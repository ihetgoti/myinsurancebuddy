import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// In-memory store for edit locks (for production, use Redis)
const editLocks = new Map<string, {
    userId: string;
    userName: string;
    lockedAt: Date;
    expiresAt: Date;
}>();

const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Clean expired locks
function cleanExpiredLocks() {
    const now = new Date();
    const entries = Array.from(editLocks.entries());
    for (const [key, lock] of entries) {
        if (lock.expiresAt < now) {
            editLocks.delete(key);
        }
    }
}

// POST - Acquire or extend edit lock
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { resourceType, resourceId, action } = body;

        if (!resourceType || !resourceId) {
            return NextResponse.json({ error: 'Missing resourceType or resourceId' }, { status: 400 });
        }

        const lockKey = `${resourceType}:${resourceId}`;
        const userId = session.user.id || session.user.email || 'unknown';
        const userName = session.user.name || session.user.email || 'Unknown User';

        cleanExpiredLocks();

        const existingLock = editLocks.get(lockKey);

        if (action === 'release') {
            // Release the lock if owned by this user
            if (existingLock && existingLock.userId === userId) {
                editLocks.delete(lockKey);
                return NextResponse.json({ success: true, message: 'Lock released' });
            }
            return NextResponse.json({ success: true, message: 'No lock to release' });
        }

        if (action === 'check') {
            // Just check if someone else is editing
            if (existingLock && existingLock.userId !== userId) {
                return NextResponse.json({
                    locked: true,
                    lockedBy: existingLock.userName,
                    lockedAt: existingLock.lockedAt,
                    message: `This ${resourceType} is being edited by ${existingLock.userName}`
                });
            }
            return NextResponse.json({ locked: false });
        }

        // Default action: acquire or extend lock
        if (existingLock && existingLock.userId !== userId) {
            // Someone else has the lock
            return NextResponse.json({
                success: false,
                locked: true,
                lockedBy: existingLock.userName,
                lockedAt: existingLock.lockedAt,
                message: `This ${resourceType} is being edited by ${existingLock.userName}. Please wait or contact them.`
            }, { status: 409 });
        }

        // Acquire or extend the lock
        const now = new Date();
        editLocks.set(lockKey, {
            userId,
            userName,
            lockedAt: existingLock ? existingLock.lockedAt : now,
            expiresAt: new Date(now.getTime() + LOCK_DURATION_MS)
        });

        return NextResponse.json({
            success: true,
            locked: false,
            message: existingLock ? 'Lock extended' : 'Lock acquired',
            expiresIn: LOCK_DURATION_MS / 1000
        });

    } catch (error: any) {
        console.error('Edit lock error:', error);
        return NextResponse.json({ error: 'Failed to manage edit lock' }, { status: 500 });
    }
}

// GET - Check lock status
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const resourceType = searchParams.get('resourceType');
        const resourceId = searchParams.get('resourceId');

        if (!resourceType || !resourceId) {
            return NextResponse.json({ error: 'Missing resourceType or resourceId' }, { status: 400 });
        }

        const lockKey = `${resourceType}:${resourceId}`;
        const userId = session.user.id || session.user.email || 'unknown';

        cleanExpiredLocks();

        const existingLock = editLocks.get(lockKey);

        if (existingLock && existingLock.userId !== userId) {
            return NextResponse.json({
                locked: true,
                lockedBy: existingLock.userName,
                lockedAt: existingLock.lockedAt,
                message: `This ${resourceType} is being edited by ${existingLock.userName}`
            });
        }

        return NextResponse.json({
            locked: false,
            ownLock: existingLock?.userId === userId
        });

    } catch (error: any) {
        console.error('Edit lock check error:', error);
        return NextResponse.json({ error: 'Failed to check edit lock' }, { status: 500 });
    }
}
