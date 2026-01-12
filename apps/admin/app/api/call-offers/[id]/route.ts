import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/call-offers/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const offer = await prisma.callOffer.findUnique({
            where: { id: params.id },
            include: {
                insuranceType: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });

        if (!offer) {
            return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
        }

        return NextResponse.json(offer);
    } catch (error) {
        console.error('GET /api/call-offers/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch offer' }, { status: 500 });
    }
}

// PATCH /api/call-offers/[id]
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, campaignId, subId, phoneMask, insuranceTypeId, geoLevel, stateIds, priority, notes, isActive } = body;

        const offer = await prisma.callOffer.update({
            where: { id: params.id },
            data: {
                ...(name !== undefined && { name }),
                ...(campaignId !== undefined && { campaignId }),
                ...(subId !== undefined && { subId }),
                ...(phoneMask !== undefined && { phoneMask }),
                ...(insuranceTypeId !== undefined && { insuranceTypeId }),
                ...(geoLevel !== undefined && { geoLevel }),
                ...(stateIds !== undefined && { stateIds }),
                ...(priority !== undefined && { priority }),
                ...(notes !== undefined && { notes }),
                ...(isActive !== undefined && { isActive }),
            },
            include: {
                insuranceType: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });

        return NextResponse.json(offer);
    } catch (error) {
        console.error('PATCH /api/call-offers/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
    }
}

// DELETE /api/call-offers/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.callOffer.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/call-offers/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
    }
}
