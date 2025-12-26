import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



// GET all insurance types
export async function GET() {
    try {
        const types = await prisma.insuranceType.findMany({
            orderBy: { sortOrder: 'asc' },
            include: {
                _count: {
                    select: { pages: true }
                }
            }
        });
        return NextResponse.json(types);
    } catch (error) {
        console.error('Failed to fetch insurance types:', error);
        return NextResponse.json({ error: 'Failed to fetch insurance types' }, { status: 500 });
    }
}

// POST create new insurance type
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, slug, icon, description, metaTitle, metaDesc, isActive, sortOrder } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        // Check for duplicate slug
        const existing = await prisma.insuranceType.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }

        const insuranceType = await prisma.insuranceType.create({
            data: {
                name,
                slug,
                icon,
                description,
                metaTitle,
                metaDesc,
                isActive: isActive ?? true,
                sortOrder: sortOrder ?? 0,
            }
        });

        return NextResponse.json(insuranceType, { status: 201 });
    } catch (error) {
        console.error('Failed to create insurance type:', error);
        return NextResponse.json({ error: 'Failed to create insurance type' }, { status: 500 });
    }
}
