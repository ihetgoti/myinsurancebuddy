import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST bulk delete states
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { ids, action } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'IDs array is required' }, { status: 400 });
        }

        if (action === 'delete') {
            // Delete in batches to avoid timeout
            const BATCH_SIZE = 100;
            let deleted = 0;

            for (let i = 0; i < ids.length; i += BATCH_SIZE) {
                const batch = ids.slice(i, i + BATCH_SIZE);

                // First delete related cities
                await prisma.city.deleteMany({
                    where: { stateId: { in: batch } }
                });

                // Then delete states
                const result = await prisma.state.deleteMany({
                    where: { id: { in: batch } }
                });

                deleted += result.count;
            }

            return NextResponse.json({
                success: true,
                deleted,
                message: `Deleted ${deleted} states`
            });
        }

        if (action === 'activate') {
            const result = await prisma.state.updateMany({
                where: { id: { in: ids } },
                data: { isActive: true }
            });
            return NextResponse.json({ success: true, updated: result.count });
        }

        if (action === 'deactivate') {
            const result = await prisma.state.updateMany({
                where: { id: { in: ids } },
                data: { isActive: false }
            });
            return NextResponse.json({ success: true, updated: result.count });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Bulk action failed:', error);
        return NextResponse.json({ error: `Bulk action failed: ${error.message}` }, { status: 500 });
    }
}
