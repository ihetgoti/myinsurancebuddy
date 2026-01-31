import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/free-models
 * Public endpoint to list active free models
 * Used by setup page and provider configuration
 */
export async function GET(req: NextRequest) {
  try {
    const models = await prisma.freeAIModel.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
      select: {
        id: true,
        modelId: true,
        name: true,
        provider: true,
        description: true
      }
    });

    return NextResponse.json({ 
      models,
      count: models.length
    });
  } catch (error: any) {
    console.error('Get free models error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
