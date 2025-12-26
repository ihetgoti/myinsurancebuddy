import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";

    // Get all active states with their country
    const states = await prisma.state.findMany({
        where: { isActive: true },
        include: {
            country: { select: { code: true } },
        },
        orderBy: { name: 'asc' },
    });

    // Get all active insurance types
    const insuranceTypes = await prisma.insuranceType.findMany({
        where: { isActive: true },
        select: { slug: true },
    });

    const urls: { loc: string; priority: string; changefreq: string }[] = [];

    // Generate URLs for each state + insurance type combination
    for (const state of states) {
        if (!state.country) continue;

        for (const type of insuranceTypes) {
            urls.push({
                loc: `${baseUrl}/${type.slug}/${state.country.code.toLowerCase()}/${state.slug}`,
                priority: '0.7',
                changefreq: 'weekly',
            });
        }
    }

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
