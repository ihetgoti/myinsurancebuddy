import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { GeoLevel } from '@myinsurancebuddy/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';
import HtmlTemplateRenderer from '@/components/HtmlTemplateRenderer';
import PageWrapper from '@/components/PageWrapper';
import { LocalBusinessSchema } from '@/components/SchemaMarkup';
import { Building2, MapPin, FileText, Shield, ArrowRight, ChevronDown } from 'lucide-react';
import { AutoInsuranceTemplate, HealthInsuranceTemplate, HomeInsuranceTemplate } from '@/components/templates';

/**
 * ISR Configuration for optimal performance at scale
 * - revalidate: Pages regenerate every 3600 seconds (1 hour)
 * - This allows serving cached pages while updating in background
 * - For 100k+ pages, this prevents DB overload on high traffic
 */
export const revalidate = false; // ISR: On-Demand revalidation only (infinite cache)
export const dynamicParams = true; // Allow dynamic routes not in generateStaticParams

interface PageProps {
    params: {
        slug: string[];
    };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolved = await resolveRoute(params.slug);

    if (!resolved.page && !resolved.insuranceType) {
        return { title: 'Not Found' };
    }

    const { page, insuranceType, country, state, city } = resolved;

    // Build variables for template replacement
    const variables = buildVariables(insuranceType, country, state, city, page);

    // If page has template-based SEO, use it
    if (page?.template?.seoTitleTemplate) {
        const title = replaceVariables(page.template.seoTitleTemplate, variables);
        const description = page.template.seoDescTemplate
            ? replaceVariables(page.template.seoDescTemplate, variables)
            : page.metaDescription || buildDescription(insuranceType, country, state, city);

        return {
            title,
            description,
            openGraph: {
                title: page.ogTitle || title,
                description: page.ogDescription || description,
                type: (page.ogType as any) || 'website',
                images: page.ogImage ? [page.ogImage] : undefined,
            },
            twitter: {
                card: (page.twitterCard as any) || 'summary_large_image',
                title: page.twitterTitle || title,
                description: page.twitterDesc || description,
                images: page.twitterImage ? [page.twitterImage] : undefined,
            },
            robots: page.robots || 'index,follow',
            alternates: page.canonicalTag ? { canonical: page.canonicalTag } : undefined,
        };
    }

    // Fallback to default SEO
    const defaultTitle = page?.metaTitle || buildTitle(insuranceType, country, state, city);
    const defaultDesc = page?.metaDescription || buildDescription(insuranceType, country, state, city);

    return {
        title: defaultTitle,
        description: defaultDesc,
        openGraph: {
            title: defaultTitle,
            description: defaultDesc,
            type: 'website',
        },
    };
}

// Resolve URL segments to database entities
async function resolveRoute(segments: string[]) {
    // First, try to find a page by exact slug match
    const fullSlug = segments.join('/');
    const pageBySlug = await prisma.page.findUnique({
        where: { slug: fullSlug },
        include: {
            template: true,
            insuranceType: true,
            country: true,
            state: true,
            city: true,
        },
    });

    if (pageBySlug && pageBySlug.isPublished) {
        return {
            page: pageBySlug,
            insuranceType: pageBySlug.insuranceType,
            country: pageBySlug.country,
            state: pageBySlug.state,
            city: pageBySlug.city,
            geoLevel: pageBySlug.geoLevel,
        };
    }

    // Fallback to hierarchical resolution
    const [insuranceTypeSlug, countryCode, stateSlug, citySlug] = segments;

    // Find insurance type
    const insuranceType = await prisma.insuranceType.findUnique({
        where: { slug: insuranceTypeSlug },
    });

    if (!insuranceType) {
        return { insuranceType: null, country: null, state: null, city: null, page: null, geoLevel: null };
    }

    let country = null;
    let state = null;
    let city = null;
    let geoLevel: GeoLevel = 'NICHE';

    // Get country if provided
    if (countryCode) {
        country = await prisma.country.findUnique({
            where: { code: countryCode.toLowerCase() },
        });
        if (!country) {
            return { insuranceType, country: null, state: null, city: null, page: null, geoLevel };
        }
        geoLevel = 'COUNTRY';
    }

    // Get state if provided
    if (stateSlug && country) {
        state = await prisma.state.findFirst({
            where: { countryId: country.id, slug: stateSlug.toLowerCase() },
        });
        if (!state) {
            return { insuranceType, country, state: null, city: null, page: null, geoLevel };
        }
        geoLevel = 'STATE';
    }

    // Get city if provided
    if (citySlug && state) {
        city = await prisma.city.findFirst({
            where: { stateId: state.id, slug: citySlug.toLowerCase() },
        });
        if (!city) {
            return { insuranceType, country, state, city: null, page: null, geoLevel };
        }
        geoLevel = 'CITY';
    }

    // Find the matching page
    const page = await prisma.page.findFirst({
        where: {
            insuranceTypeId: insuranceType.id,
            geoLevel,
            countryId: country?.id || null,
            stateId: state?.id || null,
            cityId: city?.id || null,
            isPublished: true,
        },
        include: {
            template: true,
        },
    });

    return { insuranceType, country, state, city, page, geoLevel };
}

