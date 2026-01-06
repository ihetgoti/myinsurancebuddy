import { NextResponse } from 'next/server';
import { GENERATION_PRESETS } from '@/lib/presets';

export const dynamic = 'force-dynamic';

/**
 * GET /api/quick-generate/presets
 * Returns all available generation presets
 */
export async function GET() {
    return NextResponse.json({
        presets: GENERATION_PRESETS,
    });
}
