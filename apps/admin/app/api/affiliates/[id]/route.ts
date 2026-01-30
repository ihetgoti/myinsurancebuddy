import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/affiliates/[id] - Get single affiliate
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const affiliate = await prisma.affiliatePartner.findUnique({
            where: { id: params.id },
            include: {
                insuranceType: {
                    select: { id: true, name: true, slug: true }
                }
            }
        });

        if (!affiliate) {
            return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
        }

        return NextResponse.json(affiliate);
    } catch (error) {
        console.error('GET /api/affiliates/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch affiliate' }, { status: 500 });
    }
}

// PATCH /api/affiliates/[id] - Update affiliate
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
        const { name, marketCallUrl, insuranceTypeId, priority, isActive } = body;

        const affiliate = await prisma.affiliatePartner.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(marketCallUrl && { marketCallUrl }),
                ...(insuranceTypeId !== undefined && { insuranceTypeId: insuranceTypeId || null }),
                ...(priority !== undefined && { priority }),
                ...(isActive !== undefined && { isActive }),
            },
            include: {
                insuranceType: {
                    select: { id: true, name: true, slug: true }
                }
            }
        });

        return NextResponse.json(affiliate);
    } catch (error) {
        console.error('PATCH /api/affiliates/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update affiliate' }, { status: 500 });
    }
}

// DELETE /api/affiliates/[id] - Delete affiliate
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.affiliatePartner.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/affiliates/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete affiliate' }, { status: 500 });
    }
}
