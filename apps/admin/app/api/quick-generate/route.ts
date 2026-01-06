import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GENERATION_PRESETS, SEO_TEMPLATES, SLUG_PATTERNS, PresetAction } from '@/lib/presets';
import { autoMapColumns, applyMapping, slugify } from '@/lib/auto-mapper';
import { processJobInBatches } from '@/lib/job-queue';

export const dynamic = 'force-dynamic';

/**
 * Get or create a default template for quick generation
 */
async function getOrCreateDefaultTemplate(): Promise<string> {
    // Try to find existing default template
    let template = await prisma.template.findFirst({
        where: { slug: 'quick-generate-default' },
    });

    if (!template) {
        // Create default template
        template = await prisma.template.create({
            data: {
                name: 'Quick Generate Default',
                slug: 'quick-generate-default',
                description: 'Auto-generated template for quick page generation',
                type: 'PAGE',
                sections: [],
                isActive: true,
                isDefault: false,
            },
        });
    }

    return template.id;
}

/**
 * POST /api/quick-generate
 * One-click page generation with presets or smart CSV import
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            action,
            insuranceTypeId,
            stateId,
            csvData,
            options = {}
        } = body;

        // Validate action
        if (!action) {
            return NextResponse.json({ error: 'Action is required' }, { status: 400 });
        }

        // Get or create default template
        const defaultTemplateId = await getOrCreateDefaultTemplate();

        // Get insurance type if required
        let insuranceType = null;
        if (insuranceTypeId) {
            insuranceType = await prisma.insuranceType.findUnique({
                where: { id: insuranceTypeId },
            });
            if (!insuranceType) {
                return NextResponse.json({ error: 'Insurance type not found' }, { status: 404 });
            }
        }

        // Handle different actions
        switch (action as PresetAction | 'CSV_IMPORT') {
            case 'ALL_STATES':
                return await generateAllStates(insuranceType, options, defaultTemplateId);

            case 'ALL_CITIES':
                return await generateAllCities(insuranceType, options, defaultTemplateId);

            case 'STATE_CITIES':
                if (!stateId) {
                    return NextResponse.json({ error: 'State ID is required for STATE_CITIES action' }, { status: 400 });
                }
                return await generateStateCities(insuranceType, stateId, options, defaultTemplateId);

            case 'TOP_CITIES':
                return await generateTopCities(insuranceType, 500, options, defaultTemplateId);

            case 'MAJOR_METROS':
                return await generateMajorMetros(insuranceType, options, defaultTemplateId);

            case 'INSURANCE_MATRIX':
                return await generateInsuranceMatrix(options, defaultTemplateId);

            case 'CSV_IMPORT':
                if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
                    return NextResponse.json({ error: 'CSV data is required' }, { status: 400 });
                }
                return await processCsvImport(csvData, insuranceType, options, defaultTemplateId);

            default:
                return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Quick generate error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate pages' }, { status: 500 });
    }
}

/**
 * Generate pages for all US states
 */
