'use client';

import Link from 'next/link';
import { ChevronRight, Home, MapPin, Shield, Building2 } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
    type?: 'home' | 'insurance' | 'country' | 'state' | 'city' | 'page';
}

interface SmartBreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

const getIcon = (type?: string) => {
    switch (type) {
        case 'home':
            return <Home size={14} />;
        case 'insurance':
            return <Shield size={14} />;
        case 'country':
        case 'state':
        case 'city':
            return <MapPin size={14} />;
        default:
            return null;
    }
};

export default function SmartBreadcrumb({ items, className = '' }: SmartBreadcrumbProps) {
    if (items.length === 0) return null;

    // Schema.org breadcrumb structured data
    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: `https://myinsurancebuddies.com${item.href}`,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <nav
                aria-label="Breadcrumb"
                className={`py-3 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200 ${className}`}
            >
                <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-600 max-w-7xl mx-auto">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        const icon = getIcon(item.type);

                        return (
                            <li key={index} className="flex items-center">
                                {index > 0 && (
                                    <ChevronRight size={14} className="mx-1 text-slate-400 flex-shrink-0" />
                                )}
                                {isLast ? (
                                    <span
                                        className="flex items-center gap-1.5 font-medium text-slate-900"
                                        aria-current="page"
                                    >
                                        {icon && <span className="text-slate-400">{icon}</span>}
                                        <span className="truncate max-w-[200px] sm:max-w-xs">
                                            {item.label}
                                        </span>
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                                    >
                                        {icon && <span className="text-slate-400">{icon}</span>}
                                        <span className="truncate max-w-[150px] sm:max-w-[200px] hover:underline">
                                            {item.label}
                                        </span>
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
