import { prisma } from '@/lib/prisma';

/**
 * Get the best matching MarketCall offer with phone number for a page
 * This matches by:
 * 1. Insurance type (car, home, etc.)
 * 2. State (California, Texas, etc.)
 * 
 * Returns the phone number and offer details
 */
export async function getMarketCallOffer(params: {
  insuranceTypeId?: string;
  stateId?: string;
  cityId?: string;
}) {
  const { insuranceTypeId, stateId, cityId } = params;

  try {
    // STEP 1: Try to find exact match (insurance type + state)
    if (insuranceTypeId && stateId) {
      const exactMatch = await prisma.callOffer.findFirst({
        where: {
          isActive: true,
          insuranceTypeId,
          stateIds: { has: stateId },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          insuranceType: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      if (exactMatch) {
        return {
          ...exactMatch,
          matchType: 'exact', // insurance + state
        };
      }
    }

    // STEP 2: Try insurance type match only (any state)
    if (insuranceTypeId) {
      const insuranceMatch = await prisma.callOffer.findFirst({
        where: {
          isActive: true,
          insuranceTypeId,
          stateIds: { isEmpty: true }, // Offers that work in all states
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          insuranceType: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      if (insuranceMatch) {
        return {
          ...insuranceMatch,
          matchType: 'insurance_only', // insurance type only
        };
      }
    }

    // STEP 3: Fallback - any active offer
    const fallback = await prisma.callOffer.findFirst({
      where: {
        isActive: true,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        insuranceType: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (fallback) {
      return {
        ...fallback,
        matchType: 'fallback', // any available offer
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching MarketCall offer:', error);
    return null;
  }
}

/**
 * Get phone number for display
 * This is what shows on the website pages
 */
export async function getPhoneNumber(params: {
  insuranceTypeId?: string;
  stateId?: string;
  cityId?: string;
}): Promise<string | null> {
  const offer = await getMarketCallOffer(params);
  
  if (offer?.phoneNumber) {
    return offer.phoneNumber;
  }
  
  // Fallback phone if no specific number
  return process.env.DEFAULT_PHONE_NUMBER || null;
}

/**
 * Get form redirect URL for leads
 */
export async function getFormRedirectUrl(params: {
  insuranceTypeId?: string;
  stateId?: string;
  cityId?: string;
}): Promise<string | null> {
  const offer = await getMarketCallOffer(params);
  return offer?.formRedirectUrl || null;
}

/**
 * Get all active offers for admin
 */
export async function getAllActiveOffers() {
  try {
    const offers = await prisma.callOffer.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' },
      include: {
        insuranceType: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return offers;
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
}

/**
 * Format phone number for display
 * (555) 123-4567 → +1 (555) 123-4567
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If 10 digits, add US country code
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // If 11 digits and starts with 1, format as US
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return as-is if doesn't match expected format
  return phone;
}
