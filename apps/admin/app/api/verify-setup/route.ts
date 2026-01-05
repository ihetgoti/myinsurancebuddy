import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Make sure this path is correct for admin (usually same)

export async function GET() {
    try {
        console.log('Starting verification setup...');
        const createdItems = [];

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
                authorId: (await prisma.user.findFirst())?.id || 'admin',
            }
        });
        createdItems.push(`Blog Post: ${post.slug}`);

        // 2. Create a Test Bridge Page
        // Need to find the template by ID or Name
        // Note: 'Bridge Page (Lead Gen)' was created in create-bridge route.
        const template = await prisma.template.findFirst({
            where: { name: 'Bridge Page (Lead Gen)' }
        });

        if (!template) {
            // Try fallback if template name differs or wasn't found
            return NextResponse.json({ error: 'Bridge Template not found' }, { status: 400 });
        }

        // Need an insurance type
        const insuranceType = await prisma.insuranceType.findFirst({
            where: { isActive: true }
        });

        if (insuranceType) {
            const bridgePage = await prisma.page.upsert({
                where: { slug: 'bridge-verify' },
                update: {
                    templateId: template.id
                },
                create: {
                    title: 'Checking Auto Insurance',
                    slug: 'bridge-verify',
                    metaTitle: 'Checking Availability...',
                    isPublished: true,
                    templateId: template.id,
                    insuranceTypeId: insuranceType.id,
                }
            });
            createdItems.push(`Bridge Page: ${bridgePage.slug}`);
        }

        return NextResponse.json({ success: true, created: createdItems });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
