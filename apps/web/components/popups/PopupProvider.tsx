'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ScrollPopup from './ScrollPopup';
import ExitIntentPopup from './ExitIntentPopup';
import TimedPopup from './TimedPopup';
import { PopupConfig } from './PopupModal';

interface PopupContextValue {
    popups: PopupConfig[];
    isEnabled: boolean;
    triggerCustomPopup: (popupId: string) => void;
}

const PopupContext = createContext<PopupContextValue>({
    popups: [],
    isEnabled: true,
    triggerCustomPopup: () => {}
});

export const usePopups = () => useContext(PopupContext);

interface PopupProviderProps {
    children: ReactNode;
    popupConfigs?: PopupConfig[];
    enabled?: boolean;
    // Page-specific overrides
    pageType?: string; // 'insurance', 'blog', 'landing', etc.
    insuranceType?: string | null; // 'auto', 'health', 'home'
    stateCode?: string | null; // 'CA', 'TX', etc.
}

export default function PopupProvider({
    children,
    popupConfigs = [],
    enabled = true,
    pageType,
    insuranceType,
    stateCode
}: PopupProviderProps) {
    const [popups, setPopups] = useState<PopupConfig[]>(popupConfigs);
    const [customPopupOpen, setCustomPopupOpen] = useState<string | null>(null);

    // Optionally fetch popup configs from API
    useEffect(() => {
        if (popupConfigs.length === 0 && enabled) {
            // Fetch from API if no configs provided
            fetchPopupConfigs();
        }
    }, [popupConfigs, enabled]);

    const fetchPopupConfigs = async () => {
        try {
            const params = new URLSearchParams();
            if (pageType) params.append('pageType', pageType);
            if (insuranceType) params.append('insuranceType', insuranceType);
            if (stateCode) params.append('stateCode', stateCode);

            const response = await fetch(`/api/popups?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setPopups(data.popups || []);
            }
        } catch (error) {
            console.error('Failed to fetch popup configs:', error);
        }
    };

    const triggerCustomPopup = (popupId: string) => {
        setCustomPopupOpen(popupId);
    };

    // Filter popups by type
    const scrollPopups = popups.filter(p => p.type === 'scroll');
    const exitPopups = popups.filter(p => p.type === 'exit_intent');
    const timedPopups = popups.filter(p => p.type === 'timed');

    return (
        <PopupContext.Provider value={{ popups, isEnabled: enabled, triggerCustomPopup }}>
            {children}

            {/* Render popup components based on type */}
            {enabled && (
                <>
                    {scrollPopups.map(popup => (
                        <ScrollPopup
                            key={popup.id}
                            config={popup}
                            enabled={enabled}
                        />
                    ))}

                    {exitPopups.map(popup => (
                        <ExitIntentPopup
                            key={popup.id}
                            config={popup}
                            enabled={enabled}
                        />
                    ))}

                    {timedPopups.map(popup => (
                        <TimedPopup
                            key={popup.id}
                            config={popup}
                            enabled={enabled}
                        />
                    ))}
                </>
            )}
        </PopupContext.Provider>
    );
}

// Server component wrapper to fetch popup configs
export async function getPopupConfigs(options?: {
    pageType?: string;
    insuranceType?: string;
    stateCode?: string;
}): Promise<PopupConfig[]> {
    // This would be called server-side to fetch popup configs
    // For now, return default configs based on insurance type
    const { insuranceType, stateCode } = options || {};

    const defaultScrollPopup: PopupConfig = {
        id: 'default-scroll-popup',
        type: 'scroll',
        title: "Don't Leave Without Your Free Quote!",
        subtitle: 'Save up to $500/year on insurance',
        description: 'Speak with a licensed agent and get personalized quotes from top providers.',
        ctaText: 'Get My Free Quote',
        ctaUrl: '/get-quote',
        phoneNumber: '1-855-205-2412',
        badgeText: 'Limited Time Offer',
        accentColor: 'blue',
        showTrustBadges: true,
        scrollPercentage: 50,
        showOncePerSession: true,
        position: 'center',
        size: 'md'
    };

    const defaultExitPopup: PopupConfig = {
        id: 'default-exit-popup',
        type: 'exit_intent',
        title: 'Wait! Before You Go...',
        subtitle: 'Get a Free Insurance Quote in 2 Minutes',
        description: 'Compare rates from 100+ top providers. No commitment required.',
        ctaText: 'Call Now for Free Quote',
        ctaUrl: 'tel:18552052412',
        phoneNumber: '1-855-205-2412',
        badgeText: 'Exclusive Offer',
        accentColor: 'orange',
        showTrustBadges: true,
        showOncePerSession: true,
        position: 'center',
        size: 'md'
    };

    // Customize based on insurance type
    if (insuranceType === 'auto') {
        defaultScrollPopup.title = 'Get Your Free Auto Insurance Quote!';
        defaultScrollPopup.subtitle = 'Save up to $600/year on car insurance';
        defaultExitPopup.title = 'Wait! Auto Insurance Rates Just Dropped';
    } else if (insuranceType === 'health') {
        defaultScrollPopup.title = 'Find Affordable Health Coverage Today!';
        defaultScrollPopup.subtitle = 'See if you qualify for subsidies';
        defaultScrollPopup.accentColor = 'emerald';
        defaultExitPopup.title = "Don't Miss Open Enrollment!";
        defaultExitPopup.accentColor = 'emerald';
    } else if (insuranceType === 'home') {
        defaultScrollPopup.title = 'Protect Your Home - Get a Free Quote!';
        defaultScrollPopup.subtitle = 'Compare rates from top home insurers';
        defaultScrollPopup.accentColor = 'purple';
        defaultExitPopup.title = 'Home Insurance Rates Are Lower Than Ever';
        defaultExitPopup.accentColor = 'purple';
    }

    // Add state name if available
    if (stateCode) {
        defaultScrollPopup.description = `Compare rates from top insurance providers in your area. Licensed agents available now.`;
    }

    return [defaultScrollPopup, defaultExitPopup];
}
