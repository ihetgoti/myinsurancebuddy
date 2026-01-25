'use client';

import { Building2, Check, X, Star } from 'lucide-react';

export interface ComparisonItem {
    name: string;
    strengths: string[];
    weaknesses: string[];
    bestFor: string;
    priceRange: string;
}

interface ProviderComparisonProps {
    items: ComparisonItem[];
    title?: string;
    description?: string;
    accentColor?: 'blue' | 'emerald' | 'orange' | 'purple';
    className?: string;
}

const accentColors = {
    blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        header: 'bg-blue-600'
    },
    emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        header: 'bg-emerald-600'
    },
    orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        header: 'bg-orange-600'
    },
    purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        header: 'bg-purple-600'
    }
};

export default function ProviderComparison({
    items,
    title = 'Top Insurance Providers',
    description,
    accentColor = 'blue',
    className = ''
}: ProviderComparisonProps) {
    const colors = accentColors[accentColor];

    if (!items || items.length === 0) return null;

    return (
        <section
            id="provider-comparison"
            aria-labelledby="comparison-heading"
            className={className}
        >
            <div className="mb-6">
                <h2
                    id="comparison-heading"
                    className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"
                >
                    <Building2 className={colors.icon} size={28} />
                    {title}
                </h2>
                {description && (
                    <p className="text-slate-600">{description}</p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className={`${colors.header} text-white px-4 py-3`}>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-sm opacity-90">{item.priceRange}</p>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Strengths */}
                            <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Strengths</h4>
                                <ul className="space-y-1">
                                    {item.strengths.slice(0, 3).map((strength, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Weaknesses */}
                            {item.weaknesses && item.weaknesses.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Considerations</h4>
                                    <ul className="space-y-1">
                                        {item.weaknesses.slice(0, 2).map((weakness, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-600">{weakness}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Best For */}
                            <div className={`${colors.bg} ${colors.border} border rounded-lg p-3`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Star className={`w-4 h-4 ${colors.icon}`} />
                                    <span className="text-xs font-semibold text-slate-600 uppercase">Best For</span>
                                </div>
                                <p className="text-sm text-slate-700">{item.bestFor}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
