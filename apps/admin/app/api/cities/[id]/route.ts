import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



// GET single city
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const city = await prisma.city.findUnique({
            where: { id: params.id },
            include: {
                state: {
                    include: {
                        country: true
                    }
                },
                _count: { select: { pages: true } }
            }
        });

        if (!city) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(city);
    } catch (error) {
        console.error('Failed to fetch city:', error);
        return NextResponse.json({ error: 'Failed to fetch city' }, { status: 500 });
    }
}

// PATCH update city
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
        const { name, slug, population, isActive } = body;

        const currentCity = await prisma.city.findUnique({ where: { id: params.id } });
        if (!currentCity) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        if (slug) {
            const existing = await prisma.city.findFirst({
                where: {
                    stateId: currentCity.stateId,
                    slug: slug.toLowerCase(),
                    NOT: { id: params.id }
                }
            });
            if (existing) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
            }
        }

        const city = await prisma.city.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(slug && { slug: slug.toLowerCase() }),
                ...(population !== undefined && { population: population ? parseInt(population) : null }),
                ...(isActive !== undefined && { isActive }),
            },
            include: {
                state: {
                    select: {
                        id: true,
                        name: true,
                        country: { select: { id: true, code: true, name: true } }
                    }
                }
            }
        });

        return NextResponse.json(city);
    } catch (error) {
        console.error('Failed to update city:', error);
        return NextResponse.json({ error: 'Failed to update city' }, { status: 500 });
    }
}

// DELETE city
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.city.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete city:', error);
        return NextResponse.json({ error: 'Failed to delete city' }, { status: 500 });
    }
}
