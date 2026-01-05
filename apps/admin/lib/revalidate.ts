/**
 * Triggers On-Demand Revalidation on the Web app.
 */
export async function revalidateWebPath(path: string) {
    // Default to localhost:3000 if not set (for dev)
    // In prod, this should be the public URL of the web app
    const webUrl = process.env.WEB_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const secret = process.env.REVALIDATION_SECRET;

    if (!secret) {
        console.warn('[Revalidate] REVALIDATION_SECRET not set, skipping revalidation for:', path);
        return;
    }

    try {
        const url = `${webUrl}/api/revalidate?path=${encodeURIComponent(path)}&secret=${secret}`;
        console.log(`[Revalidate] Triggering revalidation for: ${path}`);

        const res = await fetch(url, { method: 'POST' });

        if (!res.ok) {
            console.error(`[Revalidate] Failed: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.error(`[Revalidate] Response: ${text}`);
        } else {
            console.log(`[Revalidate] Success for: ${path}`);
        }
    } catch (error) {
        console.error('[Revalidate] Network error:', error);
    }
}
