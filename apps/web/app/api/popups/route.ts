import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pageType = searchParams.get('pageType');
        const insuranceType = searchParams.get('insuranceType');
        const stateCode = searchParams.get('stateCode');
        const pageSlug = searchParams.get('pageSlug');

        const now = new Date();

        // Build where clause for active popups
        const where: any = {
            isActive: true,
            OR: [
                { startDate: null },
                { startDate: { lte: now } }
            ],
            AND: [
                {
                    OR: [
                        { endDate: null },
                        { endDate: { gte: now } }
                    ]
                }
            ]
        };

        // Fetch all active popups
        const allPopups = await prisma.popup.findMany({
            where,
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        // Filter popups based on targeting
        const filteredPopups = allPopups.filter(popup => {
            // Check insurance type targeting
            if (popup.insuranceTypeIds.length > 0 && insuranceType) {
                if (!popup.insuranceTypeIds.includes(insuranceType)) {
                    return false;
                }
            }

            // Check state targeting
            if (popup.stateIds.length > 0 && stateCode) {
                if (!popup.stateIds.includes(stateCode)) {
                    return false;
                }
            }

            // Check page type targeting
            if (popup.pageTypes.length > 0 && pageType) {
                if (!popup.pageTypes.includes(pageType)) {
                    return false;
                }
            }

            // Check excluded pages
            if (popup.excludePageSlugs.length > 0 && pageSlug) {
                if (popup.excludePageSlugs.includes(pageSlug)) {
                    return false;
                }
            }

            return true;
        });

        // Transform to frontend format
        const popups = filteredPopups.map(popup => ({
            id: popup.id,
            type: popup.type.toLowerCase() as 'scroll' | 'exit_intent' | 'timed' | 'click',
            title: popup.title,
            subtitle: popup.subtitle,
            description: popup.description,
            ctaText: popup.ctaText,
            ctaUrl: popup.ctaUrl,
            secondaryCtaText: popup.secondaryCtaText,
            secondaryCtaUrl: popup.secondaryCtaUrl,
            phoneNumber: popup.phoneNumber,
            imageUrl: popup.imageUrl,
            badgeText: popup.badgeText,
            accentColor: popup.accentColor as 'blue' | 'emerald' | 'orange' | 'purple' | 'red',
            showTrustBadges: popup.showTrustBadges,
            scrollPercentage: popup.scrollPercentage,
            delaySeconds: popup.delaySeconds,
            position: popup.position.toLowerCase().replace('_', '-') as 'center' | 'bottom-right' | 'bottom-left',
            size: popup.size.toLowerCase() as 'sm' | 'md' | 'lg',
            showOncePerSession: popup.showOncePerSession,
            showOncePerDay: popup.showOncePerDay,
            cookieKey: popup.cookieKey
        }));

        return NextResponse.json({ popups });
    } catch (error) {
        console.error('Error fetching popups:', error);
        return NextResponse.json({ popups: [] });
    }
}
