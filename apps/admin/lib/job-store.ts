/**
 * Simple in-memory job store for tracking bulk/auto generation progress
 * Note: This is client-side state, not persisted
 */

export interface JobProgress {
    id: string;
    type: 'bulk' | 'auto';
    name: string;
    status: 'QUEUED' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    total: number;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    failed: number;
    startedAt: string;
    completedAt?: string;
    // Auto-generate specific fields
    tokensUsed?: number;
    estimatedCost?: number;
    currentPage?: string;
}

// In-memory store (browser only)
let activeJobs: JobProgress[] = [];

export function getActiveJobs(): JobProgress[] {
    return [...activeJobs];
}

export function addActiveJob(job: JobProgress): void {
    // Remove any existing job with the same ID
    activeJobs = activeJobs.filter(j => j.id !== job.id);
    activeJobs.unshift(job);
    // Keep only last 10 jobs
    if (activeJobs.length > 10) {
        activeJobs = activeJobs.slice(0, 10);
    }
}

export function updateJobProgress(jobId: string, update: Partial<JobProgress>): void {
    const job = activeJobs.find(j => j.id === jobId);
    if (job) {
        Object.assign(job, update);
        if (update.status === 'COMPLETED' || update.status === 'FAILED') {
            job.completedAt = new Date().toISOString();
        }
    }
}

export function removeJob(jobId: string): void {
    activeJobs = activeJobs.filter(j => j.id !== jobId);
}

export function cleanupOldJobs(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    activeJobs = activeJobs.filter(job => {
        if (job.status === 'QUEUED' || job.status === 'PROCESSING') return true;
        const completedAt = job.completedAt ? new Date(job.completedAt).getTime() : 0;
        return completedAt > oneHourAgo;
    });
}
