import { describe, it, expect, vi } from 'vitest';

/**
 * Template Rendering Tests
 * Validates that templates render correctly with variable substitution
 */

// Variable replacement function (extracted for testing)
function replaceVariables(template: string, variables: Record<string, string>): string {
    if (!template) return '';
    
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(`{{${escapedKey}}}`, 'g'), value || '');
    });
    
    // Remove unresolved variables
    result = result.replace(/{{[^}]+}}/g, '');
    return result;
}

describe('Template Variable Replacement', () => {
    it('should replace simple variables', () => {
        const template = 'Hello {{name}}, welcome to {{city}}!';
        const variables = { name: 'John', city: 'Los Angeles' };
        
        const result = replaceVariables(template, variables);
        expect(result).toBe('Hello John, welcome to Los Angeles!');
    });

    it('should handle missing variables by removing them', () => {
        const template = 'Hello {{name}}, your city is {{city}}';
        const variables = { name: 'John' };
        
        const result = replaceVariables(template, variables);
        expect(result).toBe('Hello John, your city is ');
    });

    it('should remove unresolved variables', () => {
        const template = '{{unknown_var}} should be removed';
        const variables = {};
        
        const result = replaceVariables(template, variables);
        expect(result).toBe(' should be removed');
    });

    it('should handle empty template', () => {
        const result = replaceVariables('', { name: 'test' });
        expect(result).toBe('');
    });

    it('should handle special regex characters in variable names', () => {
        const template = 'Price: {{price.usd}}';
        const variables = { 'price.usd': '$100' };
        
        const result = replaceVariables(template, variables);
        expect(result).toBe('Price: $100');
    });

    it('should replace multiple occurrences of same variable', () => {
        const template = '{{city}} is great. I love {{city}}!';
        const variables = { city: 'NYC' };
        
        const result = replaceVariables(template, variables);
        expect(result).toBe('NYC is great. I love NYC!');
    });

    it('should handle empty variable values', () => {
        const template = 'Hello {{name}}!';
        const variables = { name: '' };
        
        const result = replaceVariables(template, variables);
        expect(result).toBe('Hello !');
    });
});

describe('SEO Title Generation', () => {
    it('should generate correct title for city page', () => {
        const template = '{{insurance_type}} in {{city}}, {{state}} | {{site_name}}';
        const variables = {
            insurance_type: 'Car Insurance',
            city: 'Los Angeles',
            state: 'California',
            site_name: 'MyInsuranceBuddies',
        };
        
        const result = replaceVariables(template, variables);
        expect(result).toBe('Car Insurance in Los Angeles, California | MyInsuranceBuddies');
    });

    it('should generate correct title for state page', () => {
        const template = '{{insurance_type}} in {{state}} | Compare Rates | {{site_name}}';
        const variables = {
            insurance_type: 'Home Insurance',
            state: 'Texas',
            site_name: 'MyInsuranceBuddies',
        };
        
        const result = replaceVariables(template, variables);
        expect(result).toBe('Home Insurance in Texas | Compare Rates | MyInsuranceBuddies');
    });

    it('should handle niche page without location', () => {
        const template = '{{insurance_type}} - Compare Quotes & Save | {{site_name}}';
        const variables = {
            insurance_type: 'Auto Insurance',
            site_name: 'MyInsuranceBuddies',
        };
        
        const result = replaceVariables(template, variables);
        expect(result).toBe('Auto Insurance - Compare Quotes & Save | MyInsuranceBuddies');
    });
});

describe('Meta Description Generation', () => {
    it('should generate description under 160 chars', () => {
        const template = 'Compare {{insurance_type}} rates in {{location}}. Get free quotes from top carriers and save up to {{avg_savings}}/year.';
        const variables = {
            insurance_type: 'car insurance',
            location: 'California',
            avg_savings: '$500',
        };
        
        const result = replaceVariables(template, variables);
        expect(result.length).toBeLessThanOrEqual(160);
    });
});

