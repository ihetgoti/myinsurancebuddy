'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Filter, MapPin, Shield, X, Search, Globe } from 'lucide-react';

interface FacetOption {
    label: string;
    href: string;
    count?: number;
    active?: boolean;
}

interface Facet {
    id: string;
    label: string;
    icon?: React.ReactNode;
    options: FacetOption[];
}

interface FacetedNavigationProps {
    facets: Facet[];
    currentPath: string;
    totalResults?: number;
    className?: string;
}

export default function FacetedNavigation({
    facets,
    currentPath,
    totalResults,
    className = ''
}: FacetedNavigationProps) {
    const [expandedFacets, setExpandedFacets] = useState<string[]>(
        facets.filter(f => f.options.some(o => o.active)).map(f => f.id)
    );
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleFacet = (facetId: string) => {
        setExpandedFacets(prev =>
            prev.includes(facetId)
                ? prev.filter(id => id !== facetId)
                : [...prev, facetId]
        );
    };

    const activeFilters = facets.flatMap(f =>
        f.options.filter(o => o.active).map(o => ({ ...o, facetLabel: f.label }))
    );

    const filteredFacets = facets.map(facet => ({
        ...facet,
        options: searchQuery
            ? facet.options.filter(o =>
                o.label.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : facet.options.slice(0, 10), // Show first 10 by default
    }));

    return (
        <>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex items-center gap-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm"
                >
                    <Filter size={18} />
                    <span className="flex-1 text-left font-medium">Filters</span>
                    {activeFilters.length > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {activeFilters.length}
                        </span>
                    )}
                    <ChevronDown
                        size={18}
                        className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {activeFilters.map((filter, i) => (
                        <Link
                            key={i}
                            href={filter.href}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                            <span className="text-slate-500 text-xs">{filter.facetLabel}:</span>
                            {filter.label}
                            <X size={14} />
                        </Link>
                    ))}
                    <Link
                        href={currentPath}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-500 text-sm hover:text-slate-700"
                    >
                        Clear all
                    </Link>
                </div>
            )}

            {/* Facets Panel */}
            <aside
                className={`
                    ${mobileOpen ? 'block' : 'hidden'} lg:block
                    bg-white border border-slate-200 rounded-xl shadow-sm ${className}
                `}
            >
                {/* Search within facets */}
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter options..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Facet Groups */}
                <div className="divide-y divide-slate-100">
                    {filteredFacets.map((facet) => (
                        <div key={facet.id} className="p-4">
                            <button
                                onClick={() => toggleFacet(facet.id)}
                                className="flex items-center justify-between w-full mb-2"
                            >
                                <div className="flex items-center gap-2 font-semibold text-slate-900">
                                    {facet.icon}
                                    {facet.label}
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`text-slate-400 transition-transform ${
                                        expandedFacets.includes(facet.id) ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {expandedFacets.includes(facet.id) && (
                                <div className="space-y-1 mt-3">
                                    {facet.options.length === 0 ? (
                                        <p className="text-sm text-slate-500 py-2">No matches found</p>
                                    ) : (
                                        facet.options.map((option, i) => (
                                            <Link
                                                key={i}
                                                href={option.href}
                                                className={`
                                                    flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                                                    ${option.active
                                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }
                                                `}
                                            >
                                                <span className="truncate">{option.label}</span>
                                                {option.count !== undefined && (
                                                    <span className="text-xs text-slate-400 ml-2">
                                                        {option.count.toLocaleString()}
                                                    </span>
                                                )}
                                            </Link>
                                        ))
                                    )}
                                    {!searchQuery && facets.find(f => f.id === facet.id)?.options.length! > 10 && (
                                        <button
                                            onClick={() => toggleFacet(facet.id)}
                                            className="text-xs text-blue-600 hover:text-blue-700 mt-2"
                                        >
                                            Show all {facets.find(f => f.id === facet.id)?.options.length} options
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Results count */}
                {totalResults !== undefined && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm text-slate-600">
                        Showing navigation for <strong>{totalResults.toLocaleString()}</strong> pages
                    </div>
                )}
            </aside>
        </>
    );
}
