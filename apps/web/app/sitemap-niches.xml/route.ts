import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";

    // Get all active insurance types
    const types = await prisma.insuranceType.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
    });

    const urls = types.map((type) => ({
        loc: `${baseUrl}/${type.slug}`,
        priority: "0.9",
        changefreq: "weekly",
    }));

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(
        (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
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
