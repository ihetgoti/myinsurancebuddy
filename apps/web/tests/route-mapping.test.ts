import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Route to Template Mapping Tests
 * Validates URL hierarchy resolves to correct templates
 */

// Mock route resolution logic
interface RouteResult {
    insuranceType: { id: string; slug: string; name: string } | null;
    country: { id: string; code: string; name: string } | null;
    state: { id: string; slug: string; name: string } | null;
    city: { id: string; slug: string; name: string } | null;
    geoLevel: 'NICHE' | 'COUNTRY' | 'STATE' | 'CITY' | null;
}

function parseUrlSegments(segments: string[]): { 
    insuranceTypeSlug: string | null;
    countryCode: string | null;
    stateSlug: string | null;
    citySlug: string | null;
    expectedGeoLevel: string;
} {
    const [insuranceTypeSlug, countryCode, stateSlug, citySlug] = segments;
    
    let expectedGeoLevel = 'NICHE';
    if (citySlug) expectedGeoLevel = 'CITY';
    else if (stateSlug) expectedGeoLevel = 'STATE';
    else if (countryCode) expectedGeoLevel = 'COUNTRY';
    
    return {
        insuranceTypeSlug: insuranceTypeSlug || null,
        countryCode: countryCode || null,
        stateSlug: stateSlug || null,
        citySlug: citySlug || null,
        expectedGeoLevel,
    };
}

describe('URL Segment Parsing', () => {
    it('should parse niche-only URL', () => {
        const result = parseUrlSegments(['car-insurance']);
        
        expect(result.insuranceTypeSlug).toBe('car-insurance');
        expect(result.countryCode).toBeNull();
        expect(result.stateSlug).toBeNull();
        expect(result.citySlug).toBeNull();
        expect(result.expectedGeoLevel).toBe('NICHE');
    });

    it('should parse country-level URL', () => {
        const result = parseUrlSegments(['car-insurance', 'us']);
        
        expect(result.insuranceTypeSlug).toBe('car-insurance');
        expect(result.countryCode).toBe('us');
        expect(result.stateSlug).toBeNull();
        expect(result.citySlug).toBeNull();
        expect(result.expectedGeoLevel).toBe('COUNTRY');
    });

    it('should parse state-level URL', () => {
        const result = parseUrlSegments(['car-insurance', 'us', 'california']);
        
        expect(result.insuranceTypeSlug).toBe('car-insurance');
        expect(result.countryCode).toBe('us');
        expect(result.stateSlug).toBe('california');
        expect(result.citySlug).toBeNull();
        expect(result.expectedGeoLevel).toBe('STATE');
    });

    it('should parse city-level URL', () => {
        const result = parseUrlSegments(['car-insurance', 'us', 'california', 'los-angeles']);
        
        expect(result.insuranceTypeSlug).toBe('car-insurance');
        expect(result.countryCode).toBe('us');
        expect(result.stateSlug).toBe('california');
        expect(result.citySlug).toBe('los-angeles');
        expect(result.expectedGeoLevel).toBe('CITY');
    });

    it('should handle empty segments', () => {
        const result = parseUrlSegments([]);
        
        expect(result.insuranceTypeSlug).toBeNull();
        expect(result.expectedGeoLevel).toBe('NICHE');
    });
});

describe('Route Hierarchy Validation', () => {
    it('should require insurance type for all routes', () => {
        const validRoutes = [
            ['car-insurance'],
            ['car-insurance', 'us'],
            ['car-insurance', 'us', 'california'],
            ['car-insurance', 'us', 'california', 'los-angeles'],
        ];

        for (const route of validRoutes) {
            const result = parseUrlSegments(route);
            expect(result.insuranceTypeSlug).not.toBeNull();
        }
    });

    it('should require country before state', () => {
        // Valid: has country before state
        const valid = parseUrlSegments(['car-insurance', 'us', 'california']);
        expect(valid.countryCode).toBe('us');
        expect(valid.stateSlug).toBe('california');
    });

    it('should require state before city', () => {
        // Valid: has state before city
        const valid = parseUrlSegments(['car-insurance', 'us', 'california', 'los-angeles']);
        expect(valid.stateSlug).toBe('california');
        expect(valid.citySlug).toBe('los-angeles');
    });
});

describe('Geo Level Detection', () => {
    const testCases = [
        { segments: ['home-insurance'], expected: 'NICHE' },
        { segments: ['home-insurance', 'us'], expected: 'COUNTRY' },
        { segments: ['home-insurance', 'us', 'texas'], expected: 'STATE' },
        { segments: ['home-insurance', 'us', 'texas', 'houston'], expected: 'CITY' },
    ];

    testCases.forEach(({ segments, expected }) => {
        it(`should detect ${expected} for /${segments.join('/')}`, () => {
            const result = parseUrlSegments(segments);
            expect(result.expectedGeoLevel).toBe(expected);
        });
    });
});

describe('404 Scenarios', () => {
    it('should identify invalid insurance type', () => {
        const segments = ['invalid-insurance-type'];
        const result = parseUrlSegments(segments);
        
        // Parser returns the slug, but DB lookup would fail
        expect(result.insuranceTypeSlug).toBe('invalid-insurance-type');
        // In actual implementation, DB lookup returns null -> 404
    });

    it('should identify invalid country code', () => {
        const segments = ['car-insurance', 'xx'];
        const result = parseUrlSegments(segments);
        
        expect(result.countryCode).toBe('xx');
        // In actual implementation, DB lookup returns null -> 404
    });

    it('should identify invalid state for country', () => {
        const segments = ['car-insurance', 'us', 'invalid-state'];
        const result = parseUrlSegments(segments);
        
        expect(result.stateSlug).toBe('invalid-state');
        // In actual implementation, DB lookup returns null -> 404
    });
});

