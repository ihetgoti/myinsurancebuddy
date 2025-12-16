import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

// GET /api/regions - List all regions (states/cities)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const regions = await prisma.region.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(regions);
    } catch (error) {
        console.error('GET /api/regions error:', error);
        return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 });
    }
}

// POST /api/regions - Create new region
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, name, slug, stateCode, population, medianIncome, timezone, seoSummary, legalNotes } = body;

        if (!type || !name || !slug) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate type
        if (type !== 'STATE' && type !== 'CITY') {
            return NextResponse.json({ error: 'Invalid region type. Must be STATE or CITY' }, { status: 400 });
        }

        // Check if slug already exists
        const existingRegion = await prisma.region.findUnique({
            where: { slug },
        });

        if (existingRegion) {
            return NextResponse.json({ error: 'Region slug already exists' }, { status: 400 });
        }

        const region = await prisma.region.create({
            data: {
                type,
                name,
                slug,
                stateCode: stateCode || null,
                population: population || null,
                medianIncome: medianIncome || null,
                timezone: timezone || null,
                seoSummary: seoSummary || null,
                legalNotes: legalNotes || null,
            },
        });

        // Create audit log
        try {
            await prisma.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: 'CREATE_REGION',
                    entityType: 'Region',
                    entityId: region.id,
                    changes: { after: region },
                },
            });
        } catch (auditError) {
            console.error('Failed to create audit log:', auditError);
        }

        return NextResponse.json(region, { status: 201 });
    } catch (error: any) {
        console.error('POST /api/regions error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Region slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ 
            error: error.message || 'Failed to create region' 
        }, { status: 500 });
    }
}
