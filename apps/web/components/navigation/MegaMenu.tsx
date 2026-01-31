'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, MapPin, Shield, Building2, ArrowRight, Grid3X3 } from 'lucide-react';

interface MenuSection {
    id: string;
    title: string;
    href: string;
    items: {
        id: string;
        title: string;
        href: string;
        description?: string;
    }[];
}

interface MegaMenuProps {
    sections: MenuSection[];
    featuredLinks?: {
        title: string;
        href: string;
        description: string;
    }[];
}

export default function MegaMenu({ sections, featuredLinks }: MegaMenuProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    return (
        <div className="relative">
            {/* Trigger */}
            <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                onMouseEnter={() => setActiveSection('main')}
            >
                <Grid3X3 size={16} />
                Browse
                <ChevronDown size={14} className={`transition-transform ${activeSection ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Panel */}
            {activeSection && (
                <div
                    className="absolute top-full left-0 mt-2 w-[800px] max-w-[95vw] bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden"
                    onMouseLeave={() => setActiveSection(null)}
                >
                    <div className="flex">
                        {/* Sidebar Navigation */}
                        <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                Browse by Category
                            </p>
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        className={`
                                            w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm transition-colors
                                            ${activeSection === section.id
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                            }
                                        `}
                                        onMouseEnter={() => setActiveSection(section.id)}
                                    >
                                        <span className="font-medium">{section.title}</span>
                                        <ArrowRight size={14} className={activeSection === section.id ? 'opacity-100' : 'opacity-0'} />
                                    </button>
                                ))}
                            </nav>

                            {/* Featured Links */}
                            {featuredLinks && featuredLinks.length > 0 && (
                                <>
                                    <div className="border-t border-slate-200 my-4" />
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                        Popular
                                    </p>
                                    <div className="space-y-2">
                                        {featuredLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="block px-3 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                                            >
                                                {link.title}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6">
                            {sections.map((section) => (
                                activeSection === section.id && (
                                    <div key={section.id}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {section.title}
                                            </h3>
                                            <Link
                                                href={section.href}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                            >
                                                View all
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {section.items.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={item.href}
                                                    className="group p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                                >
                                                    <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {item.title}
                                                    </p>
                                                    {item.description && (
                                                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}

                            {activeSection === 'main' && (
                                <div className="h-full flex items-center justify-center text-center text-slate-400">
                                    <div>
                                        <Grid3X3 size={48} className="mx-auto mb-3 opacity-30" />
                                        <p>Select a category to browse</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                            Browse thousands of insurance guides
                        </span>
                        <Link
                            href="/directory"
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            Full Directory
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