function buildVariables(insuranceType: any, country: any, state: any, city: any, page: any): Record<string, any> {
    const currentDate = new Date();
    const location = city?.name || state?.name || country?.name || '';

    // Base variables from geo hierarchy
    const baseVars: Record<string, any> = {
        // Page-level
        page_title: page?.title || buildTitle(insuranceType, country, state, city).replace(' | MyInsuranceBuddies', ''),
        page_subtitle: page?.subtitle || buildDescription(insuranceType, country, state, city),

        // Insurance type
        insurance_type: insuranceType?.name || 'Insurance',
        insurance_type_name: insuranceType?.name || 'Insurance',
        insurance_type_slug: insuranceType?.slug || 'insurance',

        // Country
        country: country?.name || '',
        country_name: country?.name || '',
        country_code: country?.code?.toUpperCase() || '',

        // State (multiple alias names for flexibility)
        state: state?.name || '',
        state_name: state?.name || '',
        state_code: state?.code || '',
        state_code_lower: state?.code?.toLowerCase() || '',
        state_slug: state?.slug || '',

        // City
        city: city?.name || '',
        city_name: city?.name || '',
        city_slug: city?.slug || '',

        // Combined location
        location: location,
        location_name: location,

        // Insurance data from state
        avg_premium: state?.avgPremium ? `$${state.avgPremium}` : '$150',
        avg_savings: '$500',
        min_coverage: state?.minCoverage || {},
        population: city?.population?.toLocaleString() || state?.population?.toLocaleString() || '',

        // Date/time
        current_year: currentDate.getFullYear().toString(),
        current_month: currentDate.toLocaleString('default', { month: 'long' }),
        year: currentDate.getFullYear().toString(),

        // Site info
        site_name: 'MyInsuranceBuddies',
        site_url: 'https://myinsurancebuddies.com',

        // Template-friendly aliases (commonly used in HTML templates)
        h1_title: page?.title || buildTitle(insuranceType, country, state, city).replace(' | MyInsuranceBuddies', ''),
        meta_title: page?.metaTitle || buildTitle(insuranceType, country, state, city),
        meta_description: page?.metaDescription || buildDescription(insuranceType, country, state, city),
        hero_title: page?.title || buildTitle(insuranceType, country, state, city).replace(' | MyInsuranceBuddies', ''),
        hero_tagline: page?.subtitle || `Compare ${insuranceType?.name || 'insurance'} quotes in ${location}`,
        hero_description: page?.metaDescription || buildDescription(insuranceType, country, state, city),
    };

    // Parse min_coverage for individual fields
    if (state?.minCoverage && typeof state.minCoverage === 'object') {
        const coverage = state.minCoverage as any;
        baseVars.bodily_injury_per_person = coverage.bodilyInjuryPerPerson || coverage.bodily_injury_per_person || '';
        baseVars.bodily_injury_per_accident = coverage.bodilyInjuryPerAccident || coverage.bodily_injury_per_accident || '';
        baseVars.property_damage = coverage.propertyDamage || coverage.property_damage || '';
        baseVars.coverage_format = coverage.format || `${baseVars.bodily_injury_per_person}/${baseVars.bodily_injury_per_accident}/${baseVars.property_damage}`;
        baseVars.is_no_fault = coverage.isNoFault || coverage.no_fault || false;
        baseVars.pip_required = coverage.pipRequired || coverage.pip_required || false;
        baseVars.um_required = coverage.umRequired || coverage.um_required || false;
    }

    // Merge custom data from page (overrides base vars)
    const customData = (page?.customData as Record<string, any>) || {};

    // Merge AI-generated content (highest priority)
    const aiContent = (page?.aiGeneratedContent as Record<string, any>) || {};

    // Map AI content to template variable names
    const aiVars: Record<string, any> = {};
    if (aiContent.intro) {
        aiVars.intro_content = aiContent.intro;
        aiVars.ai_intro = aiContent.intro;
    }
    if (aiContent.requirements) {
        aiVars.requirements_content = aiContent.requirements;
        aiVars.ai_requirements = aiContent.requirements;
    }
    if (aiContent.faqs && Array.isArray(aiContent.faqs)) {
        aiVars.faqs = aiContent.faqs;
        aiVars.ai_faq = aiContent.faqs;
    }
    if (aiContent.tips && Array.isArray(aiContent.tips)) {
        aiVars.tips_content = aiContent.tips;
        aiVars.ai_tips = aiContent.tips;
    }

    // NEW: Map additional AI-generated SEO sections
    if (aiContent.costBreakdown && Array.isArray(aiContent.costBreakdown)) {
        aiVars.costBreakdown = aiContent.costBreakdown;
        aiVars.ai_costBreakdown = aiContent.costBreakdown;
    }
    if (aiContent.comparison && Array.isArray(aiContent.comparison)) {
        aiVars.comparison = aiContent.comparison;
        aiVars.ai_comparison = aiContent.comparison;
    }
    if (aiContent.discounts && Array.isArray(aiContent.discounts)) {
        aiVars.discounts_ai = aiContent.discounts;
        aiVars.ai_discounts = aiContent.discounts;
    }
    if (aiContent.localStats && Array.isArray(aiContent.localStats)) {
        aiVars.localStats = aiContent.localStats;
        aiVars.ai_localStats = aiContent.localStats;
    }
    if (aiContent.coverageGuide && Array.isArray(aiContent.coverageGuide)) {
        aiVars.coverageGuide = aiContent.coverageGuide;
        aiVars.ai_coverageGuide = aiContent.coverageGuide;
    }
    if (aiContent.claimsProcess) {
        aiVars.claimsProcess = aiContent.claimsProcess;
        aiVars.ai_claimsProcess = aiContent.claimsProcess;
    }
    if (aiContent.buyersGuide) {
        aiVars.buyersGuide = aiContent.buyersGuide;
        aiVars.ai_buyersGuide = aiContent.buyersGuide;
    }

    return {
        ...baseVars,
        ...customData,
        ...aiVars, // AI content takes priority
    };
}


