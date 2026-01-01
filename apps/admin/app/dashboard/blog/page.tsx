'use client';

import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Search, RefreshCw } from 'lucide-react';
import { getApiUrl } from '@/lib/api';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt: string | null;
    createdAt: string;
    viewCount: number;
    category: { id: string; name: string; color: string | null } | null;
    author: { name: string | null; email: string } | null;
}

export default function BlogDashboard() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl('/api/blog?limit=50'));
            const data = await res.json();
            setPosts(data.posts || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await fetch(getApiUrl(`/api/blog/${id}`), { method: 'DELETE' });
            fetchPosts();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleTogglePublish = async (post: BlogPost) => {
        try {
            await fetch(getApiUrl(`/api/blog/${post.id}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !post.isPublished }),
            });
            fetchPosts();
        } catch (error) {
            console.error('Failed to toggle publish:', error);
        }
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
                        <p className="text-slate-500 text-sm mt-1">{total} posts total</p>
                    </div>
                    <Link
                        href="/dashboard/blog/new"
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Post
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={fetchPosts}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-400">Loading...</div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-500 mb-4">No blog posts yet</p>
                            <Link
                                href="/dashboard/blog/new"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Create your first post →
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Author</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Views</th>
                                    <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {post.isFeatured && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                                                <div>
                                                    <p className="font-semibold text-slate-900">{post.title}</p>
                                                    <p className="text-xs text-slate-400">/{post.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {post.category ? (
                                                <span
                                                    className="px-2 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor: `${post.category.color}20` || '#f1f5f9',
                                                        color: post.category.color || '#64748b'
                                                    }}
                                                >
                                                    {post.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {post.isPublished ? (
                                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                    <Eye className="w-4 h-4" /> Published
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-slate-400 text-sm">
                                                    <EyeOff className="w-4 h-4" /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {post.author?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {post.viewCount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleTogglePublish(post)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title={post.isPublished ? 'Unpublish' : 'Publish'}
                                                >
                                                    {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <Link
                                                    href={`/dashboard/blog/${post.id}`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
