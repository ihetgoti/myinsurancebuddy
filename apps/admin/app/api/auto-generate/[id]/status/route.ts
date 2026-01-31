import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auto-generate/[id]/status
 * Returns current status and progress of an auto-generate job
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: jobId } = await params;

    const job = await prisma.aIGenerationJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Parse filters to get some context
    const filters = job.filters as any;
    const resumeState = job.resumeState as any;

    // Calculate percentage
    const percentComplete = job.totalPages > 0
      ? Math.round((job.processedPages / job.totalPages) * 100)
      : 0;

    // Calculate estimated time remaining (if processing)
    let estimatedTimeRemaining = null;
    if (job.status === 'PROCESSING' && job.startedAt && job.processedPages > 0) {
      const elapsed = Date.now() - new Date(job.startedAt).getTime();
      const rate = job.processedPages / elapsed; // pages per ms
      const remaining = job.totalPages - job.processedPages;
      const remainingMs = remaining / rate;
      estimatedTimeRemaining = Math.round(remainingMs / 1000 / 60); // minutes
    }

    // Calculate time until auto-resume (if paused)
    let timeUntilResume = null;
    if (job.status === 'PAUSED' && job.autoResumeAt) {
      const resumeTime = new Date(job.autoResumeAt).getTime();
      const now = Date.now();
      timeUntilResume = Math.max(0, Math.round((resumeTime - now) / 1000 / 60)); // minutes
    }

    return NextResponse.json({
      id: job.id,
      name: job.name,
      status: job.status,
      totalPages: job.totalPages,
      processedPages: job.processedPages,
      successfulPages: job.successfulPages,
      failedPages: job.failedPages,
      skippedPages: job.totalPages - job.processedPages, // Remaining pages
      percentComplete,
      tokensUsed: job.totalTokensUsed,
      estimatedCost: job.estimatedCost,
      errorLog: job.errorLog,
      
      // Pause/Resume info
      isPaused: job.status === 'PAUSED',
      canResume: job.status === 'PAUSED',
      autoResumeAt: job.autoResumeAt,
      timeUntilResume,
      pausedAt: job.pausedAt,
      resumedAt: job.resumedAt,
      resumeState: resumeState ? {
        lastProcessedStateId: resumeState.lastProcessedStateId,
        lastProcessedCityId: resumeState.lastProcessedCityId,
        processedCount: resumeState.processedCount
      } : null,
      
      // Timing info
      estimatedTimeRemaining,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      
      // Config
      filters,
      sections: job.sections,
      model: job.model
    });

  } catch (error: any) {
    console.error('Get auto-generate status error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to get job status'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/auto-generate/[id]/status
 * Cancel a running or paused job
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: jobId } = await params;

    const job = await prisma.aIGenerationJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status !== 'PROCESSING' && job.status !== 'PENDING' && job.status !== 'PAUSED') {
      return NextResponse.json({
        error: `Cannot cancel job with status: ${job.status}`
      }, { status: 400 });
    }

    // Mark job as cancelled
    await prisma.aIGenerationJob.update({
      where: { id: jobId },
      data: {
        status: 'CANCELLED',
        completedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Job cancelled'
    });

  } catch (error: any) {
    console.error('Cancel auto-generate job error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to cancel job'
    }, { status: 500 });
  }
}