/**
 * Replace template variables with actual values
 * CRITICAL: Removes unresolved variables to prevent raw tokens from rendering
 * @param template - String containing {{variable}} placeholders
 * @param variables - Key-value map of variable replacements
 * @returns Processed string with variables replaced
 */
function replaceVariables(template: string, variables: Record<string, any>): string {
    if (!template) return '';

    let result = template;

    // Replace all known variables
    Object.entries(variables).forEach(([key, value]) => {
        // Escape special regex characters in key
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Convert value to string, handling objects/arrays
        const stringValue = value === null || value === undefined
            ? ''
            : typeof value === 'object'
                ? JSON.stringify(value)
                : String(value);
        result = result.replace(new RegExp(`{{${escapedKey}}}`, 'g'), stringValue);
    });

    // SECURITY: Remove any remaining unreplaced variables to prevent raw token display
    // Log warning in development for debugging
    const unresolvedMatches = result.match(/{{[^}]+}}/g);
    if (unresolvedMatches && process.env.NODE_ENV === 'development') {
        console.warn('[Template] Unresolved variables found:', unresolvedMatches);
    }
    result = result.replace(/{{[^}]+}}/g, '');

    return result;
}


function buildTitle(insuranceType: any, country: any, state: any, city: any): string {
    const parts = [insuranceType?.name || 'Insurance'];
    if (city) parts.push(`in ${city.name}`);
    else if (state) parts.push(`in ${state.name}`);
    else if (country) parts.push(`in ${country.name}`);
    parts.push('| MyInsuranceBuddies');
    return parts.join(' ');
}

