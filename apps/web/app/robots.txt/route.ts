export function GET() {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://myinsurancebuddies.com/sitemap-index.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow blog and insurance guides
Allow: /blog/
Allow: /state/
Allow: /city/
`;

    return new Response(robotsTxt, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
