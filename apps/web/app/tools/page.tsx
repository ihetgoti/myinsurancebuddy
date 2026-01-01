import Link from 'next/link';
import { Calculator, Shield, FileText, TrendingUp } from 'lucide-react';

export const metadata = {
    title: 'Insurance Tools & Calculators | MyInsuranceBuddies',
    description: 'Free insurance tools and calculators to help you estimate costs, compare rates, and make smart coverage decisions.',
};

export default function ToolsPage() {
    const tools = [
        {
            title: 'Insurance Calculator',
            description: 'Calculate estimated premiums for Car, Home, Life, and Health insurance based on your profile.',
            icon: <Calculator className="w-8 h-8 text-blue-600" />,
            href: '/tools/insurance-calculator',
            popular: true,
        },
        {
            title: 'Coverage Estimator',
            description: 'Not sure how much coverage you need? Use our guide to find the right limits for your situation.',
            icon: <Shield className="w-8 h-8 text-emerald-600" />,
            href: '/guides/how-much-coverage', // Placeholder link
            popular: false,
        },
        {
            title: 'Savings Finder',
            description: 'Discover potential discounts and bundling opportunities to lower your monthly premiums.',
            icon: <TrendingUp className="w-8 h-8 text-amber-600" />,
            href: '/guides/discounts', // Placeholder link
            popular: false,
        },
        {
            title: 'Policy Decoder',
            description: 'Upload or paste your policy details to understand what is actually covered in plain English.',
            icon: <FileText className="w-8 h-8 text-purple-600" />,
            href: '/guides/policy-help', // Placeholder link
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            {/* Hero Section */}
            <section className="bg-white border-b border-slate-200 mb-12">
                <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Free Insurance Tools
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed">
                        Smart calculators and utilities to help you save money and make better decisions.
                    </p>
                </div>
            </section>

            {/* Tools Grid */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-6">
                    {tools.map((tool) => (
                        <Link
                            key={tool.title}
                            href={tool.href}
                            className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-start gap-6">
                                <div className="p-4 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                    {tool.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {tool.title}
                                        </h3>
                                        {tool.popular && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full tracking-wide">
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 leading-relaxed">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-20 bg-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-900/20">
                    <h2 className="text-3xl font-bold mb-4">Ready to see your actual rates?</h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                        Calculators are great, but real quotes are better. Compare licensed providers in your area in minutes.
                    </p>
                    <Link
                        href="/get-quote"
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                    >
                        Get Real Quotes
                    </Link>
                </div>
            </div>
        </div>
    );
}
