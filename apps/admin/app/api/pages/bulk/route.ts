import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Helper to slugify text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Generate slug based on template and data
function generateSlug(templateId: string, data: Record<string, string>): string | null {
  const state = slugify(data.state_name || data.state || '');
  const city = slugify(data.city_name || data.city || '');
  
  if (!state) return null;
  if (city) return `${templateId}-insurance/${state}/${city}`;
  return `${templateId}-insurance/${state}`;
}

// POST - Create pages in bulk from CSV/JSON/Excel data
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, data } = body;

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'data array is required' }, { status: 400 });
    }

    const results = {
      created: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Generate slug
        const slug = generateSlug(templateId, row);
        if (!slug) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Could not generate slug - missing state_name or state`);
          continue;
        }

        // Check if page already exists
        const existing = await prisma.page.findUnique({ where: { slug } });
        if (existing) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Page with slug "${slug}" already exists`);
          continue;
        }

        // Find related entities
        let insuranceTypeId = null;
        let stateId = null;
        let cityId = null;

        // Find insurance type by template ID
        const insuranceType = await prisma.insuranceType.findFirst({
          where: {
            OR: [
              { slug: templateId },
              { slug: `${templateId}-insurance` },
              { name: { equals: templateId, mode: 'insensitive' } },
            ],
          },
        });
        if (insuranceType) {
          insuranceTypeId = insuranceType.id;
        }

        // Find state
        const stateName = row.state_name || row.state;
        if (stateName) {
          const state = await prisma.state.findFirst({
            where: {
              OR: [
                { name: { equals: stateName, mode: 'insensitive' } },
                { code: { equals: stateName.toUpperCase() } },
                { slug: slugify(stateName) },
              ],
            },
          });
          if (state) {
            stateId = state.id;
          }
        }

        // Find city
        const cityName = row.city_name || row.city;
        if (cityName && stateId) {
          const city = await prisma.city.findFirst({
            where: {
              stateId,
              OR: [
                { name: { equals: cityName, mode: 'insensitive' } },
                { slug: slugify(cityName) },
              ],
            },
          });
          if (city) {
            cityId = city.id;
          }
        }

        // Determine geo level
        let geoLevel: any = 'NONE';
        if (cityId) geoLevel = 'CITY';
        else if (stateId) geoLevel = 'STATE';

        // Generate page title
        const stateDisplay = row.state_name || row.state || 'Your State';
        const cityDisplay = row.city_name || row.city;
        const title = cityDisplay 
          ? `${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Insurance in ${cityDisplay}, ${stateDisplay}`
          : `${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Insurance in ${stateDisplay}`;

        // Create page with template reference and variables
        await prisma.page.create({
          data: {
            slug,
            title,
            metaTitle: row.meta_title || row.metaTitle || title,
            metaDescription: row.meta_description || row.metaDescription || `Find the best ${templateId} insurance rates in ${stateDisplay}. Compare quotes and save.`,
            customData: {
              ...row,
              template: templateId, // Reference to the React component template
            },
            insuranceTypeId,
            stateId,
            cityId,
            geoLevel,
            content: [],
            status: 'PUBLISHED',
            isPublished: true,
            publishedAt: new Date(),
          },
        });

        results.created++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      created: results.created,
      failed: results.failed,
      total: data.length,
      errors: results.errors.length > 0 ? results.errors.slice(0, 10) : undefined,
    });

  } catch (error: any) {
    console.error('[Bulk Pages API]', error);
    return NextResponse.json({ 
      error: error.message,
      created: 0,
      failed: 0,
    }, { status: 500 });
  }
}

// GET - Simple documentation
export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/pages/bulk',
    description: 'Create pages in bulk from CSV/JSON/Excel data',
    requestBody: {
      templateId: 'string (required) - Insurance type: auto, home, health, life, motorcycle, pet, business, renters, umbrella',
      data: 'array (required) - Array of objects with template variables',
    },
    example: {
      templateId: 'auto',
      data: [
        {
          state_name: 'California',
          state_code: 'CA',
          avg_premium: '$1,500/year',
          min_coverage: '15/30/5',
          top_insurer: 'State Farm',
          uninsured_rate: '12%'
        },
        {
          state_name: 'Texas',
          state_code: 'TX',
          avg_premium: '$1,400/year',
          min_coverage: '30/60/25',
          top_insurer: 'GEICO',
          uninsured_rate: '8%'
        }
      ]
    },
    response: {
      success: true,
      created: 2,
      failed: 0,
      total: 2,
      errors: undefined
    }
  });
}
