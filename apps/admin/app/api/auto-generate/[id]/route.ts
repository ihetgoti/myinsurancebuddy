import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auto-generate/[id]
 * Get details of a specific auto-generate job
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

    return NextResponse.json(job);

  } catch (error: any) {
    console.error('Get auto-generate job error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to get job'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/auto-generate/[id]
 * Delete an auto-generate job
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

    // Don't allow deleting running jobs
    if (job.status === 'PROCESSING') {
      return NextResponse.json({
        error: 'Cannot delete a running job. Cancel it first.'
      }, { status: 400 });
    }

    await prisma.aIGenerationJob.delete({
      where: { id: jobId }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Delete auto-generate job error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to delete job'
    }, { status: 500 });
  }
}
