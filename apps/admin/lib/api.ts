// Get the base path for API calls
// In production, the admin app runs at /admin, so API calls need to be prefixed
export function getApiUrl(path: string): string {
    const basePath = process.env.NODE_ENV === 'production' ? '/admin' : '';
    return `${basePath}${path}`;
}
