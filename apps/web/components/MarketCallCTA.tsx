import { getMarketCallOffer } from '@/lib/marketcallService';
import MarketCallCTAClient from './MarketCallCTAClient';

interface MarketCallCTAProps {
    insuranceTypeId?: string;
    stateId?: string;
    phoneNumber?: string; // Fallback phone
    variant?: 'phone' | 'form' | 'both'; // Display mode
    className?: string;
}

/**
 * Server component that automatically fetches and displays MarketCall offers
 * Shows phone number, form link, or both based on what's configured
 */
export default async function MarketCallCTA({
    insuranceTypeId,
    stateId,
    phoneNumber = '1-855-205-2412',
    variant = 'both',
    className = ''
}: MarketCallCTAProps) {
    // Automatically fetch matching offer
    const offer = await getMarketCallOffer({ insuranceTypeId, stateId });

    const displayPhone = offer?.phoneMask || phoneNumber;
    const campaignId = offer?.campaignId;
    const formUrl = offer?.formRedirectUrl;

    // If no offer found and no fallback, don't render
    if (!offer && !phoneNumber) {
        return null;
    }

    return (
        <MarketCallCTAClient
            displayPhone={displayPhone}
            campaignId={campaignId}
            formUrl={formUrl}
            variant={variant}
            className={className}
            insuranceTypeId={insuranceTypeId}
            stateId={stateId}
            offerName={offer?.name}
        />
    );
}
