/**
 * Presets for Quick Page Generation
 * Pre-configured generation jobs that work out of the box
 */

export interface GenerationPreset {
    id: string;
    name: string;
    description: string;
    icon: string;
    estimatedPages: string;
    action: PresetAction;
    requiresInsuranceType: boolean;
    requiresState?: boolean;
}

export type PresetAction =
    | 'ALL_STATES'
    | 'ALL_CITIES'
    | 'STATE_CITIES'
    | 'INSURANCE_MATRIX'
    | 'TOP_CITIES'
    | 'MAJOR_METROS';

export const GENERATION_PRESETS: GenerationPreset[] = [
    {
        id: 'all-states',
        name: 'All US States',
        description: 'Generate pages for all 50 US states',
        icon: '🗺️',
        estimatedPages: '50 pages',
        action: 'ALL_STATES',
        requiresInsuranceType: true,
    },
    {
        id: 'all-cities',
        name: 'All Cities',
        description: 'Generate pages for every city in the database',
        icon: '🏙️',
        estimatedPages: '~30,000 pages',
        action: 'ALL_CITIES',
        requiresInsuranceType: true,
    },
    {
        id: 'state-cities',
        name: 'Cities in State',
        description: 'Generate pages for all cities in a specific state',
        icon: '📍',
        estimatedPages: '500-2000 pages',
        action: 'STATE_CITIES',
        requiresInsuranceType: true,
        requiresState: true,
    },
    {
        id: 'top-cities',
        name: 'Top 500 Cities',
        description: 'Generate pages for the 500 largest cities by population',
        icon: '⭐',
        estimatedPages: '500 pages',
        action: 'TOP_CITIES',
        requiresInsuranceType: true,
    },
    {
        id: 'major-metros',
        name: 'Major Metro Areas',
        description: 'Generate pages for major metropolitan areas',
        icon: '🌆',
        estimatedPages: '~100 pages',
        action: 'MAJOR_METROS',
        requiresInsuranceType: true,
    },
    {
        id: 'insurance-matrix',
        name: 'Insurance Matrix',
        description: 'Generate all insurance types × all states',
        icon: '📊',
        estimatedPages: '~500 pages',
        action: 'INSURANCE_MATRIX',
        requiresInsuranceType: false,
    },
];

/**
 * Default SEO templates for auto-generation
 */
export const SEO_TEMPLATES = {
    state: {
        titleTemplate: '{{insurance_type}} in {{state}} | Compare Rates & Save',
        descTemplate: 'Compare the best {{insurance_type_lower}} options in {{state}}. Get free quotes, compare rates from top providers, and save up to 40% on your policy.',
        h1Template: 'Best {{insurance_type}} in {{state}}',
    },
    city: {
        titleTemplate: '{{insurance_type}} in {{city}}, {{state_code}} | Local Rates & Quotes',
        descTemplate: 'Find affordable {{insurance_type_lower}} in {{city}}, {{state}}. Compare local rates, get free quotes, and save on coverage today.',
        h1Template: '{{insurance_type}} in {{city}}, {{state_code}}',
    },
    comparison: {
        titleTemplate: 'Compare {{insurance_type}} in {{location}} | Side-by-Side Rates',
        descTemplate: 'Compare {{insurance_type_lower}} providers in {{location}}. See side-by-side rates, coverage options, and customer reviews.',
        h1Template: 'Compare {{insurance_type}} Providers in {{location}}',
    },
};

/**
 * Default slug patterns for different page types
 */
export const SLUG_PATTERNS = {
    state: '{{insurance_type_slug}}/{{state_slug}}',
    city: '{{insurance_type_slug}}/{{state_slug}}/{{city_slug}}',
    comparison: '{{insurance_type_slug}}/compare/{{location_slug}}',
    niche: '{{insurance_type_slug}}',
};

/**
 * Get estimated page count for a preset
 */
export function getEstimatedCount(action: PresetAction, context?: { stateId?: string }): string {
    switch (action) {
        case 'ALL_STATES':
            return '50';
        case 'ALL_CITIES':
            return '~30,000';
        case 'STATE_CITIES':
            return '500-2000';
        case 'TOP_CITIES':
            return '500';
        case 'MAJOR_METROS':
            return '~100';
        case 'INSURANCE_MATRIX':
            return '~500';
        default:
            return 'Unknown';
    }
}
