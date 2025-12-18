import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, GeoLevel, JobStatus } from '@myinsurancebuddy/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Helper to replace variables in content
function replaceVariables(content: string, variables: Record<string, string>): string {
    let result = content;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'gi');
        result = result.replace(regex, value);
    }
    return result;
}

// Helper to process sections with variable replacement
function processSections(sections: any[], variables: Record<string, string>): any[] {
    return sections.map(section => ({
        ...section,
        title: replaceVariables(section.title || '', variables),
        content: replaceVariables(section.content || '', variables),
        items: section.items?.map((item: any) => ({
            ...item,
            title: replaceVariables(item.title || '', variables),
            content: replaceVariables(item.content || '', variables),
        })),
    }));
}

// POST /api/bulk-generate/[id]/execute - Execute the bulk job
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
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

        if (job.status !== 'PENDING') {
            return NextResponse.json(
                { error: `Job is already ${job.status.toLowerCase()}` },
                { status: 400 }
            );
        }

        // Update status to processing
        await prisma.bulkJob.update({
            where: { id: job.id },
            data: { status: 'PROCESSING' as JobStatus },
        });

        try {
            let createdPages = 0;
            let skippedPages = 0;
            const geoLevel = job.geoLevel as GeoLevel;

            // Get CSV data for custom variable mapping
            const csvRows = (job.csvData as any[]) || [];
            const variableMapping = (job.variableMapping as Record<string, string>) || {};

            // Build geo entity query
            let geoEntities: any[] = [];

            if (geoLevel === 'NICHE') {
                geoEntities = [{ id: null, countryId: null, stateId: null }];
            } else if (geoLevel === 'COUNTRY') {
                geoEntities = await prisma.country.findMany({
                    where: { isActive: true },
                });
            } else if (geoLevel === 'STATE') {
                geoEntities = await prisma.state.findMany({
                    where: {
                        isActive: true,
                        ...(job.countryId && { countryId: job.countryId }),
                    },
                    include: { country: true },
                });
            } else if (geoLevel === 'CITY') {
                geoEntities = await prisma.city.findMany({
                    where: {
                        isActive: true,
                        ...(job.stateId && { stateId: job.stateId }),
                        ...(job.countryId && { state: { countryId: job.countryId } }),
                    },
                    include: { state: { include: { country: true } } },
                });
            }

            const templateSections = (job.template.sections as any[]) || [];

            for (const entity of geoEntities) {
                // Build page identifiers based on geo level
                let pageData: any = {
                    insuranceTypeId: job.insuranceTypeId,
                    geoLevel,
                    countryId: null,
                    stateId: null,
                    cityId: null,
                };

                // Build variables for replacement
                let variables: Record<string, string> = {
                    insurance_type: job.insuranceType.name,
                    insurance_slug: job.insuranceType.slug,
                };

                if (geoLevel === 'COUNTRY') {
                    pageData.countryId = entity.id;
                    variables.country = entity.name;
                    variables.country_code = entity.code;
                } else if (geoLevel === 'STATE') {
                    pageData.countryId = entity.countryId;
                    pageData.stateId = entity.id;
                    variables.country = entity.country.name;
                    variables.country_code = entity.country.code;
                    variables.state = entity.name;
                    variables.state_code = entity.code || '';
                } else if (geoLevel === 'CITY') {
                    pageData.countryId = entity.state.countryId;
                    pageData.stateId = entity.stateId;
                    pageData.cityId = entity.id;
                    variables.country = entity.state.country.name;
                    variables.country_code = entity.state.country.code;
                    variables.state = entity.state.name;
                    variables.state_code = entity.state.code || '';
                    variables.city = entity.name;
                    variables.city_population = entity.population?.toString() || '';
                }

                // Find matching CSV row for custom variables
                if (csvRows.length > 0) {
                    const matchKey = geoLevel === 'CITY' ? 'city' :
                        geoLevel === 'STATE' ? 'state' :
                            geoLevel === 'COUNTRY' ? 'country' : null;

                    if (matchKey) {
                        const entityName = (variables[matchKey] || '').toLowerCase();
                        const matchingRow = csvRows.find(row => {
                            const csvMatchCol = variableMapping[matchKey] || matchKey;
                            return (row[csvMatchCol] || '').toLowerCase() === entityName;
                        });

                        if (matchingRow) {
                            // Apply custom variables from CSV
                            for (const [csvCol, varName] of Object.entries(variableMapping)) {
                                if (matchingRow[csvCol] !== undefined) {
                                    variables[varName as string] = matchingRow[csvCol];
                                }
                            }
                        }
                    }
                }

                // Check if page already exists
                if (job.skipExisting) {
                    const existing = await prisma.page.findFirst({
                        where: {
                            insuranceTypeId: pageData.insuranceTypeId,
                            geoLevel: pageData.geoLevel,
                            countryId: pageData.countryId,
                            stateId: pageData.stateId,
                            cityId: pageData.cityId,
                        },
                    });

                    if (existing) {
                        skippedPages++;
                        continue;
                    }
                }

                // Process sections with variable replacement
                const processedSections = processSections(templateSections, variables);

                // Build location string for title
                const locationParts = [];
                if (variables.city) locationParts.push(variables.city);
                if (variables.state) locationParts.push(variables.state);
                if (variables.country && !variables.state) locationParts.push(variables.country);
                const locationStr = locationParts.join(', ');

                // Create the page
                await prisma.page.create({
                    data: {
                        ...pageData,
                        templateId: job.templateId,
                        sections: processedSections,
                        heroTitle: locationStr
                            ? `${job.insuranceType.name} in ${locationStr}`
                            : job.insuranceType.name,
                        heroSubtitle: replaceVariables(
                            job.template.description || `Find the best {{insurance_type}} coverage`,
                            variables
                        ),
                        metaTitle: locationStr
                            ? `${job.insuranceType.name} in ${locationStr} | MyInsuranceBuddies`
                            : `${job.insuranceType.name} | MyInsuranceBuddies`,
                        metaDescription: `Compare ${job.insuranceType.name.toLowerCase()} options${locationStr ? ` in ${locationStr}` : ''}. Get quotes, coverage details, and expert advice.`,
                        isPublished: job.publishOnCreate,
                        publishedAt: job.publishOnCreate ? new Date() : null,
                    },
                });

                createdPages++;

                // Update progress periodically
                if (createdPages % 10 === 0) {
                    await prisma.bulkJob.update({
                        where: { id: job.id },
                        data: { createdPages, skippedPages },
                    });
                }
            }

            // Mark job as completed
            await prisma.bulkJob.update({
                where: { id: job.id },
                data: {
                    status: 'COMPLETED' as JobStatus,
                    createdPages,
                    skippedPages,
                },
            });

            return NextResponse.json({
                success: true,
                createdPages,
                skippedPages,
            });
        } catch (execError: any) {
            // Mark job as failed
            await prisma.bulkJob.update({
                where: { id: job.id },
                data: {
                    status: 'FAILED' as JobStatus,
                    errorMessage: execError.message,
                },
            });

            throw execError;
        }
    } catch (error: any) {
        console.error('POST /api/bulk-generate/[id]/execute error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to execute job' },
            { status: 500 }
        );
    }
}