function buildDescription(insuranceType: any, country: any, state: any, city: any): string {
    const location = city?.name || state?.name || country?.name || '';
    const typeName = insuranceType?.name?.toLowerCase() || 'insurance';

    if (location) {
        return `Find the best ${typeName} in ${location}. Compare rates, coverage options, and get expert advice tailored to your location.`;
    }
    return `Comprehensive guide to ${typeName}. Compare options, understand coverage, and make informed decisions.`;
}

// Get related links for internal linking
async function getRelatedLinks(insuranceType: any, country: any, state: any, city: any) {
    const links: any = {
        otherNiches: [],
        nearbyCities: [],
        parentLocations: [],
    };

    if (!insuranceType) return links;

    // Get other insurance types at the same location
    const otherTypes = await prisma.insuranceType.findMany({
        where: {
            isActive: true,
            NOT: { id: insuranceType.id }
        },
        take: 5,
    });

    links.otherNiches = otherTypes.map(type => {
        const parts = [type.slug];
        if (country) parts.push(country.code);
        if (state) parts.push(state.slug);
        if (city) parts.push(city.slug);

        return {
            icon: type.icon || '📋',
            label: type.name,
            href: `/${parts.join('/')}`,
        };
    });

    // Get nearby cities in the same state
    if (state && city && insuranceType && country) {
        const nearbyCities = await prisma.city.findMany({
            where: {
                stateId: state.id,
                isActive: true,
                NOT: { id: city.id },
                // Only show cities that have a published page for this insurance type
                pages: {
                    some: {
                        insuranceTypeId: insuranceType.id,
                        isPublished: true
                    }
                }
            },
            take: 5,
        });

        links.nearbyCities = nearbyCities.map((c: any) => ({
            label: `${insuranceType.name} in ${c.name}`,
            href: `/${insuranceType.slug}/${country.code}/${state.slug}/${c.slug}`,
        }));
    }

    // Parent locations
    if (city && insuranceType && state && country) {
        links.parentLocations = [
            { label: `All ${insuranceType.name} in ${state.name}`, href: `/${insuranceType.slug}/${country.code}/${state.slug}` },
            { label: `All ${insuranceType.name} in ${country.name}`, href: `/${insuranceType.slug}/${country.code}` },
        ];
    } else if (state && insuranceType && country) {
        links.parentLocations = [
            { label: `All ${insuranceType.name} in ${country.name}`, href: `/${insuranceType.slug}/${country.code}` },
            { label: `${insuranceType.name} Overview`, href: `/${insuranceType.slug}` },
        ];
    } else if (country && insuranceType) {
        links.parentLocations = [
            { label: `${insuranceType.name} Overview`, href: `/${insuranceType.slug}` },
        ];
    }

    return links;
}

// Generate JSON-LD Schema
function generateSchema(insuranceType: any, country: any, state: any, city: any, page: any) {
    const schemas: any[] = [];
    const location = city?.name || state?.name || country?.name;

    // Organization schema
    schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MyInsuranceBuddies',
        url: 'https://myinsurancebuddies.com',
        logo: 'https://myinsurancebuddies.com/logo.png',
    });

    // WebPage schema
    schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page?.title || buildTitle(insuranceType, country, state, city),
        description: page?.metaDescription || buildDescription(insuranceType, country, state, city),
        url: `https://myinsurancebuddies.com/${page?.slug || insuranceType?.slug}`,
    });

    // Breadcrumb schema
    const breadcrumbItems: any[] = [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myinsurancebuddies.com' },
    ];

    if (insuranceType) {
        breadcrumbItems.push({
            '@type': 'ListItem',
            position: 2,
            name: insuranceType.name,
            item: `https://myinsurancebuddies.com/${insuranceType.slug}`,
        });
    }

    if (country) {
        breadcrumbItems.push({
            '@type': 'ListItem',
            position: 3,
            name: country.name,
            item: `https://myinsurancebuddies.com/${insuranceType?.slug}/${country.code}`,
        });
    }

    if (state) {
        breadcrumbItems.push({
            '@type': 'ListItem',
            position: 4,
            name: state.name,
            item: `https://myinsurancebuddies.com/${insuranceType?.slug}/${country?.code}/${state.slug}`,
        });
    }

    if (city) {
        breadcrumbItems.push({
            '@type': 'ListItem',
            position: 5,
            name: city.name,
            item: `https://myinsurancebuddies.com/${insuranceType?.slug}/${country?.code}/${state?.slug}/${city.slug}`,
        });
    }

    schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
    });

    // FAQ schema if page has FAQ content
    if (page?.schemaMarkup) {
        schemas.push(page.schemaMarkup);
    }

    return schemas;
}

