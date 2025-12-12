import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

// GET /api/regions/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const region = await prisma.region.findUnique({
            where: { id: params.id },
        });

        if (!region) {
            return NextResponse.json({ error: 'Region not found' }, { status: 404 });
        }

        return NextResponse.json(region);
    } catch (error) {
        console.error('GET /api/regions/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch region' }, { status: 500 });
    }
}

// PATCH /api/regions/[id]
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
        const { name, slug, stateCode, population, medianIncome, timezone, seoSummary, legalNotes } = body;

        const region = await prisma.region.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(stateCode !== undefined && { stateCode }),
                ...(population !== undefined && { population }),
                ...(medianIncome !== undefined && { medianIncome }),
                ...(timezone !== undefined && { timezone }),
                ...(seoSummary !== undefined && { seoSummary }),
                ...(legalNotes !== undefined && { legalNotes }),
            },
        });

        return NextResponse.json(region);
    } catch (error) {
        console.error('PATCH /api/regions/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update region' }, { status: 500 });
    }
}

// DELETE /api/regions/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.region.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/regions/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete region' }, { status: 500 });
    }
}
