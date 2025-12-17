'use client';

import AdminLayout from '@/components/AdminLayout';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';

interface Stats {
    posts: number;
    templates: number;
    regions: number;
    media: number;
}

export default function Dashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<Stats>({ posts: 0, templates: 0, regions: 0, media: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch stats from APIs
            const [postsRes, templatesRes, regionsRes, mediaRes] = await Promise.all([
                fetch(getApiUrl('/api/posts')),
                fetch(getApiUrl('/api/templates')),
                fetch(getApiUrl('/api/regions')),
                fetch(getApiUrl('/api/media')),
            ]);

            const [posts, templates, regions, media] = await Promise.all([
                postsRes.json(),
                templatesRes.json(),
                regionsRes.json(),
                mediaRes.json(),
            ]);

            setStats({
                posts: Array.isArray(posts) ? posts.length : 0,
                templates: Array.isArray(templates) ? templates.length : 0,
                regions: Array.isArray(regions) ? regions.length : 0,
                media: Array.isArray(media) ? media.length : 0,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Blog Posts', value: stats.posts, icon: '📝', color: 'bg-blue-500' },
        { label: 'Templates', value: stats.templates, icon: '📄', color: 'bg-green-500' },
        { label: 'Regions', value: stats.regions, icon: '🗺️', color: 'bg-purple-500' },
        { label: 'Media Files', value: stats.media, icon: '🖼️', color: 'bg-orange-500' },
    ];

    return (
        <AdminLayout>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600 mb-8">Welcome back, {session?.user?.name || session?.user?.email}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((card) => (
                        <div key={card.label} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${card.color} text-white p-3 rounded-lg text-2xl`}>
                                    {card.icon}
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.label}</h3>
                            <p className="text-3xl font-bold text-gray-900">
                                {loading ? '...' : card.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a
                            href="/dashboard/posts/new"
                            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                        >
                            <span className="text-2xl">➕</span>
                            <div>
                                <p className="font-medium text-gray-900">Create Blog Post</p>
                                <p className="text-sm text-gray-600">Write a new article</p>
                            </div>
                        </a>
                        <a
                            href="/dashboard/templates/new"
                            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
                        >
                            <span className="text-2xl">📄</span>
                            <div>
                                <p className="font-medium text-gray-900">New Template</p>
                                <p className="text-sm text-gray-600">Create page template</p>
                            </div>
                        </a>
                        <a
                            href="/dashboard/media"
                            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition"
                        >
                            <span className="text-2xl">📤</span>
                            <div>
                                <p className="font-medium text-gray-900">Upload Media</p>
                                <p className="text-sm text-gray-600">Add images</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">System Status</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                            <div className="flex items-center gap-3">
                                <span className="text-green-600 text-xl">✓</span>
                                <span className="font-medium">Database</span>
                            </div>
                            <span className="text-sm text-green-600">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                            <div className="flex items-center gap-3">
                                <span className="text-green-600 text-xl">✓</span>
                                <span className="font-medium">API Services</span>
                            </div>
                            <span className="text-sm text-green-600">Running</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                            <div className="flex items-center gap-3">
                                <span className="text-green-600 text-xl">✓</span>
                                <span className="font-medium">Storage</span>
                            </div>
                            <span className="text-sm text-green-600">Available</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
