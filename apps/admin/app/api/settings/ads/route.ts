import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/settings/ads - Get current ad settings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get or create site settings
        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    siteName: 'MyInsuranceBuddies',
                    siteUrl: 'https://myinsurancebuddies.com',
                    adsEnabled: true,
                }
            });
        }

        return NextResponse.json({
            adsEnabled: settings.adsEnabled,
            adsenseId: settings.adsenseId,
            adSlots: settings.adSlots,
            customAdCode: settings.customAdCode,
        });
    } catch (error) {
        console.error('GET /api/settings/ads error:', error);
        return NextResponse.json({ error: 'Failed to fetch ad settings' }, { status: 500 });
    }
}

// PUT /api/settings/ads - Update ad settings
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { adsEnabled, adsenseId, adSlots, customAdCode } = body;

        // Find existing settings
        let settings = await prisma.siteSettings.findFirst();

        if (settings) {
            // Update existing
            settings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: {
                    adsEnabled: adsEnabled ?? settings.adsEnabled,
                    adsenseId: adsenseId !== undefined ? adsenseId : settings.adsenseId,
                    adSlots: adSlots !== undefined ? adSlots : settings.adSlots,
                    customAdCode: customAdCode !== undefined ? customAdCode : settings.customAdCode,
                }
            });
        } else {
            // Create new
            settings = await prisma.siteSettings.create({
                data: {
                    siteName: 'MyInsuranceBuddies',
                    siteUrl: 'https://myinsurancebuddies.com',
                    adsEnabled: adsEnabled ?? true,
                    adsenseId,
                    adSlots,
                    customAdCode,
                }
            });
        }

        return NextResponse.json({
            success: true,
            adsEnabled: settings.adsEnabled,
            adsenseId: settings.adsenseId,
            adSlots: settings.adSlots,
            customAdCode: settings.customAdCode,
        });
    } catch (error) {
        console.error('PUT /api/settings/ads error:', error);
        return NextResponse.json({ error: 'Failed to update ad settings' }, { status: 500 });
    }
}
