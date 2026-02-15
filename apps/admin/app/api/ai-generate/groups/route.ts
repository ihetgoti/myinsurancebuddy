import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/ai-generate/groups
 * List all job groups
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groups = await prisma.aIGenerationJobGroup.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        jobs: {
          select: {
            id: true,
            name: true,
            status: true,
            totalPages: true,
            processedPages: true,
            providerId: true,
            model: true
          }
        }
      }
    });

    return NextResponse.json({ groups });
  } catch (error: any) {
    console.error('Get job groups error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai-generate/groups
 * Create a new job group for parallel processing
 * 
 * Body:
 * {
 *   "name": "Auto + Home Insurance Generation",
 *   "description": "Generating content for auto and home insurance simultaneously",
 *   "jobs": [
 *     {
 *       "name": "Auto Insurance - All States",
 *       "filters": { "insuranceTypeId": "...", "geoLevel": "STATE" },
 *       "sections": ["intro", "faqs", "tips"],
 *       "providerId": "...",
 *       "model": "nvidia/llama-3.1-nemotron-70b-reward"
 *     },
 *     {
 *       "name": "Home Insurance - All States", 
 *       "filters": { "insuranceTypeId": "...", "geoLevel": "STATE" },
 *       "sections": ["intro", "faqs", "tips"],
 *       "providerId": "...",
 *       "model": "deepseek/deepseek-r1:free"
 *     }
 *   ]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, jobs: jobConfigs } = body;

    if (!name || !jobConfigs || !Array.isArray(jobConfigs) || jobConfigs.length === 0) {
      return NextResponse.json(
        { error: 'Name and at least one job configuration are required' },
        { status: 400 }
      );
    }

    // Create the job group
    const group = await prisma.aIGenerationJobGroup.create({
      data: {
        name,
        description,
        status: 'PENDING',
        totalJobs: jobConfigs.length,
        sharedSettings: {
          createdBy: session.user?.id,
          jobCount: jobConfigs.length
        }
      }
    });

    // Create individual jobs
    const createdJobs = [];
    for (const jobConfig of jobConfigs) {
      // Get pages matching filters
      const whereClause: any = {};
      
      if (jobConfig.filters?.insuranceTypeId) {
        whereClause.insuranceTypeId = jobConfig.filters.insuranceTypeId;
      }
      if (jobConfig.filters?.stateId) {
        whereClause.stateId = jobConfig.filters.stateId;
      }
      if (jobConfig.filters?.geoLevel) {
        whereClause.geoLevel = jobConfig.filters.geoLevel;
      }
      if (!jobConfig.filters?.includeDrafts) {
        whereClause.isPublished = true;
      }

      const pages = await prisma.page.findMany({
        where: whereClause,
        select: { id: true }
      });

      if (pages.length === 0) {
        console.warn(`No pages found for job ${jobConfig.name}`);
        continue;
      }

      const pageIds = pages.map(p => p.id);

      // Create the job
      const job = await prisma.aIGenerationJob.create({
        data: {
          name: jobConfig.name || `${name} - Job ${createdJobs.length + 1}`,
          description: jobConfig.description || `Generating ${jobConfig.sections?.length || 4} sections for ${pages.length} pages`,
          pageIds,
          sections: jobConfig.sections || ['intro', 'requirements', 'faqs', 'tips'],
          providerId: jobConfig.providerId,
          model: jobConfig.model || 'deepseek/deepseek-r1:free',
          promptTemplateId: jobConfig.templateId,
          filters: jobConfig.filters,
          batchSize: jobConfig.batchSize || 10,
          delayBetweenBatches: jobConfig.delayBetweenBatches || 1000,
          perSection: jobConfig.perSection || false,
          totalPages: pageIds.length,
          status: 'PENDING',
          jobGroupId: group.id,
          dedupKey: jobConfig.dedupKey || `${jobConfig.name}-${Date.now()}`,
          createdById: session.user?.id
        }
      });

      createdJobs.push(job);
    }

    // Update group with actual job count
    await prisma.aIGenerationJobGroup.update({
      where: { id: group.id },
      data: {
        totalJobs: createdJobs.length,
        status: createdJobs.length > 0 ? 'PENDING' : 'FAILED'
      }
    });

    return NextResponse.json({
      success: true,
      group: {
        ...group,
        totalJobs: createdJobs.length
      },
      jobs: createdJobs,
      message: `Created job group with ${createdJobs.length} jobs`
    });
  } catch (error: any) {
    console.error('Create job group error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
