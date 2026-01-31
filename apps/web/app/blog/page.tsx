import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPosts } from '@/lib/blog';
import BlogCard from '@/components/blog/BlogCard';
import AdUnit from '@/components/AdUnit';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { BookOpen, TrendingUp } from 'lucide-react';

export const metadata = {
    title: 'Insurance Blog | Expert Guides & Money-Saving Tips - MyInsuranceBuddy',
    description: 'Expert insurance guides, money-saving tips, industry news, and coverage advice to help you make informed decisions and protect what matters most.',
    keywords: 'insurance blog, insurance tips, money saving insurance, insurance guides, coverage advice',
    openGraph: {
        title: 'Insurance Insights & Guides - MyInsuranceBuddy',
        description: 'Navigate insurance with expert guides, industry news, and money-saving tips.',
    },
};

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export default async function BlogIndex() {
    const posts = await getPublishedPosts();
    const featured = posts[0];
    const rest = posts.slice(1);
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-slate-50">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Header - Mobile Optimized */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-20 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500 rounded-full blur-3xl"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                            Expert Insurance Content
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                            Insurance Insights
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                            Navigate the complex world of insurance with our expert guides, 
                            industry news, and money-saving tips.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-10 pb-16 sm:pb-20">
                {/* Top Ad */}
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-slate-100 mb-8 sm:mb-12 flex justify-center">
                    <AdUnit slot="blog-index-top" format="horizontal" />
                </div>

                {featured && (
                    <div className="mb-10 sm:mb-16">
                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="h-px bg-slate-200 flex-1"></div>
                            <h2 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">Featured Article</h2>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="h-48 sm:h-64 lg:h-auto bg-slate-100 relative min-h-[200px] sm:min-h-[300px] overflow-hidden">
                                {featured.featuredImage ? (
                                    <Image 
                                        src={featured.featuredImage} 
                                        alt={featured.title} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-50 text-4xl sm:text-6xl">📝</div>
                                )}
                            </div>
                            <div className="p-5 sm:p-8 lg:p-10 lg:p-12 flex flex-col justify-center">
                                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                                    {featured.category && (
                                        <span className="text-xs sm:text-sm font-bold text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 rounded-full uppercase tracking-wide">
                                            {featured.category.name}
                                        </span>
                                    )}
                                    <span className="text-slate-400 text-xs sm:text-sm">
                                        {featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                    {featured.title}
                                </h3>
                                <p className="text-slate-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 line-clamp-3">
                                    {featured.excerpt || 'Read our latest in-depth guide...'}
                                </p>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <span className="font-semibold text-slate-900 text-sm sm:text-base">Read Full Story</span>
                                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm group-hover:translate-x-2 transition-transform">→</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Latest Articles</h2>
                            <Link 
                                href="/guides" 
                                className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1"
                            >
                                View All
                                <TrendingUp className="w-4 h-4" />
                            </Link>
                        </div>

                        {rest.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                {rest.map((post: any) => <BlogCard key={post.id} post={post} />)}
                            </div>
                        ) : (
                            <div className="p-8 sm:p-12 bg-slate-50 rounded-xl text-center border border-dashed border-slate-300">
                                <p className="text-slate-500 italic mb-2 text-sm sm:text-base">More articles coming soon...</p>
                                {!featured && <p className="text-xs sm:text-sm text-slate-400">Head to Admin to publish your first post!</p>}
                            </div>
                        )}
                    </div>

                    <aside className="space-y-6 sm:space-y-8">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
                            <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 text-xs uppercase tracking-wider">Sponsored</h3>
                            <AdUnit slot="blog-sidebar" format="rectangle" className="w-full bg-slate-50 shadow-sm h-[250px]" />
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:sticky lg:top-24 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">Popular Topics</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Car Insurance', 'Home', 'Health', 'Life', 'Tips', 'Savings'].map(tag => (
                                    <span 
                                        key={tag} 
                                        className="px-2.5 sm:px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs sm:text-sm hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Quick CTA */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 sm:p-6 text-white">
                            <h3 className="font-bold mb-2 text-base sm:text-lg">Ready to Save?</h3>
                            <p className="text-blue-100 text-xs sm:text-sm mb-4">Compare quotes from 120+ providers and save up to $867/year.</p>
                            <Link 
                                href="/get-quote"
                                className="block w-full text-center bg-white text-blue-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition"
                            >
                                Get Free Quotes
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
