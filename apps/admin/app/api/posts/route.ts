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

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('POST /api/posts error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
