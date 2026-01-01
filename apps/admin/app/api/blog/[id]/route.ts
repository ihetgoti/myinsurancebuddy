import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET single post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { id: params.id },
            include: {
                category: true,
                author: { select: { id: true, name: true, email: true } },
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('GET /api/blog/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

// PATCH update post
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const currentPost = await prisma.blogPost.findUnique({ where: { id: params.id } });

        if (!currentPost) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // Handle publishing
        let publishedAt = currentPost.publishedAt;
        if (body.isPublished && !currentPost.isPublished) {
            publishedAt = new Date();
        }

        const post = await prisma.blogPost.update({
            where: { id: params.id },
            data: {
                ...body,
                publishedAt,
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
                action: 'UPDATE',
                entityType: 'BlogPost',
                entityId: post.id,
                entityName: post.title,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('PATCH /api/blog/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// DELETE post
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await prisma.blogPost.findUnique({
            where: { id: params.id },
            select: { id: true, title: true },
        });

        if (!post) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        await prisma.blogPost.delete({ where: { id: params.id } });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'DELETE',
                entityType: 'BlogPost',
                entityId: params.id,
                entityName: post.title,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/blog/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
