import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/admin/free-models
 * List all free AI models
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    const models = await prisma.freeAIModel.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { priority: 'asc' }
    });

    return NextResponse.json({ models });
  } catch (error: any) {
    console.error('Get free models error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/free-models
 * Add a new free AI model
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      modelId,
      name,
      provider,
      description,
      priority = 0
    } = body;

    if (!modelId || !name) {
      return NextResponse.json(
        { error: 'Model ID and name are required' },
        { status: 400 }
      );
    }

    // Validate model ID ends with :free
    if (!modelId.endsWith(':free')) {
      return NextResponse.json(
        { error: 'Model ID must end with ":free" to be considered free' },
        { status: 400 }
      );
    }

    const newModel = await prisma.freeAIModel.create({
      data: {
        modelId,
        name,
        provider: provider || 'unknown',
        description,
        priority,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Free model added successfully',
      model: newModel
    });
  } catch (error: any) {
    console.error('Create free model error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Model with this ID already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/free-models
 * Remove a free AI model
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    await prisma.freeAIModel.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Free model removed'
    });
  } catch (error: any) {
    console.error('Delete free model error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/free-models
 * Update a free AI model
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    const updated = await prisma.freeAIModel.update({
      where: { id },
      data: updates
    });

    return NextResponse.json({
      success: true,
      message: 'Free model updated',
      model: updated
    });
  } catch (error: any) {
    console.error('Update free model error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
