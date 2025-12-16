import { Metadata } from "next";
import { PrismaClient } from "@myinsurancebuddy/db";
import { notFound } from "next/navigation";
import Link from "next/link";

const prisma = new PrismaClient();

const INSURANCE_TYPES = [
    "health-insurance",
    "car-insurance",
    "auto-insurance",
    "home-insurance",
    "life-insurance",
    "business-insurance",
    "travel-insurance",
];

export const dynamic = "force-dynamic";

export async function generateMetadata({
    params,
}: {
    params: { insuranceType: string; locationSlug: string };
}): Promise<Metadata> {
    if (!INSURANCE_TYPES.includes(params.insuranceType)) {
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
        },
    });

    const insuranceTypeName = params.insuranceType
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

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
    if (!INSURANCE_TYPES.includes(params.insuranceType)) {
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
        },
    });

    const insuranceTypeName = params.insuranceType
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

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
                        name: insuranceTypeName,
                        item: `https://myinsurancebuddies.com/${params.insuranceType}`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
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

            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <Link
                            href={`/${params.insuranceType}`}
                            className="hover:text-blue-600"
                        >
                            {insuranceTypeName}
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{region.name}</span>
                    </nav>

                    {page ? (
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: page.generatedHtml }}
                        />
                    ) : (
                        <div>
                            <h1 className="text-4xl font-bold mb-6">
                                {insuranceTypeName} in {region.name}
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Find the best {insuranceTypeName.toLowerCase()} options in{" "}
                                {region.name}.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <p className="text-yellow-800">
                                    This page is being prepared. Check back soon for
                                    comprehensive {insuranceTypeName.toLowerCase()} guides for{" "}
                                    {region.name}.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Related links */}
                    <div className="mt-12 bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold mb-4">Related Guides</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Link
                                href={`/state/${region.slug}/insurance-guide`}
                                className="block p-4 border border-gray-200 rounded hover:border-blue-500 hover:shadow-md transition"
                            >
                                <h3 className="font-semibold text-blue-600">
                                    {region.name} Insurance Guide
                                </h3>
                                <p className="text-sm text-gray-600">
                                    General insurance information for {region.name}
                                </p>
                            </Link>
                            {region.type === "CITY" && region.stateCode && (
                                <Link
                                    href={`/state/${region.stateCode.toLowerCase()}/insurance-guide`}
                                    className="block p-4 border border-gray-200 rounded hover:border-blue-500 hover:shadow-md transition"
                                >
                                    <h3 className="font-semibold text-blue-600">
                                        State Insurance Guide
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Insurance information for the state
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
