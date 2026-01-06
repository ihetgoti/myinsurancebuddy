import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';



// GET /api/media - List all media files
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const media = await prisma.media.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(media);
    } catch (error) {
        console.error('GET /api/media error:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}
