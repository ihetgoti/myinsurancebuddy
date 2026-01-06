import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';



const SITE_URL = process.env.SITE_URL || 'https://myinsurancebuddies.com';

export async function POST() {
    try {
        // Get all published pages
        const pages = await prisma.page.findMany({
            where: { isPublished: true },
            select: {
                slug: true,
                updatedAt: true,
                insuranceType: { select: { slug: true } },
                geoLevel: true,
            },
            orderBy: { updatedAt: 'desc' },
        });

        // Group pages by type for multiple sitemaps
        const pagesByType: Record<string, any[]> = {
            main: [],
            locations: [],
            niches: [],
        };

        pages.forEach(page => {
            if (page.geoLevel === 'STATE' || page.geoLevel === 'CITY') {
                pagesByType.locations.push(page);
            } else if (page.geoLevel === 'NICHE') {
                pagesByType.niches.push(page);
            } else {
                pagesByType.main.push(page);
            }
        });

        // Generate sitemaps
        const sitemapConfigs = [
            { name: 'sitemap-main.xml', slug: 'sitemap-main.xml', type: 'PAGES', pages: pagesByType.main },
            { name: 'sitemap-locations.xml', slug: 'sitemap-locations.xml', type: 'LOCATIONS', pages: pagesByType.locations },
            { name: 'sitemap-niches.xml', slug: 'sitemap-niches.xml', type: 'PAGES', pages: pagesByType.niches },
        ];

        for (const config of sitemapConfigs) {
            const xml = generateSitemapXML(config.pages);
            
            await prisma.sitemap.upsert({
                where: { slug: config.slug },
                update: {
                    content: xml,
                    urlCount: config.pages.length,
                    lastGenerated: new Date(),
                },
                create: {
                    name: config.name,
                    slug: config.slug,
                    type: config.type as any,
                    content: xml,
                    urlCount: config.pages.length,
                    lastGenerated: new Date(),
                },
            });
        }

        // Generate sitemap index
        const indexXml = generateSitemapIndex(sitemapConfigs.filter(c => c.pages.length > 0));
        
        await prisma.sitemap.upsert({
            where: { slug: 'sitemap-index.xml' },
            update: {
                content: indexXml,
                urlCount: sitemapConfigs.reduce((sum, c) => sum + c.pages.length, 0),
                lastGenerated: new Date(),
            },
            create: {
                name: 'sitemap-index.xml',
                slug: 'sitemap-index.xml',
                type: 'INDEX',
                content: indexXml,
                urlCount: sitemapConfigs.reduce((sum, c) => sum + c.pages.length, 0),
                lastGenerated: new Date(),
            },
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Sitemaps generated successfully',
            totalUrls: pages.length,
        });
    } catch (error) {
        console.error('Failed to generate sitemaps:', error);
        return NextResponse.json({ error: 'Failed to generate sitemaps' }, { status: 500 });
    }
}

function generateSitemapXML(pages: any[]): string {
    const urls = pages.map(page => {
        const loc = `${SITE_URL}/${page.slug}`;
        const lastmod = page.updatedAt.toISOString().split('T')[0];
        const priority = getPriority(page.geoLevel);
        const changefreq = 'weekly';

        return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function generateSitemapIndex(sitemaps: any[]): string {
    const entries = sitemaps.map(sitemap => {
        return `  <sitemap>
    <loc>${SITE_URL}/${sitemap.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`;
}

function getPriority(geoLevel: string | null): string {
    switch (geoLevel) {
        case 'NICHE': return '1.0';
        case 'COUNTRY': return '0.9';
        case 'STATE': return '0.8';
        case 'CITY': return '0.7';
        default: return '0.5';
    }
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

