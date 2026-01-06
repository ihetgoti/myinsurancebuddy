import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/settings/analytics - Get current analytics settings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    siteName: 'MyInsuranceBuddies',
                    siteUrl: 'https://myinsurancebuddies.com',
                }
            });
        }

        return NextResponse.json({
            googleAnalyticsId: settings.googleAnalyticsId,
            googleTagManagerId: settings.googleTagManagerId,
        });
    } catch (error) {
        console.error('GET /api/settings/analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics settings' }, { status: 500 });
    }
}

// PUT /api/settings/analytics - Update analytics settings
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { googleAnalyticsId, googleTagManagerId } = body;

        let settings = await prisma.siteSettings.findFirst();

        if (settings) {
            settings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: {
                    googleAnalyticsId: googleAnalyticsId !== undefined ? googleAnalyticsId : settings.googleAnalyticsId,
                    googleTagManagerId: googleTagManagerId !== undefined ? googleTagManagerId : settings.googleTagManagerId,
                }
            });
        } else {
            settings = await prisma.siteSettings.create({
                data: {
                    siteName: 'MyInsuranceBuddies',
                    siteUrl: 'https://myinsurancebuddies.com',
                    googleAnalyticsId,
                    googleTagManagerId,
                }
            });
        }

        return NextResponse.json({
            success: true,
            googleAnalyticsId: settings.googleAnalyticsId,
            googleTagManagerId: settings.googleTagManagerId,
        });
    } catch (error) {
        console.error('PUT /api/settings/analytics error:', error);
        return NextResponse.json({ error: 'Failed to update analytics settings' }, { status: 500 });
    }
}
