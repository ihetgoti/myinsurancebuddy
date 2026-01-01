import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { GeoLevel } from '@myinsurancebuddy/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';
import { Building2, MapPin, FileText, Shield, ArrowRight, ChevronDown } from 'lucide-react';

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

    // Fetch data for header navigation and stats
    const [allInsuranceTypes, allStates, totalPages, totalStates, totalCities] = await Promise.all([
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
