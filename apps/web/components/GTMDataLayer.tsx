'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

interface GTMDataLayerProps {
    pageType?: string;
    insuranceType?: string | null;
    stateName?: string | null;
    stateCode?: string | null;
    cityName?: string | null;
}

// Event tracking utilities
export const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
    if (typeof window !== 'undefined') {
        // Push to dataLayer for GTM
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: eventName,
            ...eventData,
            timestamp: new Date().toISOString()
        });

        // Also send to GA4 if available
        if (window.gtag) {
            window.gtag('event', eventName, eventData);
        }
    }
};

// Pre-defined event trackers
export const trackPhoneClick = (phoneNumber: string, source: string) => {
    trackEvent('phone_click', {
        phone_number: phoneNumber,
        click_source: source,
        event_category: 'lead_generation',
        event_label: `Phone: ${phoneNumber}`
    });
};

export const trackCTAClick = (ctaText: string, ctaUrl: string, position: string) => {
    trackEvent('cta_click', {
        cta_text: ctaText,
        cta_url: ctaUrl,
        cta_position: position,
        event_category: 'engagement'
    });
};

export const trackFormSubmit = (formName: string, formData: Record<string, any>) => {
    trackEvent('form_submit', {
        form_name: formName,
        ...formData,
        event_category: 'lead_generation'
    });
};

export const trackAffiliateClick = (partnerName: string, affiliateUrl: string) => {
    trackEvent('affiliate_click', {
        partner_name: partnerName,
        affiliate_url: affiliateUrl,
        event_category: 'affiliate'
    });
};

export const trackScrollDepth = (depth: number) => {
    trackEvent('scroll_depth', {
        depth_percentage: depth,
        event_category: 'engagement'
    });
};

export const trackPopupImpression = (popupId: string, popupType: string) => {
    trackEvent('popup_impression', {
        popup_id: popupId,
        popup_type: popupType,
        event_category: 'engagement'
    });
};

export const trackPopupClick = (popupId: string, popupType: string, ctaUrl: string) => {
    trackEvent('popup_cta_click', {
        popup_id: popupId,
        popup_type: popupType,
        cta_url: ctaUrl,
        event_category: 'lead_generation'
    });
};

export const trackPopupClose = (popupId: string, popupType: string) => {
    trackEvent('popup_close', {
        popup_id: popupId,
        popup_type: popupType,
        event_category: 'engagement'
    });
};

// Component to initialize data layer with page context
export default function GTMDataLayer({
    pageType,
    insuranceType,
    stateName,
    stateCode,
    cityName
}: GTMDataLayerProps) {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Initialize dataLayer if not present
        window.dataLayer = window.dataLayer || [];

        // Push page context data
        window.dataLayer.push({
            event: 'page_context',
            page_type: pageType || 'general',
            insurance_type: insuranceType || null,
            state_name: stateName || null,
            state_code: stateCode || null,
            city_name: cityName || null,
            page_path: pathname
        });
    }, [pathname, pageType, insuranceType, stateName, stateCode, cityName]);

    // Track scroll depth
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const scrollDepths = [25, 50, 75, 90];
        const trackedDepths = new Set<number>();

        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

            scrollDepths.forEach(depth => {
                if (scrollPercent >= depth && !trackedDepths.has(depth)) {
                    trackedDepths.add(depth);
                    trackScrollDepth(depth);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    // Track time on page
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const startTime = Date.now();
        const timeCheckpoints = [30, 60, 120, 300]; // seconds
        const trackedTimes = new Set<number>();

        const checkTime = () => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timeCheckpoints.forEach(checkpoint => {
                if (elapsed >= checkpoint && !trackedTimes.has(checkpoint)) {
                    trackedTimes.add(checkpoint);
                    trackEvent('time_on_page', {
                        seconds: checkpoint,
                        event_category: 'engagement'
                    });
                }
            });
        };

        const interval = setInterval(checkTime, 5000);
        return () => clearInterval(interval);
    }, [pathname]);

    return null;
}
