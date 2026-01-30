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

    // Get all insurance types to map IDs to slugs
    const insuranceTypes = await prisma.insuranceType.findMany({
      select: { id: true, slug: true, name: true }
    });
    const insuranceTypeMap = new Map(insuranceTypes.map(t => [t.id, t]));

    // Add insuranceType slug to each template for frontend filtering
    const templatesWithSlug = templates.map(template => {
      const insuranceTypeInfo = template.insuranceTypeId
        ? insuranceTypeMap.get(template.insuranceTypeId)
        : null;

      return {
        ...template,
        // Add slug for frontend filtering (use 'all' if no specific type)
        insuranceType: insuranceTypeInfo?.slug || 'all',
        insuranceTypeName: insuranceTypeInfo?.name || 'All Types'
      };
    });

    return NextResponse.json({ templates: templatesWithSlug });
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
      // Original prompts
      introPrompt,
      requirementsPrompt,
      faqsPrompt,
      tipsPrompt,
      // New SEO prompts
      costBreakdownPrompt,
      comparisonPrompt,
      discountsPrompt,
      localStatsPrompt,
      coverageGuidePrompt,
      claimsProcessPrompt,
      buyersGuidePrompt,
      metaTagsPrompt,
      // Settings
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
        // Original prompts
        introPrompt,
        requirementsPrompt,
        faqsPrompt,
        tipsPrompt,
        // New SEO prompts
        costBreakdownPrompt,
        comparisonPrompt,
        discountsPrompt,
        localStatsPrompt,
        coverageGuidePrompt,
        claimsProcessPrompt,
        buyersGuidePrompt,
        metaTagsPrompt,
        // Settings
        model,
        temperature,
        maxTokens,
        availableVars: availableVars || null,
        exampleOutput: exampleOutput || null,
        isActive,
        isDefault,
        priority
        // createdById removed - user may not exist in DB
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
