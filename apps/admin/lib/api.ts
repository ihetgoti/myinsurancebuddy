// Get the base path for API calls
// The admin app runs on its own subdomain, so no prefix needed
export function getApiUrl(path: string): string {
    return path;
}

