/**
 * Smart CSV Auto-Mapper
 * Automatically detects and maps CSV columns to template variables
 */

export interface MappingResult {
    mapping: Record<string, string>;
    confidence: number;
    unmapped: string[];
    suggestions: Array<{ column: string; suggestedVariable: string; confidence: number }>;
}

/**
 * Column detection patterns with priorities
 * Higher priority patterns are checked first
 */
const COLUMN_PATTERNS: Array<{
    variable: string;
    patterns: RegExp[];
    priority: number;
}> = [
        // Location fields - highest priority
        {
            variable: 'city',
            patterns: [
                /^city$/i,
                /^city[_\s]?name$/i,
                /^town$/i,
                /^municipality$/i,
                /^location$/i,
            ],
            priority: 100,
        },
        {
            variable: 'state',
            patterns: [
                /^state$/i,
                /^state[_\s]?name$/i,
                /^province$/i,
                /^region$/i,
            ],
            priority: 100,
        },
        {
            variable: 'state_code',
            patterns: [
                /^state[_\s]?code$/i,
                /^st$/i,
                /^state[_\s]?abbr(ev)?$/i,
                /^province[_\s]?code$/i,
            ],
            priority: 95,
        },
        {
            variable: 'country',
            patterns: [
                /^country$/i,
                /^country[_\s]?name$/i,
                /^nation$/i,
            ],
            priority: 90,
        },
        {
            variable: 'zipcode',
            patterns: [
                /^zip$/i,
                /^zipcode$/i,
                /^zip[_\s]?code$/i,
                /^postal$/i,
                /^postal[_\s]?code$/i,
            ],
            priority: 85,
        },

        // Content fields
        {
            variable: 'page_title',
            patterns: [
                /^title$/i,
                /^page[_\s]?title$/i,
                /^h1$/i,
                /^heading$/i,
                /^name$/i,
            ],
            priority: 80,
        },
        {
            variable: 'page_subtitle',
            patterns: [
                /^subtitle$/i,
                /^subheading$/i,
                /^tagline$/i,
                /^h2$/i,
            ],
            priority: 75,
        },
        {
            variable: 'meta_description',
            patterns: [
                /^description$/i,
                /^meta[_\s]?desc(ription)?$/i,
                /^seo[_\s]?desc(ription)?$/i,
                /^excerpt$/i,
                /^summary$/i,
            ],
            priority: 70,
        },
        {
            variable: 'content',
            patterns: [
                /^content$/i,
                /^body$/i,
                /^text$/i,
                /^main[_\s]?content$/i,
                /^page[_\s]?content$/i,
            ],
            priority: 65,
        },

        // URL fields
        {
            variable: 'slug',
            patterns: [
                /^slug$/i,
                /^url$/i,
                /^path$/i,
                /^permalink$/i,
                /^url[_\s]?path$/i,
            ],
            priority: 60,
        },

        // Population/Statistics
        {
            variable: 'population',
            patterns: [
                /^pop(ulation)?$/i,
                /^city[_\s]?pop(ulation)?$/i,
            ],
            priority: 50,
        },

        // Insurance specific
        {
            variable: 'insurance_type',
            patterns: [
                /^insurance[_\s]?type$/i,
                /^type$/i,
                /^category$/i,
                /^niche$/i,
            ],
            priority: 45,
        },
        {
            variable: 'avg_rate',
            patterns: [
                /^avg[_\s]?rate$/i,
                /^average[_\s]?rate$/i,
                /^rate$/i,
                /^premium$/i,
                /^avg[_\s]?premium$/i,
            ],
            priority: 40,
        },
    ];

/**
 * Auto-map CSV headers to template variables
 */
export function autoMapColumns(headers: string[]): MappingResult {
    const mapping: Record<string, string> = {};
    const unmapped: string[] = [];
    const suggestions: Array<{ column: string; suggestedVariable: string; confidence: number }> = [];
    const usedHeaders = new Set<string>();

    // Sort patterns by priority (highest first)
    const sortedPatterns = [...COLUMN_PATTERNS].sort((a, b) => b.priority - a.priority);

    // First pass: exact matches
    for (const { variable, patterns } of sortedPatterns) {
        for (const header of headers) {
            if (usedHeaders.has(header)) continue;

            const normalizedHeader = header.trim();
            for (const pattern of patterns) {
                if (pattern.test(normalizedHeader)) {
                    mapping[variable] = header;
                    usedHeaders.add(header);
                    break;
                }
            }
            if (mapping[variable]) break;
        }
    }

    // Second pass: fuzzy matching for unmapped columns
    for (const header of headers) {
        if (usedHeaders.has(header)) continue;

        const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
        let bestMatch: { variable: string; confidence: number } | null = null;

        for (const { variable, patterns } of sortedPatterns) {
            if (mapping[variable]) continue; // Already mapped

            for (const pattern of patterns) {
                const patternStr = pattern.source.toLowerCase().replace(/[^a-z0-9]/g, '');
                const similarity = calculateSimilarity(normalizedHeader, patternStr);

                if (similarity > 0.6 && (!bestMatch || similarity > bestMatch.confidence)) {
                    bestMatch = { variable, confidence: similarity };
                }
            }
        }

        if (bestMatch && bestMatch.confidence > 0.7) {
            suggestions.push({
                column: header,
                suggestedVariable: bestMatch.variable,
                confidence: bestMatch.confidence,
            });
        } else {
            unmapped.push(header);
        }
    }

    // Calculate overall confidence
    const totalVariables = COLUMN_PATTERNS.length;
    const mappedCount = Object.keys(mapping).length;
    const confidence = Math.min(1, mappedCount / Math.min(totalVariables, headers.length));

    return {
        mapping,
        confidence,
        unmapped,
        suggestions,
    };
}

/**
 * Simple similarity calculation (Jaccard-like)
 */
function calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (!str1 || !str2) return 0;

    const chars1 = str1.split('');
    const chars2 = str2.split('');
    const set2 = new Set(chars2);

    const intersection = chars1.filter(x => set2.has(x));
    const unionSet = new Set([...chars1, ...chars2]);

    // Use Array.from for ES5 compatibility
    return new Set(intersection).size / Array.from(unionSet).length;
}

/**
 * Generate page data from CSV row using mapping
 */
export function applyMapping(
    row: Record<string, string>,
    mapping: Record<string, string>,
    defaults?: Record<string, string>
): Record<string, string> {
    const result: Record<string, string> = { ...defaults };

    for (const [variable, column] of Object.entries(mapping)) {
        if (row[column] !== undefined) {
            result[variable] = row[column];
        }
    }

    // Generate derived fields
    if (result.city && !result.city_slug) {
        result.city_slug = slugify(result.city);
    }
    if (result.state && !result.state_slug) {
        result.state_slug = slugify(result.state);
    }
    if (result.insurance_type && !result.insurance_type_slug) {
        result.insurance_type_slug = slugify(result.insurance_type);
    }

    return result;
}

/**
 * Simple slugify function
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Validate CSV data for required fields
 */
export function validateCsvData(
    data: Record<string, string>[],
    requiredFields: string[],
    mapping: Record<string, string>
): { valid: boolean; errors: Array<{ row: number; field: string; error: string }> } {
    const errors: Array<{ row: number; field: string; error: string }> = [];

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (const field of requiredFields) {
            const column = mapping[field];
            if (!column || !row[column] || row[column].trim() === '') {
                errors.push({
                    row: i + 1,
                    field,
                    error: `Missing or empty value for ${field}`,
                });
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
