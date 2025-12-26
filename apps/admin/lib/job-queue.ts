/**
 * Background Job Queue for Bulk Operations
 * Handles large jobs (30,000+ pages) without timeout
 */

import { prisma } from './prisma';

export interface JobProgress {
    total: number;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    failed: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    currentBatch: number;
    totalBatches: number;
    estimatedTimeRemaining?: number;
    errors: Array<{ row: number; error: string }>;
}

export interface QueueOptions {
    batchSize?: number;
    delayBetweenBatches?: number;
    maxRetries?: number;
    onProgress?: (progress: JobProgress) => void;
}

const DEFAULT_OPTIONS: Required<Omit<QueueOptions, 'onProgress'>> = {
    batchSize: 100,
    delayBetweenBatches: 100, // ms
    maxRetries: 3,
};

/**
 * Process a bulk generation job in batches
 */
export async function processJobInBatches(
    jobId: string,
    data: any[],
    processor: (item: any, index: number) => Promise<{ success: boolean; action: 'created' | 'updated' | 'skipped'; error?: string }>,
    options: QueueOptions = {}
): Promise<JobProgress> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const totalItems = data.length;
    const totalBatches = Math.ceil(totalItems / opts.batchSize);

    const progress: JobProgress = {
        total: totalItems,
        processed: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
        status: 'PROCESSING',
        currentBatch: 0,
        totalBatches,
        errors: [],
    };

    const startTime = Date.now();

    try {
        // Update job status to processing
        await prisma.bulkJob.update({
            where: { id: jobId },
            data: { status: 'PROCESSING', startedAt: new Date() },
        });

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            progress.currentBatch = batchIndex + 1;

            // Check if job was cancelled
            const job = await prisma.bulkJob.findUnique({
                where: { id: jobId },
                select: { status: true },
            });

            if (job?.status === 'CANCELLED') {
                progress.status = 'CANCELLED';
                break;
            }

            const batchStart = batchIndex * opts.batchSize;
            const batchEnd = Math.min(batchStart + opts.batchSize, totalItems);
            const batch = data.slice(batchStart, batchEnd);

            // Process batch items concurrently (with limit)
            const batchResults = await Promise.allSettled(
                batch.map((item, idx) =>
                    retryWithBackoff(() => processor(item, batchStart + idx), opts.maxRetries)
                )
            );

            // Aggregate results
            for (let i = 0; i < batchResults.length; i++) {
                const result = batchResults[i];
                progress.processed++;

                if (result.status === 'fulfilled') {
                    if (result.value.success) {
                        switch (result.value.action) {
                            case 'created':
                                progress.created++;
                                break;
                            case 'updated':
                                progress.updated++;
                                break;
                            case 'skipped':
                                progress.skipped++;
                                break;
                        }
                    } else {
                        progress.failed++;
                        if (result.value.error) {
                            progress.errors.push({ row: batchStart + i, error: result.value.error });
                        }
                    }
                } else {
                    progress.failed++;
                    progress.errors.push({ row: batchStart + i, error: result.reason?.message || 'Unknown error' });
                }
            }

            // Calculate estimated time remaining
            const elapsed = Date.now() - startTime;
            const avgTimePerItem = elapsed / progress.processed;
            const remainingItems = totalItems - progress.processed;
            progress.estimatedTimeRemaining = Math.round(avgTimePerItem * remainingItems / 1000);

            // Update job progress in database
            await prisma.bulkJob.update({
                where: { id: jobId },
                data: {
                    processedRows: progress.processed,
                    createdPages: progress.created,
                    updatedPages: progress.updated,
                    skippedPages: progress.skipped,
                    failedPages: progress.failed,
                    errorLog: progress.errors.length > 0 ? progress.errors.slice(-100) : undefined, // Keep last 100 errors
                },
            });

            // Notify progress callback
            if (options.onProgress) {
                options.onProgress({ ...progress });
            }

            // Delay between batches to prevent overwhelming the database
            if (batchIndex < totalBatches - 1 && opts.delayBetweenBatches > 0) {
                await sleep(opts.delayBetweenBatches);
            }
        }

        // Mark job as completed
        progress.status = progress.status === 'CANCELLED' ? 'CANCELLED' : 'COMPLETED';
        await prisma.bulkJob.update({
            where: { id: jobId },
            data: {
                status: progress.status,
                completedAt: new Date(),
                processedRows: progress.processed,
                createdPages: progress.created,
                updatedPages: progress.updated,
                skippedPages: progress.skipped,
                failedPages: progress.failed,
                errorLog: progress.errors.length > 0 ? progress.errors.slice(-100) : undefined,
            },
        });

    } catch (error: any) {
        progress.status = 'FAILED';
        await prisma.bulkJob.update({
            where: { id: jobId },
            data: {
                status: 'FAILED',
                errorMessage: error.message,
                completedAt: new Date(),
            },
        });
        throw error;
    }

    return progress;
}

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number,
    baseDelay: number = 100
): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            if (attempt < maxRetries) {
                const delay = baseDelay * Math.pow(2, attempt);
                await sleep(delay);
            }
        }
    }

    throw lastError;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Cancel a running job
 */
export async function cancelJob(jobId: string): Promise<boolean> {
    try {
        const job = await prisma.bulkJob.findUnique({
            where: { id: jobId },
            select: { status: true },
        });

        if (job && (job.status === 'PROCESSING' || job.status === 'PENDING' || job.status === 'QUEUED')) {
            await prisma.bulkJob.update({
                where: { id: jobId },
                data: { status: 'CANCELLED' },
            });
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

/**
 * Get job progress
 */
export async function getJobProgress(jobId: string): Promise<JobProgress | null> {
    const job = await prisma.bulkJob.findUnique({
        where: { id: jobId },
        select: {
            status: true,
            totalRows: true,
            processedRows: true,
            createdPages: true,
            updatedPages: true,
            skippedPages: true,
            failedPages: true,
            errorLog: true,
        },
    });

    if (!job) return null;

    return {
        total: job.totalRows,
        processed: job.processedRows,
        created: job.createdPages,
        updated: job.updatedPages,
        skipped: job.skippedPages,
        failed: job.failedPages,
        status: job.status as JobProgress['status'],
        currentBatch: 0,
        totalBatches: 0,
        errors: (job.errorLog as any[]) || [],
    };
}
