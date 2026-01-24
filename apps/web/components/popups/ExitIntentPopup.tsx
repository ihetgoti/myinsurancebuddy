'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import PopupModal, { PopupConfig } from './PopupModal';

interface ExitIntentPopupProps {
    config: PopupConfig;
    enabled?: boolean;
    sensitivity?: number; // How far above viewport to trigger (default: 0)
}

const STORAGE_KEY_PREFIX = 'exit_popup_shown_';

export default function ExitIntentPopup({
    config,
    enabled = true,
    sensitivity = 0
}: ExitIntentPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Detect exit intent
    useEffect(() => {
        if (!enabled || hasTriggered || typeof window === 'undefined') return;

        // Desktop: Mouse leaves viewport from top
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= sensitivity && !hasTriggered) {
                triggerPopup();
            }
        };

        // Mobile: Back button or tab blur
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && !hasTriggered) {
                // Don't trigger immediately on mobile, might be accidental
                // Instead, show on next visit via session storage flag
                if (!hasTriggered) {
                    sessionStorage.setItem(`${storageKey}_pending`, 'true');
                }
            }
        };

        // Check for pending popup on mount (mobile return visit)
        const pendingPopup = sessionStorage.getItem(`${storageKey}_pending`);
        if (pendingPopup && !hasTriggered) {
            sessionStorage.removeItem(`${storageKey}_pending`);
            // Small delay to let page render
            setTimeout(() => triggerPopup(), 1000);
        }

        // Mobile: Detect rapid scroll up (back to top gesture)
        let lastScrollY = window.scrollY;
        let scrollVelocity = 0;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            scrollVelocity = lastScrollY - currentScrollY;
            lastScrollY = currentScrollY;

            // Rapid scroll up near top of page
            if (scrollVelocity > 50 && currentScrollY < 100 && !hasTriggered) {
                triggerPopup();
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('scroll', handleScroll);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled, hasTriggered, sensitivity, storageKey]);

    const triggerPopup = useCallback(() => {
        if (hasTriggered) return;

        setHasTriggered(true);

        // Apply delay if configured
        const delay = (config.delaySeconds || 0) * 1000;
        timeoutRef.current = setTimeout(() => {
            setIsOpen(true);

            // Track popup impression
            if (typeof window !== 'undefined') {
                if ((window as any).gtag) {
                    (window as any).gtag('event', 'popup_impression', {
                        popup_id: config.id,
                        popup_type: 'exit_intent'
                    });
                }

                if ((window as any).dataLayer) {
                    (window as any).dataLayer.push({
                        event: 'popup_impression',
                        popupId: config.id,
                        popupType: 'exit_intent'
                    });
                }
            }

            // Mark as shown
            if (config.showOncePerSession) {
                sessionStorage.setItem(storageKey, 'true');
            }
            if (config.showOncePerDay) {
                localStorage.setItem(storageKey, new Date().toISOString());
            }
        }, delay);
    }, [hasTriggered, config, storageKey]);

    const handleClose = useCallback(() => {
        setIsOpen(false);

        // Track popup close
        if (typeof window !== 'undefined') {
            if ((window as any).gtag) {
                (window as any).gtag('event', 'popup_close', {
                    popup_id: config.id,
                    popup_type: 'exit_intent'
                });
            }

            if ((window as any).dataLayer) {
                (window as any).dataLayer.push({
                    event: 'popup_close',
                    popupId: config.id,
                    popupType: 'exit_intent'
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