/**
 * Generate static params for high-priority pages at build time
 * This pre-renders important pages for instant loading
 * Limited to prevent excessive build times with 100k+ pages
 */
export async function generateStaticParams() {
    // Return empty array - pages are generated on-demand via ISR
    // This prevents build failures when DATABASE_URL is not accessible from CI/CD
    return [];
}

export default async function DynamicPage({ params }: PageProps) {
    const { insuranceType, country, state, city, page } = await resolveRoute(params.slug);

    // If nothing found, show 404
    if (!insuranceType && !page) {
        notFound();
    }

    // Fetch data for header navigation and stats
    const [allInsuranceTypes, allStates, totalPages, totalStates, totalCities, affiliatePartners] = await Promise.all([
        prisma.insuranceType.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        }),
        prisma.state.findMany({
            where: { isActive: true },
            include: { country: true },
            orderBy: { name: 'asc' },
            take: 10,
        }),
        prisma.page.count({ where: { isPublished: true } }),
        prisma.state.count({ where: { isActive: true } }),
        prisma.city.count({ where: { isActive: true } }),
        // Fetch affiliates filtered by insurance type (niche)
        prisma.affiliatePartner.findMany({
            where: {
                isActive: true,
                // Filter by insurance type if we have one
                ...(insuranceType?.slug ? {
                    insuranceTypes: { has: insuranceType.slug.replace('-insurance', '') }
                } : {}),
            },
            orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
            take: 6,
        }),
    ]);

    // Check if template allows affiliates
    const showAffiliates = page?.template?.showAffiliates !== false && affiliatePartners.length > 0;

    // Check layout settings (Bridge Page support)
    const showHeader = page?.template?.includeHeader !== false;
    const showFooter = page?.template?.includeFooter !== false;

    // Get primary offer for Bridge Pages
    const primaryOffer = affiliatePartners[0];

    // Get related links for internal linking
    const relatedLinks = await getRelatedLinks(insuranceType, country, state, city);

    // Build variables
    const variables = buildVariables(insuranceType, country, state, city, page);

    // Inject Affiliate Offers
    if (primaryOffer) {
        variables.primary_offer_link = primaryOffer.affiliateUrl || '#';
        variables.primary_offer_name = primaryOffer.name;
        variables.primary_offer_cta = primaryOffer.ctaText || 'Get Quote';
    }

    // Generate schema
    const schemas = generateSchema(insuranceType, country, state, city, page);

    // Build location string
    const location = city?.name || state?.name || country?.name;
    const locationBadge = city
        ? `${city.name}, ${state?.name}`
        : state
            ? `${state.name}, ${country?.name}`
            : country?.name;

    // PRIORITY 0: Use niche-specific React templates for Auto, Health, Home insurance
    const nicheSlug = insuranceType?.slug;

    if (nicheSlug === 'car-insurance') {
        return (
            <PageWrapper
                pageType="insurance"
                insuranceType={insuranceType?.name}
                insuranceTypeSlug={nicheSlug}
                stateName={state?.name}
                stateCode={state?.code}
                stateId={state?.id}
                cityName={city?.name}
                enablePopups={true}
            >
                <div className="min-h-screen bg-white">
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
                    />
                    {/* LocalBusiness Schema for geo-targeted SEO */}
                    {state && (
                        <LocalBusinessSchema
                            name={`${insuranceType?.name} in ${state?.name}`}
                            description={`Compare ${insuranceType?.name?.toLowerCase()} rates in ${state?.name}. Get free quotes from top providers.`}
                            insuranceType={insuranceType?.name}
                            stateName={state?.name}
                            stateCode={state?.code}
                            cityName={city?.name}
                            url={`https://myinsurancebuddies.com/${page?.slug || nicheSlug}`}
                            rating={4.8}
                            reviewCount={1250}
                        />
                    )}
                    {showHeader && <Header insuranceTypes={allInsuranceTypes} states={allStates} />}
                    <AutoInsuranceTemplate
                        variables={variables}
                        affiliates={affiliatePartners}
                        relatedLinks={relatedLinks}
                        insuranceTypeId={insuranceType?.id}
                        stateId={state?.id}
                    />
                    {showFooter && <Footer insuranceTypes={allInsuranceTypes} />}
                </div>
            </PageWrapper>
        );
    }

    if (nicheSlug === 'health-insurance') {
        return (
            <PageWrapper
                pageType="insurance"
                insuranceType={insuranceType?.name}
                insuranceTypeSlug={nicheSlug}
                stateName={state?.name}
                stateCode={state?.code}
                stateId={state?.id}
                cityName={city?.name}
                enablePopups={true}
            >
                <div className="min-h-screen bg-white">
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
                    />
                    {state && (
                        <LocalBusinessSchema
                            name={`${insuranceType?.name} in ${state?.name}`}
                            description={`Find affordable ${insuranceType?.name?.toLowerCase()} plans in ${state?.name}. Compare marketplace options and get subsidies.`}
                            insuranceType={insuranceType?.name}
                            stateName={state?.name}
                            stateCode={state?.code}
                            cityName={city?.name}
                            url={`https://myinsurancebuddies.com/${page?.slug || nicheSlug}`}
                            rating={4.8}
                            reviewCount={980}
                        />
                    )}
                    {showHeader && <Header insuranceTypes={allInsuranceTypes} states={allStates} />}
                    <HealthInsuranceTemplate
                        variables={variables}
                        affiliates={affiliatePartners}
                        relatedLinks={relatedLinks}
                        insuranceTypeId={insuranceType?.id}
                        stateId={state?.id}
                    />
                    {showFooter && <Footer insuranceTypes={allInsuranceTypes} />}
                </div>
            </PageWrapper>
        );
    }

    if (nicheSlug === 'home-insurance' || nicheSlug === 'homeowners-insurance') {
        return (
            <PageWrapper
                pageType="insurance"
                insuranceType={insuranceType?.name}
                insuranceTypeSlug={nicheSlug}
                stateName={state?.name}
                stateCode={state?.code}
                stateId={state?.id}
                cityName={city?.name}
                enablePopups={true}
            >
                <div className="min-h-screen bg-white">
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
                    />
                    {state && (
                        <LocalBusinessSchema
                            name={`${insuranceType?.name} in ${state?.name}`}
                            description={`Protect your home with ${insuranceType?.name?.toLowerCase()} in ${state?.name}. Compare rates from top providers.`}
                            insuranceType={insuranceType?.name}
                            stateName={state?.name}
                            stateCode={state?.code}
                            cityName={city?.name}
                            url={`https://myinsurancebuddies.com/${page?.slug || nicheSlug}`}
                            rating={4.7}
                            reviewCount={875}
                        />
                    )}
                    {showHeader && <Header insuranceTypes={allInsuranceTypes} states={allStates} />}
                    <HomeInsuranceTemplate
                        variables={variables}
                        affiliates={affiliatePartners}
                        relatedLinks={relatedLinks}
                        insuranceTypeId={insuranceType?.id}
                        stateId={state?.id}
                    />
                    {showFooter && <Footer insuranceTypes={allInsuranceTypes} />}
                </div>
            </PageWrapper>
        );
    }

    // PRIORITY 1: If template has HTML content, render with Handlebars-style substitution
    if (page?.template?.htmlContent) {
        return (
            <div className="min-h-screen bg-white">
                {/* Schema.org JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
                />

                {showHeader && <Header insuranceTypes={allInsuranceTypes} states={allStates} />}

                <HtmlTemplateRenderer
                    htmlContent={page.template.htmlContent}
                    cssContent={page.template.customCss}
                    variables={variables}
                />

                {/* Interlinking Section */}
                <section className="bg-slate-50 border-t border-slate-200 py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Nearby Cities */}
                            {relatedLinks.nearbyCities.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Nearby Cities</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.nearbyCities.slice(0, 8).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
                                                    → {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Other Insurance Types */}
                            {relatedLinks.otherNiches.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Other Insurance Types</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.otherNiches.slice(0, 6).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2">
                                                    <span>{link.icon}</span> {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Parent Locations */}
                            {relatedLinks.parentLocations.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Browse More</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.parentLocations.map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
                                                    → {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Affiliate Partners Section */}
                {showAffiliates && (
                    <section className="py-12 bg-white border-t border-slate-200">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Compare Top {insuranceType?.name || 'Insurance'} Providers</h2>
                                <p className="text-slate-500 text-sm">Get quotes from trusted insurance carriers</p>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                {affiliatePartners.map((partner: any) => (
                                    <a
                                        key={partner.id}
                                        href={partner.affiliateUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group flex items-center gap-4 p-5 bg-white rounded-lg border hover:shadow-lg transition-all ${partner.affiliateUrl
                                            ? 'border-slate-200 hover:border-blue-500'
                                            : 'border-dashed border-slate-300 opacity-60'
                                            }`}
                                    >
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {partner.logo ? (
                                                <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <span className="text-xl font-bold text-slate-400">{partner.name[0]}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                                {partner.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 truncate">
                                                {partner.description || `${insuranceType?.name || 'Insurance'} provider`}
                                            </p>
                                        </div>
                                        <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 ${partner.affiliateUrl
                                            ? 'bg-blue-600 text-white group-hover:bg-blue-700'
                                            : 'bg-slate-200 text-slate-500'
                                            }`}>
                                            {partner.ctaText || 'Get Quote'}
                                        </span>
                                    </a>
                                ))}
                            </div>
                            <p className="text-center text-xs text-slate-400 mt-6">
                                Clicking these links may take you to partner websites. We may earn a commission at no extra cost to you.
                            </p>
                        </div>
                    </section>
                )}

                {showFooter && <Footer insuranceTypes={allInsuranceTypes} />}

                {/* Custom JS from template */}
                {page.template.customJs && (
                    <script dangerouslySetInnerHTML={{ __html: page.template.customJs }} />
                )}
            </div>
        );
    }

    // PRIORITY 2: If page has template with component sections, render dynamically
    if (page?.template?.sections && Array.isArray(page.template.sections) && page.template.sections.length > 0) {
        return (
            <div className="min-h-screen bg-white">
                {/* Schema.org JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
                />

                {/* Custom CSS from template */}
                {page.template.customCss && (
                    <style dangerouslySetInnerHTML={{ __html: page.template.customCss }} />
                )}

                {showHeader && <Header insuranceTypes={allInsuranceTypes} states={allStates} />}

                <DynamicPageRenderer
                    sections={page.template.sections as any[]}
                    pageContent={page.content as any[] || []}
                    variables={variables}
                />

                {/* Interlinking Section */}
                <section className="bg-slate-50 border-t border-slate-200 py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Nearby Cities */}
                            {relatedLinks.nearbyCities.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Nearby Cities</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.nearbyCities.slice(0, 8).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
                                                    → {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Other Insurance Types */}
                            {relatedLinks.otherNiches.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Other Insurance Types</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.otherNiches.slice(0, 6).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2">
                                                    <span>{link.icon}</span> {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Parent Locations */}
                            {relatedLinks.parentLocations.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Browse More</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.parentLocations.map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
                                                    → {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Affiliate Partners Section */}
                {showAffiliates && (
                    <section className="py-12 bg-white border-t border-slate-200">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Compare Top {insuranceType?.name || 'Insurance'} Providers</h2>
                                <p className="text-slate-500 text-sm">Get quotes from trusted insurance carriers</p>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                {affiliatePartners.map((partner: any) => (
                                    <a
                                        key={partner.id}
                                        href={partner.affiliateUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group flex items-center gap-4 p-5 bg-white rounded-lg border hover:shadow-lg transition-all ${partner.affiliateUrl
                                            ? 'border-slate-200 hover:border-blue-500'
                                            : 'border-dashed border-slate-300 opacity-60'
                                            }`}
                                    >
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {partner.logo ? (
                                                <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <span className="text-xl font-bold text-slate-400">{partner.name[0]}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                                {partner.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 truncate">
                                                {partner.description || `${insuranceType?.name || 'Insurance'} provider`}
                                            </p>
                                        </div>
                                        <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 ${partner.affiliateUrl
                                            ? 'bg-blue-600 text-white group-hover:bg-blue-700'
                                            : 'bg-slate-200 text-slate-500'
                                            }`}>
                                            {partner.ctaText || 'Get Quote'}
                                        </span>
                                    </a>
                                ))}
                            </div>
                            <p className="text-center text-xs text-slate-400 mt-6">
                                Clicking these links may take you to partner websites. We may earn a commission at no extra cost to you.
                            </p>
                        </div>
                    </section>
                )}

                {showFooter && <Footer insuranceTypes={allInsuranceTypes} />}

                {/* Custom JS from template */}
                {page.template.customJs && (
                    <script dangerouslySetInnerHTML={{ __html: page.template.customJs }} />
                )}
            </div>
        );
    }

    // Fallback to default funnel layout
    const heroTitle = page?.title || variables.page_title;
    const heroSubtitle = page?.subtitle || variables.page_subtitle;

    const contentTitle = location
        ? `Understanding ${insuranceType?.name} in ${location}`
        : `Complete Guide to ${insuranceType?.name}`;

    return (
        <div className="min-h-screen bg-white">
            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
            />

            <Header insuranceTypes={allInsuranceTypes} states={allStates} />

            {/* Hero Section - Corporate Minimal */}
            <section className="relative bg-[#0F172A] border-b border-slate-800 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        {locationBadge && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 mb-6">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">{locationBadge}</span>
                            </div>
                        )}
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
                            {heroTitle}
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed font-light">
                            {heroSubtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Content Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                                    {contentTitle}
                                </h2>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 leading-relaxed">
                                        Finding the right {insuranceType?.name?.toLowerCase() || 'insurance'} coverage {location ? `in ${location}` : ''} requires understanding local regulations, comparing rates from multiple providers, and choosing the coverage limits that match your needs.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed">
                                        Our comprehensive guide helps you navigate the insurance landscape, understand your options, and make informed decisions that protect what matters most.
                                    </p>
                                </div>
                            </div>

                            {/* Key Features */}
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6">What You'll Learn</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        { icon: Shield, title: 'Coverage Requirements', desc: `Minimum coverage needed ${location ? `in ${location}` : 'in your area'}` },
                                        { icon: Building2, title: 'Top Providers', desc: 'Best-rated insurance companies' },
                                        { icon: FileText, title: 'Policy Comparison', desc: 'Side-by-side rate analysis' },
                                        { icon: ArrowRight, title: 'How to Save', desc: 'Discounts and savings tips' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-blue-500/50 transition-colors">
                                            <div className="w-10 h-10 bg-slate-50 rounded-md flex items-center justify-center flex-shrink-0">
                                                <item.icon className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900">{item.title}</h4>
                                                <p className="text-sm text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Common Questions</h3>
                                <div className="space-y-3">
                                    {[
                                        { q: `What are the minimum ${insuranceType?.name?.toLowerCase() || 'insurance'} requirements${location ? ` in ${location}` : ''}?`, a: `Requirements vary by location. We provide detailed coverage minimums specific to your area.` },
                                        { q: 'How can I get the best rates?', a: 'Compare multiple quotes, maintain a good record, and ask about available discounts.' },
                                        { q: 'How often should I compare rates?', a: 'We recommend comparing rates every 6-12 months or when your policy renews.' },
                                    ].map((faq, i) => (
                                        <details key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden group">
                                            <summary className="p-4 cursor-pointer font-medium text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                                {faq.q}
                                                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <div className="px-4 pb-4 text-slate-600 text-sm">
                                                {faq.a}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">

                            {/* Related Links */}
                            {relatedLinks.nearbyCities.length > 0 && (
                                <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-4">Nearby Cities</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.nearbyCities.slice(0, 5).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                                                    <ArrowRight className="w-3 h-3" />
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Browse More */}
                            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-2">Explore More</h3>
                                <p className="text-sm text-blue-700/80 mb-4">Find coverage options in other areas.</p>
                                <div className="flex gap-2">
                                    <Link href="/states" className="flex-1 py-2 bg-white border border-blue-200 text-blue-700 text-center rounded text-sm font-semibold hover:bg-blue-50 transition-colors">
                                        All States
                                    </Link>
                                    <Link href="/cities" className="flex-1 py-2 bg-white border border-blue-200 text-blue-700 text-center rounded text-sm font-semibold hover:bg-blue-50 transition-colors">
                                        All Cities
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-slate-900 border-t border-slate-800 py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Compare Rates?</h2>
                    <p className="text-slate-400 max-w-xl mx-auto mb-8 font-light">
                        Get personalized quotes from top-rated carriers in minutes.
                    </p>
                    <Link
                        href="/get-quote"
                        className="inline-block bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all"
                    >
                        Get Your Free Quote
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={allInsuranceTypes} />
        </div>
    );
}
