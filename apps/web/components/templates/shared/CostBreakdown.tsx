'use client';

import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface CostBreakdownItem {
    factor: string;
    impact: string;
    description: string;
}

interface CostBreakdownProps {
    items: CostBreakdownItem[];
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

function getImpactIcon(impact: string) {
    const lower = impact.toLowerCase();
    if (lower.includes('increase') || lower.includes('+') || lower.includes('higher')) {
        return <TrendingUp className="w-4 h-4 text-red-500" />;
    }
    if (lower.includes('decrease') || lower.includes('-') || lower.includes('lower') || lower.includes('save')) {
        return <TrendingDown className="w-4 h-4 text-green-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
}

export default function CostBreakdown({
    items,
    title = 'What Affects Your Premium',
    description,
    accentColor = 'blue',
    className = ''
}: CostBreakdownProps) {
    const colors = accentColors[accentColor];

    if (!items || items.length === 0) return null;

    return (
        <section
            id="cost-breakdown"
            aria-labelledby="cost-breakdown-heading"
            className={className}
        >
            <div className="mb-6">
                <h2
                    id="cost-breakdown-heading"
                    className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"
                >
                    <DollarSign className={colors.icon} size={28} />
                    {title}
                </h2>
                {description && (
                    <p className="text-slate-600">{description}</p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`${colors.bg} ${colors.border} border rounded-xl p-4 hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-slate-900">{item.factor}</h3>
                            <div className="flex items-center gap-1">
                                {getImpactIcon(item.impact)}
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}>
                                    {item.impact}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
