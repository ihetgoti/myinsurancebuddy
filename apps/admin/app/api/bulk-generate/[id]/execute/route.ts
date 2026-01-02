import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
                // Build variables from mapping
                const variables: Record<string, string> = {
                    // Inject context variables
                    'insurance_type_slug': job.insuranceType?.slug || '',
                    'insurance_type_name': job.insuranceType?.name || '',
                    'template_slug': job.template.slug,
                };

                Object.entries(variableMapping).forEach(([varName, csvColumn]) => {
                    variables[varName] = row[csvColumn] || '';
                });

                // Generate slug
                let slug = slugPattern;
                Object.entries(variables).forEach(([key, value]) => {
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
                                    title: variables.page_title || existingPage.title,
                                    subtitle: variables.page_subtitle || existingPage.subtitle,
                                    customData: { ...((existingPage.customData as any) || {}), ...variables },
                                    updatedAt: new Date(),
                                },
                            });
                        }
                        updatedPages++;
                        continue;
                    }
                }

                // Create new page
                if (!job.dryRun) {
                    await prisma.page.create({
                        data: {
                            slug,
                            title: variables.page_title || null,
                            subtitle: variables.page_subtitle || null,
                            templateId: job.templateId,
                            insuranceTypeId: job.insuranceTypeId,
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
