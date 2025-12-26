import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/seo/validate
 * Validates SEO uniqueness and detects issues at scale
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { scope = 'all', limit = 1000 } = body;

        const issues: any[] = [];
        const stats = {
            totalPages: 0,
            pagesChecked: 0,
            duplicateTitles: 0,
            duplicateDescriptions: 0,
            missingTitles: 0,
            missingDescriptions: 0,
            titleTooLong: 0,
            titleTooShort: 0,
            descTooLong: 0,
            descTooShort: 0,
            missingCanonical: 0,
            missingOgImage: 0,
        };

        // Get all published pages
        const pages = await prisma.page.findMany({
            where: { isPublished: true },
            select: {
                id: true,
                slug: true,
                metaTitle: true,
                metaDescription: true,
                canonicalTag: true,
                ogImage: true,
                ogTitle: true,
                ogDescription: true,
            },
            take: limit,
        });

        stats.totalPages = pages.length;
        stats.pagesChecked = pages.length;

        // Track titles and descriptions for duplicate detection
        const titleMap = new Map<string, string[]>();
        const descMap = new Map<string, string[]>();

        for (const page of pages) {
            // Check for missing meta title
            if (!page.metaTitle) {
                stats.missingTitles++;
                issues.push({
                    type: 'missing_title',
                    severity: 'high',
                    pageId: page.id,
                    slug: page.slug,
                    message: 'Missing meta title',
                });
            } else {
                // Check title length (optimal: 50-60 chars)
                if (page.metaTitle.length > 60) {
                    stats.titleTooLong++;
                    issues.push({
                        type: 'title_too_long',
                        severity: 'medium',
                        pageId: page.id,
                        slug: page.slug,
                        message: `Title too long (${page.metaTitle.length} chars, max 60)`,
                        value: page.metaTitle,
                    });
                } else if (page.metaTitle.length < 30) {
                    stats.titleTooShort++;
                    issues.push({
                        type: 'title_too_short',
                        severity: 'low',
                        pageId: page.id,
                        slug: page.slug,
                        message: `Title too short (${page.metaTitle.length} chars, min 30)`,
                        value: page.metaTitle,
                    });
                }

                // Track for duplicates
                const normalizedTitle = page.metaTitle.toLowerCase().trim();
                if (!titleMap.has(normalizedTitle)) {
                    titleMap.set(normalizedTitle, []);
                }
                titleMap.get(normalizedTitle)!.push(page.slug);
            }

            // Check for missing meta description
            if (!page.metaDescription) {
                stats.missingDescriptions++;
                issues.push({
                    type: 'missing_description',
                    severity: 'high',
                    pageId: page.id,
                    slug: page.slug,
                    message: 'Missing meta description',
                });
            } else {
                // Check description length (optimal: 150-160 chars)
                if (page.metaDescription.length > 160) {
                    stats.descTooLong++;
                    issues.push({
                        type: 'description_too_long',
                        severity: 'medium',
                        pageId: page.id,
                        slug: page.slug,
                        message: `Description too long (${page.metaDescription.length} chars, max 160)`,
                    });
                } else if (page.metaDescription.length < 120) {
                    stats.descTooShort++;
                    issues.push({
                        type: 'description_too_short',
                        severity: 'low',
                        pageId: page.id,
                        slug: page.slug,
                        message: `Description too short (${page.metaDescription.length} chars, min 120)`,
                    });
                }

                // Track for duplicates
                const normalizedDesc = page.metaDescription.toLowerCase().trim();
                if (!descMap.has(normalizedDesc)) {
                    descMap.set(normalizedDesc, []);
                }
                descMap.get(normalizedDesc)!.push(page.slug);
            }

            // Check for missing canonical
            if (!page.canonicalTag) {
                stats.missingCanonical++;
            }

            // Check for missing OG image
            if (!page.ogImage) {
                stats.missingOgImage++;
                issues.push({
                    type: 'missing_og_image',
                    severity: 'low',
                    pageId: page.id,
                    slug: page.slug,
                    message: 'Missing Open Graph image',
                });
            }
        }

        // Find duplicates
        for (const [title, slugs] of titleMap) {
            if (slugs.length > 1) {
                stats.duplicateTitles += slugs.length - 1;
                issues.push({
                    type: 'duplicate_title',
                    severity: 'critical',
                    message: `Duplicate title found on ${slugs.length} pages`,
                    value: title,
                    affectedPages: slugs,
                });
            }
        }

        for (const [desc, slugs] of descMap) {
            if (slugs.length > 1) {
                stats.duplicateDescriptions += slugs.length - 1;
                issues.push({
                    type: 'duplicate_description',
                    severity: 'high',
                    message: `Duplicate description found on ${slugs.length} pages`,
                    affectedPages: slugs,
                });
            }
        }

        // Calculate SEO score
        const seoScore = Math.round(
            100 - (
                (stats.duplicateTitles * 10) +
                (stats.duplicateDescriptions * 8) +
                (stats.missingTitles * 5) +
                (stats.missingDescriptions * 4) +
                (stats.titleTooLong * 2) +
                (stats.descTooLong * 2)
            ) / Math.max(stats.totalPages, 1)
        );

        return NextResponse.json({
            success: true,
            seoScore: Math.max(0, Math.min(100, seoScore)),
            stats,
            issues: issues.slice(0, 100), // Limit issues returned
            totalIssues: issues.length,
        });
    } catch (error) {
        console.error('POST /api/seo/validate error:', error);
        return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
    }
}

