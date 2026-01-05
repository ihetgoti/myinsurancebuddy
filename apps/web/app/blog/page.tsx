import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPosts } from '@/lib/blog';
import BlogCard from '@/components/blog/BlogCard';
import AdUnit from '@/components/AdUnit';

export const metadata = {
    title: 'Insurance Insights & Guides | MyInsuranceBuddy',
    description: 'Expert guides, money-saving tips, and industry news to help you protect what matters most.',
};

export const revalidate = 3600;

export default async function BlogIndex() {
    const posts = await getPublishedPosts();
    const featured = posts[0];
    const rest = posts.slice(1);

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Insurance Insights</h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Navigate the complex world of insurance with our expert guides, industry news, and money-saving tips.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
                {/* Top Ad */}
                <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 mb-12 flex justify-center">
                    <AdUnit slot="blog-index-top" format="horizontal" />
                </div>

                {featured && (
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-slate-200 flex-1"></div>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Featured Article</h2>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="h-64 lg:h-auto bg-slate-100 relative min-h-[300px] overflow-hidden">
                                {featured.featuredImage ? (
                                    <Image src={featured.featuredImage} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-50 text-6xl">📝</div>
                                )}
                            </div>
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-4">
                                    {featured.category && (
                                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
                                            {featured.category.name}
                                        </span>
                                    )}
                                    <span className="text-slate-400 text-sm">
                                        {featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                    {featured.title}
                                </h3>
                                <p className="text-slate-600 text-lg mb-8 line-clamp-3">
                                    {featured.excerpt || 'Read our latest in-depth guide...'}
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-slate-900">Read Full Story</span>
                                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:translate-x-2 transition-transform">→</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Latest Articles</h2>
                        </div>

                        {rest.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {rest.map((post: any) => <BlogCard key={post.id} post={post} />)}
                            </div>
                        ) : (
                            <div className="p-12 bg-slate-50 rounded-xl text-center border border-dashed border-slate-300">
                                <p className="text-slate-500 italic mb-2">More articles coming soon...</p>
                                {!featured && <p className="text-sm text-slate-400">Head to Admin to publish your first post!</p>}
                            </div>
                        )}
                    </div>

                    <aside className="space-y-8">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                            <h3 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Sponsored</h3>
                            <AdUnit slot="blog-sidebar" format="rectangle" className="w-full bg-white shadow-sm h-[250px]" />
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4">Popular Topics</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Car Insurance', 'Home', 'Health', 'Life', 'Tips'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-slate-200 cursor-pointer transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
