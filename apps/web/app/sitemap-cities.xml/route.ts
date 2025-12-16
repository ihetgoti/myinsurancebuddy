import { PrismaClient } from "@myinsurancebuddy/db";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";

    const cities = await prisma.region.findMany({
        where: { type: "CITY" },
        orderBy: { name: "asc" },
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${cities.map(
        (city) => `
  <url>
    <loc>${baseUrl}/city/${city.slug}/insurance-guide</loc>
    <lastmod>${city.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
