import { PrismaClient, GeoLevel } from '@myinsurancebuddy/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const prisma = new PrismaClient();

interface PageProps {
    params: {
        slug: string[];
    };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { insuranceType, country, state, city, page } = await resolveRoute(params.slug);

    if (!page && !insuranceType) {
        return { title: 'Not Found' };
    }

    const defaultTitle = buildTitle(insuranceType, country, state, city);
    const defaultDesc = buildDescription(insuranceType, country, state, city);

    return {
        title: page?.metaTitle || defaultTitle,
        description: page?.metaDescription || defaultDesc,
    };
}

// Resolve URL segments to database entities
async function resolveRoute(segments: string[]) {
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
    });

    return { insuranceType, country, state, city, page, geoLevel };
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

export default async function InsurancePage({ params }: PageProps) {
    const { insuranceType, country, state, city, page, geoLevel } = await resolveRoute(params.slug);

    // If insurance type not found, show 404
    if (!insuranceType) {
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

    // Build breadcrumb data
    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: insuranceType.name, href: `/${insuranceType.slug}` },
    ];
    if (country) breadcrumbs.push({ label: country.name, href: `/${insuranceType.slug}/${country.code}` });
    if (state) breadcrumbs.push({ label: state.name, href: `/${insuranceType.slug}/${country!.code}/${state.slug}` });
    if (city) breadcrumbs.push({ label: city.name, href: `/${insuranceType.slug}/${country!.code}/${state!.slug}/${city.slug}` });

    // Get related links for internal linking
    const relatedLinks = await getRelatedLinks(insuranceType, country, state, city);

    const heroTitle = page?.heroTitle || buildTitle(insuranceType, country, state, city).replace(' | MyInsuranceBuddies', '');
    const heroSubtitle = page?.heroSubtitle || buildDescription(insuranceType, country, state, city);

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={allInsuranceTypes} states={allStates} />

            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={crumb.href} className="flex items-center gap-2">
                                {i > 0 && <span className="text-gray-400">/</span>}
                                {i === breadcrumbs.length - 1 ? (
                                    <span className="text-gray-600 font-medium">{crumb.label}</span>
                                ) : (
                                    <Link href={crumb.href} className="text-blue-600 hover:text-blue-700">
                                        {crumb.label}
                                    </Link>
                                )}
                            </span>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                            <span className="text-lg">{insuranceType.icon || '📋'}</span>
                            {insuranceType.name}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {heroTitle}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl">
                            {heroSubtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2">
                            {page ? (
                                <PageContent page={page} insuranceType={insuranceType} country={country} state={state} city={city} />
                            ) : (
                                <DefaultContent insuranceType={insuranceType} country={country} state={state} city={city} geoLevel={geoLevel!} />
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <InternalLinks
                                relatedLinks={relatedLinks}
                                insuranceType={insuranceType}
                                country={country}
                                state={state}
                                city={city}
                            />
                        </aside>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={allInsuranceTypes} />
        </div>
    );
}

// Default content when no custom page exists
function DefaultContent({ insuranceType, country, state, city, geoLevel }: any) {
    const location = city?.name || state?.name || country?.name;

    return (
        <div className="space-y-8">
            {/* Overview Section */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-600 leading-relaxed">
                    {location ? (
                        `Looking for ${insuranceType.name.toLowerCase()} in ${location}? You've come to the right place. 
                        We provide comprehensive information to help you find the best coverage options tailored to your needs and local requirements.`
                    ) : (
                        `Welcome to our comprehensive guide on ${insuranceType.name.toLowerCase()}. 
                        Here you'll find everything you need to know about coverage options, costs, and how to choose the right policy.`
                    )}
                </p>
            </section>

            {/* Why It Matters */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Why {insuranceType.name} {location ? `in ${location}` : ''} Matters
                </h2>
                <div className="prose text-gray-600">
                    <p className="mb-4">
                        Having the right insurance coverage is essential for protecting yourself and your assets.
                        {location && ` Each location has unique requirements and considerations that affect your insurance needs.`}
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Financial protection against unexpected events</li>
                        <li>Peace of mind knowing you're covered</li>
                        <li>Compliance with local laws and regulations</li>
                        <li>Access to quality services when you need them</li>
                    </ul>
                </div>
            </section>

            {/* Cost Factors */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Cost Factors</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { icon: '📊', title: 'Coverage Level', desc: 'Higher coverage means higher premiums' },
                        { icon: '🏠', title: 'Location', desc: 'Local factors affect insurance rates' },
                        { icon: '📋', title: 'Personal Factors', desc: 'Age, history, and lifestyle considerations' },
                        { icon: '💰', title: 'Deductible Amount', desc: 'Higher deductibles lower premiums' },
                    ].map((factor, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <span className="text-2xl">{factor.icon}</span>
                            <div>
                                <h3 className="font-semibold text-gray-900">{factor.title}</h3>
                                <p className="text-sm text-gray-600">{factor.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How to Choose */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Choose the Right Coverage</h2>
                <ol className="space-y-4">
                    {[
                        'Assess your coverage needs based on your situation',
                        'Compare quotes from multiple providers',
                        'Review policy details and exclusions carefully',
                        'Consider bundling multiple insurance types',
                        'Read reviews and check provider ratings',
                    ].map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {i + 1}
                            </span>
                            <span className="text-gray-600 pt-1">{step}</span>
                        </li>
                    ))}
                </ol>
            </section>

            {/* FAQs */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        {
                            q: `What does ${insuranceType.name.toLowerCase()} cover?`,
                            a: `${insuranceType.name} typically covers specific risks and provides financial protection against losses. Coverage varies by policy and provider.`
                        },
                        {
                            q: 'How much does coverage cost?',
                            a: 'Costs vary based on coverage level, location, personal factors, and the provider you choose. We recommend comparing quotes from multiple insurers.'
                        },
                        {
                            q: 'How do I file a claim?',
                            a: 'Contact your insurance provider directly to file a claim. Most providers offer online, phone, and mobile app options for filing claims.'
                        },
                    ].map((faq, i) => (
                        <details key={i} className="group border-b border-gray-100 pb-4">
                            <summary className="flex items-center justify-between cursor-pointer text-gray-900 font-medium py-2">
                                {faq.q}
                                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="text-gray-600 pt-2">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
}

// Render custom page content from sections
function PageContent({ page, insuranceType, country, state, city }: any) {
    const sections = page.sections || [];

    if (sections.length === 0) {
        return <DefaultContent insuranceType={insuranceType} country={country} state={state} city={city} geoLevel="CITY" />;
    }

    return (
        <div className="space-y-8">
            {sections.map((section: any, i: number) => (
                <section key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <div className="prose text-gray-600" dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                </section>
            ))}
        </div>
    );
}

// Internal links sidebar
function InternalLinks({ relatedLinks, insuranceType, country, state, city }: any) {
    return (
        <div className="space-y-6 sticky top-24">
            {/* Other Insurance Types */}
            {relatedLinks.otherNiches?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">
                        {city ? `Other Insurance in ${city.name}` :
                            state ? `Other Insurance in ${state.name}` :
                                country ? `Other Insurance in ${country.name}` :
                                    'Other Insurance Types'}
                    </h3>
                    <ul className="space-y-2">
                        {relatedLinks.otherNiches.map((link: any) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                                >
                                    <span>{link.icon}</span>
                                    <span>{link.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Nearby Cities */}
            {relatedLinks.nearbyCities?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">
                        {insuranceType.name} in Nearby Cities
                    </h3>
                    <ul className="space-y-2">
                        {relatedLinks.nearbyCities.map((link: any) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-gray-600 hover:text-blue-600 transition"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Parent Locations */}
            {relatedLinks.parentLocations?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Explore More</h3>
                    <ul className="space-y-2">
                        {relatedLinks.parentLocations.map((link: any) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-gray-600 hover:text-blue-600 transition"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">Need Help?</h3>
                <p className="text-blue-100 text-sm mb-4">
                    Not sure which coverage is right for you? Our guides can help you decide.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                    Browse All Types
                </Link>
            </div>
        </div>
    );
}

// Get related links for internal linking
async function getRelatedLinks(insuranceType: any, country: any, state: any, city: any) {
    const links: any = {
        otherNiches: [],
        nearbyCities: [],
        parentLocations: [],
    };

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
    if (state && city) {
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
    if (city) {
        links.parentLocations = [
            { label: `All ${insuranceType.name} in ${state.name}`, href: `/${insuranceType.slug}/${country.code}/${state.slug}` },
            { label: `All ${insuranceType.name} in ${country.name}`, href: `/${insuranceType.slug}/${country.code}` },
        ];
    } else if (state) {
        links.parentLocations = [
            { label: `All ${insuranceType.name} in ${country.name}`, href: `/${insuranceType.slug}/${country.code}` },
            { label: `${insuranceType.name} Overview`, href: `/${insuranceType.slug}` },
        ];
    } else if (country) {
        links.parentLocations = [
            { label: `${insuranceType.name} Overview`, href: `/${insuranceType.slug}` },
        ];
    }

    return links;
}
