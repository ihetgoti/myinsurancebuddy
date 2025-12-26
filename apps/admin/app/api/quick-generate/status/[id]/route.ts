import { NextRequest, NextResponse } from 'next/server';
import { getJobProgress } from '@/lib/job-queue';

/**
 * GET /api/quick-generate/status/[id]
 * Get job progress status
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const progress = await getJobProgress(params.id);

        if (!progress) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json(progress);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
