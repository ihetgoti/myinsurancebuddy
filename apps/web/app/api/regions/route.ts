import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@myinsurancebuddy/db";
import { z } from "zod";

const prisma = new PrismaClient();

const regionSchema = z.object({
    type: z.enum(["STATE", "CITY"]),
    name: z.string().min(1),
    slug: z.string().min(1),
    stateCode: z.string().optional(),
    population: z.number().optional(),
    medianIncome: z.number().optional(),
    timezone: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    seoSummary: z.string().optional(),
    legalNotes: z.string().optional(),
    metadata: z.any().optional(),
});

// GET /api/regions - List all regions
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const stateCode = searchParams.get("stateCode");

    const where: any = {};
    if (type) where.type = type;
    if (stateCode) where.stateCode = stateCode;

    const regions = await prisma.region.findMany({
        where,
        orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ regions });
}

// POST /api/regions - Create a new region (SUPER_ADMIN only)
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const validated = regionSchema.parse(body);

        const region = await prisma.region.create({
            data: validated,
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "CREATE_REGION",
                entityType: "Region",
                entityId: region.id,
                changes: { after: region },
            },
        });

        return NextResponse.json(region, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
