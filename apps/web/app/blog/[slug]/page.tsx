import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdUnit from '@/components/AdUnit';
import BlogCard from '@/components/blog/BlogCard';
import { Calendar, Clock, User, Share2, ArrowLeft } from 'lucide-react';

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

async function getHeaderData() {
    const { prisma } = await import('@/lib/prisma');
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({
            where: { isActive: true },
            include: { country: true },
            orderBy: { name: 'asc' },
            take: 12,
        }),
    ]);
    return { insuranceTypes, states };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
    const post = await getPostBySlug(params.slug);
    if (!post) notFound();

    const [related, { insuranceTypes }] = await Promise.all([
        getRelatedPosts(post.categoryId, post.id),
        getHeaderData(),
    ]);

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={[]} />

            {/* Hero Header */}
            <section className="bg-slate-900 py-8 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6 overflow-hidden">
                        <Link href="/" className="hover:text-blue-400 whitespace-nowrap transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-blue-400 whitespace-nowrap transition-colors">Blog</Link>
                        <span>/</span>
                        <span className="text-slate-300 truncate max-w-[150px] sm:max-w-xs">{post.title}</span>
                    </div>

                    {post.category && (
                        <span className="inline-block text-blue-400 font-bold tracking-wider uppercase text-xs sm:text-sm mb-3 sm:mb-4">
                            {post.category.name}
                        </span>
                    )}
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Author & Meta */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-400 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm sm:text-base">
                                {post.author?.name?.[0] || 'E'}
                            </div>
                            <div>
                                <p className="font-medium text-slate-200">{post.author?.name || 'Editor'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{Math.ceil((post.content?.length || 0) / 1000)} min read</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6">
                    <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
                        <Image 
                            src={post.featuredImage} 
                            alt={post.title} 
                            fill 
                            className="object-cover" 
                            priority 
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                    {/* Article */}
                    <article className="lg:col-span-2">
                        {/* Top Ad */}
                        <div className="mb-6 sm:mb-8">
                            <AdUnit slot="in-content-top" format="horizontal" className="w-full bg-slate-50 border border-slate-200 rounded-lg" />
                        </div>

                        {/* Content */}
                        <div
                            className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none 
                                prose-headings:font-bold prose-headings:text-slate-900 
                                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline 
                                prose-img:rounded-lg sm:prose-img:rounded-xl prose-img:shadow-md
                                prose-p:text-slate-600"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Bottom Ad */}
                        <div className="mt-8 sm:mt-12 mb-8 sm:mb-12">
                            <AdUnit slot="in-content-bottom" format="horizontal" className="w-full bg-slate-50 border border-slate-200 rounded-lg" />
                        </div>

                        {/* Share */}
                        <div className="flex items-center justify-between py-4 sm:py-6 border-t border-slate-200">
                            <span className="text-xs sm:text-sm font-medium text-slate-500">Share this article:</span>
                            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-xs sm:text-sm text-slate-600">
                                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Share
                            </button>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-6 sm:space-y-8">
                        <div className="sticky top-24 space-y-6 sm:space-y-8">
                            {/* Ad */}
                            <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 text-xs uppercase tracking-wider">Advertisement</h3>
                                <AdUnit slot="sidebar-sticky" format="rectangle" className="w-full bg-white shadow-sm h-[250px] sm:h-[300px] rounded-lg" />
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 sm:p-6 rounded-xl shadow-lg">
                                <h3 className="font-bold text-lg sm:text-xl mb-2">Need Coverage?</h3>
                                <p className="text-blue-100 mb-4 sm:mb-5 text-xs sm:text-sm">Compare real-time quotes from top providers in your area.</p>
                                <Link href="/" className="block w-full py-2.5 sm:py-3 bg-white text-blue-600 font-semibold text-center rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-sm">
                                    Get a Free Quote
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Related Posts */}
                {related.length > 0 && (
                    <div className="border-t border-slate-200 pt-10 sm:pt-16 mt-10 sm:mt-16">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {related.map((post: any) => (
                                <div key={post.id} className="h-full">
                                    <BlogCard post={post} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to Blog */}
                <div className="mt-10 sm:mt-16 text-center">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to all articles
                    </Link>
                </div>
            </div>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
