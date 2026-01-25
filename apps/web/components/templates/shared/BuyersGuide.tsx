'use client';

import { ShoppingCart, CheckCircle, Search, AlertTriangle, MessageCircle } from 'lucide-react';

export interface BuyersGuideContent {
    steps: string[];
    lookFor: string[];
    redFlags: string[];
    questions: string[];
}

interface BuyersGuideProps {
    content: BuyersGuideContent;
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
        step: 'bg-blue-600'
    },
    emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        step: 'bg-emerald-600'
    },
    orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        step: 'bg-orange-600'
    },
    purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        step: 'bg-purple-600'
    }
};

export default function BuyersGuide({
    content,
    title = 'How to Buy Insurance',
    description,
    accentColor = 'emerald',
    className = ''
}: BuyersGuideProps) {
    const colors = accentColors[accentColor];

    if (!content) return null;

    return (
        <section
            id="buyers-guide"
            aria-labelledby="buyers-guide-heading"
            className={className}
        >
            <div className="mb-6">
                <h2
                    id="buyers-guide-heading"
                    className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"
                >
                    <ShoppingCart className={colors.icon} size={28} />
                    {title}
                </h2>
                {description && (
                    <p className="text-slate-600">{description}</p>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Steps */}
                {content.steps && content.steps.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <CheckCircle className={colors.icon} size={20} />
                            Step-by-Step Guide
                        </h3>
                        <ol className="space-y-3">
                            {content.steps.map((step, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className={`${colors.step} text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                                        {index + 1}
                                    </span>
                                    <span className="text-slate-700">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* What to Look For */}
                {content.lookFor && content.lookFor.length > 0 && (
                    <div className={`${colors.bg} ${colors.border} border rounded-xl p-5`}>
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Search className={colors.icon} size={20} />
                            What to Look For
                        </h3>
                        <ul className="space-y-2">
                            {content.lookFor.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-slate-700">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Red Flags */}
                {content.redFlags && content.redFlags.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-red-600" size={20} />
                            Red Flags to Avoid
                        </h3>
                        <ul className="space-y-2">
                            {content.redFlags.map((flag, index) => (
                                <li key={index} className="flex items-start gap-2 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{flag}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Questions to Ask */}
                {content.questions && content.questions.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MessageCircle className="text-amber-600" size={20} />
                            Questions to Ask
                        </h3>
                        <ul className="space-y-2">
                            {content.questions.map((question, index) => (
                                <li key={index} className="flex items-start gap-2 text-slate-700">
                                    <span className="font-bold text-amber-600">{index + 1}.</span>
                                    <span>{question}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}
