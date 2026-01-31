import Link from 'next/link';
import {
    Phone, Home, Shield, DollarSign, CheckCircle,
    Flame, UserX, Briefcase, Zap
} from 'lucide-react';
import MarketCallCTA from '@/components/MarketCallCTA';
import { RelatedContentExplorer } from '@/components/navigation';
import {
    TableOfContents, QuickAnswerBox, EnhancedFAQ, CTABanner, CoverageCard,
    TOCItem, FAQItem
} from './shared';

interface RentersInsuranceTemplateProps {
    variables: Record<string, any>;
    affiliates: any[];
    relatedLinks: any;
    insuranceTypeId?: string;
    stateId?: string;
    insuranceTypeName?: string;
}

export default function RentersInsuranceTemplate({
    variables,
    affiliates,
    relatedLinks,
    insuranceTypeId,
    stateId,
    insuranceTypeName = 'Renters Insurance',
}: RentersInsuranceTemplateProps) {
    const stateName = variables.state_name || variables.state || 'Your State';
    const avgPremium = variables.avg_premium || '$15/month';
    const lastUpdated = variables.last_updated || new Date().toISOString().split('T')[0];

    // Coverage types
    const coverageTypes = [
        {
            title: 'Personal Property',
            description: 'Covers your belongings from theft, fire, and damage. Most policies cover $20,000-50,000.',
            typical: '$30,000',
            icon: 'briefcase' as const
        },
        {
            title: 'Liability',
            description: 'Protects if someone is injured in your rental and sues you.',
            typical: '$100,000',
            icon: 'shield' as const
        },
        {
            title: 'Loss of Use',
            description: 'Pays for hotel and food if your rental becomes uninhabitable.',
            typical: '30-50% of property limit',
            icon: 'home' as const
        },
        {
            title: 'Medical Payments',
            description: 'Covers minor injuries to guests regardless of fault.',
            typical: '$1,000-5,000',
            icon: 'users' as const
        }
    ];

    // Cost factors
    const costFactors = [
        { factor: 'Location', impact: 'medium', description: 'Urban areas and high-crime neighborhoods cost more' },
        { factor: 'Coverage Amount', impact: 'high', description: 'More coverage = higher premiums' },
        { factor: 'Deductible', impact: 'medium', description: 'Higher deductible = lower premium' },
        { factor: 'Building Age', impact: 'low', description: 'Older buildings may cost slightly more' },
        { factor: 'Safety Features', impact: 'low', description: 'Smoke detectors, security systems reduce rates' }
    ];

    // What's covered
    const coveredEvents = [
        'Fire and smoke damage',
        'Theft and vandalism',
        'Water damage (excluding floods)',
        'Wind and hail damage',
        'Lightning strikes',
        'Explosions'
    ];

    // Not covered
    const notCovered = [
        'Floods (need separate flood insurance)',
        'Earthquakes (need separate policy)',
        'Pest damage',
        'Roommate belongings',
        'Expensive jewelry/art without rider'
    ];

    // FAQs
    const faqs: FAQItem[] = [
        {
            question: `Is renters insurance required in ${stateName}?`,
            answer: `Renters insurance is not legally required by ${stateName} law, but most landlords require it as a lease condition. Even if not required, it's highly recommended - it costs just $15-30/month but can save you tens of thousands if disaster strikes.`
        },
        {
            question: 'What does renters insurance actually cover?',
            answer: 'Renters insurance covers your personal belongings from theft, fire, and most disasters. It also includes liability protection if someone is injured in your rental, and pays for temporary housing if your place becomes uninhabitable. Average coverage is $30,000 for belongings and $100,000 for liability.'
        },
        {
            question: 'Does renters insurance cover my roommate?',
            answer: 'Generally no - renters insurance only covers the policyholder and their immediate family members. Each roommate needs their own policy. Some insurers allow you to add roommates to a single policy, but this can complicate claims if one moves out.'
        },
        {
            question: 'How much renters insurance do I need?',
            answer: 'Calculate the value of all your belongings - furniture, electronics, clothes, jewelry, etc. Most people need $20,000-50,000 in coverage. For liability, $100,000 is standard, but consider $300,000 if you have significant assets to protect. Take photos of valuables for documentation.'
        },
        {
            question: 'Is renters insurance worth it?',
            answer: 'Absolutely! At just $15-30/month, renters insurance is one of the best values in insurance. A single stolen laptop or apartment fire could cost you $10,000+ in losses. For less than the cost of a few coffees per month, you get peace of mind and financial protection.'
        }
    ];

    const tocItems: TOCItem[] = [
        { id: 'quick-answer', label: 'Quick Answer' },
        { id: 'coverage', label: 'Coverage Types' },
        { id: 'cost-factors', label: 'Cost Factors' },
        { id: 'faq', label: 'FAQs' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-emerald-600 to-teal-700 text-white overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Home className="w-4 h-4" />
                                Updated {new Date(lastUpdated).toLocaleDateString()}
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                Renters Insurance in {stateName}
                            </h1>
                            <p className="text-emerald-100 text-lg mb-6 max-w-xl">
                                Protect your belongings and liability for less than the cost of dinner out. 
                                Starting at just {avgPremium}/month.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Starting at {avgPremium}/mo
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Covers $30,000+ belongings
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> $100K Liability Included
                                </span>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <MarketCallCTA 
                                insuranceTypeId={insuranceTypeId} 
                                stateId={stateId}
                                insuranceTypeName={insuranceTypeName}
                                stateName={stateName}
                                className="max-w-sm w-full mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <TableOfContents items={tocItems} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Quick Answer */}
                        <section id="quick-answer">
                            <QuickAnswerBox 
                                question={`Is renters insurance required in ${stateName}?`}
                                answer={`Renters insurance is not legally required by ${stateName} law, but most landlords require it as a lease condition. Coverage costs just $15-30/month and protects your belongings ($20,000-50,000) plus liability ($100,000). Even if not required, it's one of the best values in insurance.`}
                                source={`${stateName} Department of Insurance`}
                            />
                        </section>

                        {/* Coverage Types */}
                        <section id="coverage" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Coverage Breakdown</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {coverageTypes.map((type, idx) => (
                                    <CoverageCard
                                        key={idx}
                                        title={type.title}
                                        description={type.description}
                                        icon={type.icon}
                                        accentColor="emerald"
                                    />
                                ))}
                            </div>

                            {/* What's Covered */}
                            <div className="mt-8 grid sm:grid-cols-2 gap-6">
                                <div className="bg-emerald-50 rounded-xl p-6">
                                    <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        What&apos;s Covered
                                    </h3>
                                    <ul className="space-y-2">
                                        {coveredEvents.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-emerald-800">
                                                <span className="text-emerald-400">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-amber-50 rounded-xl p-6">
                                    <h3 className="font-bold text-amber-900 mb-4">Not Covered</h3>
                                    <ul className="space-y-2">
                                        {notCovered.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-amber-800">
                                                <span className="text-amber-400">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Cost Factors */}
                        <section id="cost-factors" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Affects Your Premium</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {costFactors.map((item, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                item.impact === 'high' ? 'bg-red-100 text-red-700' : 
                                                item.impact === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {item.impact.toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-slate-900">{item.factor}</h3>
                                        <p className="text-sm text-slate-600">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ */}
                        <section id="faq" className="scroll-mt-24">
                            <EnhancedFAQ 
                                title={`Renters Insurance FAQs for ${stateName}`}
                                items={faqs}
                            />
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <CTABanner 
                            title="Get Renters Insurance"
                            subtitle="Protect your stuff for pennies a day"
                            primaryButtonText="Get Quote"
                            accentColor="emerald"
                        />
                    </aside>
                </div>
            </main>

            {relatedLinks?.groups && (
                <RelatedContentExplorer 
                    groups={relatedLinks.groups}
                    currentTitle={`${insuranceTypeName} in ${stateName}`}
                />
            )}
        </div>
    );
}
