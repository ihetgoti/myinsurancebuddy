import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/admin/keywords
 * List all keyword configurations
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const insuranceTypeId = searchParams.get('insuranceTypeId');
    const activeOnly = searchParams.get('active') === 'true';

    const configs = await prisma.keywordConfig.findMany({
      where: {
        ...(insuranceTypeId ? { insuranceTypeId } : {}),
        ...(activeOnly ? { isActive: true } : {})
      },
      orderBy: { createdAt: 'desc' },
      include: {
        insuranceType: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({ configs });
  } catch (error: any) {
    console.error('Get keyword configs error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/keywords
 * Create new keyword configuration
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
      description,
      primaryKeyword,
      secondaryKeywords = [],
      longTailKeywords = [],
      lsiKeywords = [],
      targetDensity = 2.0,
      maxDensity = 3.0,
      requireInTitle = true,
      requireInH1 = true,
      requireInH2 = true,
      requireInFirst100 = true,
      requireInMeta = true,
      insuranceTypeId
    } = body;

    if (!name || !primaryKeyword) {
      return NextResponse.json(
        { error: 'Name and primary keyword are required' },
        { status: 400 }
      );
    }

    const config = await prisma.keywordConfig.create({
      data: {
        name,
        description,
        primaryKeyword,
        secondaryKeywords,
        longTailKeywords,
        lsiKeywords,
        targetDensity,
        maxDensity,
        requireInTitle,
        requireInH1,
        requireInH2,
        requireInFirst100,
        requireInMeta,
        insuranceTypeId: insuranceTypeId || undefined,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Keyword configuration created',
      config
    });
  } catch (error: any) {
    console.error('Create keyword config error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/keywords
 * Update keyword configuration
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Config ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const config = await prisma.keywordConfig.update({
      where: { id },
      data: body
    });

    return NextResponse.json({
      success: true,
      message: 'Keyword configuration updated',
      config
    });
  } catch (error: any) {
    console.error('Update keyword config error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/keywords
 * Delete keyword configuration
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
        { error: 'Config ID is required' },
        { status: 400 }
      );
    }

    await prisma.keywordConfig.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Keyword configuration deleted'
    });
  } catch (error: any) {
    console.error('Delete keyword config error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
