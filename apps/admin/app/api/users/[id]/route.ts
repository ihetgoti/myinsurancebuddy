import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

// PATCH /api/users/[id] - Update user
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { isActive } = body;

        const user = await prisma.user.update({
            where: { id: params.id },
            data: { isActive },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
            },
        });

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'UPDATE',
                entityType: 'User',
                entityId: user.id,
                changes: { isActive },
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('PATCH /api/users/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Prevent self-deletion
        if (params.id === session.user.id) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: params.id },
        });

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'DELETE',
                entityType: 'User',
                entityId: params.id,
                changes: {},
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/users/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
