import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { batchGenerateContent } from '@/lib/aiContentService';
import { authOptions } from '@/lib/auth';
import { KeywordContentService } from '@/lib/keywordContentService';

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
      providerId, // Specific AI provider to use (optional)
      batchSize = 10,
      delayBetweenBatches = 1000,
      priority = 'all', // 'all', 'major-cities', 'states-only'
      regenerate = false, // Set to true to regenerate AI content for pages that already have it
      includeDrafts = false, // Set to true to include unpublished/draft pages
      templateId, // Optional template to use for prompts
      perSection = false, // If true, generate each section with separate API request
      jobGroupId, // Optional job group for parallel processing
      jobName, // Optional custom job name
      dedupKey // Optional deduplication key
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

    // Fetch template if specified
    let templatePrompts = undefined;
    if (templateId) {
      const template = await prisma.aIPromptTemplate.findUnique({
        where: { id: templateId }
      });
      if (template) {
        templatePrompts = {
          systemPrompt: template.systemPrompt,
          introPrompt: template.introPrompt || undefined,
          requirementsPrompt: template.requirementsPrompt || undefined,
          faqsPrompt: template.faqsPrompt || undefined,
          tipsPrompt: template.tipsPrompt || undefined,
          costBreakdownPrompt: template.costBreakdownPrompt || undefined,
          comparisonPrompt: template.comparisonPrompt || undefined,
          discountsPrompt: template.discountsPrompt || undefined,
          localStatsPrompt: template.localStatsPrompt || undefined,
          coverageGuidePrompt: template.coverageGuidePrompt || undefined,
          claimsProcessPrompt: template.claimsProcessPrompt || undefined,
          buyersGuidePrompt: template.buyersGuidePrompt || undefined,
          metaTagsPrompt: template.metaTagsPrompt || undefined,
        };
      }
    }

    // Fetch keyword config for the insurance type
    let keywordConfig = undefined;
    if (filters?.insuranceTypeId) {
      const insuranceType = await prisma.insuranceType.findUnique({
        where: { id: filters.insuranceTypeId }
      });
      if (insuranceType) {
        keywordConfig = await KeywordContentService.getKeywordConfig(filters.insuranceTypeId)
          || KeywordContentService.generateDefaultKeywords(insuranceType.name);
        console.log(`🎯 AI Generate API: Using keyword "${keywordConfig.primaryKeyword}"`);
      }
    }

    // Validate provider if specified
    if (providerId) {
      const provider = await prisma.aIProvider.findUnique({
        where: { id: providerId }
      });
      if (!provider) {
        return NextResponse.json(
          { error: 'Invalid provider ID' },
          { status: 400 }
        );
      }
      if (!provider.isActive) {
        return NextResponse.json(
          { error: 'Selected provider is not active' },
          { status: 400 }
        );
      }
    }

    // Get insurance type name for job naming
    let insuranceTypeName = 'Insurance';
    if (filters?.insuranceTypeId) {
      const insuranceType = await prisma.insuranceType.findUnique({
        where: { id: filters.insuranceTypeId },
        select: { name: true }
      });
      if (insuranceType) {
        insuranceTypeName = insuranceType.name;
      }
    }

    // Generate job name
    const generatedJobName = jobName || 
      `${insuranceTypeName} - ${filters?.geoLevel || 'All'} Pages - ${new Date().toLocaleDateString()}`;

    // Create AI generation job
    const job = await prisma.aIGenerationJob.create({
      data: {
        name: generatedJobName,
        description: `Generating ${sections.length} sections for ${pageIds.length} pages`,
        pageIds,
        sections,
        providerId: providerId || undefined,
        model: model || 'deepseek/deepseek-r1:free',
        promptTemplateId: templateId || undefined,
        filters: { ...filters, templateId, perSection },
        batchSize,
        delayBetweenBatches,
        perSection,
        totalPages: pageIds.length,
        status: 'PROCESSING',
        jobGroupId: jobGroupId || undefined,
        dedupKey: dedupKey || `${insuranceTypeName}-${filters?.geoLevel || 'all'}-${Date.now()}`,
        createdById: session.user?.id,
        startedAt: new Date()
      }
    });

    // Start batch processing (run in background)
    batchGenerateContent(pageIds, sections, {
      batchSize,
      delayBetweenBatches,
      model,
      providerId, // Pass provider to use for this job
      templatePrompts,
      keywordConfig,
      perSection,
      dedupKey: job.dedupKey,
      onProgress: async (progress) => {
        // Update job progress
        // In per-section mode, processed is work units; convert to pages for storage
        const processedPages = perSection 
          ? Math.floor(progress.processed / sections.length)
          : progress.processed;
        
        await prisma.aIGenerationJob.update({
          where: { id: job.id },
          data: {
            processedPages,
            status: progress.paused ? 'PAUSED' : 'PROCESSING'
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

    const totalApiCalls = perSection ? pageIds.length * sections.length : pageIds.length;
    
    return NextResponse.json({
      success: true,
      jobId: job.id,
      totalPages: pageIds.length,
      totalSections: sections.length,
      perSectionMode: perSection,
      estimatedApiCalls: totalApiCalls,
      message: perSection 
        ? `Started AI generation for ${pageIds.length} pages with ${sections.length} sections each (${totalApiCalls} total API calls)`
        : `Started AI generation for ${pageIds.length} pages`
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
 * DELETE /api/ai-generate?jobId=xxx
 * Cancel an AI generation job
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    const job = await prisma.aIGenerationJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Only cancel jobs that are pending or processing
    if (!['PENDING', 'PROCESSING', 'QUEUED'].includes(job.status)) {
      return NextResponse.json({
        error: `Cannot cancel job with status: ${job.status}`
      }, { status: 400 });
    }

    await prisma.aIGenerationJob.update({
      where: { id: jobId },
      data: {
        status: 'CANCELLED',
        completedAt: new Date(),
        errorLog: [{ error: 'Job cancelled by user' }]
      }
    });

    return NextResponse.json({ success: true, message: 'Job cancelled' });
  } catch (error: any) {
    console.error('Cancel job error:', error);
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
