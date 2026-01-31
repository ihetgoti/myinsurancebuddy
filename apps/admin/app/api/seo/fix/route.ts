import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_OG_IMAGE = process.env.DEFAULT_OG_IMAGE || 'https://myinsurancebuddies.com/og-default.jpg';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myinsurancebuddies.com';

// Batch size for processing to avoid memory issues
const BATCH_SIZE = 100;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { 
            fixCanonical = true, 
            fixOgImage = true,
            fixMetaTitle = false,
            fixMetaDesc = false,
            dryRun = false,
            batchSize = BATCH_SIZE,
        } = body;

        let updatedCount = 0;
        let errorCount = 0;
        const updates: { id: string; slug: string; fixes: string[]; error?: string }[] = [];
        const errors: { slug: string; error: string }[] = [];

        // Build where clause dynamically
        const whereConditions: any[] = [];
        
        if (fixCanonical) {
            whereConditions.push({ canonicalTag: null });
        }
        if (fixOgImage) {
            whereConditions.push({ ogImage: null });
        }
        if (fixMetaTitle) {
            whereConditions.push({
                OR: [{ metaTitle: null }, { metaTitle: '' }]
            });
        }
        if (fixMetaDesc) {
            whereConditions.push({
                OR: [{ metaDescription: null }, { metaDescription: '' }]
            });
        }

        // Get total count for progress tracking
        const totalCount = await prisma.page.count({
            where: {
                isPublished: true,
                OR: whereConditions,
            },
        });

        if (totalCount === 0) {
            return NextResponse.json({
                message: 'No pages need fixing',
                updated: 0,
                totalFound: 0,
                fixes: [],
            });
        }

        // Process in batches
        let processed = 0;
        let skip = 0;

        while (processed < totalCount) {
            const pages = await prisma.page.findMany({
                where: {
                    isPublished: true,
                    OR: whereConditions,
                },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    metaTitle: true,
                    metaDescription: true,
                    canonicalTag: true,
                    ogImage: true,
                    insuranceType: { select: { name: true } },
                    state: { select: { name: true } },
                    city: { select: { name: true } },
                },
                take: batchSize,
                skip,
            });

            if (pages.length === 0) break;

            // Process batch
            for (const page of pages) {
                try {
                    const pageFixes: string[] = [];
                    const updateData: any = {};

                    // Fix canonical URL
                    if (fixCanonical && !page.canonicalTag) {
                        updateData.canonicalTag = `${SITE_URL}/${page.slug}`;
                        pageFixes.push('canonical');
                    }

                    // Fix OG Image
                    if (fixOgImage && !page.ogImage) {
                        updateData.ogImage = DEFAULT_OG_IMAGE;
                        if (page.title && !page.metaTitle) {
                            updateData.ogTitle = page.title;
                        }
                        pageFixes.push('ogImage');
                    }

                    // Fix missing meta title (generate from page data)
                    if (fixMetaTitle && (!page.metaTitle || page.metaTitle === '')) {
                        const generatedTitle = generateMetaTitle(page);
                        updateData.metaTitle = generatedTitle;
                        updateData.ogTitle = generatedTitle;
                        pageFixes.push('metaTitle');
                    }

                    // Fix missing meta description
                    if (fixMetaDesc && (!page.metaDescription || page.metaDescription === '')) {
                        const generatedDesc = generateMetaDescription(page);
                        updateData.metaDescription = generatedDesc;
                        updateData.ogDescription = generatedDesc;
                        pageFixes.push('metaDesc');
                    }

                    if (pageFixes.length > 0) {
                        updates.push({ id: page.id, slug: page.slug, fixes: pageFixes });

                        if (!dryRun) {
                            await prisma.page.update({
                                where: { id: page.id },
                                data: updateData,
                            });
                            updatedCount++;
                        }
                    }
                } catch (pageError: any) {
                    errorCount++;
                    errors.push({
                        slug: page.slug,
                        error: pageError.message || 'Unknown error',
                    });
                }
            }

            processed += pages.length;
            skip += batchSize;
        }

        return NextResponse.json({
            message: dryRun ? 'Dry run completed' : 'SEO fixes applied',
            updated: updatedCount,
            totalFound: totalCount,
            errors: errorCount,
            errorDetails: errors.slice(0, 10), // Show first 10 errors
            fixes: updates.slice(0, 20),
            dryRun,
        });
    } catch (error: any) {
        console.error('SEO fix error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// Helper: Generate meta title from page context
function generateMetaTitle(page: any): string {
    const parts: string[] = [];
    
    if (page.insuranceType?.name) {
        parts.push(page.insuranceType.name);
    }
    if (page.city?.name) {
        parts.push(page.city.name);
    } else if (page.state?.name) {
        parts.push(page.state.name);
    }
    
    if (parts.length === 0) {
        return page.title || 'Insurance Quotes';
    }
    
    return `${parts.join(' in ')} - Get Free Quotes`;
}

// Helper: Generate meta description from page context
function generateMetaDescription(page: any): string {
    const type = page.insuranceType?.name || 'Insurance';
    const location = page.city?.name || page.state?.name;
    
    if (location) {
        return `Compare ${type} rates in ${location}. Get free quotes from top providers and save on your premiums. Quick, easy, and free comparison.`;
    }
    
    return `Compare ${type} rates and get free quotes from top providers. Find the best coverage at the lowest price. Quick and easy comparison.`;
}
