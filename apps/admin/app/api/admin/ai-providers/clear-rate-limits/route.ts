import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/admin/ai-providers/clear-rate-limits
 * Clear rate limit status for all providers (for testing)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clear rate limit status for all providers
    await prisma.aIProvider.updateMany({
      where: { lastError: 'RATE_LIMITED' },
      data: {
        lastError: null,
        lastErrorAt: null,
        metadata: {}
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Rate limit status cleared for all providers'
    });
  } catch (error: any) {
    console.error('Clear rate limits error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
