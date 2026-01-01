import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all affiliates
export async function GET() {
    try {
        const affiliates = await prisma.affiliatePartner.findMany({
            orderBy: [
                { displayOrder: 'asc' },
                { name: 'asc' }
            ],
        });
        return NextResponse.json(affiliates);
    } catch (error) {
        console.error('Failed to fetch affiliates:', error);
        return NextResponse.json({ error: 'Failed to fetch affiliates' }, { status: 500 });
    }
}

// POST create new affiliate
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const affiliate = await prisma.affiliatePartner.create({
            data: {
                name: body.name,
                slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                logo: body.logo || null,
                description: body.description || null,
                affiliateUrl: body.affiliateUrl || null,
                affiliateId: body.affiliateId || null,
                displayOrder: body.displayOrder || 0,
                isActive: body.isActive ?? true,
                isFeatured: body.isFeatured ?? false,
                insuranceTypes: body.insuranceTypes || [],
                ctaText: body.ctaText || 'Get Quote',
                notes: body.notes || null,
            },
        });

        return NextResponse.json(affiliate, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create affiliate:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'An affiliate with this slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create affiliate' }, { status: 500 });
    }
}
