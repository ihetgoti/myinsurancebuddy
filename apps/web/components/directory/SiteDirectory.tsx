'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, MapPin, Shield, Building2, Globe } from 'lucide-react';

interface DirectorySection {
    id: string;
    title: string;
    icon: 'insurance' | 'location' | 'state' | 'city';
    count: number;
    items: {
        id: string;
        title: string;
        href: string;
        count?: number;
    }[];
}

interface SiteDirectoryProps {
    sections: DirectorySection[];
    className?: string;
}

const getIcon = (type: string, size: number = 20) => {
    switch (type) {
        case 'insurance':
            return <Shield size={size} />;
        case 'location':
            return <MapPin size={size} />;
        case 'state':
            return <Building2 size={size} />;
        case 'city':
            return <Globe size={size} />;
        default:
            return <ChevronRight size={size} />;
    }
};

export default function SiteDirectory({ sections, className = '' }: SiteDirectoryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSections, setExpandedSections] = useState<string[]>(
        sections.slice(0, 3).map(s => s.id)
    );

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    // Filter sections based on search
    const filteredSections = searchQuery
        ? sections.map(section => ({
            ...section,
            items: section.items.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(section => section.items.length > 0)
        : sections;

    const totalPages = sections.reduce((sum, s) => sum + s.count, 0);

    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                    Site Directory
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Browse our comprehensive collection of {totalPages.toLocaleString()} insurance guides,
                    organized by type and location.
                </p>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-12">
                <div className="relative">
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search pages, locations, insurance types..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                                 shadow-sm"
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {sections.slice(0, 4).map((section) => (
                    <div
                        key={section.id}
                        className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                    >
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-2">
                            {getIcon(section.icon, 20)}
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{section.count.toLocaleString()}</p>
                        <p className="text-sm text-slate-500">{section.title}</p>
                    </div>
                ))}
            </div>

            {/* Directory Sections */}
            <div className="grid md:grid-cols-2 gap-6">
                {filteredSections.map((section) => (
                    <div
                        key={section.id}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                    >
                        {/* Section Header */}
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-4 sm:p-6 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                                    {getIcon(section.icon)}
                                </div>
                                <div className="text-left">
                                    <h2 className="font-bold text-slate-900">{section.title}</h2>
                                    <p className="text-sm text-slate-500">
                                        {section.count.toLocaleString()} pages
                                    </p>
                                </div>
                            </div>
                            <ChevronDown
                                size={20}
                                className={`text-slate-400 transition-transform ${
                                    expandedSections.includes(section.id) ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {/* Section Items */}
                        {expandedSections.includes(section.id) && (
                            <div className="p-4 sm:p-6 border-t border-slate-200">
                                {section.items.length === 0 ? (
                                    <p className="text-slate-500 text-center py-4">
                                        No matches found
                                    </p>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                                            {section.items.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={item.href}
                                                    className="flex items-center justify-between px-3 py-2 rounded-lg
                                                             text-slate-600 hover:bg-blue-50 hover:text-blue-700
                                                             transition-colors text-sm"
                                                >
                                                    <span className="truncate">{item.title}</span>
                                                    {item.count && (
                                                        <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                                                            {item.count}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                        {section.items.length > 20 && (
                                            <div className="mt-4 text-center">
                                                <Link
                                                    href={`/directory/${section.id}`}
                                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    View all {section.count.toLocaleString()} pages
                                                    <ChevronRight size={16} />
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* No results */}
            {filteredSections.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">
                        No results found for &ldquo;{searchQuery}&rdquo;
                    </p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {/* Schema.org SiteNavigationElement */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SiteNavigationElement',
                        name: 'Site Directory',
                        url: 'https://myinsurancebuddies.com/directory',
                        hasPart: sections.map(section => ({
                            '@type': 'SiteNavigationElement',
                            name: section.title,
                            url: `https://myinsurancebuddies.com/directory/${section.id}`,
                        })),
                    }),
                }}
            />
        </div>
    );
}
