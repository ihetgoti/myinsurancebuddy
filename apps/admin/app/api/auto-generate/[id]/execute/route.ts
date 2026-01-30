import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpenRouterService, AIContentSection } from '@/lib/aiContentService';

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

    if (job.status !== 'PENDING') {
      return NextResponse.json({
        error: `Job already ${job.status.toLowerCase()}. Cannot restart.`
      }, { status: 400 });
    }

    // Mark job as processing
    await prisma.aIGenerationJob.update({
      where: { id: jobId },
      data: {
        status: 'PROCESSING',
        startedAt: new Date()
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

    return NextResponse.json({
      success: true,
      message: 'Job started. Poll /api/auto-generate/' + jobId + '/status for progress.'
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
 * Background job processor
 */
async function processAutoGenerateJob(job: any) {
  const filters = job.filters as JobFilters;
  const sections = job.sections as string[];
  const model = job.model;

  // Get insurance type
  const insuranceType = await prisma.insuranceType.findUnique({
    where: { id: filters.insuranceTypeId }
  });

  if (!insuranceType) {
    throw new Error('Insurance type not found');
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

  let processedPages = 0;
  let successfulPages = 0;
  let failedPages = 0;
  let totalTokensUsed = 0;
  let estimatedCost = 0;
  const errorLog: any[] = [];

  // Process each state
  for (const state of selectedStates) {
    // Process state-level page
    if (filters.geoLevels.includes('STATE')) {
      const result = await processPage(
        insuranceType,
        state,
        null,
        model,
        sections as AIContentSection[],
        job.id
      );

      processedPages++;
      if (result.success) {
        successfulPages++;
        totalTokensUsed += result.tokensUsed || 0;
        estimatedCost += result.cost || 0;
      } else {
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
        errorLog
      });
    }

    // Process city-level pages
    if (filters.geoLevels.includes('CITY')) {
      for (const city of state.cities) {
        const result = await processPage(
          insuranceType,
          state,
          city,
          model,
          sections as AIContentSection[],
          job.id
        );

        processedPages++;
        if (result.success) {
          successfulPages++;
          totalTokensUsed += result.tokensUsed || 0;
          estimatedCost += result.cost || 0;
        } else {
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
            errorLog
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
      completedAt: new Date()
    }
  });
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
  jobId: string
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
        model
      });

      if (!response.success || !response.content) {
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
  data: {
    processedPages: number;
    successfulPages: number;
    failedPages: number;
    totalTokensUsed: number;
    estimatedCost: number;
    errorLog: any[];
  }
) {
  await prisma.aIGenerationJob.update({
    where: { id: jobId },
    data: {
      processedPages: data.processedPages,
      successfulPages: data.successfulPages,
      failedPages: data.failedPages,
      totalTokensUsed: data.totalTokensUsed,
      estimatedCost: data.estimatedCost,
      errorLog: data.errorLog.length > 0 ? data.errorLog : undefined
    }
  });
}

function getTemplateNameForInsuranceType(slug: string): string {
  const templateMap: Record<string, string> = {
    'car-insurance': 'AutoInsuranceTemplate',
    'auto-insurance': 'AutoInsuranceTemplate',
    'home-insurance': 'HomeInsuranceTemplate',
    'homeowners-insurance': 'HomeInsuranceTemplate',
    'health-insurance': 'HealthInsuranceTemplate',
    'life-insurance': 'LifeInsuranceTemplate',
    'business-insurance': 'BusinessInsuranceTemplate',
    'travel-insurance': 'TravelInsuranceTemplate'
  };
  return templateMap[slug] || 'AutoInsuranceTemplate';
}
