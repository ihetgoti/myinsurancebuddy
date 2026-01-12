import { prisma } from '@/lib/prisma';
import { Phone, PhoneCall } from 'lucide-react';

interface MarketcallCTAProps {
    insuranceTypeId?: string;
    stateId?: string;
    phoneNumber?: string; // Fallback phone
    className?: string;
}

// Server component that fetches the appropriate call offer
export default async function MarketcallCTA({
    insuranceTypeId,
    stateId,
    phoneNumber = '1-855-205-2412',
    className = ''
}: MarketcallCTAProps) {
    // Try to find matching call offer
    let callOffer = null;

    if (insuranceTypeId || stateId) {
        callOffer = await prisma.callOffer.findFirst({
            where: {
                isActive: true,
                // Match by insurance type if provided
                ...(insuranceTypeId ? { insuranceTypeId } : {}),
                // Match by state if in stateIds array
                ...(stateId ? { stateIds: { has: stateId } } : {}),
            },
            orderBy: { priority: 'desc' },
        });
    }

    const displayPhone = callOffer?.phoneMask || phoneNumber;
    const campaignId = callOffer?.campaignId;

    return (
        <div className={`bg-blue-600 text-white rounded-xl p-4 ${className}`}>
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <PhoneCall size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-blue-100">Speak with a Licensed Agent</p>
                    <a
                        href={`tel:${displayPhone.replace(/[^0-9]/g, '')}`}
                        className="text-2xl font-bold hover:text-blue-100 transition-colors"
                        data-campaign-id={campaignId}
                    >
                        {displayPhone}
                    </a>
                </div>
            </div>
            <button
                className="w-full mt-3 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg
                         hover:bg-blue-50 transition-colors"
            >
                Call Now for Free Quote
            </button>

            {/* Marketcall tracking script placeholder */}
            {campaignId && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                if (typeof window.marketcall === 'undefined') {
                                    window.marketcall = { campaign: '${campaignId}' };
                                }
                            })();
                        `,
                    }}
                />
            )}
        </div>
    );
}
