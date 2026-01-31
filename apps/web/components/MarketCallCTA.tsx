import { getMarketCallOffer } from '@/lib/marketcallService';
import MarketCallCTAClient from './MarketCallCTAClient';

interface MarketCallCTAProps {
    insuranceTypeId?: string;
    stateId?: string;
    phoneNumber?: string; // Fallback phone
    variant?: 'phone' | 'form' | 'both'; // Display mode
    className?: string;
    insuranceTypeName?: string; // For fallback form
    stateName?: string; // For fallback form
    cityName?: string; // For fallback form
}

/**
 * Server component that automatically fetches and displays MarketCall offers
 * Shows phone number, form link, or both based on what's configured
 * Falls back to lead form if no offer is available
 */
export default async function MarketCallCTA({
    insuranceTypeId,
    stateId,
    phoneNumber = '1-855-205-2412',
    variant = 'both',
    className = '',
    insuranceTypeName,
    stateName,
    cityName,
}: MarketCallCTAProps) {
    // Automatically fetch matching offer
    const offer = await getMarketCallOffer({ insuranceTypeId, stateId });

    const displayPhone = offer?.phoneNumber || phoneNumber;
    const campaignId = offer?.campaignId;
    const formUrl = offer?.formRedirectUrl;

    return (
        <MarketCallCTAClient
            displayPhone={displayPhone}
            campaignId={campaignId}
            formUrl={formUrl ?? undefined}
            variant={variant}
            className={className}
            insuranceTypeId={insuranceTypeId}
            stateId={stateId}
            offerName={offer?.name}
            hasOffer={!!offer}
            insuranceTypeName={insuranceTypeName || offer?.insuranceType?.name}
            stateName={stateName}
            cityName={cityName}
        />
    );
}
