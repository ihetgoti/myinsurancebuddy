'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

const faqs = [
    {
        question: 'What types of insurance do you cover?',
        answer: 'We provide information on all major insurance types including auto, health, home, life, renters, business, and more. We cover state-specific requirements for all 50 US states.',
    },
    {
        question: 'Are the quotes really free?',
        answer: 'Yes, all quote requests through our platform are completely free. We connect you with licensed insurance agents who provide personalized quotes at no cost to you.',
    },
    {
        question: 'How do you make money?',
        answer: 'We may receive a referral fee when you purchase a policy through one of our partner providers. This does not affect the price you pay for insurance.',
    },
    {
        question: 'Is my information secure?',
        answer: 'Absolutely. We use industry-standard encryption to protect your personal information. We never sell your data to third parties without your consent.',
    },
    {
        question: 'How accurate are your rate comparisons?',
        answer: 'Our rate comparisons are based on publicly available data and user-reported information. Actual rates depend on your individual circumstances and may vary.',
    },
    {
        question: 'Can I purchase insurance directly through your site?',
        answer: 'We do not sell insurance directly. We connect you with licensed agents and providers who can help you purchase the coverage you need.',
    },
    {
        question: 'How often is your information updated?',
        answer: 'Our team updates insurance information regularly to reflect changes in state laws, rates, and provider offerings. State requirement pages are updated at least quarterly.',
    },
    {
        question: 'What if I have a complaint about an insurance provider?',
        answer: 'For issues with insurance providers, we recommend contacting your state insurance commissioner. We can help you find the appropriate contact information for your state.',
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={[]} states={[]} />

            <section className="bg-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Help Center</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Frequently asked questions and answers.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-slate-50 transition"
                                >
                                    <span className="font-semibold text-slate-900">{faq.question}</span>
                                    <svg
                                        className={`w-5 h-5 text-slate-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                                        <p className="text-slate-600">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center bg-slate-100 rounded-xl p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Still have questions?</h3>
                        <p className="text-slate-600 mb-6">Our support team is here to help.</p>
                        <a href="/contact" className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition">
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}
