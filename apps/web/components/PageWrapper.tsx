'use client';

import { ReactNode } from 'react';
import PopupProvider from './popups/PopupProvider';
import GTMDataLayer from './GTMDataLayer';
import { PopupConfig } from './popups/PopupModal';

interface PageWrapperProps {
    children: ReactNode;
    // Page context for tracking and popup targeting
    pageType?: string;
    insuranceType?: string | null;
    insuranceTypeSlug?: string | null;
    stateName?: string | null;
    stateCode?: string | null;
    stateId?: string | null;
    cityName?: string | null;
    // Popup configuration (fetched server-side or use defaults)
    popupConfigs?: PopupConfig[];
    enablePopups?: boolean;
}

export default function PageWrapper({
    children,
    pageType = 'insurance',
    insuranceType,
    insuranceTypeSlug,
    stateName,
    stateCode,
    stateId,
    cityName,
    popupConfigs,
    enablePopups = true
}: PageWrapperProps) {
    // Generate default popup configs if none provided
    const defaultConfigs = getDefaultPopupConfigs({
        insuranceType,
        insuranceTypeSlug,
        stateName,
        stateCode
    });

    const configs = popupConfigs || defaultConfigs;

    return (
        <>
            {/* GTM Data Layer for tracking */}
            <GTMDataLayer
                pageType={pageType}
                insuranceType={insuranceType}
                stateName={stateName}
                stateCode={stateCode}
                cityName={cityName}
            />

            {/* Popup Provider */}
            <PopupProvider
                popupConfigs={enablePopups ? configs : []}
                enabled={enablePopups}
                pageType={pageType}
                insuranceType={insuranceTypeSlug}
                stateCode={stateCode}
            >
                {children}
            </PopupProvider>
        </>
    );
}

// Generate default popup configurations based on page context
function getDefaultPopupConfigs(context: {
    insuranceType?: string | null;
    insuranceTypeSlug?: string | null;
    stateName?: string | null;
    stateCode?: string | null;
}): PopupConfig[] {
    const { insuranceType, insuranceTypeSlug, stateName } = context;

    // Determine accent color based on insurance type
    let accentColor: 'blue' | 'emerald' | 'orange' | 'purple' = 'blue';
    if (insuranceTypeSlug === 'health-insurance') {
        accentColor = 'emerald';
    } else if (insuranceTypeSlug === 'home-insurance' || insuranceTypeSlug === 'homeowners-insurance') {
        accentColor = 'purple';
    } else if (insuranceTypeSlug === 'car-insurance') {
        accentColor = 'blue';
    }

    const locationText = stateName ? ` in ${stateName}` : '';
    const insuranceName = insuranceType || 'Insurance';

    // Scroll-triggered popup (shows at 50% scroll)
    const scrollPopup: PopupConfig = {
        id: `scroll-popup-${insuranceTypeSlug || 'default'}`,
        type: 'scroll',
        title: `Get Your Free ${insuranceName} Quote!`,
        subtitle: `Save up to $500/year${locationText}`,
        description: 'Compare rates from 100+ top providers. Licensed agents available to help you find the best coverage.',
        ctaText: 'Call Now for Free Quote',
        ctaUrl: 'tel:18552052412',
        phoneNumber: '1-855-205-2412',
        badgeText: 'Limited Time Offer',
        accentColor,
        showTrustBadges: true,
        scrollPercentage: 50,
        showOncePerSession: true,
        position: 'center',
        size: 'md'
    };

    // Exit intent popup
    const exitPopup: PopupConfig = {
        id: `exit-popup-${insuranceTypeSlug || 'default'}`,
        type: 'exit_intent',
        title: 'Wait! Before You Go...',
        subtitle: `Don't Miss Out on Savings${locationText}`,
        description: `Get a free ${insuranceName.toLowerCase()} quote in just 2 minutes. No obligation, no credit card required.`,
        ctaText: 'Get My Free Quote',
        ctaUrl: 'tel:18552052412',
        phoneNumber: '1-855-205-2412',
        badgeText: 'Exclusive Offer',
        accentColor: 'orange',
        showTrustBadges: true,
        showOncePerSession: true,
        position: 'center',
        size: 'md'
    };

    return [scrollPopup, exitPopup];
}

// Export helper for server-side popup fetching
export async function fetchPopupConfigs(options: {
    pageType?: string;
    insuranceType?: string;
    stateCode?: string;
    pageSlug?: string;
}): Promise<PopupConfig[]> {
    try {
        const params = new URLSearchParams();
        if (options.pageType) params.append('pageType', options.pageType);
        if (options.insuranceType) params.append('insuranceType', options.insuranceType);
        if (options.stateCode) params.append('stateCode', options.stateCode);
        if (options.pageSlug) params.append('pageSlug', options.pageSlug);

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/popups?${params.toString()}`, {
            cache: 'no-store'
        });

        if (response.ok) {
            const data = await response.json();
            return data.popups || [];
        }
    } catch (error) {
        console.error('Failed to fetch popup configs:', error);
    }

    return [];
}
