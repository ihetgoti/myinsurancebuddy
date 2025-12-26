'use client';

import { useState } from 'react';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    title?: string;
    subtitle?: string;
    insuranceType: string;
    location?: string;
    customFAQs?: FAQ[];
}

export default function FAQAccordion({
    title = "Frequently Asked Questions",
    subtitle,
    insuranceType,
    location,
    customFAQs,
}: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const defaultFAQs: FAQ[] = [
        {
            question: `What does ${insuranceType.toLowerCase()} typically cover?`,
            answer: `${insuranceType} provides financial protection against specific risks and losses. Coverage varies by policy but typically includes protection for common incidents, liability coverage, and may include additional benefits depending on your plan. We recommend reviewing policy details carefully and comparing multiple options.`,
        },
        {
            question: `How much does ${insuranceType.toLowerCase()} cost ${location ? `in ${location}` : 'on average'}?`,
            answer: `The cost of ${insuranceType.toLowerCase()} varies based on several factors including coverage level, personal factors, location, and the provider you choose. ${location ? `In ${location}, average premiums may differ from national averages due to local regulations and risk factors.` : ''} We recommend getting personalized quotes to find the best rate for your situation.`,
        },
        {
            question: 'How do I choose the right coverage level?',
            answer: 'Choosing the right coverage depends on your specific needs, assets to protect, risk tolerance, and budget. Consider factors like your financial situation, dependents, and potential risks. Our guides can help you understand the different coverage options and make an informed decision.',
        },
        {
            question: 'Can I switch insurance providers at any time?',
            answer: 'In most cases, you can switch insurance providers at any time. However, consider timing your switch with policy renewal dates to avoid cancellation fees. Always ensure your new coverage is active before canceling your existing policy to avoid any gaps in coverage.',
        },
        {
            question: 'How do I file a claim if I need to?',
            answer: 'To file a claim, contact your insurance provider directly through their phone line, mobile app, or online portal. Document everything related to your claim, including photos, receipts, and any relevant information. Most providers have 24/7 claim support for emergencies.',
        },
        {
            question: `Are there any ${location ? `${location}-specific` : 'state-specific'} requirements I should know about?`,
            answer: `${location ? `${location} has specific insurance requirements and regulations` : 'Each state has specific insurance requirements'} that may affect your coverage needs. These can include minimum coverage requirements, mandatory reporting, and specific consumer protections. Our guides cover these requirements in detail for your area.`,
        },
    ];

    const faqs = customFAQs || defaultFAQs;

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
                            Got Questions?
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            {title}
                        </h2>
                        <p className="text-lg text-slate-600">
                            {subtitle || `Everything you need to know about ${insuranceType.toLowerCase()}${location ? ` in ${location}` : ''}.`}
                        </p>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === i
                                        ? 'border-blue-200 shadow-lg shadow-blue-100/50'
                                        : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="text-lg font-semibold text-slate-900 pr-4">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === i
                                                ? 'bg-blue-600 text-white rotate-180'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    className={`transition-all duration-300 ease-in-out ${openIndex === i
                                            ? 'max-h-96 opacity-100'
                                            : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6">
                                        <p className="text-slate-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Still have questions? */}
                    <div className="mt-12 text-center p-8 bg-white rounded-2xl border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            Still have questions?
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Our team is here to help you make the right decision.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            Contact Our Experts
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
