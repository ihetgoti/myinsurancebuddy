import { Metadata } from "next";
import { PrismaClient } from "@myinsurancebuddy/db";
import { notFound } from "next/navigation";
import Link from "next/link";

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

    const title = page?.metaTitle || `Best Insurance in ${state.name} - Tips & Deals`;
    const description = page?.metaDescription ||
        `Find the best and cheapest insurance in ${state.name}. Compare auto, health, home, and life insurance rates. Expert tips & deals.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

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
        orderBy: { name: "asc" },
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
                        name: "States",
                        item: "https://myinsurancebuddies.com/states",
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
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

            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/states" className="hover:text-blue-600">States</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{state.name}</span>
                    </nav>

                    {page ? (
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: page.generatedHtml }}
                        />
                    ) : (
                        <div>
                            <h1 className="text-4xl font-bold mb-6">{state.name} Insurance Guide</h1>
                            <p className="text-xl text-gray-600 mb-8">
                                {state.seoSummary || `Find the best insurance options in ${state.name}.`}
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <p className="text-yellow-800">
                                    This page is being prepared. Check back soon for comprehensive insurance guides for {state.name}.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Major cities in this state */}
                    {cities.length > 0 && (
                        <div className="mt-12 bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-4">Major Cities in {state.name}</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {cities.map((city) => (
                                    <Link
                                        key={city.id}
                                        href={`/city/${city.slug}/insurance-guide`}
                                        className="block p-4 border border-gray-200 rounded hover:border-blue-500 hover:shadow-md transition"
                                    >
                                        <h3 className="font-semibold text-blue-600">{city.name}</h3>
                                        {city.population && (
                                            <p className="text-sm text-gray-600">
                                                Pop: {city.population.toLocaleString()}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
