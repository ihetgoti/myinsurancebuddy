/**
 * Bulk Edit API - Update existing pages' customData via CSV
 *
 * POST /api/bulk-edit
 *
 * Supports updating published pages by matching on slug
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidateWebPath } from '@/lib/revalidate';

export const dynamic = 'force-dynamic';

interface BulkEditRequest {
    csvData: Record<string, any>[];
    slugColumn: string;
    variableMapping?: Record<string, string>;
    mergeMode: 'merge' | 'replace';
    updatePublished?: boolean;
    dryRun?: boolean;
    revalidate?: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: BulkEditRequest = await request.json();

        // Validate required fields
        if (!body.csvData || !Array.isArray(body.csvData) || body.csvData.length === 0) {
            return NextResponse.json({ error: 'csvData array is required' }, { status: 400 });
        }
        if (!body.slugColumn) {
            return NextResponse.json({ error: 'slugColumn is required' }, { status: 400 });
        }

        const slugColumn = body.slugColumn;
        const mergeMode = body.mergeMode || 'merge';
        const updatePublished = body.updatePublished !== false;
        const dryRun = body.dryRun === true;
        const shouldRevalidate = body.revalidate !== false;
        const variableMapping = body.variableMapping || {};

        // Results tracking
        const results = {
            total: body.csvData.length,
            updated: 0,
            skipped: 0,
            notFound: 0,
            failed: 0,
            pages: [] as { slug: string; status: string; changes?: Record<string, any> }[],
            errors: [] as { row: number; slug: string; error: string }[],
        };

        // Process each row
        for (let i = 0; i < body.csvData.length; i++) {
            const row = body.csvData[i];
            const slug = row[slugColumn];

            if (!slug) {
                results.failed++;
                results.errors.push({ row: i, slug: '(empty)', error: 'Slug is empty' });
                continue;
            }

            try {
                // Find the page
                const existingPage = await prisma.page.findUnique({
                    where: { slug },
                    select: {
                        id: true,
                        slug: true,
                        isPublished: true,
                        customData: true,
                        title: true,
                        metaTitle: true,
                        metaDescription: true,
                    },
                });

                if (!existingPage) {
                    results.notFound++;
                    results.pages.push({ slug, status: 'not_found' });
                    continue;
                }

                // Check if we can update published pages
                if (existingPage.isPublished && !updatePublished) {
                    results.skipped++;
                    results.pages.push({ slug, status: 'skipped_published' });
                    continue;
                }

                // Build new customData
                const existingCustomData = (existingPage.customData as Record<string, any>) || {};
                const newVariables: Record<string, any> = {};

                // Apply variable mapping or direct column names
                Object.keys(row).forEach((csvColumn) => {
                    if (csvColumn === slugColumn) return; // Skip slug column

                    let value = row[csvColumn];

                    // Parse JSON strings for arrays/objects
                    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                        try {
                            value = JSON.parse(value);
                        } catch (e) {
                            // Keep as string
                        }
                    }

                    // Use mapping if provided, otherwise use column name directly
                    const varName = variableMapping[csvColumn] || csvColumn;
                    newVariables[varName] = value;
                });

                // Merge or replace customData
                const finalCustomData = mergeMode === 'merge'
                    ? { ...existingCustomData, ...newVariables }
                    : newVariables;

                // Extract special fields that have dedicated columns
                const updateData: any = {
                    customData: finalCustomData,
                    updatedAt: new Date(),
                };

                // Update title if present
                if (newVariables.h1_title || newVariables.page_title) {
                    updateData.title = newVariables.h1_title || newVariables.page_title;
                }
                if (newVariables.meta_title) {
                    updateData.metaTitle = newVariables.meta_title;
                }
                if (newVariables.meta_description) {
                    updateData.metaDescription = newVariables.meta_description;
                }

                if (!dryRun) {
                    await prisma.page.update({
                        where: { id: existingPage.id },
                        data: updateData,
                    });

                    // Revalidate the page
                    if (shouldRevalidate) {
                        const path = slug.startsWith('/') ? slug : `/${slug}`;
                        await revalidateWebPath(path).catch(console.error);
                    }
                }

                results.updated++;
                results.pages.push({
                    slug,
                    status: dryRun ? 'would_update' : 'updated',
                    changes: newVariables,
                });

            } catch (error: any) {
                results.failed++;
                results.errors.push({ row: i, slug, error: error.message });
            }
        }

        // Create audit log
        if (!dryRun && results.updated > 0) {
            await prisma.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: 'BULK_UPDATE',
                    entityType: 'Page',
                    entityId: 'bulk',
                    entityName: `Bulk update: ${results.updated} pages`,
                    metadata: {
                        updated: results.updated,
                        skipped: results.skipped,
                        notFound: results.notFound,
                        failed: results.failed,
                    },
                },
            });
        }

        return NextResponse.json({
            success: true,
            dryRun,
            ...results,
        });

    } catch (error: any) {
        console.error('[Bulk Edit API]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET - API Documentation
 */
export async function GET() {
    return NextResponse.json({
        endpoint: 'POST /api/bulk-edit',
        description: 'Bulk update existing pages customData from CSV data',
        request: {
            csvData: 'array (required) - CSV data with page slugs and new values',
            slugColumn: 'string (required) - Which CSV column contains the page slug',
            variableMapping: 'object (optional) - Map CSV columns to customData field names',
            mergeMode: '"merge" | "replace" (default: merge) - Merge with existing or replace all',
            updatePublished: 'boolean (default: true) - Allow updating published pages',
            dryRun: 'boolean (default: false) - Preview changes without applying',
            revalidate: 'boolean (default: true) - Trigger web revalidation after update',
        },
        example: {
            csvData: [
                { slug: 'car-insurance/california', avg_premium: '$200', population: '39,000,000' },
                { slug: 'car-insurance/texas', avg_premium: '$150', population: '29,000,000' },
            ],
            slugColumn: 'slug',
            mergeMode: 'merge',
            updatePublished: true,
            dryRun: false,
        },
        response: {
            success: true,
            dryRun: false,
            total: 2,
            updated: 2,
            skipped: 0,
            notFound: 0,
            failed: 0,
            pages: [
                { slug: 'car-insurance/california', status: 'updated', changes: { avg_premium: '$200' } },
            ],
        },
    });
}
