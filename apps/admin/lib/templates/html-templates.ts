/**
 * Revenue-Focused HTML Templates
 * 
 * Each template includes:
 * - Strategic ad placements
 * - SEO-optimized structure
 * - Variable injection points
 * - Mobile-responsive design
 */

export interface HtmlTemplate {
    id: string;
    name: string;
    description: string;
    category: 'state' | 'city' | 'comparison' | 'guide' | 'landing';
    html: string;
    css: string;
    variables: string[];
    adSlots: string[];
}

// Ad slot placeholders - replaced at render time
export const AD_SLOTS = {
    HEADER: '<!-- AD_HEADER -->',
    IN_CONTENT_1: '<!-- AD_IN_CONTENT_1 -->',
    IN_CONTENT_2: '<!-- AD_IN_CONTENT_2 -->',
    IN_CONTENT_3: '<!-- AD_IN_CONTENT_3 -->',
    SIDEBAR: '<!-- AD_SIDEBAR -->',
    FOOTER: '<!-- AD_FOOTER -->',
};

// Common CSS for all templates
const COMMON_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background: #fff;
  }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  .ad-slot { 
    background: #f5f5f5; 
    border: 1px dashed #ddd; 
    padding: 20px; 
    text-align: center;
    margin: 20px 0;
    min-height: 90px;
  }
  .ad-slot-header { min-height: 90px; }
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
  .breadcrumb a { color: #666; }
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
  
  /* Layout */
  .layout { display: flex; gap: 2rem; }
  .main-content { flex: 1; min-width: 0; }
  .sidebar { width: 300px; flex-shrink: 0; }
  
  @media (max-width: 900px) {
    .layout { flex-direction: column; }
    .sidebar { width: 100%; }
    h1 { font-size: 2rem; }
  }
`;

// State Page Template
const STATE_PAGE_TEMPLATE: HtmlTemplate = {
    id: 'state-page',
    name: 'State Insurance Page',
    description: 'SEO-optimized template for state-level insurance pages',
    category: 'state',
    variables: ['state', 'state_abbr', 'insurance_type', 'year', 'avg_rate', 'min_rate', 'population'],
    adSlots: ['HEADER', 'IN_CONTENT_1', 'IN_CONTENT_2', 'SIDEBAR'],
    css: COMMON_CSS,
    html: `
<div class="container">
  <!-- Header Ad -->
  <div class="ad-slot ad-slot-header">
    ${AD_SLOTS.HEADER}
  </div>
  
  <!-- Breadcrumb -->
  <nav class="breadcrumb">
    <a href="/">Home</a> › 
    <a href="/{{insurance_type}}">{{insurance_type}}</a> › 
    {{state}}
  </nav>
  
  <div class="layout">
    <article class="main-content">
      <h1>{{insurance_type}} in {{state}} ({{year}} Guide)</h1>
      
      <p class="meta">Average rate: {{avg_rate}}/month</p>
      
      <p>Looking for the best <strong>{{insurance_type}}</strong> in <strong>{{state}}</strong>? 
      You've come to the right place. Our comprehensive guide covers everything you need to know 
      about getting affordable coverage in {{state}} ({{state_abbr}}).</p>
      
      <a href="#quotes" class="cta-button">Get Free {{state}} Quotes →</a>
      
      <!-- In-Content Ad 1 -->
      <div class="ad-slot">
        ${AD_SLOTS.IN_CONTENT_1}
      </div>
      
      <h2>Average {{insurance_type}} Rates in {{state}}</h2>
      
      <div class="card">
        <div class="grid grid-3">
          <div>
            <strong>Average Rate</strong>
            <p style="font-size: 1.5rem; color: #2563eb;">{{avg_rate}}/mo</p>
          </div>
          <div>
            <strong>Minimum Rate</strong>
            <p style="font-size: 1.5rem; color: #16a34a;">{{min_rate}}/mo</p>
          </div>
          <div>
            <strong>Population</strong>
            <p style="font-size: 1.5rem;">{{population}}</p>
          </div>
        </div>
      </div>
      
      <h2>Top {{insurance_type}} Companies in {{state}}</h2>
      
      <p>Here are the leading insurance providers in {{state}}:</p>
      
      <ul>
        <li><strong>State Farm</strong> - Best overall coverage</li>
        <li><strong>GEICO</strong> - Best for low rates</li>
        <li><strong>Progressive</strong> - Best for online experience</li>
        <li><strong>Allstate</strong> - Best for bundling</li>
        <li><strong>USAA</strong> - Best for military families</li>
      </ul>
      
      <!-- In-Content Ad 2 -->
      <div class="ad-slot">
        ${AD_SLOTS.IN_CONTENT_2}
      </div>
      
      <h2>How to Save on {{insurance_type}} in {{state}}</h2>
      
      <div class="grid grid-2">
        <div class="card">
          <h3>Compare Quotes</h3>
          <p>Get quotes from at least 3-5 companies to find the best rate in {{state}}.</p>
        </div>
        <div class="card">
          <h3>Bundle Policies</h3>
          <p>Combine your {{insurance_type}} with home or renters insurance for discounts.</p>
        </div>
        <div class="card">
          <h3>Maintain Good Credit</h3>
          <p>In most states including {{state}}, credit score affects your premiums.</p>
        </div>
        <div class="card">
          <h3>Ask About Discounts</h3>
          <p>Safe driver, good student, and low mileage discounts can save you money.</p>
        </div>
      </div>
      
      <h2 id="quotes">Get {{insurance_type}} Quotes in {{state}}</h2>
      
      <p>Ready to find affordable {{insurance_type}} in {{state}}? Enter your zip code below 
      to compare personalized quotes from top insurers.</p>
      
      <a href="#" class="cta-button">Compare {{state}} Quotes Now →</a>
      
    </article>
    
    <aside class="sidebar">
      <div class="ad-slot ad-slot-sidebar">
        ${AD_SLOTS.SIDEBAR}
      </div>
    </aside>
  </div>
</div>
`
};

// City Page Template
const CITY_PAGE_TEMPLATE: HtmlTemplate = {
    id: 'city-page',
    name: 'City Insurance Page',
    description: 'SEO-optimized template for city-level insurance pages',
    category: 'city',
    variables: ['city', 'state', 'state_abbr', 'insurance_type', 'year', 'avg_rate', 'population', 'zip_codes'],
    adSlots: ['HEADER', 'IN_CONTENT_1', 'IN_CONTENT_2', 'SIDEBAR'],
    css: COMMON_CSS,
    html: `
<div class="container">
  <div class="ad-slot ad-slot-header">
    ${AD_SLOTS.HEADER}
  </div>
  
  <nav class="breadcrumb">
    <a href="/">Home</a> › 
    <a href="/{{insurance_type}}">{{insurance_type}}</a> › 
    <a href="/{{insurance_type}}/{{state_abbr|lower}}">{{state}}</a> › 
    {{city}}
  </nav>
  
  <div class="layout">
    <article class="main-content">
      <h1>{{insurance_type}} in {{city}}, {{state_abbr}} ({{year}})</h1>
      
      <p class="meta">Population: {{population}} • Average: {{avg_rate}}/mo</p>
      
      <p>Compare the best <strong>{{insurance_type}}</strong> rates in <strong>{{city}}, {{state}}</strong>. 
      Our guide helps {{city}} residents find affordable coverage from top-rated insurers.</p>
      
      <a href="#quotes" class="cta-button">Get {{city}} Quotes →</a>
      
      <div class="ad-slot">
        ${AD_SLOTS.IN_CONTENT_1}
      </div>
      
      <h2>{{insurance_type}} Rates in {{city}}, {{state_abbr}}</h2>
      
      <div class="card">
        <p>The average {{insurance_type}} rate in {{city}} is <strong>{{avg_rate}}/month</strong>, 
        which is competitive compared to the {{state}} state average.</p>
        
        <p>Factors affecting your rate in {{city}} include:</p>
        <ul>
          <li>Your driving record and claims history</li>
          <li>The neighborhood where your vehicle is parked</li>
          <li>Your age and years of driving experience</li>
          <li>The type of vehicle you drive</li>
        </ul>
      </div>
      
      <h2>Best Insurance Companies in {{city}}</h2>
      
      <p>These insurers are highly rated by {{city}} residents:</p>
      
      <div class="grid grid-2">
        <div class="card">
          <h3>State Farm</h3>
          <p>Strong local agent network in {{city}} with excellent claims service.</p>
        </div>
        <div class="card">
          <h3>GEICO</h3>
          <p>Consistently low rates for {{city}} drivers.</p>
        </div>
        <div class="card">
          <h3>Progressive</h3>
          <p>Popular among {{city}} residents for usage-based discounts.</p>
        </div>
        <div class="card">
          <h3>Allstate</h3>
          <p>Wide coverage options and bundling discounts for {{city}} homes.</p>
        </div>
      </div>
      
      <div class="ad-slot">
        ${AD_SLOTS.IN_CONTENT_2}
      </div>
      
      <h2>{{city}} ZIP Codes We Serve</h2>
      <p>We provide {{insurance_type}} quotes for all {{city}} ZIP codes including: {{zip_codes}}</p>
      
      <h2 id="quotes">Get Your Free Quote</h2>
      <p>Enter your ZIP code to compare {{insurance_type}} rates from multiple {{city}} insurers:</p>
      <a href="#" class="cta-button">Compare {{city}} Rates →</a>
    </article>
    
    <aside class="sidebar">
      <div class="ad-slot ad-slot-sidebar">
        ${AD_SLOTS.SIDEBAR}
      </div>
    </aside>
  </div>
</div>
`
};

// Comparison Template
const COMPARISON_TEMPLATE: HtmlTemplate = {
    id: 'comparison',
    name: 'Insurance Comparison',
    description: 'Compare insurance companies or coverage types',
    category: 'comparison',
    variables: ['title', 'insurance_type', 'year', 'description'],
    adSlots: ['HEADER', 'IN_CONTENT_1', 'IN_CONTENT_2', 'SIDEBAR'],
    css: COMMON_CSS + `
    .comparison-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    .comparison-table th, .comparison-table td { 
      padding: 12px 16px; 
      text-align: left; 
      border-bottom: 1px solid #e5e7eb;
    }
    .comparison-table th { background: #f9fafb; font-weight: 600; }
    .comparison-table tr:hover { background: #f9fafb; }
    .rating { color: #f59e0b; }
  `,
    html: `
<div class="container">
  <div class="ad-slot ad-slot-header">
    ${AD_SLOTS.HEADER}
  </div>
  
  <nav class="breadcrumb">
    <a href="/">Home</a> › 
    <a href="/{{insurance_type}}">{{insurance_type}}</a> › 
    Compare
  </nav>
  
  <div class="layout">
    <article class="main-content">
      <h1>{{title}} ({{year}} Comparison)</h1>
      
      <p>{{description}}</p>
      
      <a href="#quotes" class="cta-button">Compare Rates Now →</a>
      
      <div class="ad-slot">
        ${AD_SLOTS.IN_CONTENT_1}
      </div>
      
      <h2>Top {{insurance_type}} Companies Compared</h2>
      
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Best For</th>
            <th>Rating</th>
            <th>Avg. Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>State Farm</strong></td>
            <td>Overall coverage</td>
            <td class="rating">★★★★★</td>
            <td>$125/mo</td>
          </tr>
          <tr>
            <td><strong>GEICO</strong></td>
            <td>Low rates</td>
            <td class="rating">★★★★☆</td>
            <td>$98/mo</td>
          </tr>
          <tr>
            <td><strong>Progressive</strong></td>
            <td>Online tools</td>
            <td class="rating">★★★★☆</td>
            <td>$110/mo</td>
          </tr>
          <tr>
            <td><strong>Allstate</strong></td>
            <td>Bundling</td>
            <td class="rating">★★★★☆</td>
            <td>$135/mo</td>
          </tr>
          <tr>
            <td><strong>USAA</strong></td>
            <td>Military</td>
            <td class="rating">★★★★★</td>
            <td>$85/mo</td>
          </tr>
        </tbody>
      </table>
      
      <div class="ad-slot">
        ${AD_SLOTS.IN_CONTENT_2}
      </div>
      
      <h2>How We Rank Insurance Companies</h2>
      
      <p>Our comparison considers:</p>
      <ul>
        <li><strong>Price</strong> - Average premiums and available discounts</li>
        <li><strong>Coverage</strong> - Policy options and add-ons</li>
        <li><strong>Service</strong> - Claims handling and customer support</li>
        <li><strong>Financial strength</strong> - Ability to pay claims</li>
      </ul>
      
      <h2 id="quotes">Find Your Best Match</h2>
      <p>Enter your details to see personalized rates from these top insurers:</p>
      <a href="#" class="cta-button">Get Personalized Quotes →</a>
    </article>
    
    <aside class="sidebar">
      <div class="ad-slot ad-slot-sidebar">
        ${AD_SLOTS.SIDEBAR}
      </div>
    </aside>
  </div>
</div>
`
};

// Guide/FAQ Template
const GUIDE_TEMPLATE: HtmlTemplate = {
    id: 'guide',
    name: 'Insurance Guide',
    description: 'Educational content with FAQ section',
    category: 'guide',
    variables: ['title', 'insurance_type', 'year', 'description'],
    adSlots: ['HEADER', 'IN_CONTENT_1', 'IN_CONTENT_2', 'IN_CONTENT_3', 'SIDEBAR'],
    css: COMMON_CSS + `
    .faq-item { border-bottom: 1px solid #e5e7eb; padding: 1rem 0; }
    .faq-item:last-child { border-bottom: none; }
    .faq-question { font-weight: 600; color: #1a1a1a; margin-bottom: 0.5rem; }
    .faq-answer { color: #4b5563; }
    .toc { background: #f9fafb; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; }
    .toc ul { margin: 0; }
    .toc a { color: #2563eb; }
  `,
    html: `
<div class="container">
  <div class="ad-slot ad-slot-header">
    ${AD_SLOTS.HEADER}
  </div>
  
  <nav class="breadcrumb">
    <a href="/">Home</a> › 
    <a href="/guides">Guides</a> › 
    {{title}}
  </nav>
  
  <div class="layout">
    <article class="main-content">
      <h1>{{title}}</h1>
      
      <p class="meta">Updated {{year}} • 10 min read</p>
      
      <p>{{description}}</p>
      
      <div class="toc">
        <strong>Table of Contents</strong>
        <ul>
          <li><a href="#basics">Understanding the Basics</a></li>
          <li><a href="#types">Types of Coverage</a></li>
          <li><a href="#costs">What Affects Your Cost</a></li>
          <li><a href="#faq">Frequently Asked Questions</a></li>
        </ul>
      </div>
      
      <div class="ad-slot">
        ${AD_SLOTS.IN_CONTENT_1}
      </div>
      
      <h2 id="basics">Understanding the Basics</h2>
      
      <p>{{insurance_type}} protects you financially against unexpected events. Here's what you need to know:</p>
      
      <ul>
        <li><strong>Premium</strong> - The amount you pay for coverage (monthly or annually)</li>
        <li><strong>Deductible</strong> - What you pay out-of-pocket before insurance kicks in</li>
        <li><strong>Coverage limit</strong> - Maximum amount the insurer will pay</li>
        <li><strong>Policy term</strong> - How long your coverage lasts</li>
      </ul>
      
      <h2 id="types">Types of Coverage</h2>
      
      <div class="grid grid-2">
        <div class="card">
          <h3>Basic Coverage</h3>
          <p>Meets minimum legal requirements at the lowest cost.</p>
        </div>
        <div class="card">
          <h3>Standard Coverage</h3>
          <p>Balanced protection for most situations.</p>
        </div>
        <div class="card">
          <h3>Premium Coverage</h3>
          <p>Comprehensive protection with higher limits.</p>
        </div>
        <div class="card">
          <h3>Custom Coverage</h3>
          <p>Tailored to your specific needs and assets.</p>
        </div>
      </div>
      
      <div class="ad-slot">
        ${AD_SLOTS.IN_CONTENT_2}
      </div>
      
      <h2 id="costs">What Affects Your Cost</h2>
      
      <p>Your {{insurance_type}} premium depends on several factors:</p>
      
      <ol>
        <li><strong>Location</strong> - Where you live affects rates significantly</li>
        <li><strong>Coverage level</strong> - More protection costs more</li>
        <li><strong>Personal factors</strong> - Age, history, and credit score</li>
        <li><strong>Discounts</strong> - Bundling, good driver, etc.</li>
      </ol>
      
      <div class="ad-slot">
        ${AD_SLOTS.IN_CONTENT_3}
      </div>
      
      <h2 id="faq">Frequently Asked Questions</h2>
      
      <div class="faq-item">
        <p class="faq-question">How much {{insurance_type}} do I need?</p>
        <p class="faq-answer">The right amount depends on your assets, risk tolerance, and state requirements. We recommend at least enough to protect your net worth.</p>
      </div>
      
      <div class="faq-item">
        <p class="faq-question">Can I switch insurance companies anytime?</p>
        <p class="faq-answer">Yes, you can switch at any time. Most companies offer prorated refunds for unused coverage.</p>
      </div>
      
      <div class="faq-item">
        <p class="faq-question">How do I lower my premiums?</p>
        <p class="faq-answer">Compare quotes, ask about discounts, bundle policies, maintain good credit, and consider raising your deductible.</p>
      </div>
      
      <a href="#" class="cta-button">Get Your Free Quote →</a>
    </article>
    
    <aside class="sidebar">
      <div class="ad-slot ad-slot-sidebar">
        ${AD_SLOTS.SIDEBAR}
      </div>
    </aside>
  </div>
</div>
`
};

// Landing Page Template
const LANDING_TEMPLATE: HtmlTemplate = {
    id: 'landing',
    name: 'Landing Page',
    description: 'High-converting landing page for lead generation',
    category: 'landing',
    variables: ['title', 'subtitle', 'insurance_type', 'cta_text'],
    adSlots: ['HEADER', 'FOOTER'],
    css: COMMON_CSS + `
    .hero { 
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }
    .hero h1 { color: white; font-size: 3rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem; }
    .hero .cta-button { background: white; color: #1e3a8a; font-size: 1.25rem; }
    .hero .cta-button:hover { background: #f0f0f0; }
    .features { padding: 4rem 0; }
    .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .trust { background: #f9fafb; padding: 3rem 0; text-align: center; }
    .trust-logos { display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; opacity: 0.6; }
  `,
    html: `
<div class="ad-slot ad-slot-header container">
  ${AD_SLOTS.HEADER}
</div>

<section class="hero">
  <div class="container">
    <h1>{{title}}</h1>
    <p>{{subtitle}}</p>
    <a href="#form" class="cta-button">{{cta_text}}</a>
  </div>
</section>

<section class="features">
  <div class="container">
    <h2 style="text-align: center; margin-bottom: 2rem;">Why Choose Us for {{insurance_type}}?</h2>
    
    <div class="grid grid-3">
      <div class="card" style="text-align: center;">
        <div class="feature-icon">💰</div>
        <h3>Save Up to 40%</h3>
        <p>Compare rates from 50+ top insurers to find the lowest price.</p>
      </div>
      <div class="card" style="text-align: center;">
        <div class="feature-icon">⚡</div>
        <h3>2-Minute Quotes</h3>
        <p>Get personalized quotes in under 2 minutes. No phone calls required.</p>
      </div>
      <div class="card" style="text-align: center;">
        <div class="feature-icon">🛡️</div>
        <h3>Trusted Partners</h3>
        <p>We only work with A-rated, financially stable insurance companies.</p>
      </div>
    </div>
  </div>
</section>

<section class="trust">
  <div class="container">
    <p style="margin-bottom: 1.5rem; font-weight: 600;">Trusted by 500,000+ customers</p>
    <div class="trust-logos">
      <span>State Farm</span>
      <span>GEICO</span>
      <span>Progressive</span>
      <span>Allstate</span>
      <span>Liberty Mutual</span>
    </div>
  </div>
</section>

<section id="form" class="features">
  <div class="container" style="max-width: 600px; text-align: center;">
    <h2>Get Your Free {{insurance_type}} Quote</h2>
    <p>Enter your ZIP code to see personalized rates:</p>
    <a href="#" class="cta-button">{{cta_text}}</a>
  </div>
</section>

<div class="ad-slot container">
  ${AD_SLOTS.FOOTER}
</div>
`
};

// Export all templates
export const HTML_TEMPLATES: HtmlTemplate[] = [
    STATE_PAGE_TEMPLATE,
    CITY_PAGE_TEMPLATE,
    COMPARISON_TEMPLATE,
    GUIDE_TEMPLATE,
    LANDING_TEMPLATE,
];

export function getTemplateById(id: string): HtmlTemplate | undefined {
    return HTML_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: HtmlTemplate['category']): HtmlTemplate[] {
    return HTML_TEMPLATES.filter(t => t.category === category);
}
