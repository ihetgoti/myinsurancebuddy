import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";
    const siteName = "MyInsuranceBuddies";

    // Get recent pages for RSS feed
    const pages = await prisma.page.findMany({
        where: { isPublished: true },
        include: {
            insuranceType: { select: { name: true } },
            state: { select: { name: true } },
            city: { select: { name: true } },
        },
        orderBy: { publishedAt: 'desc' },
        take: 50,
    });

    const items = pages.map((page) => {
        const title = page.title || page.metaTitle || `${page.insuranceType?.name || 'Insurance'} Guide`;
        const description = page.metaDescription || `Insurance guide for ${page.city?.name || page.state?.name || 'your area'}`;
        const pubDate = page.publishedAt?.toUTCString() || new Date().toUTCString();

        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${baseUrl}/${page.slug}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>${baseUrl}/${page.slug}</guid>
    </item>`;
    }).join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${baseUrl}</link>
    <description>Compare insurance quotes and find the best rates. Expert guides for car, home, life, and health insurance.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            "Content-Type": "application/rss+xml",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
        },
    });
}
