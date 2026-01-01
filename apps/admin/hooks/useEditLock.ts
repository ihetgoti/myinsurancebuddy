import { useEffect, useCallback, useRef } from 'react';
import { getApiUrl } from '@/lib/api';

interface EditLockOptions {
    resourceType: 'template' | 'page';
    resourceId: string;
    enabled?: boolean;
    onLockConflict?: (lockedBy: string) => void;
}

export function useEditLock({
    resourceType,
    resourceId,
    enabled = true,
    onLockConflict
}: EditLockOptions) {
    const lockInterval = useRef<NodeJS.Timeout | null>(null);
    const hasLock = useRef(false);

    const acquireLock = useCallback(async () => {
        if (!enabled || !resourceId) return;

        try {
            const res = await fetch(getApiUrl('/api/edit-lock'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resourceType, resourceId, action: 'acquire' }),
            });

            const data = await res.json();

            if (data.success) {
                hasLock.current = true;
            } else if (data.locked && onLockConflict) {
                onLockConflict(data.lockedBy);
            }

            return data;
        } catch (error) {
            console.error('Failed to acquire edit lock:', error);
            return null;
        }
    }, [resourceType, resourceId, enabled, onLockConflict]);

    const releaseLock = useCallback(async () => {
        if (!enabled || !resourceId || !hasLock.current) return;

        try {
            await fetch(getApiUrl('/api/edit-lock'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resourceType, resourceId, action: 'release' }),
            });
            hasLock.current = false;
        } catch (error) {
            console.error('Failed to release edit lock:', error);
        }
    }, [resourceType, resourceId, enabled]);

    const checkLock = useCallback(async () => {
        if (!enabled || !resourceId) return null;

        try {
            const res = await fetch(
                getApiUrl(`/api/edit-lock?resourceType=${resourceType}&resourceId=${resourceId}`)
            );
            return await res.json();
        } catch (error) {
            console.error('Failed to check edit lock:', error);
            return null;
        }
    }, [resourceType, resourceId, enabled]);

    useEffect(() => {
        if (!enabled || !resourceId) return;

        // Acquire lock on mount
        acquireLock();

        // Refresh lock every 4 minutes (lock expires in 5)
        lockInterval.current = setInterval(() => {
            if (hasLock.current) {
                acquireLock();
            }
        }, 4 * 60 * 1000);

        // Release lock on unmount or page unload
        const handleUnload = () => releaseLock();
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            if (lockInterval.current) {
                clearInterval(lockInterval.current);
            }
            window.removeEventListener('beforeunload', handleUnload);
            releaseLock();
        };
    }, [resourceId, enabled, acquireLock, releaseLock]);

    return { acquireLock, releaseLock, checkLock, hasLock: () => hasLock.current };
}

// HTML Validation hook
export function useHtmlValidation() {
    const validateHtml = useCallback(async (html: string) => {
        try {
            const res = await fetch(getApiUrl('/api/validate-html'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html }),
            });
            return await res.json();
        } catch (error) {
            console.error('HTML validation failed:', error);
            return { valid: false, errors: ['Validation request failed'], warnings: [] };
        }
    }, []);

    const validateSections = useCallback(async (sections: any[]) => {
        try {
            const res = await fetch(getApiUrl('/api/validate-html'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections }),
            });
            return await res.json();
        } catch (error) {
            console.error('Sections validation failed:', error);
            return { valid: false, errors: ['Validation request failed'], warnings: [] };
        }
    }, []);

    return { validateHtml, validateSections };
}
