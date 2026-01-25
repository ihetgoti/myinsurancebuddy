'use client';

import { Tag, MapPin, Percent } from 'lucide-react';

export interface DiscountItem {
    name: string;
    savings: string;
    qualification: string;
    isLocal: boolean;
}

interface DiscountsListProps {
    items: DiscountItem[];
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

export default function DiscountsList({
    items,
    title = 'Available Discounts',
    description,
    accentColor = 'emerald',
    className = ''
}: DiscountsListProps) {
    const colors = accentColors[accentColor];

    if (!items || items.length === 0) return null;

    return (
        <section
            id="discounts"
            aria-labelledby="discounts-heading"
            className={className}
        >
            <div className="mb-6">
                <h2
                    id="discounts-heading"
                    className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"
                >
                    <Tag className={colors.icon} size={28} />
                    {title}
                </h2>
                {description && (
                    <p className="text-slate-600">{description}</p>
                )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow flex items-start gap-4"
                    >
                        <div className={`${colors.bg} ${colors.border} border rounded-lg p-3 flex-shrink-0`}>
                            <Percent className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900">{item.name}</h3>
                                {item.isLocal && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                        <MapPin className="w-3 h-3" />
                                        Local
                                    </span>
                                )}
                            </div>
                            <div className={`inline-block text-sm font-bold ${colors.badge} px-2 py-0.5 rounded mb-2`}>
                                Save {item.savings}
                            </div>
                            <p className="text-sm text-slate-600">{item.qualification}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
