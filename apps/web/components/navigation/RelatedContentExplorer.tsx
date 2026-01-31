'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MapPin, Shield, ChevronRight, ArrowRight, Layers, Globe, Building2 } from 'lucide-react';

interface RelatedGroup {
    id: string;
    title: string;
    icon: 'location' | 'insurance' | 'nearby' | 'parent';
    items: {
        id: string;
        title: string;
        href: string;
        badge?: string;
    }[];
}

interface RelatedContentExplorerProps {
    groups: RelatedGroup[];
    currentTitle?: string;
    className?: string;
}

const getIcon = (type: string, size: number = 20) => {
    switch (type) {
        case 'location':
            return <MapPin size={size} />;
        case 'insurance':
            return <Shield size={size} />;
        case 'nearby':
            return <Building2 size={size} />;
        case 'parent':
            return <Globe size={size} />;
        default:
            return <Layers size={size} />;
    }
};

const getGradient = (type: string) => {
    switch (type) {
        case 'location':
            return 'from-blue-500 to-cyan-500';
        case 'insurance':
            return 'from-indigo-500 to-purple-500';
        case 'nearby':
            return 'from-emerald-500 to-teal-500';
        case 'parent':
            return 'from-violet-500 to-fuchsia-500';
        default:
            return 'from-slate-500 to-slate-600';
    }
};

export default function RelatedContentExplorer({
    groups,
    currentTitle,
    className = ''
}: RelatedContentExplorerProps) {
    const [expandedGroup, setExpandedGroup] = useState<string | null>(
        groups.length > 0 ? groups[0].id : null
    );

    return (
        <section className={`bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 py-12 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                        <Layers size={14} />
                        Explore More
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        Continue Your Journey
                    </h2>
                    {currentTitle ? (
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            You&apos;re viewing <strong>{currentTitle}</strong>. Discover related insurance guides and locations.
                        </p>
                    ) : (
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Discover more insurance guides organized by type and location
                        </p>
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {groups.map((group, index) => {
                        const isExpanded = expandedGroup === group.id;
                        const gradient = getGradient(group.icon);

                        return (
                            <div
                                key={group.id}
                                className={`
                                    bg-white rounded-2xl border border-slate-200 overflow-hidden
                                    transition-all duration-300
                                    ${isExpanded ? 'shadow-lg ring-2 ring-blue-500/10' : 'shadow-sm hover:shadow-md'}
                                    ${index === 0 ? 'lg:col-span-2' : ''}
                                `}
                            >
                                {/* Card Header */}
                                <button
                                    onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                                    className={`w-full p-5 sm:p-6 text-left bg-gradient-to-r ${gradient}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                                {getIcon(group.icon, 24)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">
                                                    {group.title}
                                                </h3>
                                                <p className="text-white/80 text-sm mt-0.5">
                                                    {group.items.length} options
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight
                                            size={24}
                                            className={`text-white/60 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                                        />
                                    </div>
                                </button>

                                {/* Card Content */}
                                <div className={`
                                    transition-all duration-300 overflow-hidden
                                    ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-[400px] lg:opacity-100'}
                                `}>
                                    <div className="p-4 sm:p-6">
                                        <div className={`grid gap-2 ${index === 0 ? 'sm:grid-cols-2' : ''}`}>
                                            {group.items.slice(0, isExpanded ? undefined : 6).map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={item.href}
                                                    className="group flex items-center justify-between p-3 rounded-xl
                                                             bg-slate-50 hover:bg-blue-50 border border-transparent
                                                             hover:border-blue-200 transition-all"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center
                                                                       text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                                            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-slate-700 group-hover:text-blue-700 truncate transition-colors">
                                                                {item.title}
                                                            </p>
                                                            {item.badge && (
                                                                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Show More/Less */}
                                        {group.items.length > 6 && (
                                            <button
                                                onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                                                className="mt-4 w-full py-2.5 text-sm font-medium text-slate-600 hover:text-blue-600
                                                         bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors
                                                         flex items-center justify-center gap-2"
                                            >
                                                {isExpanded ? (
                                                    <>Show less</>
                                                ) : (
                                                    <>
                                                        Show {group.items.length - 6} more
                                                        <ArrowRight size={14} />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-10 text-center">
                    <Link
                        href="/directory"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl
                                 font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                    >
                        <Globe size={18} />
                        Browse Full Directory
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
