import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@myinsurancebuddy/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET single insurance type
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const insuranceType = await prisma.insuranceType.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: { pages: true }
                }
            }
        });

        if (!insuranceType) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(insuranceType);
    } catch (error) {
        console.error('Failed to fetch insurance type:', error);
        return NextResponse.json({ error: 'Failed to fetch insurance type' }, { status: 500 });
    }
}

// PATCH update insurance type
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, slug, icon, description, metaTitle, metaDesc, isActive, sortOrder } = body;

        // Check if slug is unique (if being changed)
        if (slug) {
            const existing = await prisma.insuranceType.findFirst({
                where: { slug, NOT: { id: params.id } }
            });
            if (existing) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
            }
        }

        const insuranceType = await prisma.insuranceType.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(icon !== undefined && { icon }),
                ...(description !== undefined && { description }),
                ...(metaTitle !== undefined && { metaTitle }),
                ...(metaDesc !== undefined && { metaDesc }),
                ...(isActive !== undefined && { isActive }),
                ...(sortOrder !== undefined && { sortOrder }),
            }
        });

        return NextResponse.json(insuranceType);
    } catch (error) {
        console.error('Failed to update insurance type:', error);
        return NextResponse.json({ error: 'Failed to update insurance type' }, { status: 500 });
    }
}

// DELETE insurance type
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.insuranceType.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete insurance type:', error);
        return NextResponse.json({ error: 'Failed to delete insurance type' }, { status: 500 });
    }
}
