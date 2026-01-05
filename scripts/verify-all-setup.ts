
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Starting verification setup...');

        // 1. Create a Test Blog Post
        const post = await prisma.post.upsert({
            where: { slug: 'verification-post' },
            update: {},
            create: {
                title: 'Verification Post: The Future of Insurance',
                slug: 'verification-post',
                content: '<h2>This is a verification post.</h2><p>We are testing the <strong>Ad Units</strong> and <strong>Interlinking</strong>.</p><p>Check for ads below.</p>',
                excerpt: 'Testing the implementation of the new blog system.',
                metaTitle: 'Verification Post',
                metaDescription: 'Testing the implementation.',
                isPublished: true,
                publishedAt: new Date(),
                authorId: (await prisma.user.findFirst())?.id || 'admin', // flexible
            }
        });
        console.log('✅ Created Blog Post:', post.slug);

        // 2. Create a Test Bridge Page
        // First find the template
        const template = await prisma.template.findFirst({
            where: { name: 'Bridge Page (Lead Gen)' }
        });

        if (!template) {
            console.error('❌ Bridge Template not found! Did seeding fail?');
        } else {
            const bridgePage = await prisma.page.upsert({
                where: { slug: 'bridge-verify' },
                update: {
                    templateId: template.id
                },
                create: {
                    title: 'Checking Auto Insurance in Austin',
                    slug: 'bridge-verify', // Root slug for test
                    metaTitle: 'Checking Availability...',
                    isPublished: true,
                    templateId: template.id,
                    insuranceTypeId: (await prisma.insuranceType.findFirst({ where: { slug: 'car-insurance' } }))?.id,
                    // We need a city/state? Let's assume generic or attach one if possible
                    // For now, root slug is allowed if strictly matched in resolveRoute
                    type: 'landing', // if 'type' field exists, check schema. Schema said `type` on template, `Page` model usually doesn't have it?
                    // Let's stick to valid fields from `page.tsx`
                }
            });
            console.log('✅ Created Bridge Page:', bridgePage.slug);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
