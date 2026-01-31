import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LLMContentRanker } from '@/lib/llmRanker';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ai/rank
 * Rank pages by content quality using AI
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      insuranceTypeId,
      stateId,
      limit = 50,
      scoreSpecificPage, // If provided, only score this page
    } = body;

    // Score a specific page
    if (scoreSpecificPage) {
      const scores = await LLMContentRanker.scorePage(scoreSpecificPage);
      
      if (!scores) {
        return NextResponse.json(
          { error: 'Failed to score page or page not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        pageId: scoreSpecificPage,
        scores,
      });
    }

    // Rank multiple pages
    const rankings = await LLMContentRanker.rankPages({
      insuranceTypeId,
      stateId,
      limit,
    });

    return NextResponse.json({
      success: true,
      totalRanked: rankings.length,
      rankings: rankings.slice(0, 20), // Return top 20
    });
  } catch (error: any) {
    console.error('Rank API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to rank content' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/rank
 * Get current rankings and improvement queue
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'rankings'; // 'rankings' | 'improvements' | 'compare'
    
    if (type === 'improvements') {
      const minScore = parseInt(searchParams.get('minScore') || '70');
      const queue = await LLMContentRanker.getImprovementQueue(minScore, 20);
      
      return NextResponse.json({
        success: true,
        totalNeedingImprovement: queue.length,
        queue,
      });
    }

    if (type === 'compare') {
      const pageA = searchParams.get('pageA');
      const pageB = searchParams.get('pageB');
      
      if (!pageA || !pageB) {
        return NextResponse.json(
          { error: 'Both pageA and pageB required for comparison' },
          { status: 400 }
        );
      }

      const comparison = await LLMContentRanker.comparePages(pageA, pageB);
      
      if (!comparison) {
        return NextResponse.json(
          { error: 'One or both pages not found or not scored' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        comparison,
      });
    }

    // Default: get rankings
    const insuranceTypeId = searchParams.get('insuranceTypeId') || undefined;
    const stateId = searchParams.get('stateId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');

    const rankings = await LLMContentRanker.rankPages({
      insuranceTypeId,
      stateId,
      limit,
    });

    return NextResponse.json({
      success: true,
      totalRanked: rankings.length,
      topPages: rankings.slice(0, 10),
      bottomPages: rankings.slice(-10).reverse(),
      averageScore: rankings.length > 0
        ? Math.round(rankings.reduce((sum, r) => sum + r.scores.overall, 0) / rankings.length)
        : 0,
    });
  } catch (error: any) {
    console.error('Rank API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get rankings' },
      { status: 500 }
    );
  }
}
