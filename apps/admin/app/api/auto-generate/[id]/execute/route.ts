import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpenRouterService, AIContentSection, AllProvidersRateLimitedError } from '@/lib/aiContentService';
import { KeywordContentService } from '@/lib/keywordContentService';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max

interface JobFilters {
  insuranceTypeId: string;
  stateIds: string[];
  geoLevels: string[];
  templateId?: string | null;
}

/**
 * POST /api/auto-generate/[id]/execute
 * Starts background processing of an auto-generate job
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: jobId } = await params;

    const job = await prisma.aIGenerationJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Allow resuming PAUSED jobs
    if (job.status !== 'PENDING' && job.status !== 'PAUSED') {
      return NextResponse.json({
        error: `Job already ${job.status.toLowerCase()}. Cannot restart.`
      }, { status: 400 });
    }

    // If resuming a PAUSED job, clear rate limit status first
    if (job.status === 'PAUSED') {
      await OpenRouterService.clearRateLimitStatus();
    }

    // Mark job as processing
    await prisma.aIGenerationJob.update({
      where: { id: jobId },
      data: {
        status: 'PROCESSING',
        startedAt: job.startedAt || new Date(), // Keep original start time if resuming
        resumedAt: job.status === 'PAUSED' ? new Date() : undefined
      }
    });

    // Start background processing (non-blocking)
    processAutoGenerateJob(job).catch(error => {
      console.error('Auto-generate job failed:', error);
      prisma.aIGenerationJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          errorLog: [{ error: error.message, timestamp: new Date().toISOString() }],
          completedAt: new Date()
        }
      }).catch(console.error);
    });

    const message = job.status === 'PAUSED'
      ? 'Job resumed from pause. Poll /api/auto-generate/' + jobId + '/status for progress.'
      : 'Job started. Poll /api/auto-generate/' + jobId + '/status for progress.';

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error: any) {
    console.error('Execute auto-generate job error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to start job'
    }, { status: 500 });
  }
}

/**
 * Background job processor with pause/resume support
 */
