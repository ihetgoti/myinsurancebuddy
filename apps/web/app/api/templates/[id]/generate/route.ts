import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@myinsurancebuddy/db";
import { generateProgrammaticPage, bulkGeneratePages } from "@/lib/template-engine";

const prisma = new PrismaClient();

// POST /api/templates/[id]/generate - Generate pages from template
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { regionId, regionType, bulk } = body;

    if (bulk) {
      // Bulk generate for all regions of a type
      const result = await bulkGeneratePages(
        params.id,
        regionType || null,
        session.user.id
      );
      return NextResponse.json(result);
    } else if (regionId) {
      // Generate for specific region
      const page = await generateProgrammaticPage(
        params.id,
        regionId,
        session.user.id
      );
      return NextResponse.json(page);
    } else {
      return NextResponse.json(
        { error: "Either regionId or bulk must be specified" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Generation failed" },
      { status: 500 }
    );
  }
}
