import { Metadata } from "next";
import { PrismaClient } from "@myinsurancebuddy/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const prisma = new PrismaClient();

// Use dynamic rendering - no static params needed in CI
export const dynamic = "force-dynamic";

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const state = await prisma.region.findUnique({
        where: { slug: params.slug, type: "STATE" },
    });

    if (!state) return {};

    const page = await prisma.programmaticPage.findFirst({
        where: {
            regionId: state.id,
            isPublished: true,
        },
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";
    const title = page?.metaTitle || `Best Insurance in ${state.name} - Tips & Deals`;
    const description = page?.metaDescription ||
        `Find the best and cheapest insurance in ${state.name}. Compare auto, health, home, and life insurance rates. Expert tips & deals.`;
    const canonical = `${baseUrl}/state/${state.slug}/insurance-guide`;

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            type: "website",
            url: canonical,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

const insuranceTypes = [
    { name: 'Auto Insurance', icon: '🚗', slug: 'auto-insurance', desc: 'Coverage for your vehicles' },
    { name: 'Health Insurance', icon: '🏥', slug: 'health-insurance', desc: 'Medical expense coverage' },
    { name: 'Home Insurance', icon: '🏠', slug: 'home-insurance', desc: 'Protection for your property' },
    { name: 'Life Insurance', icon: '💚', slug: 'life-insurance', desc: 'Financial security for family' },
];

export default async function StateInsuranceGuidePage({
    params,
}: {
    params: { slug: string };
}) {
    const state = await prisma.region.findUnique({
        where: { slug: params.slug, type: "STATE" },
    });

    if (!state) {
        notFound();
    }

    const page = await prisma.programmaticPage.findFirst({
        where: {
            regionId: state.id,
            isPublished: true,
        },
    });

    const cities = await prisma.region.findMany({
        where: {
            type: "CITY",
            stateCode: state.stateCode || undefined,
        },
        orderBy: { population: "desc" },
        take: 12,
    });

    // JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `https://myinsurancebuddies.com/state/${params.slug}/insurance-guide`,
                name: page?.metaTitle || `${state.name} Insurance Guide`,
                description: page?.metaDescription,
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://myinsurancebuddies.com",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: state.name,
                        item: `https://myinsurancebuddies.com/state/${params.slug}/insurance-guide`,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Header />

            <main className="min-h-screen bg-white pt-16">
                {/* Hero Section */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                    <div className="container mx-auto px-4 relative">
                        {/* Breadcrumbs */}
                        <nav className="mb-6 text-sm text-gray-600">
                            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{state.name}</span>
                        </nav>

                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {state.stateCode} Insurance Guide
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                {state.name} Insurance Guide
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl">
                                {state.seoSummary || `Find the best insurance options in ${state.name}. Compare rates, understand requirements, and get expert tips for auto, health, home, and life insurance.`}
                            </p>
                            {state.population && (
                                <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                                    <span>Population: {state.population.toLocaleString()}</span>
                                    {state.medianIncome && (
                                        <span>Median Income: ${state.medianIncome.toLocaleString()}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Insurance Types */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                            Insurance Coverage in {state.name}
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {insuranceTypes.map((type) => (
                                <Link
                                    key={type.slug}
                                    href={`/${type.slug}/${state.slug}`}
                                    className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all"
                                >
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{type.icon}</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{type.name}</h3>
                                    <p className="text-gray-600 text-sm">{type.desc}</p>
                                    <div className="mt-3 text-blue-600 font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Learn more
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                {page && (
                    <section className="py-12 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
                                <div
                                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600"
                                    dangerouslySetInnerHTML={{ __html: page.generatedHtml }}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Legal Notes */}
                {state.legalNotes && (
                    <section className="py-8 bg-blue-50">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="font-semibold text-blue-900 mb-2">State Insurance Requirements</h3>
                                <p className="text-blue-800">{state.legalNotes}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Major cities in this state */}
                {cities.length > 0 && (
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Major Cities in {state.name}
                            </h2>
                            <p className="text-gray-600 mb-8">Find city-specific insurance guides and local rates</p>
                            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {cities.map((city) => (
                                    <Link
                                        key={city.id}
                                        href={`/city/${city.slug}/insurance-guide`}
                                        className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all"
                                    >
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            📍
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">{city.name}</h3>
                                            {city.population && (
                                                <p className="text-xs text-gray-500">
                                                    Pop: {city.population.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Ready to Find Your Coverage in {state.name}?
                        </h2>
                        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                            Explore our comprehensive guides and make informed decisions about your insurance today.
                        </p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
                        >
                            Explore All Guides
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
