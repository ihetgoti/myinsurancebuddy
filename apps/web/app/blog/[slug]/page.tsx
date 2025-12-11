import { Metadata } from "next";
import { PrismaClient } from "@myinsurancebuddy/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

const prisma = new PrismaClient();

export async function generateStaticParams() {
    const posts = await prisma.post.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true },
    });

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
    });

    if (!post || post.status !== "PUBLISHED") return {};

    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || "";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            publishedTime: post.publishedAt?.toISOString(),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
        include: { author: true },
    });

    if (!post || post.status !== "PUBLISHED") {
        notFound();
    }

    // JSON-LD Article structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        author: {
            "@type": "Person",
            name: post.author.name || "Anonymous",
        },
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        publisher: {
            "@type": "Organization",
            name: "MyInsuranceBuddies",
            logo: {
                "@type": "ImageObject",
                url: "https://myinsurancebuddies.com/logo.png",
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-gray-50">
                <article className="container mx-auto px-4 py-12 max-w-4xl">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{post.title}</span>
                    </nav>

                    {/* Article Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                        {post.excerpt && (
                            <p className="text-xl text-gray-600 mb-4">{post.excerpt}</p>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                            <span>By {post.author.name || "Anonymous"}</span>
                            <span className="mx-2">•</span>
                            <time dateTime={post.publishedAt?.toISOString()}>
                                {post.publishedAt ? format(post.publishedAt, "MMMM d, yyyy") : ""}
                            </time>
                        </div>
                        {post.tags.length > 0 && (
                            <div className="flex gap-2 mt-4">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Article Body */}
                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
                    />
                </article>
            </main>
        </>
    );
}
