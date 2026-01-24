'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import PopupModal, { PopupConfig } from './PopupModal';

interface TimedPopupProps {
    config: PopupConfig;
    enabled?: boolean;
}

const STORAGE_KEY_PREFIX = 'timed_popup_shown_';

export default function TimedPopup({ config, enabled = true }: TimedPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const delaySeconds = config.delaySeconds || 30; // Default 30 seconds
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

    // Set timer
    useEffect(() => {
        if (!enabled || hasTriggered || typeof window === 'undefined') return;

        timeoutRef.current = setTimeout(() => {
            setHasTriggered(true);
            setIsOpen(true);

            // Track popup impression
            if ((window as any).gtag) {
                (window as any).gtag('event', 'popup_impression', {
                    popup_id: config.id,
                    popup_type: 'timed',
                    delay_seconds: delaySeconds
                });
            }

            if ((window as any).dataLayer) {
                (window as any).dataLayer.push({
                    event: 'popup_impression',
                    popupId: config.id,
                    popupType: 'timed',
                    delaySeconds: delaySeconds
                });
            }

            // Mark as shown
            if (config.showOncePerSession) {
                sessionStorage.setItem(storageKey, 'true');
            }
            if (config.showOncePerDay) {
                localStorage.setItem(storageKey, new Date().toISOString());
            }
        }, delaySeconds * 1000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled, hasTriggered, delaySeconds, config, storageKey]);

    const handleClose = useCallback(() => {
        setIsOpen(false);

        // Track popup close
        if (typeof window !== 'undefined') {
            if ((window as any).gtag) {
                (window as any).gtag('event', 'popup_close', {
                    popup_id: config.id,
                    popup_type: 'timed'
                });
            }

            if ((window as any).dataLayer) {
                (window as any).dataLayer.push({
                    event: 'popup_close',
                    popupId: config.id,
                    popupType: 'timed'
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
