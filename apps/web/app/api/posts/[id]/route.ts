import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@myinsurancebuddy/db";
import { z } from "zod";

const prisma = new PrismaClient();

const postSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    slug: z.string().min(1).max(200).optional(),
    excerpt: z.string().optional(),
    bodyHtml: z.string().optional(),
    status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).optional(),
    publishedAt: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().max(160).optional(),
    canonicalUrl: z.string().url().optional().nullable(),
});

// GET /api/posts/[id] - Get a single post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
        where: { id: params.id },
        include: { author: { select: { id: true, name: true, email: true } } },
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
}

// PATCH /api/posts/[id] - Update a post
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validated = postSchema.parse(body);

        const existingPost = await prisma.post.findUnique({
            where: { id: params.id },
        });

        if (!existingPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const updateData: any = { ...validated };
        if (validated.publishedAt !== undefined) {
            updateData.publishedAt = validated.publishedAt ? new Date(validated.publishedAt) : null;
        }

        const post = await prisma.post.update({
            where: { id: params.id },
            data: updateData,
            include: { author: { select: { id: true, name: true, email: true } } },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "UPDATE_POST",
                objectType: "Post",
                objectId: post.id,
                beforeState: existingPost,
                afterState: post,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    if (role !== "SUPER_ADMIN" && role !== "BLOG_ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const post = await prisma.post.findUnique({
        where: { id: params.id },
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({
        where: { id: params.id },
    });

    // Audit log
    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "DELETE_POST",
            objectType: "Post",
            objectId: params.id,
            beforeState: post,
        },
    });

    return NextResponse.json({ success: true });
}
