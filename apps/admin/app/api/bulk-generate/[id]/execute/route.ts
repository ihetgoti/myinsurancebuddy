import { NextRequest, NextResponse } from 'next/server';
import { revalidateWebPath } from '@/lib/revalidate';
import { replaceVariables } from '@/lib/templates/renderer';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/bulk-generate/[id]/execute
 * Executes a bulk page generation job
 * SECURITY: Requires admin authentication
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // SECURITY: Verify authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const job = await prisma.bulkJob.findUnique({
            where: { id: params.id },
            include: {
                template: true,
                insuranceType: true,
            },
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        if (job.status !== 'PENDING' && job.status !== 'QUEUED') {
            return NextResponse.json({ error: 'Job already executed' }, { status: 400 });
        }

        // Update status to processing
        await prisma.bulkJob.update({
            where: { id: params.id },
            data: {
                status: 'PROCESSING',
                startedAt: new Date(),
            },
        });

        // Process in background (in production, use a queue like Bull)
        processJob(job).catch(console.error);

        return NextResponse.json({ success: true, message: 'Job started' });
    } catch (error) {
        console.error('Failed to execute job:', error);
        return NextResponse.json({ error: 'Failed to execute job' }, { status: 500 });
    }
}

async function processJob(job: any) {
    const csvData = job.csvData as any[] || [];
    const variableMapping = job.variableMapping as Record<string, string> || {};
    const slugPattern = job.slugPattern || '{{slug}}';

    let createdPages = 0;
    let updatedPages = 0;
    let skippedPages = 0;
    let failedPages = 0;
    const errorLog: any[] = [];

    try {
        for (let i = 0; i < csvData.length; i++) {
            const row = csvData[i];

            try {
                // Build variables with PRIORITY ORDER:
                // 1. Context variables (always available)
                // 2. Auto-match: CSV columns that match template variable names exactly
                // 3. Custom mapping: Override with user-defined mappings

                const variables: Record<string, any> = {
                    // Priority 1: Inject context variables
                    'insurance_type_slug': job.insuranceType?.slug || '',
                    'insurance_type_name': job.insuranceType?.name || '',
                    'template_slug': job.template.slug,
                };

                // Priority 2: AUTO-MATCH - Copy all CSV columns directly as variables
                // This means if CSV has "city_name" column, {{city_name}} will work automatically!
                Object.keys(row).forEach((csvColumn) => {
                    let value = row[csvColumn];

                    // Skip empty values
                    if (value === undefined || value === null || value === '') return;

                    // Auto-parse JSON strings (arrays/objects) for Loop compatibility
                    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                        try {
                            value = JSON.parse(value);
                        } catch (e) {
                            // Keep as string if parse fails
                        }
                    }

                    // Use the CSV column name directly as the variable name
                    variables[csvColumn] = value;
                });

                // Priority 3: CUSTOM MAPPING - Override with user-defined variable mappings
                // This allows renaming: CSV "my_col" → template "{{different_name}}"
                Object.entries(variableMapping).forEach(([varName, csvColumn]) => {
                    let value = row[csvColumn];

                    if (value === undefined || value === null) {
                        value = '';
                    }

                    // Auto-parse JSON strings (arrays/objects) for Loop compatibility
                    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                        try {
                            value = JSON.parse(value);
                        } catch (e) {
                            // Keep as string if parse fails
                        }
                    }

                    variables[varName] = value;
                });

                // Helper: derived variables
                if (variables['state_code'] && typeof variables['state_code'] === 'string') {
                    variables['state_code_lower'] = variables['state_code'].toLowerCase();
                }

                // Helper: Split 25/50 liability if needed
                if (variables['min_liability_bodily'] && typeof variables['min_liability_bodily'] === 'string') {
                    const parts = variables['min_liability_bodily'].split('/');
                    if (parts.length === 2) {
                        variables['bodily_injury_per_person'] = parts[0];
                        variables['bodily_injury_per_accident'] = parts[1];
                    }
                }

                // FAILSAFE: Auto-detect state_slug/city_slug if not mapped (critical for URLs)
                ['state_slug', 'city_slug'].forEach(key => {
                    if (!variables[key]) {
                        // Find header matching key (case-insensitive)
                        const header = Object.keys(row).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === key.replace(/_/g, ''));
                        if (header && row[header]) {
                            variables[key] = row[header];
                        }
                    }
                });

                // ========================================
                // GEO HIERARCHY RESOLUTION
                // Auto-link to Country → State → City
                // ========================================
                let countryId: string | null = null;
                let stateId: string | null = null;
                let cityId: string | null = null;
                let geoLevel: 'COUNTRY' | 'STATE' | 'CITY' | null = null;

                // 1. Find State (by slug or code) - this also gives us the country
                if (variables['state_slug'] || variables['state_code']) {
                    const state = await prisma.state.findFirst({
                        where: {
                            OR: [
                                { slug: String(variables['state_slug'] || '').toLowerCase() },
                                { code: String(variables['state_code'] || '').toUpperCase() },
                            ],
                        },
                        include: { country: true },
                    });
                    if (state) {
                        stateId = state.id;
                        countryId = state.countryId;
                        geoLevel = 'STATE';
                        // Auto-populate geo variables for URL and template
                        variables['state_name'] = state.name;
                        variables['state_code'] = state.code;
                        variables['state_slug'] = state.slug;
                        variables['country_name'] = state.country.name;
                        variables['country_code'] = state.country.code;
                        if (state.avgPremium) variables['avg_premium'] = `$${state.avgPremium}`;
                        if (state.population) variables['state_population'] = state.population.toLocaleString();
                    }
                }

                // 2. Find City (by slug or name)
                if (variables['city_slug'] || variables['city_name']) {
                    const city = await prisma.city.findFirst({
                        where: {
                            OR: [
                                { slug: String(variables['city_slug'] || '').toLowerCase() },
                                { name: { equals: String(variables['city_name'] || ''), mode: 'insensitive' } },
                            ],
                            ...(stateId ? { stateId } : {}),
                        },
                        include: { state: { include: { country: true } } },
                    });
                    if (city) {
                        cityId = city.id;
                        stateId = city.stateId;
                        countryId = city.state.countryId;
                        geoLevel = 'CITY';
                        // Auto-populate geo variables
                        variables['city_name'] = city.name;
                        variables['city_slug'] = city.slug;
                        variables['state_name'] = city.state.name;
                        variables['state_code'] = city.state.code;
                        variables['state_slug'] = city.state.slug;
                        variables['country_name'] = city.state.country.name;
                        variables['country_code'] = city.state.country.code;
                        if (city.population) variables['population'] = city.population.toLocaleString();
                        if (city.avgPremium) variables['avg_premium'] = `$${city.avgPremium}`;
                    }
                }

                // 3. Find Country if only country_code provided
                if (!countryId && variables['country_code']) {
                    const country = await prisma.country.findFirst({
                        where: { code: String(variables['country_code']).toLowerCase() },
                    });
                    if (country) {
                        countryId = country.id;
                        geoLevel = 'COUNTRY';
                        variables['country_name'] = country.name;
                        variables['country_code'] = country.code;
                    }
                }

                // Generate slug
                let slug = slugPattern;
                Object.entries(variables).forEach(([key, value]) => {
                    if (typeof value !== 'string') return;

                    const slugValue = value.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                    slug = slug.replace(new RegExp(`{{${key}}}`, 'g'), slugValue);
                    slug = slug.replace(new RegExp(`{{${key}_slug}}`, 'g'), slugValue);
                });

                // Clean up slug
                slug = slug.replace(/{{[^}]+}}/g, '').replace(/\/+/g, '/').replace(/(^\/|\/$)/g, '');

                if (!slug) {
                    failedPages++;
                    errorLog.push({ row: i, error: 'Empty slug generated' });
                    continue;
                }

                // Check if page exists
                const existingPage = await prisma.page.findUnique({
                    where: { slug },
                });

                if (existingPage) {
                    if (job.skipExisting) {
                        skippedPages++;
                        continue;
                    } else if (job.updateExisting) {
                        if (!job.dryRun) {
                            await prisma.page.update({
                                where: { id: existingPage.id },
                                data: {
                                    title: variables.h1_title || variables.page_title || existingPage.title,
                                    subtitle: variables.hero_tagline || variables.page_subtitle || existingPage.subtitle,
                                    metaTitle: variables.meta_title || existingPage.metaTitle,
                                    metaDescription: variables.meta_description || existingPage.metaDescription,
                                    customData: { ...((existingPage.customData as any) || {}), ...variables },
                                    // Update geo hierarchy if resolved
                                    countryId: countryId || existingPage.countryId,
                                    stateId: stateId || existingPage.stateId,
                                    cityId: cityId || existingPage.cityId,
                                    geoLevel: geoLevel || existingPage.geoLevel,
                                    updatedAt: new Date(),
                                },
                            });
                            // Trigger revalidation
                            const path = slug.startsWith('/') ? slug : `/${slug}`;
                            await revalidateWebPath(path).catch(console.error);
                        }
                        updatedPages++;
                        continue;
                    }
                }

                // Create new page with geo hierarchy
                if (!job.dryRun) {
                    await prisma.page.create({
                        data: {
                            slug,
                            title: variables.h1_title || variables.page_title || null,
                            subtitle: variables.hero_tagline || variables.page_subtitle || null,
                            metaTitle: variables.meta_title || null,
                            metaDescription: variables.meta_description || null,
                            templateId: job.templateId,
                            insuranceTypeId: job.insuranceTypeId,
                            // Geo hierarchy
                            countryId,
                            stateId,
                            cityId,
                            geoLevel,
                            content: job.template?.sections || [],
                            customData: variables,
                            status: job.publishOnCreate ? 'PUBLISHED' : 'DRAFT',
                            isPublished: job.publishOnCreate,
                            publishedAt: job.publishOnCreate ? new Date() : null,
                        },
                    });
                }
                createdPages++;

            } catch (rowError: any) {
                failedPages++;
                errorLog.push({ row: i, error: rowError.message });
            }

            // Update progress every 10 rows
            if (i % 10 === 0) {
                await prisma.bulkJob.update({
                    where: { id: job.id },
                    data: {
                        processedRows: i + 1,
                        createdPages,
                        updatedPages,
                        skippedPages,
                        failedPages,
                    },
                });
            }
        }

        // Mark job as completed
        await prisma.bulkJob.update({
            where: { id: job.id },
            data: {
                status: 'COMPLETED',
                processedRows: csvData.length,
                createdPages,
                updatedPages,
                skippedPages,
                failedPages,
                errorLog: errorLog.length > 0 ? errorLog : undefined,
                completedAt: new Date(),
            },
        });

    } catch (error: any) {
        await prisma.bulkJob.update({
            where: { id: job.id },
            data: {
                status: 'FAILED',
                errorMessage: error.message,
                errorLog: errorLog.length > 0 ? errorLog : undefined,
                completedAt: new Date(),
            },
        });
    }
}