async function processAutoGenerateJob(job: any) {
  const filters = job.filters as JobFilters;
  const sections = job.sections as string[];
  const model = job.model;

  // Get resume state if this is a resumed job
  const resumeState = job.resumeState as {
    lastProcessedStateId?: string;
    lastProcessedCityId?: string;
    processedCount?: number;
  } | undefined;

  // Get insurance type
  const insuranceType = await prisma.insuranceType.findUnique({
    where: { id: filters.insuranceTypeId }
  });

  if (!insuranceType) {
    throw new Error('Insurance type not found');
  }

  // Fetch keyword config for this insurance type
  const keywordConfig = await KeywordContentService.getKeywordConfig(filters.insuranceTypeId)
    || KeywordContentService.generateDefaultKeywords(insuranceType.name);

  console.log(`🎯 Using keyword config: "${keywordConfig.primaryKeyword}" for ${insuranceType.name}`);

  // Fetch template if specified
  let templatePrompts = undefined;
  if (filters.templateId) {
    const template = await prisma.aIPromptTemplate.findUnique({
      where: { id: filters.templateId }
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

  // Get selected states with cities
  const selectedStates = await prisma.state.findMany({
    where: { id: { in: filters.stateIds } },
    include: { cities: true }
  });

  // Calculate actual total
  let totalPages = 0;
  for (const state of selectedStates) {
    if (filters.geoLevels.includes('STATE')) totalPages += 1;
    if (filters.geoLevels.includes('CITY')) totalPages += state.cities.length;
  }

  // Update job with accurate total
  await prisma.aIGenerationJob.update({
    where: { id: job.id },
    data: { totalPages }
  });

  // Initialize or restore counters
  let processedPages = job.processedPages || 0;
  let successfulPages = job.successfulPages || 0;
  let failedPages = job.failedPages || 0;
  let totalTokensUsed = job.totalTokensUsed || 0;
  let estimatedCost = job.estimatedCost || 0;
  const errorLog = (job.errorLog as any[]) || [];

  // Track if we've hit rate limits
  let isPaused = false;
  let pauseState: {
    lastProcessedStateId?: string;
    lastProcessedCityId?: string | null;
    processedCount: number;
  } = {
    lastProcessedStateId: resumeState?.lastProcessedStateId,
    lastProcessedCityId: resumeState?.lastProcessedCityId || null,
    processedCount: processedPages
  };

  // Find resume point if applicable
  let skipUntilStateId = resumeState?.lastProcessedStateId || null;
  let skipUntilCityId = resumeState?.lastProcessedCityId || null;
  let foundResumePoint = !skipUntilStateId; // If no resume point, start from beginning

  try {
    // Process each state
    for (const state of selectedStates) {
      // Check if we need to find resume point
      if (!foundResumePoint) {
        if (state.id === skipUntilStateId) {
          foundResumePoint = true;
          console.log(`🔄 Resuming from state: ${state.name}`);
        } else {
          continue; // Skip this state
        }
      }

      // Update pause state
      pauseState.lastProcessedStateId = state.id;
      pauseState.lastProcessedCityId = null;

      // Process state-level page
      if (filters.geoLevels.includes('STATE')) {
        // If resuming and we were in the middle of a state's cities, skip state page
        if (!(skipUntilCityId && state.id === skipUntilStateId)) {
          const result = await processPage(
            insuranceType,
            state,
            null,
            model,
            sections as AIContentSection[],
            job.id,
            templatePrompts,
            keywordConfig
          );

          processedPages++;
          if (result.success) {
            successfulPages++;
            totalTokensUsed += result.tokensUsed || 0;
            estimatedCost += result.cost || 0;
          } else {
            // Check if this is a rate limit error
            if (result.error?.includes('All providers') || result.error?.includes('rate limit')) {
              throw new AllProvidersRateLimitedError(result.error);
            }

            failedPages++;
            errorLog.push({
              slug: `${insuranceType.slug}/${state.slug}`,
              error: result.error,
              timestamp: new Date().toISOString()
            });
          }

          // Update progress
          await updateJobProgress(job.id, {
            processedPages,
            successfulPages,
            failedPages,
            totalTokensUsed,
            estimatedCost,
            errorLog,
            resumeState: pauseState
          });
        }
      }

      // Process city-level pages
      if (filters.geoLevels.includes('CITY')) {
        for (const city of state.cities) {
          // Check if we need to find resume point within cities
          if (skipUntilCityId && !foundResumePoint) {
            if (city.id === skipUntilCityId) {
              foundResumePoint = true;
              console.log(`🔄 Resuming from city: ${city.name}`);
            } else {
              continue; // Skip this city
            }
          }

          // Update pause state
          pauseState.lastProcessedCityId = city.id;
          pauseState.processedCount = processedPages;

          const result = await processPage(
            insuranceType,
            state,
            city,
            model,
            sections as AIContentSection[],
            job.id,
            templatePrompts,
            keywordConfig
          );

          processedPages++;
          if (result.success) {
            successfulPages++;
            totalTokensUsed += result.tokensUsed || 0;
            estimatedCost += result.cost || 0;
          } else {
            // Check if this is a rate limit error
            if (result.error?.includes('All providers') || result.error?.includes('rate limit')) {
              throw new AllProvidersRateLimitedError(result.error);
            }

            failedPages++;
            errorLog.push({
              slug: `${insuranceType.slug}/${state.slug}/${city.slug}`,
              error: result.error,
              timestamp: new Date().toISOString()
            });
          }

          // Update progress every 5 pages
          if (processedPages % 5 === 0) {
            await updateJobProgress(job.id, {
              processedPages,
              successfulPages,
              failedPages,
              totalTokensUsed,
              estimatedCost,
              errorLog,
              resumeState: pauseState
            });
          }
        }
      }
    }

    // Mark job as completed
    await prisma.aIGenerationJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        processedPages,
        successfulPages,
        failedPages,
        totalTokensUsed,
        estimatedCost,
        errorLog: errorLog.length > 0 ? errorLog : undefined,
        completedAt: new Date(),
        resumeState: undefined // Clear resume state
      }
    });

  } catch (error: any) {
    // Check if this is a rate limit pause
    if (error.name === 'AllProvidersRateLimitedError') {
      const resumeAt = await OpenRouterService.getNextAvailableTime();

      console.warn(`⏸️ Job ${job.id} paused due to rate limits. Will resume at ${resumeAt}`);

      // Mark job as paused with resume state
      await prisma.aIGenerationJob.update({
        where: { id: job.id },
        data: {
          status: 'PAUSED',
          processedPages,
          successfulPages,
          failedPages,
          totalTokensUsed,
          estimatedCost,
          errorLog: errorLog.length > 0 ? errorLog : undefined,
          resumeState: pauseState,
          pausedAt: new Date(),
          autoResumeAt: resumeAt || new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      });

      // Schedule auto-resume (this would be handled by a cron job or similar)
      scheduleAutoResume(job.id, resumeAt);

      return;
    }

    // Other error - mark as failed
    throw error;
  }
}

/**
 * Schedule auto-resume of a paused job
 */
function scheduleAutoResume(jobId: string, resumeAt: Date | null) {
  const delay = resumeAt ? resumeAt.getTime() - Date.now() : 24 * 60 * 60 * 1000;
  const resumeTime = new Date(Date.now() + delay);

  console.log(`⏰ Scheduled auto-resume for job ${jobId} at ${resumeTime}`);

  // In production, you'd use a job queue like Bull/BullMQ or a cron job
  // For now, we just log it. The admin can manually resume or a cron can check.

  // Example: Set a timeout (only works if server stays running)
  // setTimeout(async () => {
  //   await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auto-generate/${jobId}/execute`, {
  //     method: 'POST'
  //   });
  // }, delay);
}

/**
 * Process a single page (create if needed + generate AI content)
 */
async function processPage(
  insuranceType: any,
  state: any,
  city: any | null,
  model: string,
  sections: AIContentSection[],
  jobId: string,
  templatePrompts?: any,
  keywordConfig?: any
): Promise<{ success: boolean; tokensUsed?: number; cost?: number; error?: string }> {
  try {
    const slug = city
      ? `${insuranceType.slug}/${state.slug}/${city.slug}`
      : `${insuranceType.slug}/${state.slug}`;

    const title = city
      ? `${insuranceType.name} in ${city.name}, ${state.code}`
      : `${insuranceType.name} in ${state.name}`;

    const geoLevel = city ? 'CITY' : 'STATE';

    // Check if page exists
    let page = await prisma.page.findUnique({
      where: { slug }
    });

    if (!page) {
      // Create the page
      page = await prisma.page.create({
        data: {
          slug,
          title,
          geoLevel,
          isPublished: false,
          insuranceTypeId: insuranceType.id,
          stateId: state.id,
          cityId: city?.id || null,
          customData: {
            templateName: getTemplateNameForInsuranceType(insuranceType.slug),
            state_name: state.name,
            state_code: state.code,
            insurance_type: insuranceType.name,
            insurance_slug: insuranceType.slug,
            ...(city ? { city_name: city.name } : {})
          }
        }
      });
    }

    // Generate AI content
    if (sections.length > 0) {
      const locationName = city ? `${city.name}, ${state.code}` : state.name;

      const response = await OpenRouterService.generateContent({
        pageData: {
          id: page.id,
          slug: page.slug,
          insuranceType: insuranceType.name,
          state: state.name,
          city: city?.name
        },
        sections,
        model,
        templatePrompts,
        keywordConfig
      });

      if (!response.success || !response.content) {
        // ROLLBACK: Delete the empty page so we don't end up with ghost pages
        console.warn(`⚠️ Generation failed for ${slug}, deleting empty page.`);
        await prisma.page.delete({ where: { id: page.id } });

        return {
          success: false,
          error: response.error || 'Failed to generate AI content'
        };
      }

      // Build update data
      const updateData: any = {
        aiGeneratedContent: response.content,
        aiGeneratedAt: new Date(),
        aiModel: model,
        isAiGenerated: true
      };

      // If meta tags were generated, update meta fields
      if (response.content.metaTags) {
        const { metaTitle, metaDescription, metaKeywords, ogTitle, ogDescription } = response.content.metaTags;
        if (metaTitle) updateData.metaTitle = metaTitle;
        if (metaDescription) updateData.metaDescription = metaDescription;
        if (metaKeywords && Array.isArray(metaKeywords)) updateData.metaKeywords = metaKeywords;
        if (ogTitle) updateData.ogTitle = ogTitle;
        if (ogDescription) updateData.ogDescription = ogDescription;
        if (ogTitle) updateData.twitterTitle = ogTitle;
        if (ogDescription) updateData.twitterDesc = ogDescription;
      }

      await prisma.page.update({
        where: { id: page.id },
        data: updateData
      });

      return {
        success: true,
        tokensUsed: response.tokensUsed,
        cost: response.cost
      };
    }

    return { success: true };

  } catch (error: any) {
    // Check for rate limit errors
    if (error.name === 'AllProvidersRateLimitedError') {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update job progress in database
 */
async function updateJobProgress(
  jobId: string,
  progress: {
    processedPages: number;
    successfulPages: number;
    failedPages: number;
    totalTokensUsed: number;
    estimatedCost: number;
    errorLog: any[];
    resumeState?: any;
  }
) {
  await prisma.aIGenerationJob.update({
    where: { id: jobId },
    data: {
      processedPages: progress.processedPages,
      successfulPages: progress.successfulPages,
      failedPages: progress.failedPages,
      totalTokensUsed: progress.totalTokensUsed,
      estimatedCost: progress.estimatedCost,
      errorLog: progress.errorLog.length > 0 ? progress.errorLog : undefined,
      ...(progress.resumeState ? { resumeState: progress.resumeState } : {})
    }
  });
}

function getTemplateNameForInsuranceType(slug: string): string {
  const templates: Record<string, string> = {
    'auto': 'auto-insurance',
    'home': 'home-insurance',
    'life': 'life-insurance',
    'health': 'health-insurance',
    'renters': 'renters-insurance',
    'business': 'business-insurance'
  };
  return templates[slug] || 'default';
}
