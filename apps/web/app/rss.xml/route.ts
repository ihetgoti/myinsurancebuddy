import { PrismaClient } from "@myinsurancebuddy/db";

const prisma = new PrismaClient();

export async function GET() {
    const posts = await prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 50,
        include: { author: true },
    });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MyInsuranceBuddies Blog</title>
    <link>https://myinsurancebuddies.com</link>
    <description>Tips & tricks to buy the best and cheapest insurance</description>
    <language>en-us</language>
    <atom:link href="https://myinsurancebuddies.com/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
            .map(
                (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://myinsurancebuddies.com/blog/${post.slug}</link>
      <guid>https://myinsurancebuddies.com/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt?.toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      ${post.author.name ? `<author>${post.author.email} (${post.author.name})</author>` : ""}
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`
            )
            .join("")}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
        },
    });
}
