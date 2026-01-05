/**
 * HTML Template Renderer
 * 
 * Renders HTML templates with Handlebars-style variable substitution.
 * Supports:
 * - {{variable}} - Simple variable replacement
 * - {{#each array}}...{{/each}} - Loop over arrays
 * - {{#if condition}}...{{else}}...{{/if}} - Conditional rendering
 * - {{variable|filter}} - Value filters (lower, upper, number, etc.)
 * 
 * Optimized for server-side rendering with millions of pages.
 */

export interface TemplateContext {
    [key: string]: any;
}

interface TemplateOptions {
    /** Remove unresolved variables instead of keeping them */
    removeUnresolved?: boolean;
    /** Log warnings for unresolved variables in development */
    debug?: boolean;
}

/**
 * Apply a filter to a value
 */
function applyFilter(value: string, filter: string): string {
    switch (filter) {
        case 'lower':
        case 'lowercase':
            return value.toLowerCase();
        case 'upper':
        case 'uppercase':
            return value.toUpperCase();
        case 'title':
        case 'titlecase':
            return value.replace(/\b\w/g, c => c.toUpperCase());
        case 'slug':
            return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        case 'number':
            return Number(value).toLocaleString();
        case 'currency':
            return `$${Number(value).toLocaleString()}`;
        case 'percent':
            return `${value}%`;
        case 'trim':
            return value.trim();
        case 'escape':
        case 'html':
            return escapeHtml(value);
        default:
            return value;
    }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, char => htmlEntities[char] || char);
}

/**
 * Get a nested value from an object using dot notation
 * e.g., getNestedValue({a: {b: 1}}, 'a.b') => 1
 */
function getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return undefined;

    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        current = current[part];
    }

    return current;
}

/**
 * Evaluate a simple condition for {{#if}}
 * Supports: variable, !variable, variable == value, variable != value
 */
