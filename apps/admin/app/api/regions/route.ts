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

        return NextResponse.json(region, { status: 201 });
    } catch (error) {
        console.error('POST /api/regions error:', error);
        return NextResponse.json({ error: 'Failed to create region' }, { status: 500 });
    }
}
