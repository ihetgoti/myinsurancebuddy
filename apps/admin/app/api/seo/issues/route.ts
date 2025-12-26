import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



interface SEOIssue {
    type: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    count: number;
    pages?: string[];
}

export async function GET() {
    try {
        const issues: SEOIssue[] = [];

        // Check for pages without meta title
        const noMetaTitle = await prisma.page.findMany({
            where: {
                isPublished: true,
                OR: [
                    { metaTitle: null },
                    { metaTitle: '' },
                ],
            },
            select: { slug: true },
            take: 100,
        });

        if (noMetaTitle.length > 0) {
            issues.push({
                type: 'error',
                category: 'Meta Tags',
                message: 'Pages missing meta title',
                count: noMetaTitle.length,
                pages: noMetaTitle.map(p => p.slug),
            });
        }

        // Check for pages without meta description
        const noMetaDesc = await prisma.page.findMany({
            where: {
                isPublished: true,
                OR: [
                    { metaDescription: null },
                    { metaDescription: '' },
                ],
            },
            select: { slug: true },
            take: 100,
        });

        if (noMetaDesc.length > 0) {
            issues.push({
                type: 'error',
                category: 'Meta Tags',
                message: 'Pages missing meta description',
                count: noMetaDesc.length,
                pages: noMetaDesc.map(p => p.slug),
            });
        }

        // Check for short titles (< 30 chars)
        const shortTitles = await prisma.page.findMany({
            where: {
                isPublished: true,
                metaTitle: { not: null },
            },
            select: { slug: true, metaTitle: true },
        });

        const shortTitlePages = shortTitles.filter(p => (p.metaTitle?.length || 0) < 30);
        if (shortTitlePages.length > 0) {
            issues.push({
                type: 'warning',
                category: 'Meta Tags',
                message: 'Pages with short meta titles (< 30 chars)',
                count: shortTitlePages.length,
                pages: shortTitlePages.slice(0, 10).map(p => p.slug),
            });
        }

        // Check for long titles (> 70 chars)
        const longTitlePages = shortTitles.filter(p => (p.metaTitle?.length || 0) > 70);
        if (longTitlePages.length > 0) {
            issues.push({
                type: 'warning',
                category: 'Meta Tags',
                message: 'Pages with long meta titles (> 70 chars)',
                count: longTitlePages.length,
                pages: longTitlePages.slice(0, 10).map(p => p.slug),
            });
        }

        // Check for pages without schema markup
        const noSchema = await prisma.page.count({
            where: {
                isPublished: true,
                schemaMarkup: { equals: null as any },
            },
        });

        if (noSchema > 0) {
            issues.push({
                type: 'info',
                category: 'Schema',
                message: 'Pages without Schema.org markup',
                count: noSchema,
            });
        }

        // Check for pages without OG image
        const noOgImage = await prisma.page.count({
            where: {
                isPublished: true,
                ogImage: null,
            },
        });

        if (noOgImage > 0) {
            issues.push({
                type: 'warning',
                category: 'Social',
                message: 'Pages without Open Graph image',
                count: noOgImage,
            });
        }

        // Check for duplicate titles
        const duplicateTitles = await prisma.$queryRaw`
            SELECT "metaTitle", COUNT(*) as count
            FROM "Page"
            WHERE "isPublished" = true AND "metaTitle" IS NOT NULL
            GROUP BY "metaTitle"
            HAVING COUNT(*) > 1
            LIMIT 10
        ` as any[];

        if (duplicateTitles.length > 0) {
            const totalDuplicates = duplicateTitles.reduce((sum, d) => sum + Number(d.count), 0);
            issues.push({
                type: 'error',
                category: 'Duplicates',
                message: 'Duplicate meta titles found',
                count: totalDuplicates,
            });
        }

        // Check for pages without canonical
        const noCanonical = await prisma.page.count({
            where: {
                isPublished: true,
                canonicalTag: null,
                canonicalUrl: null,
            },
        });

        if (noCanonical > 0) {
            issues.push({
                type: 'info',
                category: 'Technical',
                message: 'Pages without canonical URL',
                count: noCanonical,
            });
        }

        return NextResponse.json(issues);
    } catch (error) {
        console.error('Failed to check SEO issues:', error);
        return NextResponse.json({ error: 'Failed to check issues' }, { status: 500 });
    }
}

