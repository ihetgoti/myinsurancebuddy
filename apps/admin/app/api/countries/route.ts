import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



// GET all countries
export async function GET() {
    try {
        const countries = await prisma.country.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { states: true, pages: true }
                }
            }
        });
        return NextResponse.json(countries);
    } catch (error) {
        console.error('Failed to fetch countries:', error);
        return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
    }
}

// POST create new country
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { code, name, isActive } = body;

        if (!code || !name) {
            return NextResponse.json({ error: 'Code and name are required' }, { status: 400 });
        }

        const normalizedCode = code.toLowerCase();

        // Check for duplicate
        const existing = await prisma.country.findUnique({ where: { code: normalizedCode } });
        if (existing) {
            return NextResponse.json({ error: 'Country code already exists' }, { status: 400 });
        }

        const country = await prisma.country.create({
            data: {
                code: normalizedCode,
                name,
                isActive: isActive ?? true,
            }
        });

        return NextResponse.json(country, { status: 201 });
    } catch (error) {
        console.error('Failed to create country:', error);
        return NextResponse.json({ error: 'Failed to create country' }, { status: 500 });
    }
}
