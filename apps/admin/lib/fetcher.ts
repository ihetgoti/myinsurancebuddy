// SWR fetcher for API calls
export const fetcher = (url: string) => fetch(url).then(res => res.json());

// Cache keys for different data types
export const cacheKeys = {
    countries: '/api/countries',
    states: (params?: string) => `/api/states${params ? `?${params}` : ''}`,
    cities: (params?: string) => `/api/cities${params ? `?${params}` : ''}`,
    affiliates: '/api/affiliates',
};

// SWR options with reasonable defaults
export const swrConfig = {
    revalidateOnFocus: false, // Don't refetch when window regains focus
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
    errorRetryCount: 2,
};
