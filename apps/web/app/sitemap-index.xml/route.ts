import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";

  // Get count of insurance types and pages to determine how many sitemaps we need
  const [typesCount, pagesCount] = await Promise.all([
    prisma.insuranceType.count({ where: { isActive: true } }),
    prisma.page.count({ where: { isPublished: true } }),
  ]);

  const sitemaps = [
    `<sitemap><loc>${baseUrl}/sitemap-main.xml</loc></sitemap>`,
    `<sitemap><loc>${baseUrl}/sitemap-niches.xml</loc></sitemap>`,
  ];

  // Add pages sitemap if we have published pages
  if (pagesCount > 0) {
    sitemaps.push(`<sitemap><loc>${baseUrl}/sitemap-pages.xml</loc></sitemap>`);
  }

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.join('\n  ')}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
