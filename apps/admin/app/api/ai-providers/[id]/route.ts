import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/**
 * PATCH /api/ai-providers/[id]
 * Update AI provider
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const updateData: any = {};

    // Only update provided fields
    if (body.name !== undefined) updateData.name = body.name;
    if (body.apiKey !== undefined) updateData.apiKey = body.apiKey;
    if (body.preferredModel !== undefined) updateData.preferredModel = body.preferredModel;
    if (body.totalBudget !== undefined) updateData.totalBudget = body.totalBudget;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.maxRequestsPerMinute !== undefined) updateData.maxRequestsPerMinute = body.maxRequestsPerMinute;

    const provider = await prisma.aIProvider.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      provider: {
        ...provider,
        apiKey: undefined
      }
    });
  } catch (error: any) {
    console.error('Update provider error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai-providers/[id]
 * Delete AI provider
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await prisma.aIProvider.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete provider error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
