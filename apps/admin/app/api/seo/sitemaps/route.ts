import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



export async function GET() {
    try {
        const sitemaps = await prisma.sitemap.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(sitemaps);
    } catch (error) {
        console.error('Failed to fetch sitemaps:', error);
        return NextResponse.json({ error: 'Failed to fetch sitemaps' }, { status: 500 });
    }
}

