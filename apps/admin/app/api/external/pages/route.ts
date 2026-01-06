import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * External Page Creation API
 * 
 * This endpoint allows external microservices to create and publish pages
 * using an API key for authentication (no session required).
 * 
 * Set the API key in your .env:
 * PAGES_API_KEY="your-secure-key-here"
 * 
 * Usage:
 * POST /api/external/pages
 * Headers:
 *   X-API-Key: your-api-key
 *   Content-Type: application/json
 * 
 * Body (single page):
 * {
 *   "slug": "car-insurance/texas/houston",
 *   "title": "Car Insurance in Houston, TX",
 *   "metaTitle": "Best Car Insurance Houston TX | Compare Quotes",
 *   "metaDescription": "Find affordable car insurance in Houston...",
 *   "insuranceType": "car-insurance",
 *   "state": "texas",
 *   "city": "houston",
 *   "templateId": "optional-template-id",
 *   "customData": { "any": "additional", "fields": "here" },
 *   "isPublished": true
 * }
 * 
 * Body (bulk):
 * {
 *   "pages": [{ ... }, { ... }]
 * }
 */

// Validate API key
function validateApiKey(request: NextRequest): boolean {
    const apiKey = request.headers.get('X-API-Key') || request.headers.get('x-api-key');
    const validKey = process.env.PAGES_API_KEY;

    if (!validKey) {
        console.error('PAGES_API_KEY not set in environment');
        return false;
    }

    return apiKey === validKey;
}

// Helper to find or create geo entities
async function resolveGeoEntities(data: any) {
    let insuranceTypeId = null;
    let countryId = null;
    let stateId = null;
    let cityId = null;

    // Resolve insurance type by slug
    if (data.insuranceType) {
        const type = await prisma.insuranceType.findFirst({
            where: {
                OR: [
                    { slug: data.insuranceType },
                    { name: { contains: data.insuranceType, mode: 'insensitive' } }
                ]
            }
        });
        insuranceTypeId = type?.id;
    }

    // Resolve state by name or slug
    if (data.state) {
        const state = await prisma.state.findFirst({
            where: {
                OR: [
                    { slug: data.state },
                    { name: { contains: data.state, mode: 'insensitive' } },
                    { abbreviation: data.state.toUpperCase() }
                ]
            },
            include: { country: true }
        });
        stateId = state?.id;
        countryId = state?.countryId;
    }

    // Resolve city by name
    if (data.city && stateId) {
        const city = await prisma.city.findFirst({
            where: {
                stateId,
                OR: [
                    { slug: data.city },
                    { name: { contains: data.city, mode: 'insensitive' } }
                ]
            }
        });
        cityId = city?.id;
    }

    return { insuranceTypeId, countryId, stateId, cityId };
}

// Create a single page
async function createPage(data: any) {
    const { insuranceTypeId, countryId, stateId, cityId } = await resolveGeoEntities(data);

    // Determine geo level
    let geoLevel = 'NICHE';
    if (cityId) geoLevel = 'CITY';
    else if (stateId) geoLevel = 'STATE';
    else if (countryId) geoLevel = 'COUNTRY';

    // Check if page already exists
    const existing = await prisma.page.findUnique({
        where: { slug: data.slug }
    });

    if (existing) {
        // Update existing page
        const updated = await prisma.page.update({
            where: { id: existing.id },
            data: {
                title: data.title || existing.title,
                metaTitle: data.metaTitle || existing.metaTitle,
                metaDescription: data.metaDescription || existing.metaDescription,
                customData: data.customData || existing.customData,
                isPublished: data.isPublished ?? existing.isPublished,
                publishedAt: data.isPublished ? new Date() : existing.publishedAt,
                status: data.isPublished ? 'PUBLISHED' : existing.status,
            }
        });
        return { action: 'updated', id: updated.id, slug: updated.slug };
    }

    // Create new page
    const page = await prisma.page.create({
        data: {
            slug: data.slug,
            title: data.title || data.slug.split('/').pop()?.replace(/-/g, ' '),
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            content: data.content || [],
            customData: data.customData,
            insuranceTypeId,
            countryId,
            stateId,
            cityId,
            geoLevel: geoLevel as any,
            templateId: data.templateId || null,
            isPublished: data.isPublished ?? true,
            publishedAt: data.isPublished !== false ? new Date() : null,
            status: data.isPublished !== false ? 'PUBLISHED' : 'DRAFT',
            showAds: data.showAds ?? true,
        }
    });

    return { action: 'created', id: page.id, slug: page.slug };
}

// POST - Create page(s)
export async function POST(request: NextRequest) {
    // Validate API key
    if (!validateApiKey(request)) {
        return NextResponse.json(
            { error: 'Unauthorized. Invalid or missing X-API-Key header.' },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const results: any[] = [];
        const errors: any[] = [];

        // Handle bulk or single page
        const pages = body.pages || [body];

        for (const pageData of pages) {
            try {
                if (!pageData.slug) {
                    errors.push({ error: 'Missing required field: slug', data: pageData });
                    continue;
                }
                const result = await createPage(pageData);
                results.push(result);
            } catch (err: any) {
                errors.push({ error: err.message, slug: pageData.slug });
            }
        }

        return NextResponse.json({
            success: true,
            created: results.filter(r => r.action === 'created').length,
            updated: results.filter(r => r.action === 'updated').length,
            errors: errors.length,
            results,
            errorDetails: errors.length > 0 ? errors : undefined,
        });
    } catch (error: any) {
        console.error('POST /api/external/pages error:', error);
        return NextResponse.json(
            { error: 'Failed to create pages', details: error.message },
            { status: 500 }
        );
    }
}

// GET - Check API status
export async function GET(request: NextRequest) {
    if (!validateApiKey(request)) {
        return NextResponse.json(
            { error: 'Unauthorized. Invalid or missing X-API-Key header.' },
            { status: 401 }
        );
    }

    const pageCount = await prisma.page.count();
    return NextResponse.json({
        status: 'ok',
        message: 'External Pages API is ready',
        totalPages: pageCount,
        endpoints: {
            createPages: 'POST /api/external/pages',
        },
        exampleBody: {
            slug: 'car-insurance/texas/houston',
            title: 'Car Insurance in Houston, TX',
            metaTitle: 'Best Car Insurance Houston TX',
            metaDescription: 'Find affordable car insurance...',
            insuranceType: 'car-insurance',
            state: 'texas',
            city: 'houston',
            isPublished: true,
            customData: { population: 2300000 }
        }
    });
}
