'use client';

import { FileText, Clock, CheckCircle, FileCheck, Phone } from 'lucide-react';

export interface ClaimsProcessContent {
    steps: string[];
    documents: string[];
    timeline: string;
    resources: string[];
}

interface ClaimsProcessProps {
    content: ClaimsProcessContent;
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

export default function ClaimsProcess({
    content,
    title = 'How to File a Claim',
    description,
    accentColor = 'blue',
    className = ''
}: ClaimsProcessProps) {
    const colors = accentColors[accentColor];

    if (!content || !content.steps || content.steps.length === 0) return null;

    return (
        <section
            id="claims-process"
            aria-labelledby="claims-heading"
            className={className}
        >
            <div className="mb-6">
                <h2
                    id="claims-heading"
                    className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"
                >
                    <FileText className={colors.icon} size={28} />
                    {title}
                </h2>
                {description && (
                    <p className="text-slate-600">{description}</p>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Steps */}
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle className={colors.icon} size={20} />
                        Step-by-Step Process
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

                {/* Documents & Timeline */}
                <div className="space-y-4">
                    {/* Documents */}
                    {content.documents && content.documents.length > 0 && (
                        <div className={`${colors.bg} ${colors.border} border rounded-xl p-5`}>
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <FileCheck className={colors.icon} size={20} />
                                Documents Needed
                            </h3>
                            <ul className="space-y-2">
                                {content.documents.map((doc, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-slate-700">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                        {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Timeline */}
                    {content.timeline && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Clock className="text-amber-600" size={20} />
                                Expected Timeline
                            </h3>
                            <p className="text-slate-700">{content.timeline}</p>
                        </div>
                    )}

                    {/* Resources */}
                    {content.resources && content.resources.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Phone className="text-slate-600" size={20} />
                                Local Resources
                            </h3>
                            <ul className="space-y-2">
                                {content.resources.map((resource, index) => (
                                    <li key={index} className="text-sm text-slate-700">
                                        {resource}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
