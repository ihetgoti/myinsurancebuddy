'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

interface Post {
    id: string;
    title: string;
    slug: string;
    bodyHtml: string;
    excerpt: string | null;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    publishedAt: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    tags: string[];
}

export default function EditPost() {
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState<Post | null>(null);

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const fetchPost = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/posts/${postId}`));
            if (!res.ok) {
                throw new Error('Post not found');
            }
            const data = await res.json();
            setFormData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
        setFormData(prev => prev ? { ...prev, tags } : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const res = await fetch(getApiUrl(`/api/posts/${postId}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    content: formData.bodyHtml,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update post');
            }

            setSuccess('Post updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(getApiUrl(`/api/posts/${postId}`), { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete post');
            router.push('/dashboard/posts');
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-gray-600">Loading post...</div>
                </div>
            </AdminLayout>
        );
    }

    if (!formData) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                    <p className="text-gray-600 mb-6">The requested post could not be found.</p>
                    <button
                        onClick={() => router.push('/dashboard/posts')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Posts
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <button
                            onClick={() => router.push('/dashboard/posts')}
                            className="text-gray-600 hover:text-gray-900 mb-2 inline-block"
                        >
                            ← Back to Posts
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={`/blog/${formData.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Preview
                        </a>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                                        <textarea
                                            name="bodyHtml"
                                            value={formData.bodyHtml || ''}
                                            onChange={handleChange}
                                            required
                                            rows={20}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                            placeholder="Write your post content here (HTML supported)..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                                        <textarea
                                            name="excerpt"
                                            value={formData.excerpt || ''}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Brief summary of the post..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SEO Settings */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                        <input
                                            type="text"
                                            name="metaTitle"
                                            value={formData.metaTitle || ''}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                        <textarea
                                            name="metaDescription"
                                            value={formData.metaDescription || ''}
                                            onChange={handleChange}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Publish Settings */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">Publish</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="DRAFT">Draft</option>
                                            <option value="PUBLISHED">Published</option>
                                            <option value="ARCHIVED">Archived</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                                    >
                                        {saving ? 'Saving...' : 'Update Post'}
                                    </button>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">Tags</h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                    <input
                                        type="text"
                                        value={(formData.tags || []).join(', ')}
                                        onChange={handleTagsChange}
                                        placeholder="tips, guide, review"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
