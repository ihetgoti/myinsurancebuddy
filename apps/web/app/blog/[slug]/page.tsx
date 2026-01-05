import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog';
import AdUnit from '@/components/AdUnit';
import BlogCard from '@/components/blog/BlogCard';

interface BlogPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: BlogPageProps) {
    const post = await getPostBySlug(params.slug);
    if (!post) return {};
    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
    };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
    const post = await getPostBySlug(params.slug);
    if (!post) notFound();

    const related = await getRelatedPosts(post.categoryId, post.id);

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Minimal Header */}
            <div className="h-24 bg-slate-900" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-hidden">
                    <Link href="/" className="hover:text-blue-600 whitespace-nowrap">Home</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-blue-600 whitespace-nowrap">Blog</Link>
                    <span>/</span>
                    <span className="text-slate-900 truncate max-w-[200px] sm:max-w-md">{post.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <article className="lg:col-span-2">
                        {/* Article Header */}
                        <header className="mb-8">
                            {post.category && (
                                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">
                                    {post.category.name}
                                </span>
                            )}
                            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex items-center justify-between border-y border-slate-100 py-4 mb-8">
                                <div className="flex items-center gap-3">
                                    {/* Author Avatar placeholder */}
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                        {post.author?.name?.[0] || 'E'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{post.author?.name || 'Editor'}</p>
                                        <p className="text-xs text-slate-500">
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {/* Social Share Buttons can go here */}
                                    <button className="text-slate-400 hover:text-blue-600">
                                        <span className="sr-only">Share</span>
                                        Share ↗
                                    </button>
                                </div>
                            </div>

                            {post.featuredImage && (
                                <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-10 bg-slate-100 shadow-sm border border-slate-100">
                                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
                                </div>
                            )}
                        </header>

                        {/* Content Ad */}
                        <div className="mb-8">
                            <AdUnit slot="in-content-top" format="horizontal" className="w-full bg-slate-50 border-dashed" />
                        </div>

                        {/* Content Body */}
                        <div
                            className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Bottom Ad */}
                        <div className="mt-12 mb-12">
                            <AdUnit slot="in-content-bottom" format="horizontal" className="w-full bg-slate-50 border-dashed" />
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Advertisement</h3>
                                <AdUnit slot="sidebar-sticky" format="rectangle" className="w-full bg-white shadow-sm h-[300px]" />
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg ring-1 ring-white/20">
                                <h3 className="font-bold text-xl mb-2">Need Coverage?</h3>
                                <p className="text-blue-100 mb-5 text-sm">Compare real-time quotes from top providers in your area.</p>
                                <Link href="/" className="block w-full py-3 bg-white text-blue-600 font-bold text-center rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
                                    Get a Free Quote
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Related Posts */}
                {related.length > 0 && (
                    <div className="border-t border-slate-200 pt-16 mt-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">You Might Also Like</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {related.map((post: any) => (
                                <div key={post.id} className="h-full">
                                    <BlogCard post={post} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">
                        ← Back to all articles
                    </Link>
                </div>
            </div>
        </div>
    );
}
