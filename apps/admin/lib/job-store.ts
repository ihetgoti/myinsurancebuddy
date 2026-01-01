'use client';

/**
 * Global Job Store
 * Persists active job IDs to localStorage and provides polling mechanism
 * for tracking job progress across page navigation
 */

export interface JobProgress {
    id: string;
    type: 'quick' | 'bulk';
    name: string;
    status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    total: number;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    failed: number;
    startedAt: string;
    error?: string;
}

const STORAGE_KEY = 'admin_active_jobs';

// Get active jobs from localStorage
export function getActiveJobs(): JobProgress[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Save active jobs to localStorage
export function saveActiveJobs(jobs: JobProgress[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch {
        // Ignore storage errors
    }
}

// Add a new job to track
export function addActiveJob(job: JobProgress): void {
    const jobs = getActiveJobs();
    // Remove if already exists (update case)
    const filtered = jobs.filter(j => j.id !== job.id);
    filtered.unshift(job);
    // Keep only last 10 jobs
    saveActiveJobs(filtered.slice(0, 10));
}

// Update job progress
export function updateJobProgress(id: string, updates: Partial<JobProgress>): void {
    const jobs = getActiveJobs();
    const index = jobs.findIndex(j => j.id === id);
    if (index !== -1) {
        jobs[index] = { ...jobs[index], ...updates };
        saveActiveJobs(jobs);
    }
}

// Remove completed/failed jobs older than 1 hour
export function cleanupOldJobs(): void {
    const jobs = getActiveJobs();
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const active = jobs.filter(job => {
        if (job.status === 'QUEUED' || job.status === 'PROCESSING') return true;
        const startTime = new Date(job.startedAt).getTime();
        return startTime > oneHourAgo;
    });
    saveActiveJobs(active);
}

// Get only actively running jobs
export function getRunningJobs(): JobProgress[] {
    return getActiveJobs().filter(
        job => job.status === 'QUEUED' || job.status === 'PROCESSING'
    );
}

// Clear all jobs
export function clearAllJobs(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}
