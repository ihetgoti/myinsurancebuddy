import Link from 'next/link';
import {
    Phone, Umbrella, Shield, DollarSign, CheckCircle,
    AlertTriangle, Scale, Home, Car, Briefcase,
    TrendingDown
} from 'lucide-react';
import MarketCallCTA from '@/components/MarketCallCTA';
import { RelatedContentExplorer } from '@/components/navigation';
import {
    TableOfContents, QuickAnswerBox, EnhancedFAQ, CTABanner, CoverageCard,
    TOCItem, FAQItem
} from './shared';

interface UmbrellaInsuranceTemplateProps {
    variables: Record<string, any>;
    affiliates: any[];
    relatedLinks: any;
    insuranceTypeId?: string;
    stateId?: string;
    insuranceTypeName?: string;
}

export default function UmbrellaInsuranceTemplate({
    variables,
    affiliates,
    relatedLinks,
    insuranceTypeId,
    stateId,
    insuranceTypeName = 'Umbrella Insurance',
}: UmbrellaInsuranceTemplateProps) {
    const stateName = variables.state_name || variables.state || 'Your State';
    const avgPremium = variables.avg_premium || '$200/year';
    const lastUpdated = variables.last_updated || new Date().toISOString().split('T')[0];

    // What it covers
    const coverageTypes = [
        {
            title: 'Bodily Injury Liability',
            description: 'Covers medical costs and lawsuits if someone is seriously injured.',
            examples: ['Car accidents you cause', 'Injuries on your property', 'Dog bites', 'Pool accidents']
        },
        {
            title: 'Property Damage',
            description: 'Covers damage you cause to others\' property beyond auto/home limits.',
            examples: ['Multi-car accidents', 'Damage to rental properties', 'Boating accidents']
        },
        {
            title: 'Personal Liability',
            description: 'Covers lawsuits from personal actions beyond covered elsewhere.',
            examples: ['Defamation/slander', 'False arrest claims', 'Malicious prosecution']
        },
        {
            title: 'Landlord Liability',
            description: 'Extra protection for rental property owners.',
            examples: ['Tenant injuries', 'Property-related lawsuits', 'Wrongful eviction claims']
        }
    ];

    // Who needs it
    const whoNeedsIt = [
        { type: 'Homeowners', reason: 'Pool, trampoline, or frequent guests' },
        { type: 'Parents', reason: 'Teen drivers increase accident risk' },
        { type: 'Dog Owners', reason: 'Dog bites can result in $50K+ claims' },
        { type: 'Landlords', reason: 'Rental properties increase liability exposure' },
        { type: 'High Net Worth', reason: 'More assets to protect from lawsuits' },
        { type: 'Public Figures', reason: 'Higher risk of defamation claims' }
    ];

    // Real scenarios
    const scenarios = [
        {
            scenario: 'Teen Driver Accident',
            details: 'Your teenager causes a multi-car accident injuring 4 people',
            cost: '$750,000',
            without: 'Your auto policy pays $300K, you owe $450K out of pocket',
            with: 'Umbrella pays the $450K difference'
        },
        {
            scenario: 'Pool Drowning',
            details: 'Neighbor\'s child drowns in your pool, family sues for wrongful death',
            cost: '$2,000,000',
            without: 'Home policy pays $500K, you owe $1.5M - bankruptcy likely',
            with: 'Umbrella covers the $1.5M'
        },
        {
            scenario: 'Social Media Defamation',
            details: 'You post negative comments about a business owner online',
            cost: '$150,000',
            without: 'Not covered by home insurance, you pay everything',
            with: 'Umbrella covers libel/slander claims'
        }
    ];

    // FAQs
    const faqs: FAQItem[] = [
        {
            question: 'What is umbrella insurance exactly?',
            answer: 'Umbrella insurance is extra liability coverage that sits on top of your auto, home, and other policies. It kicks in when you exceed your underlying policy limits. For example, if you cause a car accident with $500,000 in damages but only have $300,000 auto liability, umbrella covers the remaining $200,000. It also covers some claims not covered by underlying policies.'
        },
        {
            question: 'How much umbrella insurance do I need?',
            answer: 'A common rule is to match your net worth or future earning potential. Most people buy $1-5 million. If you have $1M in assets (home equity, savings, investments), get at least $1M umbrella. High earners should consider more since future wages can be garnished. Coverage is cheap - $1M costs ~$200-400/year, $2M costs ~$300-600/year.'
        },
        {
            question: `Is umbrella insurance required in ${stateName}?`,
            answer: `No, umbrella insurance is not legally required in ${stateName} or any state. However, it's highly recommended for anyone with assets to protect or significant liability exposure. Some landlords require tenants to have umbrella coverage as a lease condition.`
        },
        {
            question: 'Does umbrella insurance cover my business?',
            answer: 'Standard personal umbrella policies do NOT cover business activities. If you have a business, you need commercial umbrella insurance. Some policies cover very small home-based businesses, but always confirm with your agent. Business owners should get proper commercial coverage.'
        },
        {
            question: 'What doesn\'t umbrella insurance cover?',
            answer: 'Umbrella does not cover: your own injuries (that\'s health insurance), damage to your own property (that\'s home/auto), intentional acts or crimes, business liability (needs commercial policy), or contract disputes. It specifically covers liability to OTHERS beyond your underlying policy limits.'
        }
    ];

    const tocItems: TOCItem[] = [
        { id: 'quick-answer', label: 'Quick Answer' },
        { id: 'coverage', label: 'What It Covers' },
        { id: 'scenarios', label: 'Real Scenarios' },
        { id: 'who-needs', label: 'Who Needs It' },
        { id: 'faq', label: 'FAQs' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-purple-600 to-indigo-700 text-white overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Umbrella className="w-4 h-4" />
                                Updated {new Date(lastUpdated).toLocaleDateString()}
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                Umbrella Insurance in {stateName}
                            </h1>
                            <p className="text-purple-100 text-lg mb-6 max-w-xl">
                                Extra liability protection beyond your auto and home policies. 
                                $1 million in coverage starting at just {avgPremium}/year.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> $1M from {avgPremium}/yr
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Covers Lawsuits
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Worldwide Coverage
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
                                question={`What is umbrella insurance in ${stateName}?`}
                                answer={`Umbrella insurance in ${stateName} provides extra liability coverage beyond your auto and home insurance limits. Starting at $200-400/year for $1 million coverage, it protects your assets from major lawsuits. It covers bodily injury, property damage, and personal liability claims that exceed your underlying policy limits.`}
                                source={`${stateName} Department of Insurance`}
                            />
                        </section>

                        {/* Coverage Types */}
                        <section id="coverage" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">What Umbrella Insurance Covers</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {coverageTypes.map((type, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                                        <h3 className="font-bold text-slate-900 mb-2">{type.title}</h3>
                                        <p className="text-slate-600 text-sm mb-3">{type.description}</p>
                                        <ul className="space-y-1">
                                            {type.examples.map((ex, i) => (
                                                <li key={i} className="text-sm text-slate-500 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3 text-purple-500" />
                                                    {ex}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Real Scenarios */}
                        <section id="scenarios" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Real-World Scenarios</h2>
                            <div className="space-y-4">
                                {scenarios.map((s, idx) => (
                                    <div key={idx} className="bg-red-50 border border-red-100 rounded-xl p-5">
                                        <div className="flex items-start gap-3 mb-3">
                                            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-bold text-red-900">{s.scenario}</h3>
                                                <p className="text-red-700 text-sm">{s.details}</p>
                                            </div>
                                        </div>
                                        <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-slate-500">Total Cost</p>
                                                <p className="font-bold text-slate-900">{s.cost}</p>
                                            </div>
                                            <div className="bg-red-100 rounded-lg p-3">
                                                <p className="text-red-600">Without Umbrella</p>
                                                <p className="text-red-800">{s.without}</p>
                                            </div>
                                            <div className="bg-green-100 rounded-lg p-3">
                                                <p className="text-green-600">With Umbrella</p>
                                                <p className="text-green-800">{s.with}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Who Needs It */}
                        <section id="who-needs" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Consider Umbrella Insurance</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {whoNeedsIt.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-purple-50 rounded-lg p-4">
                                        <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">{item.type}</p>
                                            <p className="text-sm text-slate-600">{item.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ */}
                        <section id="faq" className="scroll-mt-24">
                            <EnhancedFAQ 
                                title={`Umbrella Insurance FAQs for ${stateName}`}
                                items={faqs}
                            />
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <CTABanner 
                            title="Get Extra Protection"
                            subtitle="$1 million in coverage for pennies a day"
                            primaryButtonText="Get Quote"
                            accentColor="purple"
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
