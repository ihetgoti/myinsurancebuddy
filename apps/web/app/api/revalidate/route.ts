import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    const token = process.env.REVALIDATION_SECRET;

    // Check for secret
    if (!token || secret !== token) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const path = request.nextUrl.searchParams.get('path');

    if (path) {
        try {
            console.log(`[Revalidate] Revalidating path: ${path}`);
            revalidatePath(path);
            return NextResponse.json({ revalidated: true, now: Date.now() });
        } catch (err) {
            console.error('[Revalidate] Error:', err);
            return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
        }
    }

    return NextResponse.json({ message: 'Missing path to revalidate' }, { status: 400 });
}