async function generateAllStates(insuranceType: any, options: any, defaultTemplateId: string) {
    const states = await prisma.state.findMany({
        where: { isActive: true },
        include: { country: true },
    });

    // Create bulk job
    const job = await prisma.bulkJob.create({
        data: {
            name: `${insuranceType?.name || 'All'} - All States`,
            templateId: options.templateId || defaultTemplateId,
            insuranceTypeId: insuranceType?.id || null,
            dataSource: 'DATABASE',
            geoLevel: 'STATE',
            totalRows: states.length,
            publishOnCreate: options.publishOnCreate ?? true,
            updateExisting: options.updateExisting ?? false,
            skipExisting: options.skipExisting ?? true,
            status: 'QUEUED',
        },
    });

    // Process in background
    processJobInBatches(
        job.id,
        states,
        async (state) => {
            const slug = insuranceType
                ? `${insuranceType.slug}/${state.slug}`
                : state.slug;

            // Check if exists
            const existing = await prisma.page.findUnique({ where: { slug } });
            if (existing) {
                if (options.skipExisting) {
                    return { success: true, action: 'skipped' as const };
                }
                if (options.updateExisting) {
                    await prisma.page.update({
                        where: { id: existing.id },
                        data: { updatedAt: new Date() },
                    });
                    return { success: true, action: 'updated' as const };
                }
                return { success: true, action: 'skipped' as const };
            }

            // Create page
            const seoTemplate = SEO_TEMPLATES.state;
            const title = seoTemplate.h1Template
                .replace('{{insurance_type}}', insuranceType?.name || 'Insurance')
                .replace('{{state}}', state.name);
            const metaTitle = seoTemplate.titleTemplate
                .replace('{{insurance_type}}', insuranceType?.name || 'Insurance')
                .replace('{{state}}', state.name);
            const metaDesc = seoTemplate.descTemplate
                .replace(/{{insurance_type}}/g, insuranceType?.name || 'Insurance')
                .replace(/{{insurance_type_lower}}/g, insuranceType?.name?.toLowerCase() || 'insurance')
                .replace(/{{state}}/g, state.name);

            await prisma.page.create({
                data: {
                    slug,
                    title,
                    metaTitle,
                    metaDescription: metaDesc,
                    insuranceTypeId: insuranceType?.id || null,
                    stateId: state.id,
                    geoLevel: 'STATE',
                    status: options.publishOnCreate ? 'PUBLISHED' : 'DRAFT',
                    isPublished: options.publishOnCreate ?? true,
                    publishedAt: options.publishOnCreate ? new Date() : null,
                    content: [],
                },
            });

            return { success: true, action: 'created' as const };
        },
        { batchSize: 50 }
    ).catch(console.error);

    return NextResponse.json({
        success: true,
        jobId: job.id,
        message: `Started generating ${states.length} state pages`,
        estimatedPages: states.length,
    });
}

/**
 * Generate pages for all cities
 */
async function generateAllCities(insuranceType: any, options: any, defaultTemplateId: string) {
    const cityCount = await prisma.city.count({ where: { isActive: true } });

    // Create bulk job
    const job = await prisma.bulkJob.create({
        data: {
            name: `${insuranceType?.name || 'All'} - All Cities`,
            templateId: options.templateId || defaultTemplateId,
            insuranceTypeId: insuranceType?.id || null,
            dataSource: 'DATABASE',
            geoLevel: 'CITY',
            totalRows: cityCount,
            publishOnCreate: options.publishOnCreate ?? true,
            updateExisting: options.updateExisting ?? false,
            skipExisting: options.skipExisting ?? true,
            status: 'QUEUED',
        },
    });

    // Process in background with streaming
    processAllCitiesInBackground(job.id, insuranceType, options).catch(console.error);

    return NextResponse.json({
        success: true,
        jobId: job.id,
        message: `Started generating ${cityCount} city pages`,
        estimatedPages: cityCount,
    });
}

/**
 * Process all cities in background (streaming to avoid memory issues)
 */
