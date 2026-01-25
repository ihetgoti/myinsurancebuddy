'use client';

import { Shield, Info } from 'lucide-react';

export interface CoverageGuideItem {
    type: string;
    description: string;
    recommended: string;
    whenNeeded: string;
}

interface CoverageGuideProps {
    items: CoverageGuideItem[];
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
        badge: 'bg-blue-100 text-blue-700'
    },
    emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700'
    },
    orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700'
    },
    purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700'
    }
};

export default function CoverageGuide({
    items,
    title = 'Coverage Types Explained',
    description,
    accentColor = 'blue',
    className = ''
}: CoverageGuideProps) {
    const colors = accentColors[accentColor];

    if (!items || items.length === 0) return null;

    return (
        <section
            id="coverage-guide"
            aria-labelledby="coverage-guide-heading"
            className={className}
        >
            <div className="mb-6">
                <h2
                    id="coverage-guide-heading"
                    className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"
                >
                    <Shield className={colors.icon} size={28} />
                    {title}
                </h2>
                {description && (
                    <p className="text-slate-600">{description}</p>
                )}
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`${colors.bg} ${colors.border} border rounded-lg p-2 flex-shrink-0`}>
                                <Shield className={`w-5 h-5 ${colors.icon}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.type}</h3>
                                <p className="text-slate-600 mb-3">{item.description}</p>

                                <div className="grid md:grid-cols-2 gap-3">
                                    <div className={`${colors.bg} rounded-lg p-3`}>
                                        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Recommended</div>
                                        <p className="text-sm font-medium text-slate-800">{item.recommended}</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-lg p-3">
                                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase mb-1">
                                            <Info className="w-3 h-3" />
                                            When You Need It
                                        </div>
                                        <p className="text-sm text-slate-700">{item.whenNeeded}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
