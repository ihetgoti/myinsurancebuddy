'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { Button } from '@myinsurancebuddy/ui';
import TipTapEditor from '@/components/editor/TipTapEditor';

export default function EditPost({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/blog/${params.id}`));
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();

                setTitle(data.title);
                setSlug(data.slug);
                setContent(data.content);
                setIsPublished(data.isPublished);
                setMetaTitle(data.metaTitle || '');
                setMetaDescription(data.metaDescription || '');
            } catch (error) {
                console.error(error);
                alert('Failed to load post');
                router.push('/dashboard/blog');
            } finally {
                setFetching(false);
            }
        };
        fetchPost();
    }, [params.id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(getApiUrl(`/api/blog/${params.id}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    content,
                    isPublished,
                    metaTitle,
                    metaDescription
                })
            });

            if (res.ok) {
                // Stay on page or redirect? usually stay + toast, but simple redirect for now
                router.push('/dashboard/blog');
            } else {
                alert('Failed to update post');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating post');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        setLoading(true);
        try {
            await fetch(getApiUrl(`/api/blog/${params.id}`), { method: 'DELETE' });
            router.push('/dashboard/blog');
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (fetching) return <AdminLayout><div>Loading...</div></AdminLayout>;

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/blog" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">Edit Post</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !title}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? 'Saving...' : 'Update Post'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 font-mono text-sm"
                                    />
                                </div>
                                <div className="prose-admin">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                                    <TipTapEditor value={content} onChange={setContent} />
                                </div>
                            </div>
                        </div>

                        {/* SEO Section */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">SEO Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                                    <input
                                        type="text"
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                                    <textarea
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Publishing</h2>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={isPublished}
                                        onChange={(e) => setIsPublished(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Publish immediately</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
