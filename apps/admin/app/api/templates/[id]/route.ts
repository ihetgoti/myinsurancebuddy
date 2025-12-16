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

// GET /api/templates/[id]
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const template = await prisma.programmaticTemplate.findUnique({
            where: { id: params.id },
            include: { createdBy: { select: { id: true, name: true, email: true } } },
        });

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: template.id,
            name: template.name,
            slug: template.slug,
            templateHtml: template.templateHtml,
            placeholders: template.placeholders,
            createdAt: template.createdAt,
            updatedAt: template.updatedAt,
            createdBy: template.createdBy,
        });
    } catch (error) {
        console.error("GET /api/templates/[id] error:", error);
        return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
    }
}

// PATCH /api/templates/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, slug, templateHtml, placeholders } = body || {};

        const placeholderArray =
            Array.isArray(placeholders) && placeholders.every((p: unknown) => typeof p === "string")
                ? placeholders
                : undefined;

        const template = await prisma.programmaticTemplate.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(slug && { slug: slugify(slug) }),
                ...(templateHtml && { templateHtml }),
                ...(placeholderArray && { placeholders: placeholderArray }),
            },
        });

        return NextResponse.json(template);
    } catch (error: any) {
        console.error("PATCH /api/templates/[id] error:", error);
        if (error?.code === "P2002") {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
    }
}

// DELETE /api/templates/[id]
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.programmaticTemplate.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/templates/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
    }
}
