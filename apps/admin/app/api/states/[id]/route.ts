import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



// GET single state
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const state = await prisma.state.findUnique({
            where: { id: params.id },
            include: {
                country: true,
                cities: {
                    orderBy: { name: 'asc' },
                    take: 100
                },
                _count: { select: { cities: true, pages: true } }
            }
        });

        if (!state) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(state);
    } catch (error) {
        console.error('Failed to fetch state:', error);
        return NextResponse.json({ error: 'Failed to fetch state' }, { status: 500 });
    }
}

// PATCH update state
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
        const { name, slug, code, isActive } = body;

        const currentState = await prisma.state.findUnique({ where: { id: params.id } });
        if (!currentState) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        if (slug) {
            const existing = await prisma.state.findFirst({
                where: {
                    countryId: currentState.countryId,
                    slug: slug.toLowerCase(),
                    NOT: { id: params.id }
                }
            });
            if (existing) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
            }
        }

        const state = await prisma.state.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(slug && { slug: slug.toLowerCase() }),
                ...(code !== undefined && { code: code?.toUpperCase() }),
                ...(isActive !== undefined && { isActive }),
            },
            include: {
                country: { select: { id: true, code: true, name: true } }
            }
        });

        return NextResponse.json(state);
    } catch (error) {
        console.error('Failed to update state:', error);
        return NextResponse.json({ error: 'Failed to update state' }, { status: 500 });
    }
}

// DELETE state
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.state.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete state:', error);
        return NextResponse.json({ error: 'Failed to delete state' }, { status: 500 });
    }
}
