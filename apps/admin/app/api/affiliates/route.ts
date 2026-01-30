import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/affiliates - List all affiliates
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const insuranceTypeId = searchParams.get('insuranceTypeId');
        const isActive = searchParams.get('isActive');

        const affiliates = await prisma.affiliatePartner.findMany({
            where: {
                ...(insuranceTypeId && { insuranceTypeId }),
                ...(isActive !== null && { isActive: isActive === 'true' }),
            },
            include: {
                insuranceType: {
                    select: { id: true, name: true, slug: true }
                }
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ],
        });

        return NextResponse.json(affiliates);
    } catch (error) {
        console.error('GET /api/affiliates error:', error);
        return NextResponse.json({ error: 'Failed to fetch affiliates' }, { status: 500 });
    }
}

// POST /api/affiliates - Create new affiliate
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, marketCallUrl, insuranceTypeId, priority, isActive } = body;

        if (!name || !marketCallUrl) {
            return NextResponse.json({ error: 'Name and MarketCall URL are required' }, { status: 400 });
        }

        // Auto-generate subId for tracking
        const subId = `mib_${insuranceTypeId || 'general'}_${Date.now()}`;

        const affiliate = await prisma.affiliatePartner.create({
            data: {
                name,
                marketCallUrl,
                insuranceTypeId: insuranceTypeId || null,
                priority: priority || 0,
                isActive: isActive ?? true,
                subId,
            },
            include: {
                insuranceType: {
                    select: { id: true, name: true, slug: true }
                }
            }
        });

        return NextResponse.json(affiliate, { status: 201 });
    } catch (error) {
        console.error('POST /api/affiliates error:', error);
        return NextResponse.json({ error: 'Failed to create affiliate' }, { status: 500 });
    }
}
