import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: List all blog posts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');
        const isPublished = searchParams.get('isPublished');
        const categoryId = searchParams.get('categoryId');

        const where: any = {};
        if (isPublished !== null) where.isPublished = isPublished === 'true';
        if (categoryId) where.categoryId = categoryId;

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
                include: {
                    category: { select: { id: true, name: true, slug: true, color: true } },
                    author: { select: { id: true, name: true, email: true } },
                },
            }),
            prisma.blogPost.count({ where }),
        ]);

        return NextResponse.json({ posts, total, limit, offset });
    } catch (error) {
        console.error('GET /api/blog error:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST: Create new blog post
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            slug,
            excerpt,
            content,
            featuredImage,
            featuredAlt,
            categoryId,
            tags,
            metaTitle,
            metaDescription,
            isPublished,
            isFeatured,
        } = body;

        if (!title || !slug || !content) {
            return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
        }

        // Check for duplicate slug
        const existing = await prisma.blogPost.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                featuredImage,
                featuredAlt,
                categoryId,
                tags: tags || [],
                metaTitle,
                metaDescription,
                isPublished: isPublished || false,
                isFeatured: isFeatured || false,
                publishedAt: isPublished ? new Date() : null,
                authorId: session.user.id,
                authorName: session.user.name,
            },
            include: {
                category: true,
                author: { select: { id: true, name: true, email: true } },
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'CREATE',
                entityType: 'BlogPost',
                entityId: post.id,
                entityName: post.title,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('POST /api/blog error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
