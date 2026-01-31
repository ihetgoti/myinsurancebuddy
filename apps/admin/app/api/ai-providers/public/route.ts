import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/ai-providers/public
 * Public endpoint for initial setup (no auth required)
 * WARNING: Only use this for initial setup, disable after!
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      apiKey,
      preferredModel = 'deepseek/deepseek-r1:free',
      priority = 0
    } = body;

    if (!name || !apiKey) {
      return NextResponse.json(
        { error: 'Name and API key are required' },
        { status: 400 }
      );
    }

    // Check if provider already exists
    const existing = await prisma.aIProvider.findFirst({
      where: { name }
    });

    if (existing) {
      // Update existing
      const updated = await prisma.aIProvider.update({
        where: { id: existing.id },
        data: {
          apiKey,
          preferredModel,
          priority,
          isActive: true
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Provider updated',
        provider: { ...updated, apiKey: undefined }
      });
    }

    // Create new provider
    const newProvider = await prisma.aIProvider.create({
      data: {
        name,
        provider: 'openrouter',
        apiKey,
        apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
        preferredModel,
        maxRequestsPerMinute: 20,
        maxTokensPerRequest: 4000,
        priority,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Provider created',
      provider: {
        ...newProvider,
        apiKey: undefined
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

/**
 * GET /api/ai-providers/public
 * Check if any providers exist
 */
export async function GET() {
  try {
    const count = await prisma.aIProvider.count();
    return NextResponse.json({ 
      hasProviders: count > 0,
      count 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
