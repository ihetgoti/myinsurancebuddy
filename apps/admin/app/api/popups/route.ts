import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/popups - List all popups
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const isActive = searchParams.get('isActive');

        const popups = await prisma.popup.findMany({
            where: {
                ...(type && { type: type as any }),
                ...(isActive !== null && { isActive: isActive === 'true' }),
            },
            orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        });

        return NextResponse.json(popups);
    } catch (error) {
        console.error('GET /api/popups error:', error);
        return NextResponse.json({ error: 'Failed to fetch popups' }, { status: 500 });
    }
}

// POST /api/popups - Create new popup
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            title,
            subtitle,
            description,
            ctaText,
            ctaUrl,
            secondaryCtaText,
            secondaryCtaUrl,
            phoneNumber,
            imageUrl,
            badgeText,
            accentColor,
            position,
            size,
            showTrustBadges,
            type,
            scrollPercentage,
            delaySeconds,
            showOncePerSession,
            showOncePerDay,
            cookieKey,
            insuranceTypeIds,
            stateIds,
            pageTypes,
            excludePageSlugs,
            priority,
            startDate,
            endDate,
            notes,
        } = body;

        if (!name || !title || !ctaUrl) {
            return NextResponse.json({ error: 'Name, title, and ctaUrl are required' }, { status: 400 });
        }

        const popup = await prisma.popup.create({
            data: {
                name,
                title,
                subtitle: subtitle || null,
                description: description || null,
                ctaText: ctaText || 'Get Quote',
                ctaUrl,
                secondaryCtaText: secondaryCtaText || null,
                secondaryCtaUrl: secondaryCtaUrl || null,
                phoneNumber: phoneNumber || null,
                imageUrl: imageUrl || null,
                badgeText: badgeText || null,
                accentColor: accentColor || 'blue',
                position: position || 'CENTER',
                size: size || 'MD',
                showTrustBadges: showTrustBadges ?? true,
                type: type || 'SCROLL',
                scrollPercentage: scrollPercentage ?? 50,
                delaySeconds: delaySeconds ?? 0,
                showOncePerSession: showOncePerSession ?? true,
                showOncePerDay: showOncePerDay ?? false,
                cookieKey: cookieKey || null,
                insuranceTypeIds: insuranceTypeIds || [],
                stateIds: stateIds || [],
                pageTypes: pageTypes || [],
                excludePageSlugs: excludePageSlugs || [],
                priority: priority || 0,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                notes: notes || null,
            },
        });

        return NextResponse.json(popup, { status: 201 });
    } catch (error) {
        console.error('POST /api/popups error:', error);
        return NextResponse.json({ error: 'Failed to create popup' }, { status: 500 });
    }
}
