import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpenRouterService, AIContentSection } from '@/lib/aiContentService';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for long generation

interface AutoGenerateRequest {
  insuranceTypeId: string;
  stateIds: string[];
  geoLevels: string[];
  templateId?: string;
  model: string;
  sections: string[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AutoGenerateRequest = await request.json();
    const { insuranceTypeId, stateIds, geoLevels, model, sections } = body;

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

    // Get selected states with cities
    const selectedStates = await prisma.state.findMany({
      where: { id: { in: stateIds } },
      include: {
        cities: true
      }
    });

    const results = {
      pagesCreated: 0,
      pagesSkipped: 0,
      contentGenerated: 0,
      errors: [] as string[]
    };

    // Generate pages for each state and city
    for (const state of selectedStates) {
      // Create state-level page if STATE is in geoLevels
      if (geoLevels.includes('STATE')) {
        try {
          const stateSlug = `${insuranceType.slug}/${state.slug}`;

          // Check if page already exists
          let page = await prisma.page.findUnique({
            where: { slug: stateSlug }
          });

          if (!page) {
            // Create the page
            page = await prisma.page.create({
              data: {
                slug: stateSlug,
                title: `${insuranceType.name} in ${state.name}`,
                geoLevel: 'STATE',
                isPublished: false,
                priority: 1,
                insuranceTypeId: insuranceType.id,
                stateId: state.id,
                templateName: getTemplateNameForInsuranceType(insuranceType.slug),
                variables: {
                  state_name: state.name,
                  state_code: state.code,
                  insurance_type: insuranceType.name,
                  insurance_slug: insuranceType.slug
                }
              }
            });
            results.pagesCreated++;
          } else {
            results.pagesSkipped++;
          }

          // Generate AI content for this page
          if (page && sections.length > 0) {
            try {
              await generateContentForPage(page, insuranceType, state, null, model, sections);
              results.contentGenerated++;
            } catch (error: any) {
              results.errors.push(`AI content failed for ${stateSlug}: ${error.message}`);
            }
          }
        } catch (error: any) {
          results.errors.push(`Failed to create state page for ${state.name}: ${error.message}`);
        }
      }

      // Create city-level pages if CITY is in geoLevels
      if (geoLevels.includes('CITY')) {
        for (const city of state.cities) {
          try {
            const citySlug = `${insuranceType.slug}/${state.slug}/${city.slug}`;

            // Check if page already exists
            let page = await prisma.page.findUnique({
              where: { slug: citySlug }
            });

            if (!page) {
              // Create the page
              page = await prisma.page.create({
                data: {
                  slug: citySlug,
                  title: `${insuranceType.name} in ${city.name}, ${state.code}`,
                  geoLevel: 'CITY',
                  isPublished: false,
                  priority: 2,
                  insuranceTypeId: insuranceType.id,
                  stateId: state.id,
                  cityId: city.id,
                  templateName: getTemplateNameForInsuranceType(insuranceType.slug),
                  variables: {
                    city_name: city.name,
                    state_name: state.name,
                    state_code: state.code,
                    insurance_type: insuranceType.name,
                    insurance_slug: insuranceType.slug
                  }
                }
              });
              results.pagesCreated++;
            } else {
              results.pagesSkipped++;
            }

            // Generate AI content for this page
            if (page && sections.length > 0) {
              try {
                await generateContentForPage(page, insuranceType, state, city, model, sections);
                results.contentGenerated++;
              } catch (error: any) {
                results.errors.push(`AI content failed for ${citySlug}: ${error.message}`);
              }
            }
          } catch (error: any) {
            results.errors.push(`Failed to create city page for ${city.name}: ${error.message}`);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...results
    });

  } catch (error: any) {
    console.error('Auto-generate error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to auto-generate pages'
    }, { status: 500 });
  }
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

async function generateContentForPage(
  page: any,
  insuranceType: any,
  state: any,
  city: any | null,
  model: string,
  sections: string[]
) {
  const locationName = city ? `${city.name}, ${state.code}` : state.name;

  // Generate content using OpenRouter
  const response = await OpenRouterService.generateContent({
    pageData: {
      id: page.id,
      slug: page.slug,
      insuranceType: insuranceType.name,
      state: state.name,
      city: city?.name
    },
    sections: sections as AIContentSection[],
    model
  });

  if (!response.success || !response.content) {
    throw new Error(response.error || 'Failed to generate AI content');
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

  return response.content;
}
