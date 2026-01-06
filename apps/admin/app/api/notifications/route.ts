import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: List notifications for current user
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const unreadOnly = searchParams.get('unread') === 'true';

        // Fetch notifications for user (or global ones with userId: null)
        const notifications = await prisma.notification.findMany({
            where: {
                OR: [
                    { userId: session.user.id },
                    { userId: null }, // Global notifications
                ],
                ...(unreadOnly ? { isRead: false } : {}),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        const unreadCount = await prisma.notification.count({
            where: {
                OR: [
                    { userId: session.user.id },
                    { userId: null },
                ],
                isRead: false,
            },
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

// POST: Create a new notification (admin only)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, title, message, link, userId } = body;

        if (!title || !message) {
            return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
        }

        const notification = await prisma.notification.create({
            data: {
                type: type || 'INFO',
                title,
                message,
                link,
                userId: userId || null, // null = global notification
            },
        });

        return NextResponse.json({ notification }, { status: 201 });
    } catch (error) {
        console.error('Error creating notification:', error);
        return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }
}

// PATCH: Mark notifications as read
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { notificationIds, markAllRead } = body;

        if (markAllRead) {
            // Mark all notifications as read for this user
            await prisma.notification.updateMany({
                where: {
                    OR: [
                        { userId: session.user.id },
                        { userId: null },
                    ],
                    isRead: false,
                },
                data: { isRead: true },
            });
        } else if (notificationIds?.length > 0) {
            // Mark specific notifications as read
            await prisma.notification.updateMany({
                where: {
                    id: { in: notificationIds },
                    OR: [
                        { userId: session.user.id },
                        { userId: null },
                    ],
                },
                data: { isRead: true },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    }
}
