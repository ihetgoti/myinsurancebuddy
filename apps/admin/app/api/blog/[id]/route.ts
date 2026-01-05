import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidateWebPath } from '@/lib/revalidate';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const post = await prisma.blogPost.findUnique({
            where: { id: params.id },
            include: { category: true }
        });

        if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: 'Error' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

        const currentPost = await prisma.blogPost.findUnique({ where: { id: params.id } });
        if (!currentPost) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const post = await prisma.blogPost.update({
            where: { id: params.id },
            data: {
                title,
                content,
                slug,
                categoryId,
                featuredImage,
                tags,
                metaTitle,
                metaDescription,
                isPublished,
                publishedAt: (isPublished && !currentPost.isPublished) ? new Date() : undefined,
            }
        });

        // Trigger reval
        await revalidateWebPath(`/blog/${post.slug}`);
        await revalidateWebPath('/blog'); // Lists

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'UPDATE',
                entityType: 'BlogPost',
                entityId: post.id,
                entityName: post.title,
            }
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
        if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        await prisma.blogPost.delete({ where: { id: params.id } });

        // Trigger reval
        await revalidateWebPath(`/blog/${post.slug}`);
        await revalidateWebPath('/blog');

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'DELETE',
                entityType: 'BlogPost',
                entityId: params.id,
                entityName: post.title,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
