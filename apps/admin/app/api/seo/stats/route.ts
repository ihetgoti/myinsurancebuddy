import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



export async function GET() {
    try {
        const [
            totalPages,
            publishedPages,
            pagesWithMeta,
            pagesWithSchema,
            avgTitleLength,
            avgDescLength,
            sitemapStats,
        ] = await Promise.all([
            prisma.page.count(),
            prisma.page.count({ where: { isPublished: true } }),
            prisma.page.count({ where: { metaTitle: { not: null }, metaDescription: { not: null } } }),
            prisma.page.count({ where: { schemaMarkup: { not: null } } }),
            prisma.page.aggregate({
                _avg: { 
                    // Using raw query for string length would be better, approximating here
                },
            }),
            prisma.page.aggregate({}),
            prisma.sitemap.aggregate({
                _sum: { urlCount: true },
                _max: { lastGenerated: true },
            }),
        ]);

        // Calculate average title/description lengths manually
        const pagesWithTitles = await prisma.page.findMany({
            where: { metaTitle: { not: null } },
            select: { metaTitle: true },
            take: 1000,
        });

        const pagesWithDescs = await prisma.page.findMany({
            where: { metaDescription: { not: null } },
            select: { metaDescription: true },
            take: 1000,
        });

        const avgTitle = pagesWithTitles.length > 0
            ? Math.round(pagesWithTitles.reduce((sum, p) => sum + (p.metaTitle?.length || 0), 0) / pagesWithTitles.length)
            : 0;

        const avgDesc = pagesWithDescs.length > 0
            ? Math.round(pagesWithDescs.reduce((sum, p) => sum + (p.metaDescription?.length || 0), 0) / pagesWithDescs.length)
            : 0;

        return NextResponse.json({
            totalPages,
            publishedPages,
            draftPages: totalPages - publishedPages,
            pagesWithMeta,
            pagesWithoutMeta: totalPages - pagesWithMeta,
            pagesWithSchema,
            avgTitleLength: avgTitle,
            avgDescLength: avgDesc,
            sitemapLastGenerated: sitemapStats._max.lastGenerated,
            sitemapUrls: sitemapStats._sum.urlCount || 0,
        });
    } catch (error) {
        console.error('Failed to fetch SEO stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

