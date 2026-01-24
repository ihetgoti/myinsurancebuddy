'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FAQItem {
    question: string;
    answer: string;
    category?: string;
}

interface EnhancedFAQProps {
    items: FAQItem[];
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
        hover: 'hover:border-blue-300'
    },
    emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        hover: 'hover:border-emerald-300'
    },
    orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        hover: 'hover:border-orange-300'
    },
    purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        hover: 'hover:border-purple-300'
    }
};

export default function EnhancedFAQ({
    items,
    title = 'Frequently Asked Questions',
    description,
    accentColor = 'blue',
    className = ''
}: EnhancedFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const colors = accentColors[accentColor];

    if (!items || items.length === 0) return null;

    // Generate FAQ JSON-LD schema
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    return (
        <section
            id="faq"
            aria-labelledby="faq-heading"
            className={className}
            itemScope
            itemType="https://schema.org/FAQPage"
        >
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="text-center mb-8">
                <h2
                    id="faq-heading"
                    className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2"
                >
                    <HelpCircle className={colors.icon} size={28} />
                    {title}
                </h2>
                {description && (
                    <p className="text-slate-600 max-w-2xl mx-auto">{description}</p>
                )}
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
                {items.map((item, index) => (
                    <div
                        key={index}
                        itemScope
                        itemType="https://schema.org/Question"
                        itemProp="mainEntity"
                        className={`
                            border rounded-xl overflow-hidden transition-all duration-200
                            ${openIndex === index ? `${colors.bg} ${colors.border}` : 'bg-white border-slate-200'}
                            ${colors.hover}
                        `}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                            aria-expanded={openIndex === index}
                            aria-controls={`faq-answer-${index}`}
                        >
                            <h3
                                className="font-semibold text-slate-900 pr-4"
                                itemProp="name"
                            >
                                {item.question}
                            </h3>
                            <ChevronDown
                                size={20}
                                className={`
                                    flex-shrink-0 transition-transform duration-200
                                    ${openIndex === index ? 'rotate-180' : ''}
                                    ${colors.icon}
                                `}
                            />
                        </button>
                        <div
                            id={`faq-answer-${index}`}
                            itemScope
                            itemType="https://schema.org/Answer"
                            itemProp="acceptedAnswer"
                            className={`
                                overflow-hidden transition-all duration-200
                                ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                            `}
                        >
                            <div className="px-5 pb-4">
                                <p
                                    className="text-slate-600 leading-relaxed"
                                    itemProp="text"
                                >
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
