import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

// GET /api/posts - List all posts
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('GET /api/posts error:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, slug, excerpt, content, metaTitle, metaDescription, status, tags } = body;

        if (!title || !slug || !excerpt || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if slug already exists
        const existingPost = await prisma.post.findUnique({
            where: { slug },
        });

        if (existingPost) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                excerpt,
                bodyHtml: content,
                metaTitle,
                metaDescription,
                status: status || 'DRAFT',
                tags: tags || [],
                authorId: session.user.id,
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Create audit log
        try {
            await prisma.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: 'CREATE_POST',
                    entityType: 'Post',
                    entityId: post.id,
                    changes: { after: post },
                },
            });
        } catch (auditError) {
            console.error('Failed to create audit log:', auditError);
            // Don't fail the request if audit logging fails
        }

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        console.error('POST /api/posts error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ 
            error: error.message || 'Failed to create post' 
        }, { status: 500 });
    }
}
