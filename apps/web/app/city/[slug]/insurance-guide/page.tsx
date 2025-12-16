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
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Cities",
                        item: "https://myinsurancebuddies.com/cities",
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
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

            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/cities" className="hover:text-blue-600">Cities</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{city.name}</span>
                    </nav>

                    {page ? (
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: page.generatedHtml }}
                        />
                    ) : (
                        <div>
                            <h1 className="text-4xl font-bold mb-6">{city.name} Insurance Guide</h1>
                            <p className="text-xl text-gray-600 mb-8">
                                {city.seoSummary || `Find the best insurance options in ${city.name}.`}
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <p className="text-yellow-800">
                                    This page is being prepared. Check back soon for comprehensive insurance guides for {city.name}.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* State link */}
                    {state && (
                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <p className="text-blue-900">
                                Also see:{" "}
                                <Link
                                    href={`/state/${state.slug}/insurance-guide`}
                                    className="font-semibold hover:underline"
                                >
                                    {state.name} State Insurance Guide
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
