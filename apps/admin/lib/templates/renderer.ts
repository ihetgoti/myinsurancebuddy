/**
 * Template Renderer
 * 
 * Handles variable injection, ad slot replacement, and final HTML generation
 */

import { HtmlTemplate, AD_SLOTS, getTemplateById } from './html-templates';

export interface RenderContext {
    // Common variables
    [key: string]: string | number | undefined;
}

export interface RenderOptions {
    includeAds?: boolean;
    adCode?: {
        header?: string;
        inContent1?: string;
        inContent2?: string;
        inContent3?: string;
        sidebar?: string;
        footer?: string;
    };
    preview?: boolean;
}

/**
 * Inject variables into template HTML
 * Supports: {{variable}}, {{variable|filter}}
 */
function injectVariables(html: string, context: RenderContext): string {
    // Match {{variable}} or {{variable|filter}}
    return html.replace(/\{\{(\w+)(?:\|(\w+))?\}\}/g, (match, variable, filter) => {
        let value = context[variable];

        if (value === undefined || value === null) {
            return match; // Keep original if not found
        }

        // Convert to string
        let result = String(value);

        // Apply filters
        if (filter) {
            switch (filter) {
                case 'lower':
                    result = result.toLowerCase();
                    break;
                case 'upper':
                    result = result.toUpperCase();
                    break;
                case 'title':
                    result = result.replace(/\b\w/g, c => c.toUpperCase());
                    break;
                case 'slug':
                    result = result.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    break;
                case 'number':
                    result = Number(result).toLocaleString();
                    break;
            }
        }

        return result;
    });
}

/**
 * Replace ad slot placeholders with actual ad code
 */
function injectAds(html: string, options: RenderOptions): string {
    const ads = options.adCode || {};
    const preview = options.preview;

    // Default placeholder for preview mode
    const placeholder = (name: string) =>
        preview
            ? `<div style="background:#f0f0f0;border:2px dashed #ccc;padding:20px;text-align:center;color:#666;">Ad: ${name}</div>`
            : '';

    html = html.replace(AD_SLOTS.HEADER, ads.header || placeholder('Header 728x90'));
    html = html.replace(AD_SLOTS.IN_CONTENT_1, ads.inContent1 || placeholder('In-Content 1'));
    html = html.replace(AD_SLOTS.IN_CONTENT_2, ads.inContent2 || placeholder('In-Content 2'));
    html = html.replace(AD_SLOTS.IN_CONTENT_3, ads.inContent3 || placeholder('In-Content 3'));
    html = html.replace(AD_SLOTS.SIDEBAR, ads.sidebar || placeholder('Sidebar 300x250'));
    html = html.replace(AD_SLOTS.FOOTER, ads.footer || placeholder('Footer'));

    return html;
}

/**
 * Generate JSON-LD schema markup for SEO
 */
export function generateSchema(context: RenderContext, type: 'Article' | 'FAQPage' | 'WebPage' | 'LocalBusiness' = 'WebPage'): string {
    const baseSchema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': type,
    };

    switch (type) {
        case 'Article':
            return JSON.stringify({
                ...baseSchema,
                headline: context.title || context.insurance_type,
                description: context.description || `Guide to ${context.insurance_type}`,
                author: {
                    '@type': 'Organization',
                    name: 'My Insurance Buddy',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'My Insurance Buddy',
                },
                datePublished: new Date().toISOString().split('T')[0],
                dateModified: new Date().toISOString().split('T')[0],
            }, null, 2);

        case 'FAQPage':
            return JSON.stringify({
                ...baseSchema,
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: `How much ${context.insurance_type} do I need?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'The right amount depends on your assets and state requirements.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Can I switch insurance companies anytime?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes, you can switch at any time with prorated refunds.',
                        },
                    },
                ],
            }, null, 2);

        case 'LocalBusiness':
            return JSON.stringify({
                ...baseSchema,
                name: `${context.insurance_type} in ${context.city || context.state}`,
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: context.city,
                    addressRegion: context.state_abbr || context.state,
                    addressCountry: 'US',
                },
            }, null, 2);

        default:
            return JSON.stringify({
                ...baseSchema,
                name: context.title || `${context.insurance_type} in ${context.state || context.city}`,
                description: context.description,
            }, null, 2);
    }
}

/**
 * Generate meta tags for SEO
 */
export function generateMetaTags(context: RenderContext): string {
    const title = context.title || `${context.insurance_type} in ${context.state || context.city}`;
    const description = context.description ||
        `Compare ${context.insurance_type} rates in ${context.city || context.state}. Get free quotes from top insurers.`;

    return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
  `.trim();
}

/**
 * Render a complete HTML page
 */
export function renderTemplate(
    templateId: string,
    context: RenderContext,
    options: RenderOptions = {}
): { html: string; css: string; schema: string; meta: string } | null {
    const template = getTemplateById(templateId);

    if (!template) {
        return null;
    }

    // Add default year if not provided
    if (!context.year) {
        context.year = new Date().getFullYear();
    }

    // Inject variables
    let html = injectVariables(template.html, context);
    let css = template.css;

    // Inject ads
    if (options.includeAds !== false) {
        html = injectAds(html, options);
    }

    // Generate schema
    const schemaType = template.category === 'guide' ? 'FAQPage' :
        template.category === 'city' ? 'LocalBusiness' : 'Article';
    const schema = generateSchema(context, schemaType);

    // Generate meta tags
    const meta = generateMetaTags(context);

    return { html, css, schema, meta };
}

/**
 * Render full HTML document (for preview or static generation)
 */
export function renderFullPage(
    templateId: string,
    context: RenderContext,
    options: RenderOptions = {}
): string | null {
    const rendered = renderTemplate(templateId, context, options);

    if (!rendered) {
        return null;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${rendered.meta}
  <style>${rendered.css}</style>
  <script type="application/ld+json">${rendered.schema}</script>
</head>
<body>
  ${rendered.html}
</body>
</html>`;
}