async function processAllCitiesInBackground(jobId: string, insuranceType: any, options: any) {
    const BATCH_SIZE = 100;
    let skip = 0;
    let processed = 0;
    let created = 0;
    let skipped = 0;
    let failed = 0;

    await prisma.bulkJob.update({
        where: { id: jobId },
        data: { status: 'PROCESSING', startedAt: new Date() },
    });

    try {
        while (true) {
            const cities = await prisma.city.findMany({
                where: { isActive: true },
                include: { state: true },
                skip,
                take: BATCH_SIZE,
                orderBy: { id: 'asc' },
            });

            if (cities.length === 0) break;

            for (const city of cities) {
                try {
                    const slug = insuranceType
                        ? `${insuranceType.slug}/${city.state.slug}/${city.slug}`
                        : `${city.state.slug}/${city.slug}`;

                    const existing = await prisma.page.findUnique({ where: { slug } });
                    if (existing) {
                        skipped++;
                        processed++;
                        continue;
                    }

                    const seoTemplate = SEO_TEMPLATES.city;
                    const title = seoTemplate.h1Template
                        .replace('{{insurance_type}}', insuranceType?.name || 'Insurance')
                        .replace('{{city}}', city.name)
                        .replace('{{state_code}}', city.state.code || city.state.name);
                    const metaTitle = seoTemplate.titleTemplate
                        .replace('{{insurance_type}}', insuranceType?.name || 'Insurance')
                        .replace('{{city}}', city.name)
                        .replace('{{state_code}}', city.state.code || city.state.name);
                    const metaDesc = seoTemplate.descTemplate
                        .replace(/{{insurance_type}}/g, insuranceType?.name || 'Insurance')
                        .replace(/{{insurance_type_lower}}/g, insuranceType?.name?.toLowerCase() || 'insurance')
                        .replace(/{{city}}/g, city.name)
                        .replace(/{{state}}/g, city.state.name);

                    await prisma.page.create({
                        data: {
                            slug,
                            title,
                            metaTitle,
                            metaDescription: metaDesc,
                            insuranceTypeId: insuranceType?.id || null,
                            stateId: city.state.id,
                            cityId: city.id,
                            geoLevel: 'CITY',
                            status: options.publishOnCreate ? 'PUBLISHED' : 'DRAFT',
                            isPublished: options.publishOnCreate ?? true,
                            publishedAt: options.publishOnCreate ? new Date() : null,
                            content: [],
                        },
                    });

                    created++;
                } catch (err) {
                    failed++;
                }
                processed++;
            }

            // Update progress
            await prisma.bulkJob.update({
                where: { id: jobId },
                data: {
                    processedRows: processed,
                    createdPages: created,
                    skippedPages: skipped,
                    failedPages: failed,
                },
            });

            skip += BATCH_SIZE;

            // Small delay to prevent overwhelming the database
            await new Promise(r => setTimeout(r, 50));
        }

        await prisma.bulkJob.update({
            where: { id: jobId },
            data: { status: 'COMPLETED', completedAt: new Date() },
        });
    } catch (error: any) {
        await prisma.bulkJob.update({
            where: { id: jobId },
            data: { status: 'FAILED', errorMessage: error.message, completedAt: new Date() },
        });
    }
}

/**
 * Generate pages for cities in a specific state
 */
async function generateStateCities(insuranceType: any, stateId: string, options: any, defaultTemplateId: string) {
    const state = await prisma.state.findUnique({ where: { id: stateId } });
    if (!state) {
        return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }

    const cities = await prisma.city.findMany({
        where: { stateId, isActive: true },
        include: { state: true },
    });

    const job = await prisma.bulkJob.create({
        data: {
            name: `${insuranceType?.name || 'All'} - ${state.name} Cities`,
            templateId: options.templateId || defaultTemplateId,
            insuranceTypeId: insuranceType?.id || null,
            dataSource: 'DATABASE',
            geoLevel: 'CITY',
            stateId,
            totalRows: cities.length,
            publishOnCreate: options.publishOnCreate ?? true,
            updateExisting: options.updateExisting ?? false,
            skipExisting: options.skipExisting ?? true,
            status: 'QUEUED',
        },
    });

    processJobInBatches(
        job.id,
        cities,
        async (city) => {
            const slug = insuranceType
                ? `${insuranceType.slug}/${city.state.slug}/${city.slug}`
                : `${city.state.slug}/${city.slug}`;

            const existing = await prisma.page.findUnique({ where: { slug } });
            if (existing) {
                return { success: true, action: 'skipped' as const };
            }

            const seoTemplate = SEO_TEMPLATES.city;
            const title = seoTemplate.h1Template
                .replace('{{insurance_type}}', insuranceType?.name || 'Insurance')
                .replace('{{city}}', city.name)
                .replace('{{state_code}}', city.state.code || city.state.name);

            await prisma.page.create({
                data: {
                    slug,
                    title,
                    insuranceTypeId: insuranceType?.id || null,
                    stateId: city.state.id,
                    cityId: city.id,
                    geoLevel: 'CITY',
                    status: options.publishOnCreate ? 'PUBLISHED' : 'DRAFT',
                    isPublished: options.publishOnCreate ?? true,
                    publishedAt: options.publishOnCreate ? new Date() : null,
                    content: [],
                },
            });

            return { success: true, action: 'created' as const };
        },
        { batchSize: 100 }
    ).catch(console.error);

    return NextResponse.json({
        success: true,
        jobId: job.id,
        message: `Started generating ${cities.length} city pages in ${state.name}`,
        estimatedPages: cities.length,
    });
}

/**
 * Generate pages for top N cities by population
 */
