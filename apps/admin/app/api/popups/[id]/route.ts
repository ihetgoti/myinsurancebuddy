import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/popups/[id] - Get single popup
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const popup = await prisma.popup.findUnique({
            where: { id },
        });

        if (!popup) {
            return NextResponse.json({ error: 'Popup not found' }, { status: 404 });
        }

        return NextResponse.json(popup);
    } catch (error) {
        console.error('GET /api/popups/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch popup' }, { status: 500 });
    }
}

// PATCH /api/popups/[id] - Update popup
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Check if popup exists
        const existing = await prisma.popup.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Popup not found' }, { status: 404 });
        }

        // Build update data
        const updateData: any = {};

        // String fields
        const stringFields = [
            'name', 'title', 'subtitle', 'description', 'ctaText', 'ctaUrl',
            'secondaryCtaText', 'secondaryCtaUrl', 'phoneNumber', 'imageUrl',
            'badgeText', 'accentColor', 'position', 'size', 'type', 'cookieKey', 'notes'
        ];

        for (const field of stringFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field] || null;
            }
        }

        // Boolean fields
        const booleanFields = ['showTrustBadges', 'showOncePerSession', 'showOncePerDay', 'isActive'];
        for (const field of booleanFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        // Number fields
        const numberFields = ['scrollPercentage', 'delaySeconds', 'priority'];
        for (const field of numberFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        // Array fields
        const arrayFields = ['insuranceTypeIds', 'stateIds', 'pageTypes', 'excludePageSlugs'];
        for (const field of arrayFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        // Date fields
        if (body.startDate !== undefined) {
            updateData.startDate = body.startDate ? new Date(body.startDate) : null;
        }
        if (body.endDate !== undefined) {
            updateData.endDate = body.endDate ? new Date(body.endDate) : null;
        }

        const popup = await prisma.popup.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(popup);
    } catch (error) {
        console.error('PATCH /api/popups/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update popup' }, { status: 500 });
    }
}

// DELETE /api/popups/[id] - Delete popup
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Check if popup exists
        const existing = await prisma.popup.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Popup not found' }, { status: 404 });
        }

        await prisma.popup.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/popups/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete popup' }, { status: 500 });
    }
}
