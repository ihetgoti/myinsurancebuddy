import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/leads
 * Fetch leads for admin dashboard
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');
        const insuranceType = searchParams.get('insuranceType');

        const where: any = {};
        if (status) where.status = status;
        if (insuranceType) where.insuranceType = insuranceType;

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            }),
            prisma.lead.count({ where }),
        ]);

        return NextResponse.json({ leads, total, limit, offset });
    } catch (error: any) {
        console.error('Failed to fetch leads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/leads/[id]
 * Update lead status
 */
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, status, notes } = body;

        const lead = await prisma.lead.update({
            where: { id },
            data: {
                status,
                notes,
                ...(status === 'QUALIFIED' ? { qualifiedAt: new Date() } : {}),
                ...(status === 'CONVERTED' ? { convertedAt: new Date() } : {}),
            },
        });

        return NextResponse.json(lead);
    } catch (error: any) {
        console.error('Failed to update lead:', error);
        return NextResponse.json(
            { error: 'Failed to update lead' },
            { status: 500 }
        );
    }
}
