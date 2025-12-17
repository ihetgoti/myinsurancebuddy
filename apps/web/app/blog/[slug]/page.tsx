import { Metadata } from "next";
import { PrismaClient } from "@myinsurancebuddy/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const prisma = new PrismaClient();

// Use dynamic rendering - no static params needed
export const dynamic = "force-dynamic";

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
    });

    if (!post || post.status !== "PUBLISHED") return {};

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";
    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || "";
    const canonical = post.canonicalUrl || `${baseUrl}/blog/${post.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            type: "article",
            publishedTime: post.publishedAt?.toISOString(),
            url: canonical,
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

    const relatedPosts = await prisma.post.findMany({
        where: {
            status: "PUBLISHED",
            slug: { not: post.slug },
        },
        take: 3,
        orderBy: { publishedAt: "desc" },
    });

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

            <Header />

            <main className="min-h-screen bg-white pt-16">
                {/* Article Header */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

                    <div className="container mx-auto px-4 relative">
                        {/* Breadcrumbs */}
                        <nav className="mb-6 text-sm text-gray-600">
                            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href="/blog" className="hover:text-blue-600 transition">Blog</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{post.title}</span>
                        </nav>

                        <div className="max-w-4xl">
                            {post.tags.length > 0 && (
                                <div className="flex gap-2 mb-4 flex-wrap">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                                {post.title}
                            </h1>
                            {post.excerpt && (
                                <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
                            )}
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {(post.author.name || 'A')[0].toUpperCase()}
                                    </div>
                                    <span className="font-medium">{post.author.name || "Anonymous"}</span>
                                </div>
                                <span>•</span>
                                <time dateTime={post.publishedAt?.toISOString()}>
                                    {post.publishedAt ? format(post.publishedAt, "MMMM d, yyyy") : ""}
                                </time>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Article Body */}
                <article className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12">
                            <div
                                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:rounded-xl"
                                dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
                            />
                        </div>
                    </div>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="py-16 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={`/blog/${relatedPost.slug}`}
                                        className="group bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
                                    >
                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                        {relatedPost.excerpt && (
                                            <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                                        )}
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
                            Find Insurance in Your State
                        </h2>
                        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                            Explore our comprehensive guides to discover the best coverage options in your area.
                        </p>
                        <Link
                            href="/#states"
                            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
                        >
                            Explore State Guides
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
