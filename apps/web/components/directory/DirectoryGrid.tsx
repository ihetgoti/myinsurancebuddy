'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Shield, FileText, ChevronRight } from 'lucide-react';

interface DirectoryItem {
    id: string;
    title: string;
    href: string;
    description?: string;
    meta?: {
        count?: number;
        type?: string;
        location?: string;
    };
    children?: DirectoryItem[];
}

interface DirectoryGridProps {
    title: string;
    subtitle?: string;
    items: DirectoryItem[];
    layout?: 'grid' | 'list' | 'compact';
    showChildren?: boolean;
    emptyMessage?: string;
}

export default function DirectoryGrid({
    title,
    subtitle,
    items,
    layout = 'grid',
    showChildren = false,
    emptyMessage = 'No items found'
}: DirectoryGridProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">{emptyMessage}</p>
            </div>
        );
    }

    const gridCols = layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
        layout === 'compact' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' :
            'grid-cols-1';

    return (
        <section className="py-8 sm:py-12">
            {(title || subtitle) && (
                <div className="mb-6 sm:mb-8">
                    {title && (
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
                    )}
                    {subtitle && (
                        <p className="mt-2 text-slate-600">{subtitle}</p>
                    )}
                </div>
            )}

            <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`
                            group relative bg-white border border-slate-200 rounded-xl p-4 sm:p-5
                            hover:shadow-lg hover:border-blue-300 transition-all duration-200
                            ${layout === 'list' ? 'flex items-center gap-4' : ''}
                        `}
                    >
                        {/* Icon based on type */}
                        <div className={`
                            ${layout === 'list' ? 'flex-shrink-0' : 'mb-3'}
                            w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center
                            group-hover:bg-blue-100 transition-colors
                        `}>
                            {item.meta?.type?.includes('location') ? (
                                <MapPin size={20} className="text-blue-600" />
                            ) : item.meta?.type?.includes('insurance') ? (
                                <Shield size={20} className="text-blue-600" />
                            ) : (
                                <FileText size={20} className="text-blue-600" />
                            )}
                        </div>

                        <div className={layout === 'list' ? 'flex-1 min-w-0' : ''}>
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                {item.title}
                            </h3>

                            {item.description && layout !== 'compact' && (
                                <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                                    {item.description}
                                </p>
                            )}

                            {item.meta && layout !== 'compact' && (
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                    {item.meta.count !== undefined && (
                                        <span>{item.meta.count.toLocaleString()} pages</span>
                                    )}
                                    {item.meta.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {item.meta.location}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Children preview */}
                            {showChildren && item.children && item.children.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-100">
                                    <div className="flex flex-wrap gap-2">
                                        {item.children.slice(0, 3).map((child) => (
                                            <Link
                                                key={child.id}
                                                href={child.href}
                                                className="text-xs text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {child.title}
                                            </Link>
                                        ))}
                                        {item.children.length > 3 && (
                                            <span className="text-xs text-slate-400 px-2 py-1">
                                                +{item.children.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Arrow indicator */}
                        <div className={`
                            ${layout === 'list' ? 'flex-shrink-0' : 'mt-3'}
                            flex items-center gap-1 text-sm text-blue-600 font-medium
                            opacity-0 group-hover:opacity-100 transition-opacity
                        `}>
                            <span className="hidden sm:inline">Explore</span>
                            <ChevronRight size={16} />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
