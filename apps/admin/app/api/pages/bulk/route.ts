import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST bulk actions on pages
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ids, action } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No page IDs provided' }, { status: 400 });
        }

        // Process in batches of 5000 (optimized for 6GB RAM VPS)
        const BATCH_SIZE = 5000;
        const batches: string[][] = [];
        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            batches.push(ids.slice(i, i + BATCH_SIZE));
        }

        if (action === 'delete') {
            let totalDeleted = 0;
            const errors: string[] = [];

            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                try {
                    await prisma.$transaction(async (tx) => {
                        // Delete related records first
                        await tx.pageVersion.deleteMany({
                            where: { pageId: { in: batch } },
                        });

                        await tx.pageComment.deleteMany({
                            where: { pageId: { in: batch } },
                        });

                        await tx.aBTest.deleteMany({
                            where: { pageId: { in: batch } },
                        });

                        // Delete the pages
                        const result = await tx.page.deleteMany({
                            where: { id: { in: batch } },
                        });

                        totalDeleted += result.count;
                    });
                } catch (batchError: any) {
                    console.error(`Batch ${i + 1} failed:`, batchError);
                    errors.push(`Batch ${i + 1}/${batches.length} failed: ${batchError.message}`);
                }
            }

            if (errors.length > 0 && totalDeleted === 0) {
                return NextResponse.json({
                    error: 'Delete failed',
                    details: errors
                }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                deleted: totalDeleted,
                batches: batches.length,
                errors: errors.length > 0 ? errors : undefined,
                message: `Successfully deleted ${totalDeleted.toLocaleString()} pages${errors.length > 0 ? ` (${errors.length} batches had errors)` : ''}`
            });
        }

        if (action === 'publish') {
            let totalUpdated = 0;

            for (const batch of batches) {
                const result = await prisma.page.updateMany({
                    where: { id: { in: batch } },
                    data: {
                        isPublished: true,
                        publishedAt: new Date(),
                        status: 'PUBLISHED'
                    },
                });
                totalUpdated += result.count;
            }

            return NextResponse.json({
                success: true,
                updated: totalUpdated,
                batches: batches.length,
                message: `Successfully published ${totalUpdated.toLocaleString()} pages`
            });
        }

        if (action === 'unpublish') {
            let totalUpdated = 0;

            for (const batch of batches) {
                const result = await prisma.page.updateMany({
                    where: { id: { in: batch } },
                    data: {
                        isPublished: false,
                        status: 'DRAFT'
                    },
                });
                totalUpdated += result.count;
            }

            return NextResponse.json({
                success: true,
                updated: totalUpdated,
                batches: batches.length,
                message: `Successfully unpublished ${totalUpdated.toLocaleString()} pages`
            });
        }

        return NextResponse.json({ error: 'Invalid action. Use: delete, publish, or unpublish' }, { status: 400 });
    } catch (error: any) {
        console.error('Bulk action failed:', error);
        return NextResponse.json({
            error: 'Bulk action failed',
            details: error.message
        }, { status: 500 });
    }
}
