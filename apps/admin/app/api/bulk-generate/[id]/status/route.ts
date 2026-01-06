import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const job = await prisma.bulkJob.findUnique({
            where: { id: params.id },
            include: {
                template: { select: { name: true } },
                insuranceType: { select: { name: true } },
            },
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error('Failed to fetch job status:', error);
        return NextResponse.json({ error: 'Failed to fetch job status' }, { status: 500 });
    }
}
