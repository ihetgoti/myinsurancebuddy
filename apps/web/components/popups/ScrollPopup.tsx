'use client';

import { useState, useEffect, useCallback } from 'react';
import PopupModal, { PopupConfig } from './PopupModal';

interface ScrollPopupProps {
    config: PopupConfig;
    enabled?: boolean;
}

const STORAGE_KEY_PREFIX = 'popup_shown_';

export default function ScrollPopup({ config, enabled = true }: ScrollPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    const scrollThreshold = config.scrollPercentage || 50;
    const storageKey = config.cookieKey || `${STORAGE_KEY_PREFIX}${config.id}`;

    // Check if popup was already shown
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const checkShownStatus = () => {
            if (config.showOncePerSession) {
                const shown = sessionStorage.getItem(storageKey);
                if (shown) {
                    setHasTriggered(true);
                    return true;
                }
            }

            if (config.showOncePerDay) {
                const lastShown = localStorage.getItem(storageKey);
                if (lastShown) {
                    const lastShownDate = new Date(lastShown);
                    const now = new Date();
                    const hoursDiff = (now.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60);
                    if (hoursDiff < 24) {
                        setHasTriggered(true);
                        return true;
                    }
                }
            }

            return false;
        };

        checkShownStatus();
    }, [config, storageKey]);

    // Track scroll position
    useEffect(() => {
        if (!enabled || hasTriggered || typeof window === 'undefined') return;

        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / scrollHeight) * 100;

            if (scrollPercent >= scrollThreshold && !hasTriggered) {
                setHasTriggered(true);

                // Apply delay if configured
                const delay = (config.delaySeconds || 0) * 1000;
                setTimeout(() => {
                    setIsOpen(true);

                    // Track popup impression
                    if ((window as any).gtag) {
                        (window as any).gtag('event', 'popup_impression', {
                            popup_id: config.id,
                            popup_type: 'scroll',
                            scroll_percentage: scrollThreshold
                        });
                    }

                    if ((window as any).dataLayer) {
                        (window as any).dataLayer.push({
                            event: 'popup_impression',
                            popupId: config.id,
                            popupType: 'scroll',
                            scrollPercentage: scrollThreshold
                        });
                    }

                    // Mark as shown
                    if (config.showOncePerSession) {
                        sessionStorage.setItem(storageKey, 'true');
                    }
                    if (config.showOncePerDay) {
                        localStorage.setItem(storageKey, new Date().toISOString());
                    }
                }, delay);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [enabled, hasTriggered, scrollThreshold, config, storageKey]);

    const handleClose = useCallback(() => {
        setIsOpen(false);

        // Track popup close
        if (typeof window !== 'undefined') {
            if ((window as any).gtag) {
                (window as any).gtag('event', 'popup_close', {
                    popup_id: config.id,
                    popup_type: 'scroll'
                });
            }

            if ((window as any).dataLayer) {
                (window as any).dataLayer.push({
                    event: 'popup_close',
                    popupId: config.id,
                    popupType: 'scroll'
                });
            }
        }
    }, [config.id]);

    if (!enabled) return null;

    return (
        <PopupModal
            config={config}
            isOpen={isOpen}
            onClose={handleClose}
        />
    );
}
