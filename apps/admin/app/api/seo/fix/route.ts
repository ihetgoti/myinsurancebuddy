import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_OG_IMAGE = 'https://myinsurancebuddies.com/og-default.jpg';
const SITE_URL = 'https://myinsurancebuddies.com';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fixCanonical = true, fixOgImage = true, dryRun = false } = body;

        let updatedCount = 0;
        const updates: { id: string; slug: string; fixes: string[] }[] = [];

        // Get pages missing canonical or OG image
        const pagesQuery: any = {
            where: {
                isPublished: true,
                OR: [],
            },
            select: {
                id: true,
                slug: true,
                canonicalTag: true,
                ogImage: true,
                title: true,
            },
        };

        if (fixCanonical) {
            pagesQuery.where.OR.push({ canonicalTag: null });
            pagesQuery.where.OR.push({ canonicalTag: '' });
        }

        if (fixOgImage) {
            pagesQuery.where.OR.push({ ogImage: null });
            pagesQuery.where.OR.push({ ogImage: '' });
        }

        // Only query if we have conditions
        if (pagesQuery.where.OR.length === 0) {
            return NextResponse.json({
                message: 'No fixes requested',
                updated: 0,
            });
        }

        const pages = await prisma.page.findMany(pagesQuery);

        for (const page of pages) {
            const fixes: string[] = [];
            const updateData: any = {};

            // Fix canonical URL
            if (fixCanonical && !page.canonicalTag) {
                updateData.canonicalTag = `${SITE_URL}/${page.slug}`;
                fixes.push('canonical');
            }

            // Fix OG Image
            if (fixOgImage && !page.ogImage) {
                updateData.ogImage = DEFAULT_OG_IMAGE;
                // Also set OG title and description if missing
                if (!page.title) {
                    updateData.ogTitle = page.title;
                }
                fixes.push('ogImage');
            }

            if (fixes.length > 0) {
                updates.push({ id: page.id, slug: page.slug, fixes });

                if (!dryRun) {
                    await prisma.page.update({
                        where: { id: page.id },
                        data: updateData,
                    });
                    updatedCount++;
                }
            }
        }

        return NextResponse.json({
            message: dryRun ? 'Dry run completed' : 'SEO fixes applied',
            updated: updatedCount,
            totalFound: pages.length,
            fixes: updates.slice(0, 20), // Show first 20 for preview
        });
    } catch (error: any) {
        console.error('SEO fix error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
