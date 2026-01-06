'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getActiveJobs, updateJobProgress, cleanupOldJobs, JobProgress } from '@/lib/job-store';
import { getApiUrl } from '@/lib/api';

interface JobProgressBarProps {
    collapsed?: boolean;
}

export default function JobProgressBar({ collapsed = false }: JobProgressBarProps) {
    const [jobs, setJobs] = useState<JobProgress[]>([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // Load jobs on mount
        cleanupOldJobs();
        setJobs(getActiveJobs());

        // Poll for updates every 2 seconds
        const interval = setInterval(() => {
            pollActiveJobs();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const pollActiveJobs = async () => {
        const currentJobs = getActiveJobs();
        const runningJobs = currentJobs.filter(
            j => j.status === 'QUEUED' || j.status === 'PROCESSING'
        );

        // Poll each running job
        for (const job of runningJobs) {
            try {
                const endpoint = `/api/bulk-generate/${job.id}/status`;

                const res = await fetch(getApiUrl(endpoint));
                if (res.ok) {
                    const data = await res.json();
                    updateJobProgress(job.id, {
                        status: data.status,
                        processed: data.processed || data.processedRows || 0,
                        created: data.created || data.createdPages || 0,
                        updated: data.updated || data.updatedPages || 0,
                        skipped: data.skipped || data.skippedPages || 0,
                        failed: data.failed || data.failedPages || 0,
                    });
                }
            } catch {
                // Ignore polling errors
            }
        }

        // Refresh state
        setJobs(getActiveJobs());
    };

    const runningJobs = jobs.filter(j => j.status === 'QUEUED' || j.status === 'PROCESSING');
    const recentJobs = jobs.filter(j => j.status === 'COMPLETED' || j.status === 'FAILED').slice(0, 3);

    if (jobs.length === 0) return null;

    // Collapsed view for sidebar
    if (collapsed) {
        if (runningJobs.length === 0) return null;
        return (
            <div className="px-2 py-3">
                <div className="bg-blue-600 rounded-lg p-2 animate-pulse">
                    <div className="text-xs text-white text-center font-medium">
                        {runningJobs.length} job{runningJobs.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border-t border-gray-200 bg-gray-50">
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {runningJobs.length > 0 && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                        Jobs {runningJobs.length > 0 && `(${runningJobs.length} running)`}
                    </span>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Job List */}
            {expanded && (
                <div className="px-3 pb-3 space-y-2">
                    {/* Running Jobs */}
                    {runningJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}

                    {/* Recent Completed */}
                    {recentJobs.length > 0 && (
                        <>
                            <div className="text-xs text-gray-400 uppercase tracking-wider pt-2">
                                Recent
                            </div>
                            {recentJobs.map(job => (
                                <JobCard key={job.id} job={job} compact />
                            ))}
                        </>
                    )}

                    {/* View All Link */}
                    <Link
                        href="/dashboard/bulk-generate"
                        className="block text-center text-xs text-blue-600 hover:text-blue-700 py-2"
                    >
                        View All Jobs →
                    </Link>
                </div>
            )}
        </div>
    );
}

function JobCard({ job, compact = false }: { job: JobProgress; compact?: boolean }) {
    const progress = job.total > 0 ? Math.round((job.processed / job.total) * 100) : 0;
    const isRunning = job.status === 'QUEUED' || job.status === 'PROCESSING';

    if (compact) {
        return (
            <div className="flex items-center justify-between text-xs py-1">
                <span className="text-gray-600 truncate flex-1">{job.name}</span>
                <span className={`ml-2 ${job.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'}`}>
                    {job.status === 'COMPLETED' ? `✓ ${job.created} created` : '✗ Failed'}
                </span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800 truncate">{job.name}</span>
                {isRunning && (
                    <span className="text-xs text-blue-600 animate-pulse">
                        {job.status === 'QUEUED' ? 'Queued' : 'Processing'}
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                    className={`h-full transition-all duration-300 ${isRunning ? 'bg-blue-500' : job.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{job.processed} / {job.total}</span>
                <span className="flex gap-2">
                    {job.created > 0 && <span className="text-green-600">+{job.created}</span>}
                    {job.skipped > 0 && <span className="text-gray-400">{job.skipped} skipped</span>}
                    {job.failed > 0 && <span className="text-red-600">{job.failed} failed</span>}
                </span>
            </div>
        </div>
    );
}
