import Link from 'next/link';
import {
    Phone, Home, Search, List, ShieldCheck,
    DollarSign, Flame, Star, ChevronDown,
    CheckCircle, MapPin, ExternalLink, FileWarning
} from 'lucide-react';
import MarketcallCTA from '@/components/MarketcallCTA';
import CopyAsMarkdown from '@/components/CopyAsMarkdown';
import AskAIButtons from '@/components/AskAIButtons';

interface HomeInsuranceTemplateProps {
    variables: Record<string, any>;
    affiliates: any[];
    relatedLinks: any;
    insuranceTypeId?: string;
    stateId?: string;
}

export default function HomeInsuranceTemplate({
    variables,
    affiliates,
    relatedLinks,
    insuranceTypeId,
    stateId,
}: HomeInsuranceTemplateProps) {
    const stateName = variables.state_name || variables.state || 'Your State';
    const avgPremium = variables.avg_premium || '$1,200/year';
    const avgClaim = variables.avg_claim || '$15,000';
    const disasterRisk = variables.disaster_risk || variables.wildfire_risk || 'Moderate';
    const topInsurer = variables.top_insurer || 'State Farm';

    const introContent = variables.intro_content || variables.ai_intro ||
        `Protecting your home in ${stateName} requires understanding local risks and coverage options. From natural disasters to liability protection, our guide helps you find the right homeowners insurance at the best price.`;

    const requirementsContent = variables.requirements_content || variables.ai_requirements ||
        `While ${stateName} doesn't legally require homeowners insurance, your mortgage lender almost certainly does. Even without a mortgage, insurance protects your largest investment from unexpected disasters.`;

    const tipsContent = variables.tips_content || variables.ai_tips || [];
    const faqItems = variables.faqs || variables.ai_faq || [];

    const keyTakeaways = [
        `Average home insurance premium in ${stateName}: ${avgPremium}`,
        `Average claim payout: ${avgClaim}`,
        `Natural disaster risk level: ${disasterRisk}`,
        `Top home insurer: ${topInsurer}`,
    ];

    const pageUrl = `https://myinsurancebuddies.com/home-insurance/us/${variables.state_slug || 'state'}`;
    const pageTitle = `Home Insurance in ${stateName}`;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Dark Navy */}
            <section className="bg-slate-900 text-white py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                Home Insurance in {stateName}
                            </h1>
                            <p className="text-slate-300 text-lg mb-6 max-w-xl">
                                Protect your home and belongings with the right coverage.
                                Compare rates and find affordable homeowners insurance.
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
            <section className="py-8 bg-orange-50 border-b border-orange-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-orange-900 flex items-center gap-2">
                                <Home size={20} />
                                Key Takeaways
                            </h2>
                            <CopyAsMarkdown
                                title={pageTitle}
                                keyTakeaways={keyTakeaways}
                                content={introContent}
                                source={pageUrl}
                            />
                        </div>
                        <ul className="space-y-2">
                            {keyTakeaways.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-orange-800">
                                    <span className="text-orange-600 mt-1">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-orange-200">
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
                        How to Get Home Insurance
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {[
                            { icon: Home, label: 'Enter Home Details', step: 1 },
                            { icon: Search, label: 'Get Property Value', step: 2 },
                            { icon: List, label: 'Compare Policies', step: 3 },
                            { icon: ShieldCheck, label: 'Protect Your Home', step: 4 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 md:gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white mb-2">
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
                            <DollarSign size={24} className="mx-auto text-orange-600 mb-2" />
                            <p className="text-2xl font-bold text-slate-900">{avgPremium}</p>
                            <p className="text-sm text-slate-500">Avg. Premium</p>
                        </div>
                        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                            <FileWarning size={24} className="mx-auto text-orange-600 mb-2" />
                            <p className="text-2xl font-bold text-slate-900">{avgClaim}</p>
                            <p className="text-sm text-slate-500">Avg. Claim</p>
                        </div>
                        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                            <Flame size={24} className="mx-auto text-red-500 mb-2" />
                            <p className="text-2xl font-bold text-slate-900">{disasterRisk}</p>
                            <p className="text-sm text-slate-500">Disaster Risk</p>
                        </div>
                        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                            <Star size={24} className="mx-auto text-yellow-500 mb-2" />
                            <p className="text-2xl font-bold text-slate-900">{topInsurer}</p>
                            <p className="text-sm text-slate-500">Top Insurer</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-slate">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Understanding Home Insurance in {stateName}
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            {introContent}
                        </p>

                        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            Coverage Types
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {requirementsContent}
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mt-8 not-prose">
                            {[
                                { title: 'Dwelling Coverage', desc: 'Covers the physical structure of your home', color: 'orange' },
                                { title: 'Personal Property', desc: 'Protects your belongings inside the home', color: 'blue' },
                                { title: 'Liability Coverage', desc: 'Covers injuries or damage to others on your property', color: 'purple' },
                                { title: 'Additional Living Expenses', desc: 'Pays for temporary housing if home is uninhabitable', color: 'green' },
                            ].map((coverage, i) => (
                                <div key={i} className="bg-slate-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-slate-900 mb-2">{coverage.title}</h4>
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
                            Compare Home Insurance Providers in {stateName}
                        </h2>
                        <p className="text-slate-500 text-center mb-8">
                            Get quotes from trusted homeowners insurance carriers
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
                                                 hover:shadow-lg hover:border-orange-300 transition-all group"
                                    >
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {partner.logo ? (
                                                <img src={partner.logo} alt={partner.name} className="w-12 h-12 object-contain" />
                                            ) : (
                                                <span className="text-2xl font-bold text-slate-400">{partner.name[0]}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 group-hover:text-orange-600">
                                                {partner.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span className="flex text-yellow-400">★★★★★</span>
                                                <span>{partner.description || 'Home insurance provider'}</span>
                                            </div>
                                        </div>
                                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium
                                                        group-hover:bg-orange-700 transition-colors flex items-center gap-1">
                                            Get Quote
                                            <ExternalLink size={14} />
                                        </button>
                                    </a>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <p>Compare home insurance to find the best coverage</p>
                                    <Link href="/get-quote" className="text-orange-600 hover:underline mt-2 inline-block">
                                        Get a personalized quote →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            {Array.isArray(faqItems) && faqItems.length > 0 && (
                <section className="py-12">
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
                <section className="py-12 border-t bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedLinks.nearbyCities?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Nearby Cities</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.nearbyCities.slice(0, 8).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-orange-600 text-sm">
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
                                                <Link href={link.href} className="text-slate-600 hover:text-orange-600 text-sm flex items-center gap-2">
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
                                                <Link href={link.href} className="text-slate-600 hover:text-orange-600 text-sm">
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
            <div className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white py-3 px-4 shadow-lg z-50 md:hidden">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Phone size={18} />
                        <span className="font-semibold">1-855-205-2412</span>
                    </div>
                    <a
                        href="tel:18552052412"
                        className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold"
                    >
                        Call Now
                    </a>
                </div>
            </div>
        </div>
    );
}
