import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ post }: { post: any }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all hover:border-blue-200 h-full">
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                {post.featuredImage ? (
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <span className="text-4xl opacity-20">📷</span>
                    </div>
                )}
                {post.category && (
                    <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 bg-white/90 text-slate-900 rounded-md shadow-sm backdrop-blur-sm">
                        {post.category.name}
                    </span>
                )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-500">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : ''}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{post.author?.name || 'Editor'}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 line-clamp-2 leading-tight">
                    {post.title}
                </h3>
                {post.excerpt && (
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                        {post.excerpt}
                    </p>
                )}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">Read Article</span>
                    <span className="text-blue-600 transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </div>
        </Link>
    );
}
