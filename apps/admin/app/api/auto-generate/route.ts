import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface AutoGenerateRequest {
  insuranceTypeId: string;
  stateIds: string[];
  geoLevels: string[];
  templateId?: string;
  model: string;
  sections: string[];
}

/**
 * POST /api/auto-generate
 * Creates a new auto-generate job and returns the job ID immediately.
 * The actual processing is done via /api/auto-generate/[id]/execute
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AutoGenerateRequest = await request.json();
    const { insuranceTypeId, stateIds, geoLevels, templateId, model, sections } = body;

    if (!insuranceTypeId || !stateIds?.length || !geoLevels?.length) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: insuranceTypeId, stateIds, geoLevels'
      }, { status: 400 });
    }

    // Get insurance type
    const insuranceType = await prisma.insuranceType.findUnique({
      where: { id: insuranceTypeId }
    });

    if (!insuranceType) {
      return NextResponse.json({
        success: false,
        message: 'Insurance type not found'
      }, { status: 404 });
    }

    // Calculate estimated total pages
    const selectedStates = await prisma.state.findMany({
      where: { id: { in: stateIds } },
      include: { _count: { select: { cities: true } } }
    });

    let estimatedTotal = 0;
    for (const state of selectedStates) {
      if (geoLevels.includes('STATE')) estimatedTotal += 1;
      if (geoLevels.includes('CITY')) estimatedTotal += state._count.cities;
    }

    // Create the job record
    const job = await prisma.aIGenerationJob.create({
      data: {
        name: `${insuranceType.name} - ${selectedStates.length} States`,
        filters: {
          insuranceTypeId,
          stateIds,
          geoLevels,
          templateId: templateId || null
        },
        sections: sections,
        model: model,
        promptTemplate: '', // Will be populated during execution
        totalPages: estimatedTotal,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      estimatedTotal,
      message: `Job created. Use /api/auto-generate/${job.id}/execute to start processing.`
    });

  } catch (error: any) {
    console.error('Auto-generate job creation error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create auto-generate job'
    }, { status: 500 });
  }
}

/**
 * GET /api/auto-generate
 * List recent auto-generate jobs
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const jobs = await prisma.aIGenerationJob.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ jobs });

  } catch (error: any) {
    console.error('List auto-generate jobs error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to list jobs'
    }, { status: 500 });
  }
}
