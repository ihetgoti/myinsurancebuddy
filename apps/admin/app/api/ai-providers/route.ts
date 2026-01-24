import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/ai-providers
 * List all AI providers
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providers = await prisma.aIProvider.findMany({
      orderBy: { priority: 'asc' },
      select: {
        id: true,
        name: true,
        provider: true,
        preferredModel: true,
        maxRequestsPerMinute: true,
        totalBudget: true,
        usedBudget: true,
        requestCount: true,
        lastUsedAt: true,
        isActive: true,
        priority: true,
        createdAt: true,
        // Don't expose API keys
        apiKey: false
      }
    });

    return NextResponse.json({ providers });
  } catch (error: any) {
    console.error('Get providers error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai-providers
 * Create new AI provider
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      provider = 'openrouter',
      apiKey,
      apiEndpoint = 'https://openrouter.ai/api/v1/chat/completions',
      preferredModel = 'anthropic/claude-haiku',
      fallbackModel,
      maxRequestsPerMinute = 60,
      maxTokensPerRequest = 4000,
      totalBudget,
      priority = 0
    } = body;

    if (!name || !apiKey) {
      return NextResponse.json(
        { error: 'Name and API key are required' },
        { status: 400 }
      );
    }

    const newProvider = await prisma.aIProvider.create({
      data: {
        name,
        provider,
        apiKey, // TODO: Encrypt this in production
        apiEndpoint,
        preferredModel,
        fallbackModel,
        maxRequestsPerMinute,
        maxTokensPerRequest,
        totalBudget,
        priority,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      provider: {
        ...newProvider,
        apiKey: undefined // Don't return the key
      }
    });
  } catch (error: any) {
    console.error('Create provider error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
