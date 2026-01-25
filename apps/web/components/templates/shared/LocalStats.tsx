'use client';

import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface LocalStatItem {
    stat: string;
    value: string;
    impact: string;
    comparison: string;
}

interface LocalStatsProps {
    items: LocalStatItem[];
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
        value: 'text-blue-700'
    },
    emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        value: 'text-emerald-700'
    },
    orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        value: 'text-orange-700'
    },
    purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        value: 'text-purple-700'
    }
};

function getComparisonIcon(comparison: string) {
    const lower = comparison.toLowerCase();
    if (lower.includes('above') || lower.includes('higher') || lower.includes('more')) {
        return <TrendingUp className="w-4 h-4 text-red-500" />;
    }
    if (lower.includes('below') || lower.includes('lower') || lower.includes('less')) {
        return <TrendingDown className="w-4 h-4 text-green-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
}

export default function LocalStats({
    items,
    title = 'Local Statistics',
    description,
    accentColor = 'purple',
    className = ''
}: LocalStatsProps) {
    const colors = accentColors[accentColor];

    if (!items || items.length === 0) return null;

    return (
        <section
            id="local-stats"
            aria-labelledby="stats-heading"
            className={className}
        >
            <div className="mb-6">
                <h2
                    id="stats-heading"
                    className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"
                >
                    <BarChart3 className={colors.icon} size={28} />
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
                        className={`${colors.bg} ${colors.border} border rounded-xl p-4`}
                    >
                        <div className="text-sm text-slate-500 mb-1">{item.stat}</div>
                        <div className={`text-2xl font-bold ${colors.value} mb-2`}>{item.value}</div>
                        <p className="text-sm text-slate-600 mb-2">{item.impact}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-200">
                            {getComparisonIcon(item.comparison)}
                            <span>{item.comparison}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
