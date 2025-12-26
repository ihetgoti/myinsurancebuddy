import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";

    // Get published posts if Post model exists, otherwise return empty sitemap
    let urls: { loc: string; lastmod: string; priority: string; changefreq: string }[] = [];

    try {
        // Try to get posts - if model doesn't exist, this will fail gracefully
        const posts = await (prisma as any).post?.findMany?.({
            where: { isPublished: true },
            orderBy: { publishedAt: 'desc' },
            take: 500,
        }) || [];

        urls = posts.map((post: any) => ({
            loc: `${baseUrl}/blog/${post.slug}`,
            lastmod: post.updatedAt?.toISOString() || new Date().toISOString(),
            priority: '0.6',
            changefreq: 'monthly',
        }));
    } catch {
        // Post model might not exist - return empty sitemap
    }

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
