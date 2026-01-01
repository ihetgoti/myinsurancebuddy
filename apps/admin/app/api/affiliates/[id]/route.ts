import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
    params: { id: string };
}

// GET single affiliate
export async function GET(request: Request, { params }: Params) {
    try {
        const affiliate = await prisma.affiliatePartner.findUnique({
            where: { id: params.id },
        });

        if (!affiliate) {
            return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
        }

        return NextResponse.json(affiliate);
    } catch (error) {
        console.error('Failed to fetch affiliate:', error);
        return NextResponse.json({ error: 'Failed to fetch affiliate' }, { status: 500 });
    }
}

// PATCH update affiliate
export async function PATCH(request: Request, { params }: Params) {
    try {
        const body = await request.json();

        const affiliate = await prisma.affiliatePartner.update({
            where: { id: params.id },
            data: {
                name: body.name,
                slug: body.slug,
                logo: body.logo || null,
                description: body.description || null,
                affiliateUrl: body.affiliateUrl || null,
                affiliateId: body.affiliateId || null,
                displayOrder: body.displayOrder,
                isActive: body.isActive,
                isFeatured: body.isFeatured,
                insuranceTypes: body.insuranceTypes,
                ctaText: body.ctaText,
                notes: body.notes || null,
            },
        });

        return NextResponse.json(affiliate);
    } catch (error: any) {
        console.error('Failed to update affiliate:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update affiliate' }, { status: 500 });
    }
}

// DELETE affiliate
export async function DELETE(request: Request, { params }: Params) {
    try {
        await prisma.affiliatePartner.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to delete affiliate:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete affiliate' }, { status: 500 });
    }
}
