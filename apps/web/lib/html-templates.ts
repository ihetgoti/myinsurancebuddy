/**
 * Shared HTML Templates for Web App
 * 
 * These are the same templates used in admin,
 * simplified for server-side rendering in the web app.
 */

export interface RenderContext {
    [key: string]: string | number | undefined;
}

const AD_HEADER = '<!-- AD_HEADER -->';
const AD_IN_CONTENT_1 = '<!-- AD_IN_CONTENT_1 -->';
const AD_IN_CONTENT_2 = '<!-- AD_IN_CONTENT_2 -->';
const AD_SIDEBAR = '<!-- AD_SIDEBAR -->';

const COMMON_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background: #fff;
  }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  .ad-slot { margin: 20px 0; min-height: 90px; }
  .ad-slot-sidebar { min-height: 250px; position: sticky; top: 20px; }
  h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; color: #0a0a0a; }
  h2 { font-size: 1.75rem; font-weight: 700; margin: 2rem 0 1rem; color: #1a1a1a; }
  h3 { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
  p { margin-bottom: 1rem; color: #444; }
  ul, ol { margin: 1rem 0; padding-left: 1.5rem; }
  li { margin-bottom: 0.5rem; }
  a { color: #2563eb; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .breadcrumb { font-size: 0.875rem; color: #666; margin-bottom: 1rem; }
  .meta { font-size: 0.875rem; color: #666; margin-bottom: 1.5rem; }
  .cta-button {
    display: inline-block;
    background: #2563eb;
    color: white;
    padding: 14px 28px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    margin: 1rem 0;
  }
  .cta-button:hover { background: #1d4ed8; text-decoration: none; }
  .card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1rem 0;
  }
  .grid { display: grid; gap: 1.5rem; }
  .grid-2 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
  .grid-3 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  .layout { display: flex; gap: 2rem; }
  .main-content { flex: 1; min-width: 0; }
  .sidebar { width: 300px; flex-shrink: 0; }
  @media (max-width: 900px) {
    .layout { flex-direction: column; }
    .sidebar { width: 100%; }
    h1 { font-size: 2rem; }
  }
`;

const TEMPLATES: Record<string, { html: string; css: string }> = {
    'state-page': {
        css: COMMON_CSS,
        html: `
<div class="container">
  <div class="ad-slot">${AD_HEADER}</div>
  <nav class="breadcrumb">
    <a href="/">Home</a> › 
    <a href="/{{insurance_type_slug}}">{{insurance_type}}</a> › 
    {{state}}
  </nav>
  <div class="layout">
    <article class="main-content">
      <h1>{{insurance_type}} in {{state}} ({{current_year}} Guide)</h1>
      <p class="meta">Last updated: {{current_year}} • Average rate: {{avg_premium}}/month</p>
      <p>Looking for the best <strong>{{insurance_type}}</strong> in <strong>{{state}}</strong>? 
      Our comprehensive guide covers everything you need to know about getting affordable coverage.</p>
      <a href="#quotes" class="cta-button">Get Free {{state}} Quotes →</a>
      <div class="ad-slot">${AD_IN_CONTENT_1}</div>
      <h2>Average {{insurance_type}} Rates in {{state}}</h2>
      <div class="card">
        <div class="grid grid-3">
          <div><strong>Average Rate</strong><p style="font-size:1.5rem;color:#2563eb;">{{avg_premium}}/mo</p></div>
          <div><strong>Population</strong><p style="font-size:1.5rem;">{{population}}</p></div>
          <div><strong>Last Updated</strong><p style="font-size:1.5rem;">{{current_year}}</p></div>
        </div>
      </div>
      <h2>Top {{insurance_type}} Companies in {{state}}</h2>
      <ul>
        <li><strong>State Farm</strong> - Best overall coverage</li>
        <li><strong>GEICO</strong> - Best for low rates</li>
        <li><strong>Progressive</strong> - Best for online experience</li>
        <li><strong>Allstate</strong> - Best for bundling</li>
        <li><strong>USAA</strong> - Best for military families</li>
      </ul>
      <div class="ad-slot">${AD_IN_CONTENT_2}</div>
      <h2>How to Save on {{insurance_type}} in {{state}}</h2>
      <div class="grid grid-2">
        <div class="card"><h3>Compare Quotes</h3><p>Get quotes from 3-5 companies to find the best rate.</p></div>
        <div class="card"><h3>Bundle Policies</h3><p>Combine policies for discounts.</p></div>
        <div class="card"><h3>Maintain Good Credit</h3><p>Credit score affects premiums.</p></div>
        <div class="card"><h3>Ask About Discounts</h3><p>Safe driver, good student discounts.</p></div>
      </div>
      <h2 id="quotes">Get {{insurance_type}} Quotes in {{state}}</h2>
      <a href="#" class="cta-button">Compare {{state}} Quotes Now →</a>
    </article>
    <aside class="sidebar">
      <div class="ad-slot ad-slot-sidebar">${AD_SIDEBAR}</div>
    </aside>
  </div>
</div>`
    },
    'city-page': {
        css: COMMON_CSS,
        html: `
<div class="container">
  <div class="ad-slot">${AD_HEADER}</div>
  <nav class="breadcrumb">
    <a href="/">Home</a> › 
    <a href="/{{insurance_type_slug}}">{{insurance_type}}</a> › 
    <a href="/{{insurance_type_slug}}/{{country_code}}/{{state_slug}}">{{state}}</a> › 
    {{city}}
  </nav>
  <div class="layout">
    <article class="main-content">
      <h1>{{insurance_type}} in {{city}}, {{state_code}} ({{current_year}})</h1>
      <p class="meta">Population: {{population}} • Average: {{avg_premium}}/mo</p>
      <p>Compare the best <strong>{{insurance_type}}</strong> rates in <strong>{{city}}, {{state}}</strong>. 
      Our guide helps residents find affordable coverage from top-rated insurers.</p>
      <a href="#quotes" class="cta-button">Get {{city}} Quotes →</a>
      <div class="ad-slot">${AD_IN_CONTENT_1}</div>
      <h2>{{insurance_type}} Rates in {{city}}</h2>
      <div class="card">
        <p>The average rate in {{city}} is <strong>{{avg_premium}}/month</strong>.</p>
        <p>Factors affecting your rate include:</p>
        <ul>
          <li>Your driving record and claims history</li>
          <li>Your neighborhood</li>
          <li>Your age and experience</li>
          <li>Your vehicle type</li>
        </ul>
      </div>
      <h2>Best Insurance Companies in {{city}}</h2>
      <div class="grid grid-2">
        <div class="card"><h3>State Farm</h3><p>Strong local agent network.</p></div>
        <div class="card"><h3>GEICO</h3><p>Consistently low rates.</p></div>
        <div class="card"><h3>Progressive</h3><p>Usage-based discounts.</p></div>
        <div class="card"><h3>Allstate</h3><p>Wide coverage options.</p></div>
      </div>
      <div class="ad-slot">${AD_IN_CONTENT_2}</div>
      <h2 id="quotes">Get Your Free Quote</h2>
      <a href="#" class="cta-button">Compare {{city}} Rates →</a>
    </article>
    <aside class="sidebar">
      <div class="ad-slot ad-slot-sidebar">${AD_SIDEBAR}</div>
    </aside>
  </div>
</div>`
    }
};

/**
 * Inject variables into template HTML
 */
function injectVariables(html: string, context: RenderContext): string {
    return html.replace(/\{\{(\w+)(?:\|(\w+))?\}\}/g, (match, variable, filter) => {
        let value = context[variable];
        if (value === undefined || value === null) return '';
        let result = String(value);
        if (filter === 'lower') result = result.toLowerCase();
        if (filter === 'upper') result = result.toUpperCase();
        return result;
    });
}

/**
 * Render an HTML template with context
 */
export function renderHtmlTemplate(
    templateId: string,
    context: RenderContext,
    adCode?: { header?: string; inContent1?: string; inContent2?: string; sidebar?: string }
): { html: string; css: string } | null {
    const template = TEMPLATES[templateId];
    if (!template) return null;

    let html = injectVariables(template.html, context);

    // Replace ad placeholders
    html = html.replace(AD_HEADER, adCode?.header || '');
    html = html.replace(AD_IN_CONTENT_1, adCode?.inContent1 || '');
    html = html.replace(AD_IN_CONTENT_2, adCode?.inContent2 || '');
    html = html.replace(AD_SIDEBAR, adCode?.sidebar || '');

    return { html, css: template.css };
}

export const TEMPLATE_IDS = Object.keys(TEMPLATES);
