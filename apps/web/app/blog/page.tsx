import { PrismaClient } from "@myinsurancebuddy/db";
import Link from "next/link";
import { format } from "date-fns";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const prisma = new PrismaClient();

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinsurancebuddies.com";

export const metadata: Metadata = {
    title: "Insurance Blog | MyInsuranceBuddies",
    description: "Expert insurance guides, tips, and insights to help you make informed decisions about your coverage.",
    alternates: {
        canonical: `${baseUrl}/blog`,
    },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    const posts = await prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { author: true },
        take: 20,
    });

    return (
        <>
            <Header />

            <main className="min-h-screen bg-white pt-16">
                {/* Hero Header */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full"></div>
                        <div className="absolute top-20 right-20 w-60 h-60 bg-white rounded-full"></div>
                        <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-white rounded-full"></div>
                    </div>

                    <div className="container mx-auto px-4 relative text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Fresh Content Weekly
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Insurance Blog
                        </h1>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            Expert guides, tips, and insights to help you navigate the world of insurance and make informed decisions.
                        </p>
                    </div>
                </section>

                {/* Blog Posts Grid */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        {posts.length === 0 ? (
                            <div className="text-center py-16 max-w-md mx-auto">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">📝</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">No Posts Yet</h2>
                                <p className="text-gray-600 mb-8">We're working on creating great content for you. Check back soon!</p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
                                >
                                    ← Back to Home
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Featured Post */}
                                {posts[0] && (
                                    <article className="mb-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                                        <div className="grid md:grid-cols-2 gap-0">
                                            <div className="aspect-video md:aspect-auto bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                <span className="text-8xl opacity-50">📄</span>
                                            </div>
                                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                                <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-4">
                                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Featured</span>
                                                    {posts[0].publishedAt && (
                                                        <time dateTime={posts[0].publishedAt.toISOString()}>
                                                            {format(posts[0].publishedAt, "MMM d, yyyy")}
                                                        </time>
                                                    )}
                                                </div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                                                    <Link href={`/blog/${posts[0].slug}`} className="hover:text-blue-600 transition">
                                                        {posts[0].title}
                                                    </Link>
                                                </h2>
                                                {posts[0].excerpt && (
                                                    <p className="text-gray-600 mb-6 line-clamp-3">{posts[0].excerpt}</p>
                                                )}
                                                <Link
                                                    href={`/blog/${posts[0].slug}`}
                                                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                                                >
                                                    Read Article
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                )}

                                {/* Rest of Posts */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {posts.slice(1).map((post) => (
                                        <article
                                            key={post.id}
                                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
                                        >
                                            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                                                <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform">📄</span>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                    {post.publishedAt && (
                                                        <time dateTime={post.publishedAt.toISOString()}>
                                                            {format(post.publishedAt, "MMM d, yyyy")}
                                                        </time>
                                                    )}
                                                    {post.author && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{post.author.name}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition">
                                                        {post.title}
                                                    </Link>
                                                </h2>
                                                {post.excerpt && (
                                                    <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                                                )}
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1"
                                                >
                                                    Read more
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Need Help Finding Coverage?
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                            Check out our state-specific guides for detailed information about insurance requirements and rates in your area.
                        </p>
                        <Link
                            href="/#states"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
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
