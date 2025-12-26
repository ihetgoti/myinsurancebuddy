import { prisma } from '@/lib/prisma';
import { GeoLevel } from '@myinsurancebuddy/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';
import {
    HeroSection,
    TrustBadges,
    FeaturesGrid,
    ContentSection,
    StatsBar,
    WhyChooseUs,
    CTABanner,
    FAQAccordion,
    RelatedPagesGrid,
    FinalCTA,
} from '@/components/funnel';

/**
 * ISR Configuration for optimal performance at scale
 * - revalidate: Pages regenerate every 3600 seconds (1 hour)
 * - This allows serving cached pages while updating in background
 * - For 100k+ pages, this prevents DB overload on high traffic
 */
export const revalidate = 3600; // ISR: revalidate every hour
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

function buildVariables(insuranceType: any, country: any, state: any, city: any, page: any): Record<string, string> {
    const currentDate = new Date();

    return {
        page_title: page?.title || buildTitle(insuranceType, country, state, city).replace(' | MyInsuranceBuddies', ''),
        page_subtitle: page?.subtitle || buildDescription(insuranceType, country, state, city),
        insurance_type: insuranceType?.name || 'Insurance',
        insurance_type_slug: insuranceType?.slug || 'insurance',
        country: country?.name || '',
        country_code: country?.code?.toUpperCase() || '',
        state: state?.name || '',
        state_code: state?.code || '',
        state_slug: state?.slug || '',
        city: city?.name || '',
        city_slug: city?.slug || '',
        location: city?.name || state?.name || country?.name || '',
        avg_premium: state?.avgPremium ? `$${state.avgPremium}` : '$150',
        avg_savings: '$500',
        min_coverage: JSON.stringify(state?.minCoverage || {}),
        population: city?.population?.toLocaleString() || state?.population?.toLocaleString() || '',
        current_year: currentDate.getFullYear().toString(),
        current_month: currentDate.toLocaleString('default', { month: 'long' }),
        site_name: 'MyInsuranceBuddies',
        site_url: 'https://myinsurancebuddies.com',
        // Custom data from page
        ...((page?.customData as Record<string, string>) || {}),
    };
}

/**
 * Replace template variables with actual values
 * CRITICAL: Removes unresolved variables to prevent raw tokens from rendering
 * @param template - String containing {{variable}} placeholders
 * @param variables - Key-value map of variable replacements
 * @returns Processed string with variables replaced
 */
function replaceVariables(template: string, variables: Record<string, string>): string {
    if (!template) return '';

    let result = template;

    // Replace all known variables
    Object.entries(variables).forEach(([key, value]) => {
        // Escape special regex characters in key
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(`{{${escapedKey}}}`, 'g'), value || '');
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
                NOT: { id: city.id }
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
    try {
        // Get high-priority pages: niche homepages and state-level pages
        const [insuranceTypes, topPages] = await Promise.all([
            prisma.insuranceType.findMany({
                where: { isActive: true },
                select: { slug: true },
            }),
            prisma.page.findMany({
                where: {
                    isPublished: true,
                    geoLevel: { in: ['NICHE', 'STATE'] },
                },
                select: { slug: true },
                take: 500, // Limit to prevent long builds
            }),
        ]);

        const params: { slug: string[] }[] = [];

        // Add insurance type homepages
        for (const type of insuranceTypes) {
            params.push({ slug: [type.slug] });
        }

        // Add top pages from DB
        for (const page of topPages) {
            if (page.slug) {
                params.push({ slug: page.slug.split('/') });
            }
        }

        return params;
    } catch (error) {
        console.error('generateStaticParams error:', error);
        return [];
    }
}

export default async function DynamicPage({ params }: PageProps) {
    const { insuranceType, country, state, city, page } = await resolveRoute(params.slug);

    // If nothing found, show 404
    if (!insuranceType && !page) {
        notFound();
    }

    // Fetch data for header navigation
    const [allInsuranceTypes, allStates] = await Promise.all([
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
    ]);

    // Get related links for internal linking
    const relatedLinks = await getRelatedLinks(insuranceType, country, state, city);

    // Build variables
    const variables = buildVariables(insuranceType, country, state, city, page);

    // Generate schema
    const schemas = generateSchema(insuranceType, country, state, city, page);

    // Build location string
    const location = city?.name || state?.name || country?.name;
    const locationBadge = city
        ? `${city.name}, ${state?.name}`
        : state
            ? `${state.name}, ${country?.name}`
            : country?.name;

    // If page has template with sections, render dynamically
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

                <Header insuranceTypes={allInsuranceTypes} states={allStates} />

                <DynamicPageRenderer
                    sections={page.template.sections as any[]}
                    pageContent={page.content as any[] || []}
                    variables={variables}
                />

                <Footer insuranceTypes={allInsuranceTypes} />

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

            {/* Hero Section */}
            <HeroSection
                title={heroTitle}
                subtitle={heroSubtitle}
                insuranceType={insuranceType || { name: 'Insurance' }}
                location={location}
                locationBadge={locationBadge}
            />

            {/* Trust Badges */}
            <TrustBadges />

            {/* Features Grid */}
            <FeaturesGrid
                insuranceType={insuranceType?.name || 'Insurance'}
                location={location}
            />

            {/* Content Section */}
            <ContentSection
                title={contentTitle}
                insuranceType={insuranceType?.name || 'Insurance'}
                location={location}
            />

            {/* Stats Bar */}
            <StatsBar />

            {/* Why Choose Us */}
            <WhyChooseUs
                insuranceType={insuranceType?.name || 'Insurance'}
                location={location}
            />

            {/* Mid-Page CTA */}
            <CTABanner />

            {/* FAQ Section */}
            <FAQAccordion
                insuranceType={insuranceType?.name || 'Insurance'}
                location={location}
            />

            {/* Related Pages / Internal Links */}
            <RelatedPagesGrid
                insuranceType={insuranceType || { name: 'Insurance', slug: 'insurance' }}
                otherNiches={relatedLinks.otherNiches}
                nearbyCities={relatedLinks.nearbyCities}
                parentLocations={relatedLinks.parentLocations}
            />

            {/* Final CTA */}
            <FinalCTA
                insuranceType={insuranceType?.name || 'Insurance'}
                location={location}
            />

            <Footer insuranceTypes={allInsuranceTypes} />
        </div>
    );
}
