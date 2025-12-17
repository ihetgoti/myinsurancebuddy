import { Metadata } from "next";
import { PrismaClient } from "@myinsurancebuddy/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const prisma = new PrismaClient();

const INSURANCE_TYPES: Record<string, { name: string; icon: string; color: string }> = {
    "health-insurance": { name: "Health Insurance", icon: "🏥", color: "from-green-500 to-teal-600" },
    "car-insurance": { name: "Car Insurance", icon: "🚗", color: "from-blue-500 to-cyan-600" },
    "auto-insurance": { name: "Auto Insurance", icon: "🚗", color: "from-blue-500 to-cyan-600" },
    "home-insurance": { name: "Home Insurance", icon: "🏠", color: "from-orange-500 to-red-600" },
    "life-insurance": { name: "Life Insurance", icon: "💚", color: "from-purple-500 to-pink-600" },
    "business-insurance": { name: "Business Insurance", icon: "🏢", color: "from-gray-600 to-slate-800" },
    "travel-insurance": { name: "Travel Insurance", icon: "✈️", color: "from-sky-500 to-indigo-600" },
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
    params,
}: {
    params: { insuranceType: string; locationSlug: string };
}): Promise<Metadata> {
    if (!INSURANCE_TYPES[params.insuranceType]) {
        return {};
    }

    const region = await prisma.region.findUnique({
        where: { slug: params.locationSlug },
    });

    if (!region) return {};

    const page = await prisma.programmaticPage.findFirst({
        where: {
            regionId: region.id,
            insuranceType: params.insuranceType,
            isPublished: true,
        } as any,
    });

    const insuranceTypeName = INSURANCE_TYPES[params.insuranceType].name;

    const title =
        page?.metaTitle ||
        `${insuranceTypeName} in ${region.name} - Compare Rates & Get Quotes`;
    const description =
        page?.metaDescription ||
        `Find the best ${insuranceTypeName.toLowerCase()} in ${region.name}. Compare rates, get quotes, and save money on your coverage.`;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";
    const canonical = `${baseUrl}/${params.insuranceType}/${params.locationSlug}`;

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

export default async function InsuranceTypeLocationPage({
    params,
}: {
    params: { insuranceType: string; locationSlug: string };
}) {
    if (!INSURANCE_TYPES[params.insuranceType]) {
        notFound();
    }

    const region = await prisma.region.findUnique({
        where: { slug: params.locationSlug },
    });

    if (!region) {
        notFound();
    }

    const page = await prisma.programmaticPage.findFirst({
        where: {
            regionId: region.id,
            insuranceType: params.insuranceType,
            isPublished: true,
        } as any,
    });

    const insuranceType = INSURANCE_TYPES[params.insuranceType];
    const insuranceTypeName = insuranceType.name;

    // Get related links
    const state = region.type === "CITY" && region.stateCode
        ? await prisma.region.findFirst({ where: { type: "STATE", stateCode: region.stateCode } })
        : null;

    // JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `https://myinsurancebuddies.com/${params.insuranceType}/${params.locationSlug}`,
                name: page?.metaTitle || `${insuranceTypeName} in ${region.name}`,
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
                        name: region.name,
                        item: `https://myinsurancebuddies.com/${params.insuranceType}/${params.locationSlug}`,
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
                    <div className={`absolute inset-0 bg-gradient-to-br ${insuranceType.color} opacity-10`}></div>
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                    <div className="container mx-auto px-4 relative">
                        {/* Breadcrumbs */}
                        <nav className="mb-6 text-sm text-gray-600">
                            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
                            <span className="mx-2">/</span>
                            <Link
                                href={`/${region.type === "STATE" ? "state" : "city"}/${region.slug}/insurance-guide`}
                                className="hover:text-blue-600 transition"
                            >
                                {region.name}
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{insuranceTypeName}</span>
                        </nav>

                        <div className="max-w-4xl">
                            <div className="text-6xl mb-4">{insuranceType.icon}</div>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {region.type === "STATE" ? "State" : "City"} Guide
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                                {insuranceTypeName} in {region.name}
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl">
                                Find the best {insuranceTypeName.toLowerCase()} options in {region.name}.
                                Compare rates, understand coverage requirements, and get expert tips to save money.
                            </p>
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
                                <div className={`bg-gradient-to-br ${insuranceType.color} text-white rounded-2xl p-8`}>
                                    <span className="text-4xl mb-4 block">🚧</span>
                                    <h3 className="text-xl font-bold mb-2">Content Coming Soon</h3>
                                    <p className="opacity-90">
                                        We're preparing comprehensive {insuranceTypeName.toLowerCase()} guides for {region.name}.
                                        In the meantime, explore our general guides below.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Related Guides */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Related Guides</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Link
                                href={`/${region.type === "STATE" ? "state" : "city"}/${region.slug}/insurance-guide`}
                                className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
                            >
                                <div className="text-3xl mb-3">📋</div>
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{region.name} Insurance Guide</h3>
                                <p className="text-gray-600 text-sm">All insurance types for {region.name}</p>
                            </Link>

                            {state && (
                                <Link
                                    href={`/state/${state.slug}/insurance-guide`}
                                    className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all"
                                >
                                    <div className="text-3xl mb-3">🗺️</div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition">{state.name} State Guide</h3>
                                    <p className="text-gray-600 text-sm">State-wide insurance information</p>
                                </Link>
                            )}

                            {Object.entries(INSURANCE_TYPES)
                                .filter(([slug]) => slug !== params.insuranceType)
                                .slice(0, state ? 1 : 2)
                                .map(([slug, type]) => (
                                    <Link
                                        key={slug}
                                        href={`/${slug}/${params.locationSlug}`}
                                        className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all"
                                    >
                                        <div className="text-3xl mb-3">{type.icon}</div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition">{type.name}</h3>
                                        <p className="text-gray-600 text-sm">{type.name} in {region.name}</p>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={`py-16 bg-gradient-to-r ${insuranceType.color}`}>
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Ready to Find {insuranceTypeName}?
                        </h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto">
                            Explore our comprehensive guides and make informed decisions about your coverage today.
                        </p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
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
