import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@myinsurancebuddy/db";

const prisma = new PrismaClient();

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

// GET /api/templates - List all templates
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const templates = await prisma.programmaticTemplate.findMany({
            orderBy: { createdAt: "desc" },
            include: { createdBy: { select: { id: true, name: true, email: true } } },
        });

        return NextResponse.json(
            templates.map((t) => ({
                id: t.id,
                name: t.name,
                slug: t.slug,
                placeholders: t.placeholders,
                createdAt: t.createdAt,
                updatedAt: t.updatedAt,
                createdBy: t.createdBy,
            }))
        );
    } catch (error) {
        console.error("GET /api/templates error:", error);
        return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
    }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, slug, templateHtml, placeholders } = body || {};

        if (!name || !templateHtml) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const safeSlug = slug ? slugify(slug) : slugify(name);
        const placeholderArray =
            Array.isArray(placeholders) && placeholders.every((p) => typeof p === "string")
                ? placeholders
                : [];

        const template = await prisma.programmaticTemplate.create({
            data: {
                name,
                slug: safeSlug,
                templateHtml,
                placeholders: placeholderArray,
                createdById: session.user.id,
            },
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/templates error:", error);
        if (error?.code === "P2002") {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
    }
}
