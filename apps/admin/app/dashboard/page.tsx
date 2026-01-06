'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import {
    Shield,
    Globe,
    Map,
    Building2,
    FileText,
    Plus,
    Upload,
    CheckCircle,
    ArrowRight
} from 'lucide-react';

interface Stats {
    insuranceTypes: number;
    countries: number;
    states: number;
    cities: number;
    pages: number;
    publishedPages: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [typesRes, countriesRes, statesRes, citiesRes, pagesRes] = await Promise.all([
                fetch(getApiUrl('/api/insurance-types')),
                fetch(getApiUrl('/api/countries')),
                fetch(getApiUrl('/api/states')),
                fetch(getApiUrl('/api/cities?limit=1')),
                fetch(getApiUrl('/api/pages?limit=1')),
            ]);

            const types = await typesRes.json();
            const countries = await countriesRes.json();
            const states = await statesRes.json();
            const cities = await citiesRes.json();
            const pages = await pagesRes.json();

            setStats({
                insuranceTypes: Array.isArray(types) ? types.length : 0,
                countries: Array.isArray(countries) ? countries.length : 0,
                states: Array.isArray(states) ? states.length : 0,
                cities: cities.total || 0,
                pages: pages.total || 0,
                publishedPages: 0, // Would need separate query
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Insurance Types', value: stats?.insuranceTypes || 0, icon: <Shield size={24} />, href: '/dashboard/insurance-types', color: 'text-blue-600 bg-blue-50' },
        { label: 'Countries', value: stats?.countries || 0, icon: <Globe size={24} />, href: '/dashboard/countries', color: 'text-indigo-600 bg-indigo-50' },
        { label: 'States', value: stats?.states || 0, icon: <Map size={24} />, href: '/dashboard/states', color: 'text-violet-600 bg-violet-50' },
        { label: 'Cities', value: stats?.cities || 0, icon: <Building2 size={24} />, href: '/dashboard/cities', color: 'text-fuchsia-600 bg-fuchsia-50' },
        { label: 'Total Pages', value: stats?.pages || 0, icon: <FileText size={24} />, href: '/dashboard/pages', color: 'text-slate-600 bg-slate-100' },
    ];

    const quickActions = [
        { label: 'New Insurance Type', href: '/dashboard/insurance-types', icon: <Plus size={18} /> },
        { label: 'Import Countries', href: '/dashboard/countries/import', icon: <Upload size={18} /> },
        { label: 'Import States', href: '/dashboard/states/import', icon: <Upload size={18} /> },
        { label: 'Import Cities', href: '/dashboard/cities/import', icon: <Upload size={18} /> },
        { label: 'Create New Page', href: '/dashboard/pages/new', icon: <Plus size={18} /> },
    ];

    return (
        <AdminLayout>
            <div>
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 mt-2">Welcome back. Here&apos;s what&apos;s happening with your content today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                    {statCards.map((stat) => (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                            </div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">
                                {loading ? '-' : stat.value.toLocaleString()}
                            </p>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <CheckCircle size={20} className="text-slate-400" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all group"
                            >
                                <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                                    {action.icon}
                                </div>
                                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                                    {action.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* URL Structure Guide */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">URL Structure</h2>
                    <div className="space-y-2 font-mono text-sm">
                        <p className="text-gray-600">
                            <span className="text-blue-600 font-medium">/car-insurance</span>
                            <span className="text-gray-400 ml-2">→ Niche Homepage</span>
                        </p>
                        <p className="text-gray-600">
                            <span className="text-blue-600 font-medium">/car-insurance/us</span>
                            <span className="text-gray-400 ml-2">→ Country Page</span>
                        </p>
                        <p className="text-gray-600">
                            <span className="text-blue-600 font-medium">/car-insurance/us/california</span>
                            <span className="text-gray-400 ml-2">→ State Page</span>
                        </p>
                        <p className="text-gray-600">
                            <span className="text-purple-600 font-medium">/car-insurance/us/california/los-angeles</span>
                            <span className="text-gray-400 ml-2">→ City Page (Primary)</span>
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
