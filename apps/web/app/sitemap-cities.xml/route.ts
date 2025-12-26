import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";

    // Get cities with state and country info
    const cities = await prisma.city.findMany({
        where: { isActive: true },
        include: {
            state: {
                include: {
                    country: { select: { code: true } },
                },
            },
        },
        orderBy: { population: 'desc' },
        take: 1000, // Limit to top 1000 cities by population
    });

    // Get primary insurance type for city pages
    const primaryType = await prisma.insuranceType.findFirst({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { slug: true },
    });

    const typeSlug = primaryType?.slug || 'car-insurance';

    const urls = cities
        .filter(city => city.state?.country)
        .map((city) => ({
            loc: `${baseUrl}/${typeSlug}/${city.state!.country!.code.toLowerCase()}/${city.state!.slug}/${city.slug}`,
            priority: '0.6',
            changefreq: 'monthly',
        }));

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(
        (url) => `
  <url>
    <loc>${url.loc}</loc>
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
