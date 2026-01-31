/**
 * Marketcall API Integration
 * Fetches phone numbers and offers from Marketcall
 */

const MARKETCALL_API_BASE = 'https://www.marketcall.com/api/v1/affiliate';

interface MarketcallConfig {
  apiKey: string;
}

/**
 * Get all phone numbers from Marketcall
 * These are the tracking numbers assigned to your account
 */
export async function getMarketcallPhones(config: MarketcallConfig) {
  try {
    const response = await fetch(`${MARKETCALL_API_BASE}/phones`, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Marketcall API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || []; // Returns array of { id, phone_number, program_id, date_from, date_to }
  } catch (error) {
    console.error('Failed to fetch Marketcall phones:', error);
    throw error;
  }
}

/**
 * Get all offers from Marketcall
 * These show which niches (insurance types) are available and in which states
 */
export async function getMarketcallOffers(config: MarketcallConfig, filters?: {
  categories?: number[];  // Insurance type IDs in Marketcall
  regions?: number[];     // State/region IDs in Marketcall
  types?: number[];       // 1=Calls, 2=Leads
  state?: number[];       // 1=Active, 2=Paused, etc.
}) {
  try {
    // Build query params
    const params = new URLSearchParams();
    if (filters?.categories?.length) filters.categories.forEach(c => params.append('categories[]', c.toString()));
    if (filters?.regions?.length) filters.regions.forEach(r => params.append('regions[]', r.toString()));
    if (filters?.types?.length) filters.types.forEach(t => params.append('types[]', t.toString()));
    if (filters?.state?.length) filters.state.forEach(s => params.append('state[]', s.toString()));

    const url = `${MARKETCALL_API_BASE}/offers?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Marketcall API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || []; // Returns array of offers
  } catch (error) {
    console.error('Failed to fetch Marketcall offers:', error);
    throw error;
  }
}

/**
 * Get all programs (your active campaigns)
 * Programs connect offers to your account
 */
export async function getMarketcallPrograms(config: MarketcallConfig) {
  try {
    const response = await fetch(`${MARKETCALL_API_BASE}/programs`, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Marketcall API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || []; // Returns array of programs
  } catch (error) {
    console.error('Failed to fetch Marketcall programs:', error);
    throw error;
  }
}

/**
 * Get regions (states) list from Marketcall
 * This maps Marketcall region IDs to state names
 */
export async function getMarketcallRegions(config: MarketcallConfig) {
  try {
    const response = await fetch(`${MARKETCALL_API_BASE}/regions`, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Marketcall API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || []; // Returns array of { id, name }
  } catch (error) {
    console.error('Failed to fetch Marketcall regions:', error);
    throw error;
  }
}

/**
 * Get categories (insurance types) from Marketcall
 */
export async function getMarketcallCategories(config: MarketcallConfig) {
  try {
    const response = await fetch(`${MARKETCALL_API_BASE}/categories`, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Marketcall API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || []; // Returns array of { id, name }
  } catch (error) {
    console.error('Failed to fetch Marketcall categories:', error);
    throw error;
  }
}

/**
 * Get promo tools (form URLs, landing pages)
 */
export async function getMarketcallPromoTools(config: MarketcallConfig, filters?: {
  programs?: number[];
  offers?: number[];
}) {
  try {
    const params = new URLSearchParams();
    if (filters?.programs?.length) filters.programs.forEach(p => params.append('programs[]', p.toString()));
    if (filters?.offers?.length) filters.offers.forEach(o => params.append('offers[]', o.toString()));

    const url = `${MARKETCALL_API_BASE}/promo?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Marketcall API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || []; // Returns promotional tools including form URLs
  } catch (error) {
    console.error('Failed to fetch Marketcall promo tools:', error);
    throw error;
  }
}
