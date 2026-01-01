import { NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myinsurancebuddies.com';

export async function GET() {
    const robotsTxt = `# Robots.txt for ${SITE_URL}
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay (optional, be nice to servers)
Crawl-delay: 1

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
`;

    return new NextResponse(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}
