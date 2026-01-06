import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

// Simple HTML tag validator
function validateHtml(html: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!html || typeof html !== 'string') {
        return { valid: true, errors: [], warnings: [] };
    }

    // Self-closing tags that don't need closing
    const selfClosingTags = new Set([
        'br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base',
        'col', 'embed', 'param', 'source', 'track', 'wbr'
    ]);

    // Stack to track open tags
    const tagStack: { tag: string; line: number }[] = [];

    // Extract all tags
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*\/?>/g;
    let match;
    let lineNumber = 1;
    let lastIndex = 0;

    while ((match = tagRegex.exec(html)) !== null) {
        // Count newlines to track line number
        const textBefore = html.substring(lastIndex, match.index);
        lineNumber += (textBefore.match(/\n/g) || []).length;
        lastIndex = match.index;

        const fullTag = match[0];
        const tagName = match[1].toLowerCase();

        // Skip self-closing tags
        if (selfClosingTags.has(tagName) || fullTag.endsWith('/>')) {
            continue;
        }

        // Check if it's a closing tag
        if (fullTag.startsWith('</')) {
            if (tagStack.length === 0) {
                errors.push(`Line ~${lineNumber}: Unexpected closing tag </${tagName}> with no matching opening tag`);
            } else {
                const lastOpen = tagStack.pop()!;
                if (lastOpen.tag !== tagName) {
                    errors.push(`Line ~${lineNumber}: Mismatched tags - expected </${lastOpen.tag}> but found </${tagName}>`);
                    // Try to recover by popping until we find the matching tag
                    let found = false;
                    for (let i = tagStack.length - 1; i >= 0; i--) {
                        if (tagStack[i].tag === tagName) {
                            tagStack.length = i;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        tagStack.push(lastOpen); // Put it back if no match found
                    }
                }
            }
        } else {
            // Opening tag
            tagStack.push({ tag: tagName, line: lineNumber });
        }
    }

    // Check for unclosed tags
    for (const unclosed of tagStack) {
        errors.push(`Line ~${unclosed.line}: Unclosed <${unclosed.tag}> tag`);
    }

    // Check for common issues
    if (html.includes('<script') && !html.includes('nonce=')) {
        warnings.push('Script tags detected. Consider using nonce for CSP compliance.');
    }

    if (html.includes('style=') && html.split('style=').length > 5) {
        warnings.push('Multiple inline styles detected. Consider using CSS classes for maintainability.');
    }

    // Check for responsive classes
    if (html.includes('class=') &&
        !html.includes('md:') &&
        !html.includes('lg:') &&
        !html.includes('sm:')) {
        warnings.push('No responsive Tailwind classes (sm:, md:, lg:) detected. Consider adding for mobile support.');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { html, sections } = body;

        const allResults: ValidationResult = {
            valid: true,
            errors: [],
            warnings: []
        };

        // Validate raw HTML if provided
        if (html) {
            const result = validateHtml(html);
            allResults.errors.push(...result.errors);
            allResults.warnings.push(...result.warnings);
            if (!result.valid) allResults.valid = false;
        }

        // Validate sections array (common template format)
        if (sections && Array.isArray(sections)) {
            sections.forEach((section: any, index: number) => {
                if (section.content && typeof section.content === 'string') {
                    const result = validateHtml(section.content);
                    result.errors.forEach(e => allResults.errors.push(`Section ${index + 1}: ${e}`));
                    result.warnings.forEach(w => allResults.warnings.push(`Section ${index + 1}: ${w}`));
                    if (!result.valid) allResults.valid = false;
                }
            });
        }

        return NextResponse.json(allResults);
    } catch (error: any) {
        console.error('HTML validation error:', error);
        return NextResponse.json({
            valid: false,
            errors: ['Failed to parse request'],
            warnings: []
        }, { status: 400 });
    }
}
