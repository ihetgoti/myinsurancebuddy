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
    const city = await prisma.region.findUnique({
        where: { slug: params.slug, type: "CITY" },
    });

    if (!city) return {};

    const page = await prisma.programmaticPage.findFirst({
        where: {
            regionId: city.id,
            isPublished: true,
        },
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";
    const title = page?.metaTitle || `${city.name} Insurance Guide - Find Cheap Coverage`;
    const description = page?.metaDescription ||
        `Find the best and cheapest local insurance in ${city.name}. Compare auto, health, home, and life insurance rates. Expert tips & deals.`;
    const canonical = `${baseUrl}/city/${city.slug}/insurance-guide`;

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

export default async function CityInsuranceGuidePage({
    params,
}: {
    params: { slug: string };
}) {
    const city = await prisma.region.findUnique({
        where: { slug: params.slug, type: "CITY" },
    });

    if (!city) {
        notFound();
    }

    const page = await prisma.programmaticPage.findFirst({
        where: {
            regionId: city.id,
            isPublished: true,
        },
    });

    const state = city.stateCode ? await prisma.region.findFirst({
        where: { type: "STATE", stateCode: city.stateCode },
    }) : null;

    // JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `https://myinsurancebuddies.com/city/${params.slug}/insurance-guide`,
                name: page?.metaTitle || `${city.name} Insurance Guide`,
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
                    ...(state ? [{
                        "@type": "ListItem",
                        position: 2,
                        name: state.name,
                        item: `https://myinsurancebuddies.com/state/${state.slug}/insurance-guide`,
                    }] : []),
                    {
                        "@type": "ListItem",
                        position: state ? 3 : 2,
                        name: city.name,
                        item: `https://myinsurancebuddies.com/city/${params.slug}/insurance-guide`,
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
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50"></div>
                    <div className="absolute top-10 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-10 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                    <div className="container mx-auto px-4 relative">
                        {/* Breadcrumbs */}
                        <nav className="mb-6 text-sm text-gray-600">
                            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
                            <span className="mx-2">/</span>
                            {state && (
                                <>
                                    <Link href={`/state/${state.slug}/insurance-guide`} className="hover:text-blue-600 transition">
                                        {state.name}
                                    </Link>
                                    <span className="mx-2">/</span>
                                </>
                            )}
                            <span className="text-gray-900">{city.name}</span>
                        </nav>

                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {state?.stateCode || ''} City Insurance Guide
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
                                {city.name} Insurance Guide
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl">
                                {city.seoSummary || `Find the best local insurance options in ${city.name}. Compare rates from top providers and discover coverage tailored to your needs.`}
                            </p>
                            <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                                {city.population && (
                                    <span>Population: {city.population.toLocaleString()}</span>
                                )}
                                {city.medianIncome && (
                                    <span>Median Income: ${city.medianIncome.toLocaleString()}</span>
                                )}
                                {state && (
                                    <span>State: {state.name}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Insurance Types */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                            Insurance Coverage in {city.name}
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {insuranceTypes.map((type) => (
                                <div
                                    key={type.slug}
                                    className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1 transition-all"
                                >
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{type.icon}</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{type.name}</h3>
                                    <p className="text-gray-600 text-sm">{type.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                {page ? (
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
                ) : (
                    <section className="py-12 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <div className="max-w-2xl mx-auto text-center">
                                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8">
                                    <span className="text-4xl mb-4 block">🚧</span>
                                    <h3 className="text-xl font-bold mb-2">Content Coming Soon</h3>
                                    <p className="text-blue-100">
                                        We're preparing comprehensive insurance guides for {city.name}.
                                        In the meantime, explore our state-level guide for {state?.name || 'your area'}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* State link */}
                {state && (
                    <section className="py-8 bg-blue-50">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-blue-900">Looking for state-wide coverage?</h3>
                                    <p className="text-blue-700">View the complete insurance guide for {state.name}</p>
                                </div>
                                <Link
                                    href={`/state/${state.slug}/insurance-guide`}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    {state.name} Guide →
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Find the Right Coverage in {city.name}
                        </h2>
                        <p className="text-purple-100 mb-8 max-w-xl mx-auto">
                            Compare local rates and get personalized recommendations for your insurance needs.
                        </p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
                        >
                            Explore Insurance Guides
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
