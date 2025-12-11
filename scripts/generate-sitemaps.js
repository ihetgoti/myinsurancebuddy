const fs = require('fs');
const path = require('path');
// Import PrismaClient from pnpm workspace location
const prismaClientPath = path.join(__dirname, '../node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client');
const { PrismaClient } = require(prismaClientPath);

const prisma = new PrismaClient();

async function generate() {
    console.log('Generating sitemaps...');

    try {
        // Fetch data
        const states = await prisma.region.findMany({ where: { type: 'STATE' } });
        const cities = await prisma.region.findMany({ where: { type: 'CITY' } });
        const posts = await prisma.post.findMany({ where: { status: 'PUBLISHED' } });

        // Helper to write file
        const writeSitemap = (filename, content) => {
            const publicDir = path.join(__dirname, '../apps/web/public');
            if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
            }
            fs.writeFileSync(path.join(publicDir, filename), content);
            console.log(`Written ${filename}`);
        };

        // Generate sitemap-states.xml
        const stateUrls = states.map(state => `
      <url>
        <loc>https://myinsurancebuddies.com/state/${state.slug}/insurance-guide</loc>
        <lastmod>${state.updatedAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('');

        const sitemapStates = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${stateUrls}
    </urlset>`;

        writeSitemap('sitemap-states.xml', sitemapStates);

        // Generate sitemap-cities.xml
        const cityUrls = cities.map(city => `
      <url>
        <loc>https://myinsurancebuddies.com/city/${city.slug}/insurance-guide</loc>
        <lastmod>${city.updatedAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('');

        const sitemapCities = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${cityUrls}
    </urlset>`;

        writeSitemap('sitemap-cities.xml', sitemapCities);

        // Generate sitemap-posts.xml
        const postUrls = posts.map(post => `
      <url>
        <loc>https://myinsurancebuddies.com/blog/${post.slug}</loc>
        <lastmod>${post.updatedAt.toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
    `).join('');

        const sitemapPosts = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${postUrls}
    </urlset>`;

        writeSitemap('sitemap-posts.xml', sitemapPosts);

        // Generate sitemap-index.xml
        const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://myinsurancebuddies.com/sitemap-states.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://myinsurancebuddies.com/sitemap-cities.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://myinsurancebuddies.com/sitemap-posts.xml</loc>
      </sitemap>
    </sitemapindex>`;

        writeSitemap('sitemap-index.xml', sitemapIndex);

        console.log('All sitemaps generated successfully!');
    } catch (error) {
        console.error('Error generating sitemaps:', error);
        process.exit(1);
    }
}

generate()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
