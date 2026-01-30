import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/redirect-offer?insuranceType=car-insurance&zip=12345&email=test@test.com
 * Returns the best matching affiliate redirect URL
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const insuranceTypeSlug = searchParams.get('insuranceType');
        const zip = searchParams.get('zip'); // Optional - MarketCall will collect if needed
        const email = searchParams.get('email');
        const phone = searchParams.get('phone');

        // Find insurance type
        const insuranceType = insuranceTypeSlug 
            ? await prisma.insuranceType.findFirst({
                  where: { slug: insuranceTypeSlug, isActive: true },
                  select: { id: true, name: true, slug: true }
              })
            : null;

        // Find best matching affiliate
        // Priority: 1. Specific to insurance type, 2. General offers
        const affiliate = await prisma.affiliatePartner.findFirst({
            where: {
                isActive: true,
                // Match insurance type if found, OR get general offers (null)
                ...(insuranceType?.id
                    ? {
                        OR: [
                            { insuranceTypeId: insuranceType.id },
                            { insuranceTypeId: null },
                        ],
                    }
                    : { insuranceTypeId: null }
                ),
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' },
            ],
            include: {
                insuranceType: {
                    select: { id: true, name: true, slug: true }
                }
            }
        });

        if (!affiliate?.marketCallUrl) {
            return NextResponse.json({
                success: false,
                error: 'No affiliate offer available',
                fallbackUrl: '/get-quote'
            }, { status: 404 });
        }

        // Build redirect URL with tracking params
        let redirectUrl = affiliate.marketCallUrl;
        
        // Add tracking parameters
        const trackingParams = new URLSearchParams();
        if (zip) trackingParams.set('zip', zip);
        if (email) trackingParams.set('email', email);
        if (phone) trackingParams.set('phone', phone);
        if (affiliate.subId) trackingParams.set('subid', affiliate.subId);
        
        // Append params to URL
        const separator = redirectUrl.includes('?') ? '&' : '?';
        redirectUrl = `${redirectUrl}${separator}${trackingParams.toString()}`;

        return NextResponse.json({
            success: true,
            redirectUrl,
            affiliate: {
                id: affiliate.id,
                name: affiliate.name,
                insuranceType: affiliate.insuranceType?.name,
            }
        });

    } catch (error) {
        console.error('GET /api/redirect-offer error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to get offer'
        }, { status: 500 });
    }
}
