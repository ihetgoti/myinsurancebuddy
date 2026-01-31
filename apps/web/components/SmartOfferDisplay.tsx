import { prisma } from '@/lib/prisma';
import MarketCallCTA from './MarketCallCTA';
import FallbackLeadForm from './FallbackLeadForm';

interface SmartOfferDisplayProps {
  insuranceTypeId?: string;
  stateId?: string;
  cityId?: string;
  stateName?: string;
  cityName?: string;
  insuranceTypeName?: string;
  className?: string;
}

/**
 * Smart Offer Display
 * Shows Marketcall offer if available, otherwise shows fallback lead form
 * 
 * Logic:
 * 1. Check if there's an active Marketcall offer for this niche + location
 * 2. If YES → Show Marketcall CTA (phone/form)
 * 3. If NO → Show FallbackLeadForm (collect email, phone, zip)
 */
export default async function SmartOfferDisplay({
  insuranceTypeId,
  stateId,
  cityId,
  stateName,
  cityName,
  insuranceTypeName,
  className = '',
}: SmartOfferDisplayProps) {
  
  // Check for Marketcall offer
  const offer = await prisma.callOffer.findFirst({
    where: {
      isActive: true,
      OR: [
        // Match by insurance type and state
        {
          insuranceTypeId: insuranceTypeId || undefined,
          stateIds: stateId ? { has: stateId } : undefined,
        },
        // Or match insurance type only (all states)
        {
          insuranceTypeId: insuranceTypeId || undefined,
          stateIds: { isEmpty: true },
        },
        // Or any active offer as fallback
        {},
      ],
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' },
    ],
    include: {
      insuranceType: {
        select: { name: true },
      },
    },
  });

  const hasValidOffer = offer && (offer.scriptUrl || offer.scriptCode || offer.formRedirectUrl || offer.phoneNumber);

  // If we have a valid offer, show Marketcall CTA
  if (hasValidOffer) {
    return (
      <MarketCallCTA
        insuranceTypeId={insuranceTypeId}
        stateId={stateId}
        className={className}
      />
    );
  }

  // No offer available - show fallback lead form
  return (
    <FallbackLeadForm
      insuranceType={insuranceTypeName || offer?.insuranceType?.name || 'Insurance'}
      state={stateName}
      city={cityName}
    />
  );
}
