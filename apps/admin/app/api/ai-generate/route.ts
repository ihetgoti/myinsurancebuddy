import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { batchGenerateContent } from '@/lib/aiContentService';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/ai-generate
 * Generate AI content for pages
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      filters,
      sections = ['intro', 'requirements', 'faqs', 'tips'],
      model,
      batchSize = 10,
      delayBetweenBatches = 1000,
      priority = 'all', // 'all', 'major-cities', 'states-only'
      regenerate = false, // Set to true to regenerate AI content for pages that already have it
      includeDrafts = false // Set to true to include unpublished/draft pages
    } = body;

    // Build page query based on filters
    const whereClause: any = {};

    // Only filter by isPublished if not including drafts
    if (!includeDrafts) {
      whereClause.isPublished = true;
    }

    if (filters?.insuranceTypeId) {
      whereClause.insuranceTypeId = filters.insuranceTypeId;
    }

    if (filters?.stateId) {
      whereClause.stateId = filters.stateId;
    }

    if (filters?.geoLevel) {
      whereClause.geoLevel = filters.geoLevel;
    }

    // Priority filtering
    if (priority === 'major-cities') {
      whereClause.city = {
        isMajorCity: true
      };
    } else if (priority === 'states-only') {
      whereClause.geoLevel = 'STATE';
    }

    // Get pages that haven't been AI-generated yet (unless regenerate is true)
    if (!regenerate) {
      whereClause.isAiGenerated = false;
    }

    const pages = await prisma.page.findMany({
      where: whereClause,
      select: { id: true },
      orderBy: [
        { city: { isMajorCity: 'desc' } }, // Major cities first
        { viewCount: 'desc' }, // High-traffic pages next
      ],
      take: 10000 // Reasonable limit
    });

    if (pages.length === 0) {
      const hint = !regenerate
        ? ' All pages may already have AI-generated content. Try enabling "Regenerate existing" option to regenerate content for pages that already have AI content.'
        : '';
      return NextResponse.json({
        success: false,
        message: `No pages found matching the criteria.${hint}`
      });
    }

    const pageIds = pages.map(p => p.id);

    // Create AI generation job
    const job = await prisma.aIGenerationJob.create({
      data: {
        name: `AI Content Generation - ${new Date().toISOString()}`,
        pageIds,
        sections,
        model: model || 'anthropic/claude-haiku',
        promptTemplate: 'Generate unique, location-specific insurance content for {{location}}',
        filters,
        batchSize,
        delayBetweenBatches,
        totalPages: pageIds.length,
        status: 'PROCESSING',
        createdById: session.user?.id,
        startedAt: new Date()
      }
    });

    // Start batch processing (run in background)
    batchGenerateContent(pageIds, sections, {
      batchSize,
      delayBetweenBatches,
      model,
      onProgress: async (processed, total) => {
        // Update job progress
        await prisma.aIGenerationJob.update({
          where: { id: job.id },
          data: {
            processedPages: processed
          }
        });
      }
    }).then(async (results) => {
      // Update job on completion
      await prisma.aIGenerationJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          successfulPages: results.successful,
          failedPages: results.failed,
          errorLog: results.errors
        }
      });

      console.log(`AI generation job ${job.id} completed:`, results);
    }).catch(async (error) => {
      // Update job on failure
      await prisma.aIGenerationJob.update({
        where: { id: job.id },
        data: {
          status: 'FAILED',
          errorLog: [{ error: error.message }]
        }
      });

      console.error(`AI generation job ${job.id} failed:`, error);
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      totalPages: pageIds.length,
      message: `Started AI generation for ${pageIds.length} pages`
    });
  } catch (error: any) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai-generate/[jobId]
 * Get AI generation job status
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId');

    if (!jobId) {
      // List all jobs
      const jobs = await prisma.aIGenerationJob.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          provider: {
            select: { name: true }
          }
        }
      });

      return NextResponse.json({ jobs });
    }

    // Get specific job
    const job = await prisma.aIGenerationJob.findUnique({
      where: { id: jobId },
      include: {
        provider: {
          select: { name: true }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error: any) {
    console.error('Get job error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
