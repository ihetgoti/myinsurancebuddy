import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/pages/bulk-ads - Bulk enable/disable ads for pages
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            pageIds,           // Array of page IDs to update
            showAds,           // Boolean: true = enable, false = disable
            filters            // Optional: {templateId, insuranceTypeId, stateId, cityId}
        } = body;

        let whereClause: any = {};
        let updatedCount = 0;

        if (pageIds && pageIds.length > 0) {
            // Update specific pages by ID
            whereClause = { id: { in: pageIds } };
        } else if (filters) {
            // Update pages matching filters
            if (filters.templateId) whereClause.templateId = filters.templateId;
            if (filters.insuranceTypeId) whereClause.insuranceTypeId = filters.insuranceTypeId;
            if (filters.stateId) whereClause.stateId = filters.stateId;
            if (filters.cityId) whereClause.cityId = filters.cityId;
            if (filters.countryId) whereClause.countryId = filters.countryId;
        } else {
            return NextResponse.json({
                error: 'Either pageIds or filters must be provided'
            }, { status: 400 });
        }

        const result = await prisma.page.updateMany({
            where: whereClause,
            data: { showAds }
        });

        updatedCount = result.count;

        return NextResponse.json({
            success: true,
            updatedCount,
            showAds,
            message: `${updatedCount} page(s) updated - Ads ${showAds ? 'enabled' : 'disabled'}`
        });
    } catch (error) {
        console.error('POST /api/pages/bulk-ads error:', error);
        return NextResponse.json({ error: 'Failed to update page ads' }, { status: 500 });
    }
}

// GET /api/pages/bulk-ads - Get pages with their ad status, supports filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const templateId = searchParams.get('templateId');
        const insuranceTypeId = searchParams.get('insuranceTypeId');
        const stateId = searchParams.get('stateId');
        const cityId = searchParams.get('cityId');
        const showAds = searchParams.get('showAds'); // 'true', 'false', or null for all

        const whereClause: any = {};
        if (templateId) whereClause.templateId = templateId;
        if (insuranceTypeId) whereClause.insuranceTypeId = insuranceTypeId;
        if (stateId) whereClause.stateId = stateId;
        if (cityId) whereClause.cityId = cityId;
        if (showAds !== null) whereClause.showAds = showAds === 'true';

        const pages = await prisma.page.findMany({
            where: whereClause,
            select: {
                id: true,
                title: true,
                slug: true,
                showAds: true,
                template: { select: { id: true, name: true } },
                insuranceType: { select: { id: true, name: true } },
                state: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
            },
            orderBy: { updatedAt: 'desc' },
            take: 500, // Limit for performance
        });

        // Get counts for summary
        const totalCount = await prisma.page.count({ where: whereClause });
        const adsEnabledCount = await prisma.page.count({
            where: { ...whereClause, showAds: true }
        });
        const adsDisabledCount = await prisma.page.count({
            where: { ...whereClause, showAds: false }
        });

        return NextResponse.json({
            pages,
            summary: {
                total: totalCount,
                adsEnabled: adsEnabledCount,
                adsDisabled: adsDisabledCount,
            }
        });
    } catch (error) {
        console.error('GET /api/pages/bulk-ads error:', error);
        return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }
}
