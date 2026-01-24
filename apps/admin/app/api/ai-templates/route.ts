import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/ai-templates
 * List all AI prompt templates
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await prisma.aIPromptTemplate.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { priority: 'desc' },
        { name: 'asc' }
      ],
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ templates });
  } catch (error: any) {
    console.error('Get AI templates error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai-templates
 * Create new AI prompt template
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      insuranceTypeId,
      geoLevel,
      isMajorCity,
      systemPrompt,
      introPrompt,
      requirementsPrompt,
      faqsPrompt,
      tipsPrompt,
      model = 'xiaomi/mimo-v2-flash',
      temperature = 0.7,
      maxTokens = 2000,
      availableVars,
      exampleOutput,
      isActive = true,
      isDefault = false,
      priority = 0
    } = body;

    if (!name || !systemPrompt) {
      return NextResponse.json(
        { error: 'Name and system prompt are required' },
        { status: 400 }
      );
    }

    const template = await prisma.aIPromptTemplate.create({
      data: {
        name,
        description,
        insuranceTypeId: insuranceTypeId || null,
        geoLevel: geoLevel || null,
        isMajorCity: isMajorCity !== undefined ? isMajorCity : null,
        systemPrompt,
        introPrompt,
        requirementsPrompt,
        faqsPrompt,
        tipsPrompt,
        model,
        temperature,
        maxTokens,
        availableVars: availableVars || null,
        exampleOutput: exampleOutput || null,
        isActive,
        isDefault,
        priority,
        createdById: session.user?.id
      }
    });

    return NextResponse.json({
      success: true,
      template
    });
  } catch (error: any) {
    console.error('Create AI template error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ai-templates/[id]
 * Update AI prompt template
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    const body = await req.json();

    const template = await prisma.aIPromptTemplate.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      template
    });
  } catch (error: any) {
    console.error('Update AI template error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai-templates/[id]
 * Delete AI prompt template
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    await prisma.aIPromptTemplate.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete AI template error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
