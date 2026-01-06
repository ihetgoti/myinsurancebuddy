import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET states with pagination
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const countryId = searchParams.get('countryId');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');
        const all = searchParams.get('all') === 'true'; // For dropdowns

        const where: any = {};
        if (countryId) where.countryId = countryId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }

        // If 'all' is true, return just names for dropdowns (fast)
        if (all) {
            const states = await prisma.state.findMany({
                where,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    code: true,
                    country: { select: { id: true, code: true, name: true } },
                },
            });
            return NextResponse.json(states);
        }

        // Paginated query with counts
        const [states, total] = await Promise.all([
            prisma.state.findMany({
                where,
                orderBy: { name: 'asc' },
                skip: offset,
                take: limit,
                include: {
                    country: { select: { id: true, code: true, name: true } },
                    _count: { select: { cities: true, pages: true } },
                },
            }),
            prisma.state.count({ where }),
        ]);

        return NextResponse.json({ states, total });
    } catch (error) {
        console.error('Failed to fetch states:', error);
        return NextResponse.json({ error: 'Failed to fetch states' }, { status: 500 });
    }
}

// POST create new state
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { countryId, name, slug, code, isActive } = body;

        if (!countryId || !name || !slug) {
            return NextResponse.json({ error: 'Country, name, and slug are required' }, { status: 400 });
        }

        // Verify country exists
        const country = await prisma.country.findUnique({ where: { id: countryId } });
        if (!country) {
            return NextResponse.json({ error: 'Country not found' }, { status: 400 });
        }

        // Check for duplicate slug within country
        const existing = await prisma.state.findFirst({
            where: { countryId, slug: slug.toLowerCase() }
        });
        if (existing) {
            return NextResponse.json({ error: 'State slug already exists in this country' }, { status: 400 });
        }

        const state = await prisma.state.create({
            data: {
                countryId,
                name,
                slug: slug.toLowerCase(),
                code: code?.toUpperCase(),
                isActive: isActive ?? true,
            },
            include: {
                country: { select: { id: true, code: true, name: true } }
            }
        });

        return NextResponse.json(state, { status: 201 });
    } catch (error) {
        console.error('Failed to create state:', error);
        return NextResponse.json({ error: 'Failed to create state' }, { status: 500 });
    }
}
