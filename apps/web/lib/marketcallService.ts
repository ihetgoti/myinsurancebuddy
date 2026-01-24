import { prisma } from '@/lib/prisma';

/**
 * Get the best matching MarketCall offer for a page
 * Automatically matches by insurance type and state
 */
export async function getMarketCallOffer(params: {
    insuranceTypeId?: string;
    stateId?: string;
}) {
    const { insuranceTypeId, stateId } = params;

    if (!insuranceTypeId && !stateId) {
        return null;
    }

    try {
        // Find matching offers, ordered by priority
        const offer = await prisma.callOffer.findFirst({
            where: {
                isActive: true,
                // Match insurance type if provided
                ...(insuranceTypeId
                    ? {
                        OR: [
                            { insuranceTypeId },
                            { insuranceTypeId: null }, // Fallback to general offers
                        ],
                    }
                    : {}),
                // Match state if in stateIds array
                ...(stateId
                    ? {
                        OR: [
                            { stateIds: { has: stateId } },
                            { stateIds: { isEmpty: true } }, // Fallback to all-states offers
                        ],
                    }
                    : {}),
            },
            orderBy: [
                { priority: 'desc' }, // Higher priority first
                { createdAt: 'desc' }, // Newer offers first as tiebreaker
            ],
            include: {
                insuranceType: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        return offer;
    } catch (error) {
        console.error('Error fetching MarketCall offer:', error);
        return null;
    }
}

/**
 * Get all active offers for admin preview/testing
 */
export async function getAllActiveOffers() {
    try {
        const offers = await prisma.callOffer.findMany({
            where: { isActive: true },
            orderBy: { priority: 'desc' },
            include: {
                insuranceType: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        return offers;
    } catch (error) {
        console.error('Error fetching offers:', error);
        return [];
    }
}
