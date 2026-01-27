import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Available template variables:
 * {{niche}} - Insurance type name (e.g., "Car Insurance")
 * {{niche_lower}} - Lowercase (e.g., "car insurance")
 * {{location}} - City name if available, else state name
 * {{state}} - State name
 * {{state_code}} - State code (e.g., "CA")
 * {{city}} - City name (empty if state-level page)
 * {{year}} - Current year
 */

function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
    }
    return result;
}

/**
 * POST /api/pages/bulk-update
 * Bulk update pages with template-based content
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            filters,          // { insuranceTypeId?, stateId?, geoLevel?, isPublished? }
            pageIds,          // Optional: specific page IDs to update
            updates,          // { title?, subtitle?, avgPremium?, customData? }
            dryRun = false    // If true, return preview without updating
        } = body;

        // Build where clause
        const where: any = {};

        if (pageIds && pageIds.length > 0) {
            where.id = { in: pageIds };
        } else {
            if (filters?.insuranceTypeId) {
                where.insuranceTypeId = filters.insuranceTypeId;
            }
            if (filters?.stateId) {
                where.stateId = filters.stateId;
            }
            if (filters?.geoLevel) {
                where.geoLevel = filters.geoLevel;
            }
            if (filters?.isPublished !== undefined) {
                where.isPublished = filters.isPublished;
            }
        }

        // Fetch pages with relationships
        const pages = await prisma.page.findMany({
            where,
            include: {
                insuranceType: { select: { name: true, slug: true } },
                state: { select: { name: true, code: true } },
                city: { select: { name: true } },
            },
            take: 10000, // Reasonable limit
        });

        if (pages.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No pages found matching criteria'
            });
        }

        const currentYear = new Date().getFullYear().toString();
        const results: any[] = [];
        const errors: string[] = [];

        for (const page of pages) {
            // Build variables for this page
            const variables: Record<string, string> = {
                niche: page.insuranceType?.name || 'Insurance',
                niche_lower: (page.insuranceType?.name || 'Insurance').toLowerCase(),
                location: page.city?.name || page.state?.name || '',
                state: page.state?.name || '',
                state_code: page.state?.code || '',
                city: page.city?.name || '',
                year: currentYear,
            };

            // Build update data
            const updateData: any = {};

            if (updates.title) {
                updateData.title = replaceTemplateVariables(updates.title, variables);
            }

            if (updates.subtitle) {
                updateData.subtitle = replaceTemplateVariables(updates.subtitle, variables);
            }

            if (updates.metaTitle) {
                updateData.metaTitle = replaceTemplateVariables(updates.metaTitle, variables);
            }

            if (updates.metaDescription) {
                updateData.metaDescription = replaceTemplateVariables(updates.metaDescription, variables);
            }

            // Handle customData updates (like avg_premium)
            if (updates.customData) {
                const existingCustomData = (page.customData as Record<string, any>) || {};
                const newCustomData: Record<string, any> = { ...existingCustomData };

                for (const [key, value] of Object.entries(updates.customData)) {
                    if (typeof value === 'string') {
                        newCustomData[key] = replaceTemplateVariables(value, variables);
                    } else {
                        newCustomData[key] = value;
                    }
                }

                updateData.customData = newCustomData;
            }

            // For dry run, just collect preview data
            if (dryRun) {
                results.push({
                    id: page.id,
                    slug: page.slug,
                    current: {
                        title: page.title,
                        subtitle: page.subtitle,
                        customData: page.customData,
                    },
                    updated: updateData,
                    variables,
                });
            } else {
                // Actually update the page
                try {
                    await prisma.page.update({
                        where: { id: page.id },
                        data: updateData,
                    });
                    results.push({
                        id: page.id,
                        slug: page.slug,
                        success: true,
                    });
                } catch (error: any) {
                    errors.push(`${page.slug}: ${error.message}`);
                }
            }
        }

        return NextResponse.json({
            success: true,
            dryRun,
            totalPages: pages.length,
            updated: dryRun ? 0 : results.filter(r => r.success).length,
            preview: dryRun ? results.slice(0, 10) : undefined, // Only first 10 for preview
            errors: errors.length > 0 ? errors : undefined,
        });

    } catch (error: any) {
        console.error('Bulk update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET /api/pages/bulk-update
 * Get available template variables and sample data
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get insurance types for filter dropdown
        const insuranceTypes = await prisma.insuranceType.findMany({
            where: { isActive: true },
            select: { id: true, name: true, slug: true },
            orderBy: { sortOrder: 'asc' },
        });

        // Get states for filter dropdown
        const states = await prisma.state.findMany({
            where: { isActive: true },
            select: { id: true, name: true, code: true },
            orderBy: { name: 'asc' },
        });

        // Get page counts by filter
        const pageCounts = await Promise.all([
            prisma.page.count({ where: { geoLevel: 'STATE' } }),
            prisma.page.count({ where: { geoLevel: 'CITY' } }),
            prisma.page.count({ where: { isPublished: true } }),
            prisma.page.count({ where: { isPublished: false } }),
        ]);

        return NextResponse.json({
            templateVariables: [
                { name: '{{niche}}', description: 'Insurance type name (e.g., "Car Insurance")' },
                { name: '{{niche_lower}}', description: 'Lowercase insurance type (e.g., "car insurance")' },
                { name: '{{location}}', description: 'City name if available, else state name' },
                { name: '{{state}}', description: 'State name (e.g., "California")' },
                { name: '{{state_code}}', description: 'State code (e.g., "CA")' },
                { name: '{{city}}', description: 'City name (empty for state-level pages)' },
                { name: '{{year}}', description: 'Current year' },
            ],
            presetTemplates: {
                titles: [
                    { label: 'Cheapest Option', template: 'Cheapest {{niche}} in {{location}} ({{year}})' },
                    { label: 'Best Rates', template: 'Best {{niche}} Rates in {{location}}' },
                    { label: 'Compare & Save', template: 'Compare {{niche}} in {{location}} - Save Up to 40%' },
                    { label: 'Affordable Coverage', template: 'Affordable {{niche}} in {{location}} | Free Quotes' },
                    { label: 'Top Rated', template: 'Top Rated {{niche}} Companies in {{location}}' },
                ],
                subtitles: [
                    { label: 'Compare & Save', template: 'Compare quotes from top providers and save on your {{niche_lower}} today.' },
                    { label: 'Free Quotes', template: 'Get free {{niche_lower}} quotes in {{location}}. Compare rates in minutes.' },
                    { label: 'Best Rates', template: 'Find the best {{niche_lower}} rates in {{state}}. No spam, no fees.' },
                ],
            },
            filters: {
                insuranceTypes,
                states,
                geoLevels: ['STATE', 'CITY', 'COUNTRY', 'NICHE'],
            },
            stats: {
                statePages: pageCounts[0],
                cityPages: pageCounts[1],
                publishedPages: pageCounts[2],
                draftPages: pageCounts[3],
            },
        });

    } catch (error: any) {
        console.error('Get bulk update info error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
