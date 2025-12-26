import { describe, it, expect } from 'vitest';

/**
 * SEO Validation Tests
 * Ensures SEO fields meet Google's requirements
 */

interface SEOData {
    title: string;
    description: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    robots?: string;
}

function validateSEO(seo: SEOData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Title validation (30-60 chars optimal)
    if (!seo.title) {
        errors.push('Missing meta title');
    } else if (seo.title.length > 60) {
        errors.push(`Title too long: ${seo.title.length} chars (max 60)`);
    } else if (seo.title.length < 30) {
        errors.push(`Title too short: ${seo.title.length} chars (min 30)`);
    }

    // Description validation (120-160 chars optimal)
    if (!seo.description) {
        errors.push('Missing meta description');
    } else if (seo.description.length > 160) {
        errors.push(`Description too long: ${seo.description.length} chars (max 160)`);
    } else if (seo.description.length < 120) {
        errors.push(`Description too short: ${seo.description.length} chars (min 120)`);
    }

    // Canonical URL validation
    if (seo.canonicalUrl && !seo.canonicalUrl.startsWith('https://')) {
        errors.push('Canonical URL should use HTTPS');
    }

    // OG validation
    if (!seo.ogTitle) {
        errors.push('Missing Open Graph title');
    }
    if (!seo.ogDescription) {
        errors.push('Missing Open Graph description');
    }
    if (!seo.ogImage) {
        errors.push('Missing Open Graph image');
    }

    return { valid: errors.length === 0, errors };
}

function validateSchemaOrg(schema: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schema['@context'] || schema['@context'] !== 'https://schema.org') {
        errors.push('Invalid or missing @context');
    }

    if (!schema['@type']) {
        errors.push('Missing @type');
    }

    return { valid: errors.length === 0, errors };
}

describe('Meta Title Validation', () => {
    it('should accept valid title length', () => {
        const seo: SEOData = {
            title: 'Car Insurance in Los Angeles, CA | Compare Rates',
            description: 'Compare car insurance rates in Los Angeles, California. Get free quotes from top carriers and save up to $500/year on your auto insurance.',
            ogTitle: 'Car Insurance in Los Angeles',
            ogDescription: 'Compare rates and save',
            ogImage: '/og-image.jpg',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.filter(e => e.includes('Title'))).toHaveLength(0);
    });

    it('should reject title over 60 chars', () => {
        const seo: SEOData = {
            title: 'This is a very long title that exceeds the maximum recommended length for SEO purposes and should be flagged',
            description: 'Valid description that meets the minimum length requirement for meta descriptions.',
            ogTitle: 'Title',
            ogDescription: 'Desc',
            ogImage: '/img.jpg',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.some(e => e.includes('Title too long'))).toBe(true);
    });

    it('should reject title under 30 chars', () => {
        const seo: SEOData = {
            title: 'Short Title',
            description: 'Valid description that meets the minimum length requirement for meta descriptions.',
            ogTitle: 'Title',
            ogDescription: 'Desc',
            ogImage: '/img.jpg',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.some(e => e.includes('Title too short'))).toBe(true);
    });

    it('should reject missing title', () => {
        const seo: SEOData = {
            title: '',
            description: 'Valid description',
            ogTitle: 'Title',
            ogDescription: 'Desc',
            ogImage: '/img.jpg',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.some(e => e.includes('Missing meta title'))).toBe(true);
    });
});

describe('Meta Description Validation', () => {
    it('should accept valid description length', () => {
        const seo: SEOData = {
            title: 'Valid Title That Meets Requirements',
            description: 'Compare car insurance rates in Los Angeles, California. Get free quotes from top carriers and save up to $500/year on your auto insurance.',
            ogTitle: 'Title',
            ogDescription: 'Desc',
            ogImage: '/img.jpg',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.filter(e => e.includes('Description'))).toHaveLength(0);
    });

    it('should reject description over 160 chars', () => {
        const seo: SEOData = {
            title: 'Valid Title That Meets Requirements',
            description: 'This is an extremely long meta description that goes way beyond the recommended maximum of 160 characters. Google will truncate this in search results which is not ideal for SEO.',
            ogTitle: 'Title',
            ogDescription: 'Desc',
            ogImage: '/img.jpg',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.some(e => e.includes('Description too long'))).toBe(true);
    });

    it('should reject description under 120 chars', () => {
        const seo: SEOData = {
            title: 'Valid Title That Meets Requirements',
            description: 'Too short description.',
            ogTitle: 'Title',
            ogDescription: 'Desc',
            ogImage: '/img.jpg',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.some(e => e.includes('Description too short'))).toBe(true);
    });
});

describe('Open Graph Validation', () => {
    it('should require OG title', () => {
        const seo: SEOData = {
            title: 'Valid Title That Meets Requirements',
            description: 'Valid description that meets the minimum length requirement for meta descriptions.',
            ogDescription: 'Desc',
            ogImage: '/img.jpg',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.some(e => e.includes('Open Graph title'))).toBe(true);
    });

    it('should require OG image', () => {
        const seo: SEOData = {
            title: 'Valid Title That Meets Requirements',
            description: 'Valid description that meets the minimum length requirement for meta descriptions.',
            ogTitle: 'Title',
            ogDescription: 'Desc',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.some(e => e.includes('Open Graph image'))).toBe(true);
    });
});

describe('Schema.org Validation', () => {
    it('should validate correct schema', () => {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Car Insurance in Los Angeles',
            description: 'Compare rates',
        };
        
        const result = validateSchemaOrg(schema);
        expect(result.valid).toBe(true);
    });

    it('should reject schema without @context', () => {
        const schema = {
            '@type': 'WebPage',
            name: 'Page Name',
        };
        
        const result = validateSchemaOrg(schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('@context'))).toBe(true);
    });

    it('should reject schema without @type', () => {
        const schema = {
            '@context': 'https://schema.org',
            name: 'Page Name',
        };
        
        const result = validateSchemaOrg(schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('@type'))).toBe(true);
    });

    it('should validate BreadcrumbList schema', () => {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
                { '@type': 'ListItem', position: 2, name: 'Insurance', item: 'https://example.com/insurance' },
            ],
        };
        
        const result = validateSchemaOrg(schema);
        expect(result.valid).toBe(true);
    });
});

describe('Canonical URL Validation', () => {
    it('should accept HTTPS canonical URL', () => {
        const seo: SEOData = {
            title: 'Valid Title That Meets Requirements',
            description: 'Valid description that meets the minimum length requirement for meta descriptions.',
            canonicalUrl: 'https://myinsurancebuddies.com/car-insurance',
            ogTitle: 'Title',
            ogDescription: 'Desc',
            ogImage: '/img.jpg',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.filter(e => e.includes('Canonical'))).toHaveLength(0);
    });

    it('should reject HTTP canonical URL', () => {
        const seo: SEOData = {
            title: 'Valid Title That Meets Requirements',
            description: 'Valid description that meets the minimum length requirement for meta descriptions.',
            canonicalUrl: 'http://myinsurancebuddies.com/car-insurance',
            ogTitle: 'Title',
            ogDescription: 'Desc',
            ogImage: '/img.jpg',
        };
        
        const result = validateSEO(seo);
        expect(result.errors.some(e => e.includes('HTTPS'))).toBe(true);
    });
});

