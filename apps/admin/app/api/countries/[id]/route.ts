import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';



// GET single country
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const country = await prisma.country.findUnique({
            where: { id: params.id },
            include: {
                states: {
                    orderBy: { name: 'asc' },
                    include: {
                        _count: { select: { cities: true } }
                    }
                },
                _count: { select: { pages: true } }
            }
        });

        if (!country) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(country);
    } catch (error) {
        console.error('Failed to fetch country:', error);
        return NextResponse.json({ error: 'Failed to fetch country' }, { status: 500 });
    }
}

// PATCH update country
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
        const { code, name, isActive } = body;

        if (code) {
            const existing = await prisma.country.findFirst({
                where: { code: code.toLowerCase(), NOT: { id: params.id } }
            });
            if (existing) {
                return NextResponse.json({ error: 'Country code already exists' }, { status: 400 });
            }
        }

        const country = await prisma.country.update({
            where: { id: params.id },
            data: {
                ...(code && { code: code.toLowerCase() }),
                ...(name && { name }),
                ...(isActive !== undefined && { isActive }),
            }
        });

        return NextResponse.json(country);
    } catch (error) {
        console.error('Failed to update country:', error);
        return NextResponse.json({ error: 'Failed to update country' }, { status: 500 });
    }
}

// DELETE country
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.country.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete country:', error);
        return NextResponse.json({ error: 'Failed to delete country' }, { status: 500 });
    }
}
