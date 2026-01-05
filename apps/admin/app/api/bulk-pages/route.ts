/**
 * Bulk Pages API - With Geo Hierarchy Support
 * 
 * POST /api/bulk-pages
 * 
 * Supports: insurance-type/country/state/city hierarchy
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GeoLevel } from '@myinsurancebuddy/db';

// Slugify helper
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate required fields
        if (!body.templateSlug && !body.templateId) {
            return NextResponse.json({ error: 'templateSlug or templateId is required' }, { status: 400 });
        }
        if (!body.slugPattern) {
            return NextResponse.json({ error: 'slugPattern is required' }, { status: 400 });
        }
        if (!body.data || !Array.isArray(body.data) || body.data.length === 0) {
            return NextResponse.json({ error: 'data array is required' }, { status: 400 });
        }

        // Find template
        let template = null;
        if (body.templateId) {
            template = await prisma.template.findUnique({ where: { id: body.templateId } });
        } else {
            template = await prisma.template.findFirst({ where: { slug: body.templateSlug } });
        }
        if (!template) {
            return NextResponse.json({ error: `Template not found: ${body.templateSlug || body.templateId}` }, { status: 404 });
        }

        // Find insurance type if provided
        let insuranceType = null;
        if (body.insuranceTypeSlug) {
            insuranceType = await prisma.insuranceType.findUnique({ where: { slug: body.insuranceTypeSlug } });
        }

        // Options
        const publishOnCreate = body.publish === true;
        const updateExisting = body.update === true;
        const dryRun = body.dryRun === true;
        const geoLevel = body.geoLevel as GeoLevel || null;

        // Results
        const results = {
            created: 0,
            updated: 0,
            skipped: 0,
            failed: 0,
            pages: [] as any[],
            errors: [] as any[],
        };

        // Process each row
        for (let i = 0; i < body.data.length; i++) {
            const row = body.data[i];

            try {
                // Parse any JSON strings
                const variables: Record<string, any> = {};
                Object.keys(row).forEach(key => {
                    let value = row[key];
                    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                        try { value = JSON.parse(value); } catch (e) { }
                    }
                    variables[key] = value;
                });

                // === GEO HIERARCHY RESOLUTION ===
                let countryId = null;
                let stateId = null;
                let cityId = null;
                let resolvedGeoLevel: GeoLevel | null = geoLevel;

                // 1. Find Country (by code like "us")
                if (row.country_code || row.country_slug) {
                    const country = await prisma.country.findFirst({
                        where: {
                            OR: [
                                { code: row.country_code?.toLowerCase() },
                                { code: row.country_slug?.toLowerCase() },
                            ]
                        }
                    });
                    if (country) {
                        countryId = country.id;
                        variables.country_name = country.name;
                        variables.country_code = country.code;
                        if (!resolvedGeoLevel) resolvedGeoLevel = 'COUNTRY';
                    }
                }

                // 2. Find State (by slug or code)
                if (row.state_slug || row.state_code) {
                    const state = await prisma.state.findFirst({
                        where: {
                            OR: [
                                { slug: row.state_slug?.toLowerCase() },
                                { code: row.state_code?.toUpperCase() },
                            ],
                            ...(countryId ? { countryId } : {}),
                        },
                        include: { country: true },
                    });
                    if (state) {
                        stateId = state.id;
                        countryId = state.countryId;
                        variables.state_name = state.name;
                        variables.state_code = state.code;
                        variables.state_slug = state.slug;
                        variables.country_name = state.country.name;
                        variables.country_code = state.country.code;
                        if (!resolvedGeoLevel) resolvedGeoLevel = 'STATE';
                    }
                }

                // 3. Find City (by slug or name)
                if (row.city_slug || row.city_name) {
                    const city = await prisma.city.findFirst({
                        where: {
                            OR: [
                                { slug: row.city_slug?.toLowerCase() },
                                { name: { equals: row.city_name, mode: 'insensitive' } },
                            ],
                            ...(stateId ? { stateId } : {}),
                        },
                        include: { state: { include: { country: true } } },
                    });
                    if (city) {
                        cityId = city.id;
                        stateId = city.stateId;
                        countryId = city.state.countryId;
                        variables.city_name = city.name;
                        variables.city_slug = city.slug;
                        variables.state_name = city.state.name;
                        variables.state_code = city.state.code;
                        variables.state_slug = city.state.slug;
                        variables.country_name = city.state.country.name;
                        variables.country_code = city.state.country.code;
                        variables.population = city.population?.toLocaleString() || '';
                        if (!resolvedGeoLevel) resolvedGeoLevel = 'CITY';
                    }
                }

                // Add context variables
                variables.insurance_type_slug = insuranceType?.slug || body.insuranceTypeSlug || '';
                variables.insurance_type_name = insuranceType?.name || '';
                variables.template_slug = template.slug;

                // Build slug from pattern
                let slug = body.slugPattern;
                Object.entries(variables).forEach(([key, value]) => {
                    if (typeof value === 'string') {
                        const slugValue = slugify(value);
                        slug = slug.replace(new RegExp(`{{${key}}}`, 'g'), slugValue);
                        slug = slug.replace(new RegExp(`{{${key}_slug}}`, 'g'), slugValue);
                    }
                });
                slug = slug.replace(/{{[^}]+}}/g, '').replace(/\/+/g, '/').replace(/(^\/|\/$)/g, '');

                if (!slug) {
                    results.failed++;
                    results.errors.push({ row: i, error: 'Could not generate slug' });
                    continue;
                }

                // Check if exists
                const existing = await prisma.page.findUnique({ where: { slug } });

                if (existing) {
                    if (updateExisting) {
                        if (!dryRun) {
                            await prisma.page.update({
                                where: { slug },
                                data: {
                                    title: variables.h1_title || variables.page_title || existing.title,
                                    metaTitle: variables.meta_title || existing.metaTitle,
                                    metaDescription: variables.meta_description || existing.metaDescription,
                                    customData: variables,
                                    countryId,
                                    stateId,
                                    cityId,
                                    geoLevel: resolvedGeoLevel,
                                    status: publishOnCreate ? 'PUBLISHED' : existing.status,
                                    isPublished: publishOnCreate || existing.isPublished,
                                },
                            });
                        }
                        results.updated++;
                        results.pages.push({ slug, action: 'updated', geoLevel: resolvedGeoLevel });
                    } else {
                        results.skipped++;
                    }
                    continue;
                }

                // Create page
                if (!dryRun) {
                    const created = await prisma.page.create({
                        data: {
                            slug,
                            title: variables.h1_title || variables.page_title || null,
                            metaTitle: variables.meta_title || null,
                            metaDescription: variables.meta_description || null,
                            templateId: template.id,
                            insuranceTypeId: insuranceType?.id || null,
                            countryId,
                            stateId,
                            cityId,
                            geoLevel: resolvedGeoLevel,
                            content: [],
                            customData: variables,
                            status: publishOnCreate ? 'PUBLISHED' : 'DRAFT',
                            isPublished: publishOnCreate,
                            publishedAt: publishOnCreate ? new Date() : null,
                        },
                    });
                    results.pages.push({ id: created.id, slug, action: 'created', geoLevel: resolvedGeoLevel });
                } else {
                    results.pages.push({ slug, action: 'would_create', geoLevel: resolvedGeoLevel });
                }
                results.created++;

            } catch (error: any) {
                results.failed++;
                results.errors.push({ row: i, data: row, error: error.message });
            }
        }

        return NextResponse.json({
            success: true,
            dryRun,
            total: body.data.length,
            created: results.created,
            updated: results.updated,
            skipped: results.skipped,
            failed: results.failed,
            pages: results.pages,
            errors: results.errors.length > 0 ? results.errors : undefined,
        });

    } catch (error: any) {
        console.error('[Bulk Pages API]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET - API Documentation with Sample Requests
 */
