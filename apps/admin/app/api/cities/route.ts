import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';



// GET all cities (with optional state filter)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const stateId = searchParams.get('stateId');
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');
        const search = searchParams.get('search');

        const where: any = {};
        if (stateId) where.stateId = stateId;
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        const [cities, total] = await Promise.all([
            prisma.city.findMany({
                where,
                orderBy: { name: 'asc' },
                skip: offset,
                take: limit,
                include: {
                    state: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            country: { select: { id: true, code: true, name: true } }
                        }
                    },
                    _count: { select: { pages: true } }
                }
            }),
            prisma.city.count({ where })
        ]);

        return NextResponse.json({ cities, total, limit, offset });
    } catch (error) {
        console.error('Failed to fetch cities:', error);
        return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
    }
}

// POST create new city
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { stateId, name, slug, population, isActive } = body;

        if (!stateId || !name || !slug) {
            return NextResponse.json({ error: 'State, name, and slug are required' }, { status: 400 });
        }

        // Verify state exists
        const state = await prisma.state.findUnique({ where: { id: stateId } });
        if (!state) {
            return NextResponse.json({ error: 'State not found' }, { status: 400 });
        }

        // Check for duplicate slug within state
        const existing = await prisma.city.findFirst({
            where: { stateId, slug: slug.toLowerCase() }
        });
        if (existing) {
            return NextResponse.json({ error: 'City slug already exists in this state' }, { status: 400 });
        }

        const city = await prisma.city.create({
            data: {
                stateId,
                name,
                slug: slug.toLowerCase(),
                population: population ? parseInt(population) : null,
                isActive: isActive ?? true,
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

        return NextResponse.json(city, { status: 201 });
    } catch (error) {
        console.error('Failed to create city:', error);
        return NextResponse.json({ error: 'Failed to create city' }, { status: 500 });
    }
}
