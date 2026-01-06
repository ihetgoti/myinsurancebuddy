import React from 'react';

interface AdUnitProps {
    slot: string;
    className?: string;
    format?: 'horizontal' | 'rectangle' | 'vertical' | 'responsive';
    adsenseId?: string | null;
    adSlotId?: string | null;
    showAds?: boolean;
}

export default function AdUnit({
    slot,
    className = '',
    format = 'horizontal',
    adsenseId,
    adSlotId,
    showAds = true
}: AdUnitProps) {
    // Don't render if ads are disabled
    if (!showAds) {
        return null;
    }

    // If we have AdSense configuration, render real ad
    if (adsenseId && adSlotId) {
        const getAdSize = () => {
            switch (format) {
                case 'horizontal':
                    return { width: 728, height: 90 };
                case 'rectangle':
                    return { width: 300, height: 250 };
                case 'vertical':
                    return { width: 160, height: 600 };
                default:
                    return { width: 'auto', height: 'auto' };
            }
        };

        const size = getAdSize();
        const isResponsive = format === 'responsive' || size.width === 'auto';

        return (
            <div className={`ad-unit ${className}`}>
                <ins
                    className="adsbygoogle"
                    style={{
                        display: 'block',
                        width: isResponsive ? '100%' : `${size.width}px`,
                        height: isResponsive ? 'auto' : `${size.height}px`,
                    }}
                    data-ad-client={adsenseId}
                    data-ad-slot={adSlotId}
                    data-ad-format={isResponsive ? 'auto' : undefined}
                    data-full-width-responsive={isResponsive ? 'true' : undefined}
                />
            </div>
        );
    }

    // Fallback: Render placeholder in development
    return (
        <div className={`ad-unit group relative overflow-hidden bg-gray-50 border border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs text-center p-4 ${className}`}>
            <div className="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[10px] px-1">AD</div>
            <span className="font-semibold mb-1 opacity-50">Advertisement Space</span>
            <span className="opacity-50 font-mono text-[10px]">{slot}</span>

            {/* Simulation of ad size - purely visual */}
            <div className="mt-2 opacity-20 bg-current">
                {format === 'horizontal' && <div className="w-[320px] sm:w-[728px] h-[50px] sm:h-[90px]" />}
                {format === 'rectangle' && <div className="w-[300px] h-[250px]" />}
                {format === 'vertical' && <div className="w-[160px] h-[600px]" />}
                {format === 'responsive' && <div className="w-full h-32" />}
            </div>
        </div>
    );
}