export async function GET() {
    const baseUrl = 'http://localhost:3002';

    return NextResponse.json({
        endpoint: `POST ${baseUrl}/api/bulk-pages`,

        description: 'Create pages with proper geo hierarchy (country/state/city)',

        // ========================================
        // REQUEST SCHEMA
        // ========================================
        request_schema: {
            templateSlug: 'string (required) - Template to use',
            slugPattern: 'string (required) - URL pattern with {{variables}}',
            insuranceTypeSlug: 'string (optional) - Link to insurance type',
            publish: 'boolean (default: false) - Publish immediately',
            update: 'boolean (default: false) - Update if exists',
            dryRun: 'boolean (default: false) - Test mode',
            data: 'array (required) - Your JSON data rows',
        },

        // ========================================
        // GEO HIERARCHY FIELDS
        // ========================================
        geo_hierarchy_fields: {
            country_code: 'e.g., "us" - Links to Country table',
            state_slug: 'e.g., "california" - Links to State table',
            state_code: 'e.g., "CA" - Alternative to state_slug',
            city_slug: 'e.g., "los-angeles" - Links to City table',
            city_name: 'e.g., "Los Angeles" - Alternative to city_slug',
        },

        // ========================================
        // SAMPLE REQUESTS
        // ========================================
        sample_requests: {

            // --- STATE LEVEL PAGES ---
            state_pages: {
                description: 'Create pages for states: /car-insurance/us/california',
                request: {
                    templateSlug: 'TEST',
                    slugPattern: '{{insurance_type_slug}}/{{country_code}}/{{state_slug}}',
                    insuranceTypeSlug: 'car-insurance',
                    publish: true,
                    data: [
                        {
                            country_code: 'us',
                            state_slug: 'california',
                            state_code: 'CA',
                            h1_title: 'Best Car Insurance in California',
                            meta_title: 'California Car Insurance - Compare Rates 2024',
                            meta_description: 'Find the best car insurance rates in California...',
                            avg_premium: '$180',
                            min_coverage: '15/30/5',
                            hero_tagline: 'Save up to $500 on California auto insurance',
                            faqs: [
                                { q: 'Is car insurance required in California?', a: 'Yes, California requires liability insurance.' },
                                { q: 'What is minimum coverage?', a: '15/30/5 liability limits.' },
                            ],
                        },
                        {
                            country_code: 'us',
                            state_slug: 'texas',
                            state_code: 'TX',
                            h1_title: 'Best Car Insurance in Texas',
                            meta_title: 'Texas Car Insurance Guide 2024',
                            avg_premium: '$145',
                            min_coverage: '30/60/25',
                        },
                    ],
                },
                curl: `curl -X POST ${baseUrl}/api/bulk-pages \\
  -H "Content-Type: application/json" \\
  -b "next-auth.session-token=YOUR_TOKEN" \\
  -d '${JSON.stringify({
                    templateSlug: "TEST",
                    slugPattern: "{{insurance_type_slug}}/{{country_code}}/{{state_slug}}",
                    insuranceTypeSlug: "car-insurance",
                    publish: true,
                    data: [{
                        country_code: "us",
                        state_slug: "california",
                        h1_title: "Best Car Insurance in California",
                        avg_premium: "$180"
                    }]
                })}'`,
            },

            // --- CITY LEVEL PAGES ---
            city_pages: {
                description: 'Create pages for cities: /car-insurance/us/california/los-angeles',
                request: {
                    templateSlug: 'city-template',
                    slugPattern: '{{insurance_type_slug}}/{{country_code}}/{{state_slug}}/{{city_slug}}',
                    insuranceTypeSlug: 'car-insurance',
                    publish: true,
                    data: [
                        {
                            country_code: 'us',
                            state_slug: 'california',
                            city_slug: 'los-angeles',
                            city_name: 'Los Angeles',
                            h1_title: 'Best Car Insurance in Los Angeles, CA',
                            meta_title: 'Los Angeles Car Insurance - Compare Rates',
                            avg_premium: '$200',
                            population: '3,900,000',
                            local_factors: [
                                { factor: 'High traffic density', impact: '+15%' },
                                { factor: 'Vehicle theft rate', impact: '+10%' },
                            ],
                        },
                        {
                            country_code: 'us',
                            state_slug: 'california',
                            city_slug: 'san-francisco',
                            city_name: 'San Francisco',
                            h1_title: 'Best Car Insurance in San Francisco, CA',
                            avg_premium: '$210',
                        },
                    ],
                },
            },

            // --- HEALTH INSURANCE EXAMPLE ---
            health_insurance: {
                description: 'Different insurance type: health-insurance',
                request: {
                    templateSlug: 'health-template',
                    slugPattern: '{{insurance_type_slug}}/{{country_code}}/{{state_slug}}',
                    insuranceTypeSlug: 'health-insurance',
                    publish: true,
                    data: [
                        {
                            country_code: 'us',
                            state_slug: 'new-york',
                            h1_title: 'Best Health Insurance in New York',
                            meta_title: 'New York Health Insurance Plans 2024',
                            plan_types: ['HMO', 'PPO', 'EPO'],
                            avg_monthly_cost: '$450',
                        },
                    ],
                },
            },

            // --- DRY RUN (TEST MODE) ---
            dry_run_test: {
                description: 'Test without creating pages',
                request: {
                    templateSlug: 'TEST',
                    slugPattern: 'test/{{state_slug}}',
                    dryRun: true,
                    data: [
                        { state_slug: 'test-state', h1_title: 'Test Page' },
                    ],
                },
            },
        },

        // ========================================
        // RESPONSE FORMAT
        // ========================================
        response_format: {
            success: true,
            dryRun: false,
            total: 2,
            created: 2,
            updated: 0,
            skipped: 0,
            failed: 0,
            pages: [
                { id: 'abc123', slug: 'car-insurance/us/california', action: 'created', geoLevel: 'STATE' },
                { id: 'def456', slug: 'car-insurance/us/texas', action: 'created', geoLevel: 'STATE' },
            ],
        },

        // ========================================
        // URL PATTERNS
        // ========================================
        url_patterns: {
            'Insurance Type Only': '{{insurance_type_slug}}',
            'Country Level': '{{insurance_type_slug}}/{{country_code}}',
            'State Level': '{{insurance_type_slug}}/{{country_code}}/{{state_slug}}',
            'City Level': '{{insurance_type_slug}}/{{country_code}}/{{state_slug}}/{{city_slug}}',
            'Alternative (no country)': '{{insurance_type_slug}}/{{state_slug}}/{{city_slug}}',
        },
    });
}
