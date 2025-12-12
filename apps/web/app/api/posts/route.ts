import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@myinsurancebuddy/db";
import { z } from "zod";

const prisma = new PrismaClient();

const postSchema = z.object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200),
    excerpt: z.string().optional(),
    bodyHtml: z.string(),
    status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]),
    publishedAt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    metaTitle: z.string().optional(),
    metaDescription: z.string().max(160).optional(),
    canonicalUrl: z.string().url().optional(),
});

// GET /api/posts - List all posts with pagination and filters
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (tag) where.tags = { has: tag };
    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
        ];
    }

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            include: { author: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.post.count({ where }),
    ]);

    return NextResponse.json({
        posts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validated = postSchema.parse(body);

        const post = await prisma.post.create({
            data: {
                ...validated,
                authorId: session.user.id,
                publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null,
            },
            include: { author: { select: { id: true, name: true, email: true } } },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "CREATE_POST",
                entityType: "Post",
                entityId: post.id,
                changes: { after: post },
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