async function generateTopCities(insuranceType: any, limit: number, options: any, defaultTemplateId: string) {
    const cities = await prisma.city.findMany({
        where: { isActive: true },
        include: { state: true },
        orderBy: { population: 'desc' },
        take: limit,
    });

    const job = await prisma.bulkJob.create({
        data: {
            name: `${insuranceType?.name || 'All'} - Top ${limit} Cities`,
            templateId: defaultTemplateId,
            insuranceTypeId: insuranceType?.id || null,
            dataSource: 'DATABASE',
            geoLevel: 'CITY',
            totalRows: cities.length,
            publishOnCreate: options.publishOnCreate ?? true,
            skipExisting: options.skipExisting ?? true,
            status: 'QUEUED',
        },
    });

    // Process in background
    processJobInBatches(
        job.id,
        cities,
        async (city) => {
            const slug = insuranceType
                ? `${insuranceType.slug}/${city.state.slug}/${city.slug}`
                : `${city.state.slug}/${city.slug}`;

            const existing = await prisma.page.findUnique({ where: { slug } });
            if (existing) return { success: true, action: 'skipped' as const };

            await prisma.page.create({
                data: {
                    slug,
                    title: `${insuranceType?.name || 'Insurance'} in ${city.name}, ${city.state.code}`,
                    insuranceTypeId: insuranceType?.id || null,
                    stateId: city.state.id,
                    cityId: city.id,
                    geoLevel: 'CITY',
                    status: options.publishOnCreate ? 'PUBLISHED' : 'DRAFT',
                    isPublished: options.publishOnCreate ?? true,
                    publishedAt: options.publishOnCreate ? new Date() : null,
                    content: [],
                },
            });

            return { success: true, action: 'created' as const };
        }
    ).catch(console.error);

    return NextResponse.json({
        success: true,
        jobId: job.id,
        message: `Started generating top ${cities.length} city pages`,
        estimatedPages: cities.length,
    });
}

/**
 * Generate pages for major metro areas
 */
async function generateMajorMetros(insuranceType: any, options: any, defaultTemplateId: string) {
    const cities = await prisma.city.findMany({
        where: { isActive: true, isMajorCity: true },
        include: { state: true },
    });

    const job = await prisma.bulkJob.create({
        data: {
            name: `${insuranceType?.name || 'All'} - Major Metros`,
            templateId: defaultTemplateId,
            insuranceTypeId: insuranceType?.id || null,
            dataSource: 'DATABASE',
            geoLevel: 'CITY',
            totalRows: cities.length,
            publishOnCreate: options.publishOnCreate ?? true,
            skipExisting: options.skipExisting ?? true,
            status: 'QUEUED',
        },
    });

    processJobInBatches(
        job.id,
        cities,
        async (city) => {
            const slug = insuranceType
                ? `${insuranceType.slug}/${city.state.slug}/${city.slug}`
                : `${city.state.slug}/${city.slug}`;

            const existing = await prisma.page.findUnique({ where: { slug } });
            if (existing) return { success: true, action: 'skipped' as const };

            await prisma.page.create({
                data: {
                    slug,
                    title: `${insuranceType?.name || 'Insurance'} in ${city.name}, ${city.state.code}`,
                    insuranceTypeId: insuranceType?.id || null,
                    stateId: city.state.id,
                    cityId: city.id,
                    geoLevel: 'CITY',
                    status: options.publishOnCreate ? 'PUBLISHED' : 'DRAFT',
                    isPublished: options.publishOnCreate ?? true,
                    publishedAt: options.publishOnCreate ? new Date() : null,
                    content: [],
                },
            });

            return { success: true, action: 'created' as const };
        }
    ).catch(console.error);

    return NextResponse.json({
        success: true,
        jobId: job.id,
        message: `Started generating ${cities.length} major metro pages`,
        estimatedPages: cities.length,
    });
}

/**
 * Generate insurance matrix (all types × all states)
 */
