import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";

    // Get all published pages with their relations
    const pages = await prisma.page.findMany({
        where: { isPublished: true },
        include: {
            insuranceType: { select: { slug: true } },
            country: { select: { code: true } },
            state: {
                select: {
                    slug: true,
                    country: { select: { code: true } }
                }
            },
            city: { select: { slug: true } },
        },
        orderBy: { updatedAt: 'desc' },
    });

    const urls = pages
        .filter(page => page.insuranceType) // Filter out pages without insuranceType
        .map((page) => {
            const parts = [page.insuranceType!.slug];
            // Get country from page or from state.country
            const countryCode = page.country?.code || page.state?.country?.code;
            if (countryCode) parts.push(countryCode.toLowerCase());
            if (page.state) parts.push(page.state.slug);
            if (page.city) parts.push(page.city.slug);

            const priority = page.geoLevel === 'CITY' ? '0.8' :
                page.geoLevel === 'STATE' ? '0.7' :
                    page.geoLevel === 'COUNTRY' ? '0.6' : '0.9';

            return {
                loc: `${baseUrl}/${parts.join('/')}`,
                priority,
                changefreq: "weekly",
                lastmod: page.updatedAt.toISOString(),
            };
        });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(
        (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    ).join("")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
        },
    });
}
