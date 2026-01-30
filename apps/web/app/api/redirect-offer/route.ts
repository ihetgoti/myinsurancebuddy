import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/redirect-offer?insuranceType=car-insurance&state=california&zip=12345
 * Returns the best matching MarketCall offer redirect URL
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const insuranceTypeSlug = searchParams.get('insuranceType');
        const stateSlug = searchParams.get('state');
        const zip = searchParams.get('zip');
        const email = searchParams.get('email');

        // Find insurance type
        const insuranceType = insuranceTypeSlug 
            ? await prisma.insuranceType.findFirst({
                  where: { slug: insuranceTypeSlug, isActive: true },
                  select: { id: true, name: true, slug: true }
              })
            : null;

        // Find state
        const state = stateSlug
            ? await prisma.state.findFirst({
                  where: { slug: stateSlug, isActive: true },
                  select: { id: true, name: true, slug: true, code: true }
              })
            : null;

        // Find best matching offer
        // Priority: 1. Specific match (type + state), 2. Type match, 3. General match
        const offer = await prisma.callOffer.findFirst({
            where: {
                isActive: true,
                formRedirectUrl: { not: null },
                // If insurance type specified, match it OR get general offers
                ...(insuranceType?.id
                    ? {
                        OR: [
                            { insuranceTypeId: insuranceType.id },
                            { insuranceTypeId: null },
                        ],
                    }
                    : { insuranceTypeId: null } // Only general offers if no type specified
                ),
                // If state specified, match it OR get all-states offers
                ...(state?.id
                    ? {
                        OR: [
                            { stateIds: { has: state.id } },
                            { stateIds: { isEmpty: true } },
                        ],
                    }
                    : {}
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

        if (!offer || !offer.formRedirectUrl) {
            return NextResponse.json({
                success: false,
                error: 'No offer available for this location/type',
                fallbackUrl: '/get-quote'
            }, { status: 404 });
        }

        // Build redirect URL with parameters
        let redirectUrl = offer.formRedirectUrl;
        
        // Add tracking parameters
        const trackingParams = new URLSearchParams();
        if (zip) trackingParams.set('zip', zip);
        if (email) trackingParams.set('email', email);
        if (offer.subId) trackingParams.set('subid', offer.subId);
        if (offer.campaignId) trackingParams.set('campaign', offer.campaignId);
        
        // Append params to URL
        const separator = redirectUrl.includes('?') ? '&' : '?';
        redirectUrl = `${redirectUrl}${separator}${trackingParams.toString()}`;

        return NextResponse.json({
            success: true,
            redirectUrl,
            offer: {
                id: offer.id,
                name: offer.name,
                insuranceType: offer.insuranceType?.name,
                phoneMask: offer.phoneMask,
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