async function generateInsuranceMatrix(options: any, defaultTemplateId: string) {
    const insuranceTypes = await prisma.insuranceType.findMany({ where: { isActive: true } });
    const states = await prisma.state.findMany({ where: { isActive: true } });

    const combinations: Array<{ insuranceType: any; state: any }> = [];
    for (const insuranceType of insuranceTypes) {
        for (const state of states) {
            combinations.push({ insuranceType, state });
        }
    }

    const job = await prisma.bulkJob.create({
        data: {
            name: 'Insurance Matrix - All Types × All States',
            templateId: defaultTemplateId,
            dataSource: 'DATABASE',
            geoLevel: 'STATE',
            totalRows: combinations.length,
            publishOnCreate: options.publishOnCreate ?? true,
            skipExisting: options.skipExisting ?? true,
            status: 'QUEUED',
        },
    });

    processJobInBatches(
        job.id,
        combinations,
        async ({ insuranceType, state }) => {
            const slug = `${insuranceType.slug}/${state.slug}`;

            const existing = await prisma.page.findUnique({ where: { slug } });
            if (existing) return { success: true, action: 'skipped' as const };

            await prisma.page.create({
                data: {
                    slug,
                    title: `${insuranceType.name} in ${state.name}`,
                    insuranceTypeId: insuranceType.id,
                    stateId: state.id,
                    geoLevel: 'STATE',
                    status: options.publishOnCreate ? 'PUBLISHED' : 'DRAFT',
                    isPublished: options.publishOnCreate ?? true,
                    publishedAt: options.publishOnCreate ? new Date() : null,
                    content: [],
                },
            });

            return { success: true, action: 'created' as const };
        }
    ).catch(console.error);

    return NextResponse.json({
        success: true,
        jobId: job.id,
        message: `Started generating ${combinations.length} insurance × state combinations`,
        estimatedPages: combinations.length,
    });
}

/**
 * Smart CSV import with auto-mapping
 */
async function processCsvImport(csvData: any[], insuranceType: any, options: any, defaultTemplateId: string) {
    if (!csvData.length) {
        return NextResponse.json({ error: 'Empty CSV data' }, { status: 400 });
    }

    // Auto-map columns
    const headers = Object.keys(csvData[0]);
    const { mapping, confidence, unmapped } = autoMapColumns(headers);

    const job = await prisma.bulkJob.create({
        data: {
            name: `CSV Import - ${csvData.length} rows`,
            templateId: defaultTemplateId,
            insuranceTypeId: insuranceType?.id || null,
            dataSource: 'CSV',
            csvData: csvData,
            variableMapping: mapping,
            totalRows: csvData.length,
            publishOnCreate: options.publishOnCreate ?? true,
            skipExisting: options.skipExisting ?? true,
            status: 'QUEUED',
        },
    });

    processJobInBatches(
        job.id,
        csvData,
        async (row) => {
            const mapped = applyMapping(row, mapping);

            // Generate slug
            let slug = '';
            if (insuranceType && mapped.state_slug && mapped.city_slug) {
                slug = `${insuranceType.slug}/${mapped.state_slug}/${mapped.city_slug}`;
            } else if (mapped.state_slug && mapped.city_slug) {
                slug = `${mapped.state_slug}/${mapped.city_slug}`;
            } else if (mapped.slug) {
                slug = mapped.slug;
            } else {
                return { success: false, action: 'skipped' as const, error: 'Could not generate slug' };
            }

            const existing = await prisma.page.findUnique({ where: { slug } });
            if (existing) return { success: true, action: 'skipped' as const };

            await prisma.page.create({
                data: {
                    slug,
                    title: mapped.page_title || mapped.city || slug,
                    subtitle: mapped.page_subtitle || null,
                    metaDescription: mapped.meta_description || null,
                    insuranceTypeId: insuranceType?.id || null,
                    customData: mapped,
                    status: options.publishOnCreate ? 'PUBLISHED' : 'DRAFT',
                    isPublished: options.publishOnCreate ?? true,
                    publishedAt: options.publishOnCreate ? new Date() : null,
                    content: [],
                },
            });

            return { success: true, action: 'created' as const };
        }
    ).catch(console.error);

    return NextResponse.json({
        success: true,
        jobId: job.id,
        message: `Started processing ${csvData.length} CSV rows`,
        estimatedPages: csvData.length,
        autoMapping: {
            mapping,
            confidence: Math.round(confidence * 100),
            unmapped,
        },
    });
}
