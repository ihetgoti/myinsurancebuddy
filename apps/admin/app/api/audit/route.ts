import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';



// GET /api/audit - List all audit logs (SUPER_ADMIN only)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const logs = await prisma.auditLog.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit to last 100 logs
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('GET /api/audit error:', error);
        return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }
}
