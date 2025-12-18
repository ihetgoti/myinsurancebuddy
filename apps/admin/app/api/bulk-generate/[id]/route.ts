import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, GeoLevel, JobStatus } from '@myinsurancebuddy/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/bulk-generate/[id] - Get job status
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const job = await prisma.bulkJob.findUnique({
            where: { id: params.id },
            include: {
                template: { select: { name: true, sections: true, customVariables: true } },
                insuranceType: { select: { name: true, slug: true, icon: true } },
            },
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error('GET /api/bulk-generate/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
    }
}

// DELETE /api/bulk-generate/[id] - Delete job
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const job = await prisma.bulkJob.findUnique({ where: { id: params.id } });
        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        if (job.status === 'PROCESSING') {
            return NextResponse.json(
                { error: 'Cannot delete job while processing' },
                { status: 400 }
            );
        }

        await prisma.bulkJob.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/bulk-generate/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }
}
