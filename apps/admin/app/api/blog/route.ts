import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    category: true,
                    author: { select: { name: true, email: true } }
                }
            }),
            prisma.blogPost.count()
        ]);

        return NextResponse.json({ posts, total });
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            content,
            slug,
            categoryId,
            featuredImage,
            tags,
            metaTitle,
            metaDescription,
            isPublished
        } = body;

        let finalSlug = slug;
        if (!finalSlug) {
            finalSlug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Check for duplicate slug
        const existing = await prisma.blogPost.findUnique({ where: { slug: finalSlug } });
        if (existing) {
            finalSlug = `${finalSlug}-${Date.now()}`;
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                content: content || '',
                slug: finalSlug,
                authorId: session.user.id,
                categoryId: categoryId || null,
                featuredImage,
                tags: tags || [],
                metaTitle,
                metaDescription,
                isPublished: !!isPublished,
                publishedAt: isPublished ? new Date() : null,
            }
        });

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'CREATE',
                entityType: 'BlogPost',
                entityId: post.id,
                entityName: post.title,
            }
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Failed to create post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
