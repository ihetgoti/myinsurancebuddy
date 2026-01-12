import Link from 'next/link';
import {
    Phone, Car, FileSearch, Shield, FileCheck,
    DollarSign, AlertTriangle, Star, ChevronDown,
    CheckCircle, MapPin, ExternalLink, Copy
} from 'lucide-react';
import MarketcallCTA from '@/components/MarketcallCTA';
import CopyAsMarkdown from '@/components/CopyAsMarkdown';
import AskAIButtons from '@/components/AskAIButtons';

interface AutoInsuranceTemplateProps {
    variables: Record<string, any>;
    affiliates: any[];
    relatedLinks: any;
    insuranceTypeId?: string;
    stateId?: string;
}

export default function AutoInsuranceTemplate({
    variables,
    affiliates,
    relatedLinks,
    insuranceTypeId,
    stateId,
}: AutoInsuranceTemplateProps) {
    const stateName = variables.state_name || variables.state || 'Your State';
    const avgPremium = variables.avg_premium || '$1,500/year';
    const minCoverage = variables.coverage_format || '15/30/5';
    const uninsuredRate = variables.uninsured_rate || '12%';
    const topInsurer = variables.top_insurer || 'State Farm';

    // AI-generated content slots (from customData)
    const introContent = variables.intro_content || variables.ai_intro ||
        `Finding affordable auto insurance in ${stateName} requires understanding local requirements and comparing rates from multiple providers. Our comprehensive guide helps you navigate the insurance landscape and find the best coverage for your needs.`;

    const requirementsContent = variables.requirements_content || variables.ai_requirements ||
        `${stateName} requires all drivers to carry minimum liability insurance. This protects you financially if you cause an accident that injures others or damages their property.`;

    const tipsContent = variables.tips_content || variables.ai_tips || [];
    const faqItems = variables.faqs || variables.ai_faq || [];

    const keyTakeaways = [
        `${stateName} requires minimum ${minCoverage} liability coverage`,
        `Average premium in ${stateName}: ${avgPremium}`,
        `${uninsuredRate} of drivers are uninsured - consider UM coverage`,
        `Top insurer by market share: ${topInsurer}`,
    ];

    const pageUrl = `https://myinsurancebuddies.com/car-insurance/us/${variables.state_slug || 'state'}`;
    const pageTitle = `Auto Insurance in ${stateName}`;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Dark Navy */}
            <section className="bg-slate-900 text-white py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                Auto Insurance in {stateName}
                            </h1>
                            <p className="text-slate-300 text-lg mb-6 max-w-xl">
                                Compare rates from top providers, understand coverage requirements,
                                and save on your auto insurance.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="#compare"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
                                             rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                                >
                                    Compare Rates
                                    <ChevronDown size={18} />
                                </Link>
                            </div>
                        </div>
                        <div className="flex justify-center md:justify-end">
                            <MarketcallCTA
                                insuranceTypeId={insuranceTypeId}
                                stateId={stateId}
                                className="max-w-sm w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* TL;DR Key Takeaways */}
            <section className="py-8 bg-amber-50 border-b border-amber-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                                <CheckCircle size={20} />
                                Key Takeaways
                            </h2>
                            <div className="flex items-center gap-2">
                                <CopyAsMarkdown
                                    title={pageTitle}
                                    keyTakeaways={keyTakeaways}
                                    content={introContent}
                                    source={pageUrl}
                                />
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {keyTakeaways.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-amber-800">
                                    <span className="text-amber-600 mt-1">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-amber-200">
                            <AskAIButtons
                                pageContent={introContent}
                                pageTitle={pageTitle}
                                pageUrl={pageUrl}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Flow Diagram */}
            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl font-bold text-center text-slate-900 mb-8">
                        How It Works: Your Path to Savings
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {[
                            { icon: Car, label: 'Enter Vehicle Info', step: 1 },
                            { icon: FileSearch, label: 'Compare Rates', step: 2 },
                            { icon: Shield, label: 'Choose Coverage', step: 3 },
                            { icon: FileCheck, label: 'Get Policy', step: 4 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 md:gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-2">
                                        <item.icon size={28} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 text-center max-w-24">
                                        {item.label}
                                    </span>
                                </div>
                                {i < 3 && (
                                    <div className="hidden md:block text-slate-300 text-2xl">→</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Local Stats Cards */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                            <DollarSign size={24} className="mx-auto text-blue-600 mb-2" />
                            <p className="text-2xl font-bold text-slate-900">{avgPremium}</p>
                            <p className="text-sm text-slate-500">Avg. Premium</p>
                        </div>
                        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                            <Shield size={24} className="mx-auto text-blue-600 mb-2" />
                            <p className="text-2xl font-bold text-slate-900">{minCoverage}</p>
                            <p className="text-sm text-slate-500">Min. Coverage</p>
                        </div>
                        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                            <AlertTriangle size={24} className="mx-auto text-amber-500 mb-2" />
                            <p className="text-2xl font-bold text-slate-900">{uninsuredRate}</p>
                            <p className="text-sm text-slate-500">Uninsured Rate</p>
                        </div>
                        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                            <Star size={24} className="mx-auto text-yellow-500 mb-2" />
                            <p className="text-2xl font-bold text-slate-900">{topInsurer}</p>
                            <p className="text-sm text-slate-500">Top Insurer</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section - Introduction */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-slate">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Understanding Auto Insurance in {stateName}
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            {introContent}
                        </p>

                        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            {stateName} Minimum Requirements
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {requirementsContent}
                        </p>

                        {/* Coverage Types */}
                        <div className="grid md:grid-cols-2 gap-4 mt-8 not-prose">
                            {[
                                { title: 'Liability Coverage', desc: 'Covers damages you cause to others', required: true },
                                { title: 'Collision Coverage', desc: 'Covers your vehicle in accidents', required: false },
                                { title: 'Comprehensive Coverage', desc: 'Covers theft, weather, vandalism', required: false },
                                { title: 'Uninsured Motorist', desc: 'Protects against uninsured drivers', required: false },
                            ].map((coverage, i) => (
                                <div key={i} className="bg-slate-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-slate-900">{coverage.title}</h4>
                                        {coverage.required && (
                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600">{coverage.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table - Affiliates */}
            <section id="compare" className="py-12 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                            Compare Top Auto Insurers in {stateName}
                        </h2>
                        <p className="text-slate-500 text-center mb-8">
                            Get quotes from trusted insurance providers
                        </p>

                        <div className="space-y-4">
                            {affiliates.length > 0 ? (
                                affiliates.map((partner: any) => (
                                    <a
                                        key={partner.id}
                                        href={partner.affiliateUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-white rounded-xl border 
                                                 hover:shadow-lg hover:border-blue-300 transition-all group"
                                    >
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {partner.logo ? (
                                                <img src={partner.logo} alt={partner.name} className="w-12 h-12 object-contain" />
                                            ) : (
                                                <span className="text-2xl font-bold text-slate-400">{partner.name[0]}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                                                {partner.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span className="flex text-yellow-400">★★★★★</span>
                                                <span>{partner.description || 'Top-rated auto insurer'}</span>
                                            </div>
                                        </div>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium
                                                        group-hover:bg-blue-700 transition-colors flex items-center gap-1">
                                            Get Quote
                                            <ExternalLink size={14} />
                                        </button>
                                    </a>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <p>Compare top insurers to find the best rate</p>
                                    <Link href="/get-quote" className="text-blue-600 hover:underline mt-2 inline-block">
                                        Get a personalized quote →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            {Array.isArray(tipsContent) && tipsContent.length > 0 && (
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Tips to Save on Auto Insurance in {stateName}
                            </h2>
                            <div className="space-y-4">
                                {tipsContent.map((tip: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 bg-green-50 rounded-lg p-4">
                                        <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {i + 1}
                                        </span>
                                        <p className="text-slate-700">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            {Array.isArray(faqItems) && faqItems.length > 0 && (
                <section className="py-12 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {faqItems.map((faq: any, i: number) => (
                                    <details key={i} className="bg-white rounded-lg border group">
                                        <summary className="px-4 py-3 cursor-pointer font-medium text-slate-900 
                                                         hover:bg-slate-50 rounded-lg flex items-center justify-between">
                                            {faq.question || faq.q}
                                            <ChevronDown size={18} className="text-slate-400 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div className="px-4 pb-4 text-slate-600">
                                            {faq.answer || faq.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Related Links */}
            {(relatedLinks?.nearbyCities?.length > 0 || relatedLinks?.otherNiches?.length > 0) && (
                <section className="py-12 border-t">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedLinks.nearbyCities?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Nearby Cities</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.nearbyCities.slice(0, 8).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 text-sm">
                                                    → {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {relatedLinks.otherNiches?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Other Insurance Types</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.otherNiches.slice(0, 6).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 text-sm flex items-center gap-2">
                                                    <span>{link.icon}</span> {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {relatedLinks.parentLocations?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Browse More</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.parentLocations.map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 text-sm">
                                                    → {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Sticky Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white py-3 px-4 shadow-lg z-50 md:hidden">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Phone size={18} />
                        <span className="font-semibold">1-855-205-2412</span>
                    </div>
                    <a
                        href="tel:18552052412"
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
                    >
                        Call Now
                    </a>
                </div>
            </div>
        </div>
    );
}
