import { PrismaClient } from "@myinsurancebuddy/db";
import Link from "next/link";
import { format } from "date-fns";
import { Metadata } from "next";

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
        <main className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🛡️</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            MyInsuranceBuddies
                        </span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 transition">Home</Link>
                        <Link href="/blog" className="text-blue-600 font-medium">Blog</Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Insurance Blog
                    </h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Expert guides, tips, and insights to help you navigate the world of insurance
                    </p>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {posts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📝</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Posts Yet</h2>
                            <p className="text-gray-600 mb-6">We're working on creating great content for you.</p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-6xl">📄</span>
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
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>© {new Date().getFullYear()} MyInsuranceBuddies. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