function evaluateCondition(condition: string, context: TemplateContext): boolean {
    condition = condition.trim();

    // Negation: !variable
    if (condition.startsWith('!')) {
        const varName = condition.slice(1).trim();
        const value = getNestedValue(context, varName);
        return !value || (Array.isArray(value) && value.length === 0);
    }

    // Equality: variable == value or variable === value
    if (condition.includes('==')) {
        const [left, right] = condition.split(/===?/).map(s => s.trim());
        const leftValue = getNestedValue(context, left);
        const rightValue = right.replace(/['"]/g, ''); // Remove quotes
        return String(leftValue) === rightValue;
    }

    // Inequality: variable != value or variable !== value
    if (condition.includes('!=')) {
        const [left, right] = condition.split(/!==?/).map(s => s.trim());
        const leftValue = getNestedValue(context, left);
        const rightValue = right.replace(/['"]/g, '');
        return String(leftValue) !== rightValue;
    }

    // Greater than: variable > value
    if (condition.includes('>')) {
        const [left, right] = condition.split('>').map(s => s.trim());
        const leftValue = Number(getNestedValue(context, left));
        const rightValue = Number(right);
        return leftValue > rightValue;
    }

    // Less than: variable < value
    if (condition.includes('<')) {
        const [left, right] = condition.split('<').map(s => s.trim());
        const leftValue = Number(getNestedValue(context, left));
        const rightValue = Number(right);
        return leftValue < rightValue;
    }

    // Simple truthy check
    const value = getNestedValue(context, condition);
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
}

/**
 * Process {{#each array}}...{{/each}} blocks
 */
function processEachBlocks(html: string, context: TemplateContext): string {
    // Regex to match {{#each arrayName}}...{{/each}} including nested content
    const eachRegex = /\{\{#each\s+(\w+(?:\.\w+)*)\s*\}\}([\s\S]*?)\{\{\/each\}\}/g;

    return html.replace(eachRegex, (match, arrayPath, innerTemplate) => {
        const array = getNestedValue(context, arrayPath);

        if (!Array.isArray(array) || array.length === 0) {
            return '';
        }

        return array.map((item, index) => {
            // Create a local context for this iteration
            const localContext = {
                ...context,
                '@index': index,
                '@first': index === 0,
                '@last': index === array.length - 1,
                'this': item,
            };

            // If item is an object, spread its properties into context
            if (item && typeof item === 'object' && !Array.isArray(item)) {
                Object.assign(localContext, item);
            }

            // Process the inner template with local context
            let result = innerTemplate;

            // Replace {{this}} or {{this.property}}
            result = result.replace(/\{\{this(?:\.(\w+))?\}\}/g, (m: string, prop: string) => {
                if (prop) {
                    return item && typeof item === 'object' ? String(item[prop] || '') : '';
                }
                return typeof item === 'object' ? JSON.stringify(item) : String(item || '');
            });

            // Replace {{@index}}, {{@first}}, {{@last}}
            result = result.replace(/\{\{@index\}\}/g, String(index));
            result = result.replace(/\{\{@first\}\}/g, String(index === 0));
            result = result.replace(/\{\{@last\}\}/g, String(index === array.length - 1));

            // Replace item properties directly
            result = replaceVariables(result, localContext);

            return result;
        }).join('');
    });
}

/**
 * Process {{#if condition}}...{{else}}...{{/if}} blocks
 */
function processIfBlocks(html: string, context: TemplateContext): string {
    // Match {{#if condition}}...{{else}}...{{/if}} or {{#if condition}}...{{/if}}
    const ifRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g;

    return html.replace(ifRegex, (match, condition, ifContent, elseContent = '') => {
        const result = evaluateCondition(condition, context);
        return result ? ifContent : elseContent;
    });
}

/**
 * Process {{#unless condition}}...{{/unless}} blocks (inverse of if)
 */
function processUnlessBlocks(html: string, context: TemplateContext): string {
    const unlessRegex = /\{\{#unless\s+([^}]+)\}\}([\s\S]*?)\{\{\/unless\}\}/g;

    return html.replace(unlessRegex, (match, condition, content) => {
        const result = evaluateCondition(condition, context);
        return result ? '' : content;
    });
}

/**
 * Process {{^variable}}...{{/variable}} blocks (Handlebars inverse shorthand)
 * This is equivalent to {{#unless variable}}
 */
function processInverseBlocks(html: string, context: TemplateContext): string {
    // Match {{^variable}}...{{/variable}}
    const inverseRegex = /\{\{\^(\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

    return html.replace(inverseRegex, (match, varName, content) => {
        const value = getNestedValue(context, varName);
        // Show content only if value is falsy or empty array
        const isFalsy = !value || (Array.isArray(value) && value.length === 0);
        return isFalsy ? content : '';
    });
}

/**
 * Replace simple {{variable}} and {{variable|filter}} placeholders
 */
function replaceVariables(html: string, context: TemplateContext, options: TemplateOptions = {}): string {
    // Match {{variable}} or {{variable|filter}} or {{nested.variable}}
    const varRegex = /\{\{([a-zA-Z_][\w.]*?)(?:\|(\w+))?\}\}/g;

    return html.replace(varRegex, (match, varPath, filter) => {
        const value = getNestedValue(context, varPath);

        if (value === undefined || value === null) {
            if (options.debug && process.env.NODE_ENV === 'development') {
                console.warn(`[Template] Unresolved variable: ${varPath}`);
            }
            return options.removeUnresolved ? '' : match;
        }

        // Handle arrays and objects
        if (Array.isArray(value)) {
            return filter ? applyFilter(JSON.stringify(value), filter) : JSON.stringify(value);
        }
        if (typeof value === 'object') {
            return filter ? applyFilter(JSON.stringify(value), filter) : JSON.stringify(value);
        }

        // Apply filter if present
        const stringValue = String(value);
        return filter ? applyFilter(stringValue, filter) : stringValue;
    });
}

/**
 * Process {{#with object}}...{{/with}} blocks for scoped context
 */
function processWithBlocks(html: string, context: TemplateContext): string {
    const withRegex = /\{\{#with\s+(\w+(?:\.\w+)*)\s*\}\}([\s\S]*?)\{\{\/with\}\}/g;

    return html.replace(withRegex, (match, objectPath, innerTemplate) => {
        const obj = getNestedValue(context, objectPath);

        if (!obj || typeof obj !== 'object') {
            return '';
        }

        // Merge object properties into context
        const localContext = { ...context, ...obj };
        return renderTemplate(innerTemplate, localContext);
    });
}

/**
 * Main template rendering function
 * 
 * @param template - HTML template string with Handlebars-style placeholders
 * @param context - Object containing variable values
 * @param options - Rendering options
 * @returns Rendered HTML string
 */
export function renderTemplate(
    template: string,
    context: TemplateContext,
    options: TemplateOptions = { removeUnresolved: true }
): string {
    if (!template) return '';

    let html = template;

    // Process block helpers in order (most nested first)
    // We may need multiple passes for nested blocks
    let prevHtml = '';
    let iterations = 0;
    const maxIterations = 10; // Prevent infinite loops

    while (prevHtml !== html && iterations < maxIterations) {
        prevHtml = html;
        iterations++;

        // Process {{#with}} blocks
        html = processWithBlocks(html, context);

        // Process {{#each}} blocks
        html = processEachBlocks(html, context);

        // Process {{#if}} blocks
        html = processIfBlocks(html, context);

        // Process {{#unless}} blocks
        html = processUnlessBlocks(html, context);

        // Process {{^variable}} inverse blocks
        html = processInverseBlocks(html, context);
    }

    // Replace remaining simple variables
    html = replaceVariables(html, context, options);

    // Clean up any remaining unresolved block helpers (including {{^...}} inverse blocks)
    if (options.removeUnresolved) {
        html = html.replace(/\{\{[#^]?\/?[\w\s.]+\}\}/g, '');
    }

    return html;
}

/**
 * Render a complete HTML template with CSS
 * 
 * @param htmlContent - The HTML template content
 * @param cssContent - Optional CSS styles
 * @param context - Template variables
 * @returns Object with rendered HTML and CSS
 */
export function renderHtmlTemplate(
    htmlContent: string,
    cssContent: string | null | undefined,
    context: TemplateContext
): { html: string; css: string } {
    const html = renderTemplate(htmlContent, context, { removeUnresolved: true, debug: true });
    const css = cssContent ? renderTemplate(cssContent, context, { removeUnresolved: true }) : '';

    return { html, css };
}

/**
 * Extract all variable names from a template
 * Useful for validation and mapping
 */
export function extractVariables(template: string): string[] {
    const variables = new Set<string>();

    // Match {{variable}} or {{variable|filter}}
    const varRegex = /\{\{([a-zA-Z_][\w.]*?)(?:\|\w+)?\}\}/g;
    let match;

    while ((match = varRegex.exec(template)) !== null) {
        variables.add(match[1]);
    }

    // Match {{#each array}}
    const eachRegex = /\{\{#each\s+(\w+(?:\.\w+)*)\s*\}\}/g;
    while ((match = eachRegex.exec(template)) !== null) {
        variables.add(match[1]);
    }

    // Match {{#if condition}} - extract variable from condition
    const ifRegex = /\{\{#if\s+!?(\w+(?:\.\w+)*)/g;
    while ((match = ifRegex.exec(template)) !== null) {
        variables.add(match[1]);
    }

    // Match {{#with object}}
    const withRegex = /\{\{#with\s+(\w+(?:\.\w+)*)\s*\}\}/g;
    while ((match = withRegex.exec(template)) !== null) {
        variables.add(match[1]);
    }

    return Array.from(variables).sort();
}

/**
 * Validate that all required variables are present in context
 */
export function validateContext(template: string, context: TemplateContext): {
    valid: boolean;
    missing: string[];
    provided: string[];
} {
    const required = extractVariables(template);
    const missing: string[] = [];
    const provided: string[] = [];

    for (const varName of required) {
        const value = getNestedValue(context, varName);
        if (value !== undefined && value !== null && value !== '') {
            provided.push(varName);
        } else {
            missing.push(varName);
        }
    }

    return {
        valid: missing.length === 0,
        missing,
        provided,
    };
}

export default {
    renderTemplate,
    renderHtmlTemplate,
    extractVariables,
    validateContext,
};
