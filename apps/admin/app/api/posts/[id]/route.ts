import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

// GET /api/posts/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await prisma.post.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: { name: true, email: true },
                },
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('GET /api/posts/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

// PATCH /api/posts/[id]
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
        const { title, slug, excerpt, content, metaTitle, metaDescription, status, tags } = body;

        // Get existing post for audit log
        const existingPost = await prisma.post.findUnique({
            where: { id: params.id },
        });

        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if slug is being changed and already exists
        if (slug && slug !== existingPost.slug) {
            const slugExists = await prisma.post.findUnique({
                where: { slug },
            });
            if (slugExists) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
            }
        }

        const post = await prisma.post.update({
            where: { id: params.id },
            data: {
                ...(title && { title }),
                ...(slug && { slug }),
                ...(excerpt && { excerpt }),
                ...(content && { bodyHtml: content }),
                ...(metaTitle !== undefined && { metaTitle }),
                ...(metaDescription !== undefined && { metaDescription }),
                ...(status && { status, publishedAt: status === 'PUBLISHED' ? new Date() : null }),
                ...(tags && { tags }),
            },
            include: {
                author: {
                    select: { name: true, email: true },
                },
            },
        });

        // Create audit log
        try {
            await prisma.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: 'UPDATE_POST',
                    entityType: 'Post',
                    entityId: post.id,
                    changes: { before: existingPost, after: post },
                },
            });
        } catch (auditError) {
            console.error('Failed to create audit log:', auditError);
        }

        return NextResponse.json(post);
    } catch (error: any) {
        console.error('PATCH /api/posts/[id] error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ 
            error: error.message || 'Failed to update post' 
        }, { status: 500 });
    }
}

// DELETE /api/posts/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await prisma.post.findUnique({
            where: { id: params.id },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        await prisma.post.delete({
            where: { id: params.id },
        });

        // Create audit log
        try {
            await prisma.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: 'DELETE_POST',
                    entityType: 'Post',
                    entityId: params.id,
                    changes: { before: post },
                },
            });
        } catch (auditError) {
            console.error('Failed to create audit log:', auditError);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('DELETE /api/posts/[id] error:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to delete post' 
        }, { status: 500 });
    }
}
