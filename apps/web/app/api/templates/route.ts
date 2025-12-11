import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@myinsurancebuddy/db";
import { z } from "zod";
import { generateProgrammaticPage, bulkGeneratePages } from "@/lib/template-engine";

const prisma = new PrismaClient();

const templateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  templateHtml: z.string().min(1),
  placeholders: z.array(z.string()),
});

// GET /api/templates - List all templates
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role === "EDITOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const templates = await prisma.programmaticTemplate.findMany({
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ templates });
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = templateSchema.parse(body);

    const template = await prisma.programmaticTemplate.create({
      data: {
        ...validated,
        createdById: session.user.id,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_TEMPLATE",
        objectType: "ProgrammaticTemplate",
        objectId: template.id,
        afterState: template,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
