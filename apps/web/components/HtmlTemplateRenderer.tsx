/**
 * HTML Template Renderer Component
 * 
 * Renders HTML templates with Handlebars-style variable substitution.
 * This is a server component that safely renders user-defined HTML templates.
 */

import { renderTemplate } from '@/lib/template-renderer';

interface HtmlTemplateRendererProps {
    /** The HTML template content with {{variable}} placeholders */
    htmlContent: string;
    /** Optional CSS styles for the template */
    cssContent?: string | null;
    /** Template variables to replace */
    variables: Record<string, any>;
    /** Optional class name for the wrapper */
    className?: string;
}

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes dangerous elements while keeping safe content
 */
function sanitizeHtml(html: string): string {
    if (!html) return '';

    let clean = html;

    // Remove script tags completely
    clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers (onclick, onload, onerror, etc.)
    clean = clean.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
    clean = clean.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: URLs
    clean = clean.replace(/javascript:/gi, '');

    // Remove data: URLs that could be used for XSS (but allow data:image)
    clean = clean.replace(/data:(?!image\/)/gi, 'data-blocked:');

    // Remove iframe srcdoc (can contain malicious scripts)
    clean = clean.replace(/srcdoc\s*=\s*["'][^"']*["']/gi, '');

    // Remove base tags (can redirect all relative URLs)
    clean = clean.replace(/<base\b[^>]*>/gi, '');

    // Remove object and embed tags (can load plugins)
    clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
    clean = clean.replace(/<embed\b[^>]*>/gi, '');

    return clean;
}

/**
 * Server Component: Renders HTML template with variable substitution
 */
export default function HtmlTemplateRenderer({
    htmlContent,
    cssContent,
    variables,
    className = '',
}: HtmlTemplateRendererProps) {
    if (!htmlContent) return null;

    // Render the template with variables
    const renderedHtml = renderTemplate(htmlContent, variables, {
        removeUnresolved: true,
        debug: process.env.NODE_ENV === 'development',
    });

    // Render CSS if present
    const renderedCss = cssContent
        ? renderTemplate(cssContent, variables, { removeUnresolved: true })
        : '';

    // Sanitize the HTML to prevent XSS
    const safeHtml = sanitizeHtml(renderedHtml);

    return (
        <>
            {/* Scoped CSS from template */}
            {renderedCss && (
                <style dangerouslySetInnerHTML={{ __html: renderedCss }} />
            )}

            {/* Rendered HTML content */}
            <div
                className={`html-template-content ${className}`}
                dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
        </>
    );
}
