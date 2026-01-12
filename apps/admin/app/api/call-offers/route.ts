import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/call-offers - List all call offers
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const insuranceTypeId = searchParams.get('insuranceTypeId');
        const geoLevel = searchParams.get('geoLevel');
        const isActive = searchParams.get('isActive');

        const offers = await prisma.callOffer.findMany({
            where: {
                ...(insuranceTypeId && { insuranceTypeId }),
                ...(geoLevel && { geoLevel: geoLevel as any }),
                ...(isActive !== null && { isActive: isActive === 'true' }),
            },
            include: {
                insuranceType: {
                    select: { id: true, name: true, slug: true },
                },
            },
            orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        });

        return NextResponse.json(offers);
    } catch (error) {
        console.error('GET /api/call-offers error:', error);
        return NextResponse.json({ error: 'Failed to fetch call offers' }, { status: 500 });
    }
}

// POST /api/call-offers - Create new call offer
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, campaignId, subId, phoneMask, insuranceTypeId, geoLevel, stateIds, priority, notes } = body;

        if (!name || !campaignId) {
            return NextResponse.json({ error: 'Name and campaignId are required' }, { status: 400 });
        }

        const offer = await prisma.callOffer.create({
            data: {
                name,
                campaignId,
                subId,
                phoneMask: phoneMask || '(xxx) xxx-xx-xx',
                insuranceTypeId: insuranceTypeId || null,
                geoLevel: geoLevel || null,
                stateIds: stateIds || [],
                priority: priority || 0,
                notes,
            },
            include: {
                insuranceType: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });

        return NextResponse.json(offer, { status: 201 });
    } catch (error) {
        console.error('POST /api/call-offers error:', error);
        return NextResponse.json({ error: 'Failed to create call offer' }, { status: 500 });
    }
}
