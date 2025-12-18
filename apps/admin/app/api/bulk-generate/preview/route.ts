import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, GeoLevel } from '@myinsurancebuddy/db';
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

// POST /api/bulk-generate/preview - Preview pages that will be generated
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            templateId,
            insuranceTypeId,
            geoLevel,
            countryId,
            stateId,
            csvData,
            variableMapping,
            limit = 5,
        } = body;

        if (!templateId || !insuranceTypeId || !geoLevel) {
            return NextResponse.json(
                { error: 'templateId, insuranceTypeId, and geoLevel are required' },
                { status: 400 }
            );
        }

        const [template, insuranceType] = await Promise.all([
            prisma.template.findUnique({ where: { id: templateId } }),
            prisma.insuranceType.findUnique({ where: { id: insuranceTypeId } }),
        ]);

        if (!template || !insuranceType) {
            return NextResponse.json({ error: 'Template or insurance type not found' }, { status: 404 });
        }

        const csvRows = csvData || [];
        const mapping = variableMapping || {};

        // Get sample geo entities
        let geoEntities: any[] = [];
        let totalCount = 0;

        if (geoLevel === 'STATE') {
            const where = {
                isActive: true,
                ...(countryId && { countryId }),
            };
            geoEntities = await prisma.state.findMany({
                where,
                include: { country: true },
                take: limit,
            });
            totalCount = await prisma.state.count({ where });
        } else if (geoLevel === 'CITY') {
            const where = {
                isActive: true,
                ...(stateId && { stateId }),
                ...(countryId && { state: { countryId } }),
            };
            geoEntities = await prisma.city.findMany({
                where,
                include: { state: { include: { country: true } } },
                take: limit,
            });
            totalCount = await prisma.city.count({ where });
        } else if (geoLevel === 'COUNTRY') {
            geoEntities = await prisma.country.findMany({
                where: { isActive: true },
                take: limit,
            });
            totalCount = await prisma.country.count({ where: { isActive: true } });
        }

        // Generate preview for each entity
        const previews = geoEntities.map(entity => {
            // Build variables
            let variables: Record<string, string> = {
                insurance_type: insuranceType.name,
                insurance_slug: insuranceType.slug,
            };

            let locationParts: string[] = [];

            if (geoLevel === 'COUNTRY') {
                variables.country = entity.name;
                variables.country_code = entity.code;
                locationParts.push(entity.name);
            } else if (geoLevel === 'STATE') {
                variables.country = entity.country.name;
                variables.country_code = entity.country.code;
                variables.state = entity.name;
                variables.state_code = entity.code || '';
                locationParts.push(entity.name, entity.country.name);
            } else if (geoLevel === 'CITY') {
                variables.country = entity.state.country.name;
                variables.country_code = entity.state.country.code;
                variables.state = entity.state.name;
                variables.state_code = entity.state.code || '';
                variables.city = entity.name;
                variables.city_population = entity.population?.toString() || '';
                locationParts.push(entity.name, entity.state.name);
            }

            // Find matching CSV row
            if (csvRows.length > 0) {
                const matchKey = geoLevel === 'CITY' ? 'city' :
                    geoLevel === 'STATE' ? 'state' :
                        geoLevel === 'COUNTRY' ? 'country' : null;

                if (matchKey) {
                    const entityName = (variables[matchKey] || '').toLowerCase();
                    const matchingRow = csvRows.find((row: any) => {
                        const csvMatchCol = mapping[matchKey] || matchKey;
                        return (row[csvMatchCol] || '').toLowerCase() === entityName;
                    });

                    if (matchingRow) {
                        for (const [csvCol, varName] of Object.entries(mapping)) {
                            if (matchingRow[csvCol] !== undefined) {
                                variables[varName as string] = matchingRow[csvCol];
                            }
                        }
                    }
                }
            }

            const locationStr = locationParts.join(', ');

            return {
                title: `${insuranceType.name} in ${locationStr}`,
                url: `/${insuranceType.slug}/${geoLevel === 'CITY' ? `${entity.state.country.code}/${entity.state.slug}/${entity.slug}` :
                        geoLevel === 'STATE' ? `${entity.country.code}/${entity.slug}` :
                            geoLevel === 'COUNTRY' ? entity.code : ''
                    }`,
                variables,
                sampleContent: template.sections && (template.sections as any[]).length > 0
                    ? replaceVariables((template.sections as any[])[0]?.content || '', variables)
                    : 'No template content',
            };
        });

        return NextResponse.json({
            totalPages: totalCount,
            previewPages: previews,
            template: {
                name: template.name,
                sectionsCount: (template.sections as any[])?.length || 0,
                customVariables: template.customVariables,
            },
        });
    } catch (error) {
        console.error('POST /api/bulk-generate/preview error:', error);
        return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
    }
}
