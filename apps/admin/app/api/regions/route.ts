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
