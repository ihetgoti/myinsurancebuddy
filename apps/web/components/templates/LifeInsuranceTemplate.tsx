import Link from 'next/link';
import {
    Phone, Heart, Shield, DollarSign, CheckCircle,
    Users, Clock, TrendingUp, AlertCircle
} from 'lucide-react';
import MarketCallCTA from '@/components/MarketCallCTA';
import { RelatedContentExplorer } from '@/components/navigation';
import {
    TableOfContents, QuickAnswerBox, EnhancedFAQ, CTABanner, CoverageCard,
    TOCItem, FAQItem
} from './shared';

interface LifeInsuranceTemplateProps {
    variables: Record<string, any>;
    affiliates: any[];
    relatedLinks: any;
    insuranceTypeId?: string;
    stateId?: string;
    insuranceTypeName?: string;
}

export default function LifeInsuranceTemplate({
    variables,
    affiliates,
    relatedLinks,
    insuranceTypeId,
    stateId,
    insuranceTypeName = 'Life Insurance',
}: LifeInsuranceTemplateProps) {
    const stateName = variables.state_name || variables.state || 'Your State';
    const avgPremium = variables.avg_premium || '$25/month';
    const lastUpdated = variables.last_updated || new Date().toISOString().split('T')[0];

    // Policy types
    const policyTypes = [
        {
            title: 'Term Life',
            description: 'Coverage for a specific period (10-30 years). Most affordable option.',
            bestFor: 'Young families, mortgage protection',
            pros: ['Lowest premiums', 'Simple to understand', 'Convertible to permanent'],
            cons: ['Expires if you outlive term', 'No cash value']
        },
        {
            title: 'Whole Life',
            description: 'Permanent coverage with cash value that grows over time.',
            bestFor: 'Estate planning, lifelong protection',
            pros: ['Never expires', 'Cash value accumulation', 'Fixed premiums'],
            cons: ['Much higher premiums', 'Complex']
        },
        {
            title: 'Universal Life',
            description: 'Flexible permanent coverage with adjustable premiums and death benefit.',
            bestFor: 'Those wanting flexibility',
            pros: ['Flexible payments', 'Cash value growth', 'Adjustable coverage'],
            cons: ['Requires monitoring', 'Can lapse if underfunded']
        }
    ];

    // Cost factors
    const costFactors = [
        { factor: 'Age', impact: 'high', description: 'Younger = much cheaper rates' },
        { factor: 'Health', impact: 'high', description: 'Medical history affects pricing' },
        { factor: 'Policy Type', impact: 'high', description: 'Term is 10-20x cheaper than permanent' },
        { factor: 'Coverage Amount', impact: 'high', description: 'More coverage = higher premium' },
        { factor: 'Term Length', impact: 'medium', description: 'Longer terms cost more' },
        { factor: 'Smoking Status', impact: 'high', description: 'Smokers pay 2-5x more' }
    ];

    // FAQs
    const faqs: FAQItem[] = [
        {
            question: 'Do I really need life insurance?',
            answer: 'You need life insurance if anyone depends on your income - spouse, children, aging parents, or co-signers on loans. Single with no dependents? You probably don\'t need it yet. Use our rule of thumb: If your death would create financial hardship for someone, get coverage.'
        },
        {
            question: 'How much life insurance do I need?',
            answer: 'A common rule is 10-15x your annual income. For more precision: Add up your debts (mortgage, loans), future expenses (college for kids), income replacement (10 years of salary), and final expenses ($15-25K). Subtract existing savings and insurance. Most families need $500K-1M.'
        },
        {
            question: 'Term vs Whole Life: Which is better?',
            answer: 'For 95% of people, term life is the better choice. It provides maximum coverage at the lowest cost. Whole life is only worth considering if you have maxed out retirement accounts, have dependents needing lifelong support, or have estate tax concerns. Buy term and invest the difference.'
        },
        {
            question: 'What happens if I outlive my term policy?',
            answer: 'If you outlive your term policy, coverage ends and you receive nothing - that\'s the trade-off for lower premiums. Most policies let you convert to permanent insurance before term ends, though at higher rates. Some insurers offer renewal options at significantly increased premiums.'
        },
        {
            question: 'Does life insurance cover suicide?',
            answer: 'Most policies have a 2-year suicide exclusion. If death by suicide occurs within the first 2 years, premiums are typically refunded but no death benefit is paid. After 2 years, suicide is covered like any other cause of death. Always review your specific policy terms.'
        }
    ];

    const tocItems: TOCItem[] = [
        { id: 'quick-answer', label: 'Quick Answer' },
        { id: 'types', label: 'Policy Types' },
        { id: 'cost-factors', label: 'Cost Factors' },
        { id: 'faq', label: 'FAQs' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-rose-600 to-pink-700 text-white overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Heart className="w-4 h-4" />
                                Updated {new Date(lastUpdated).toLocaleDateString()}
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                Life Insurance in {stateName}
                            </h1>
                            <p className="text-rose-100 text-lg mb-6 max-w-xl">
                                Protect your family&apos;s financial future. Affordable term life coverage 
                                starting at just {avgPremium}/month.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Starting at {avgPremium}/mo
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> No Medical Exam Options
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Instant Quotes
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
                                question={`How much does life insurance cost in ${stateName}?`}
                                answer={`Life insurance in ${stateName} starts at around ${avgPremium}/month for a healthy 30-year-old seeking a 20-year term policy with $500,000 coverage. Whole life insurance costs significantly more, typically 10-20x the price of term. Factors like age, health, smoking status, and coverage amount all impact your rate.`}
                                source={`${stateName} Department of Insurance`}
                            />
                        </section>

                        {/* Policy Types */}
                        <section id="types" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Types of Life Insurance</h2>
                            <div className="space-y-6">
                                {policyTypes.map((type, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">{type.title}</h3>
                                                <p className="text-slate-600 mb-3">{type.description}</p>
                                                <p className="text-sm text-slate-500">Best for: {type.bestFor}</p>
                                            </div>
                                            <div className="md:w-48 space-y-2">
                                                <div>
                                                    <p className="text-xs font-semibold text-green-700">PROS</p>
                                                    <ul className="text-sm text-slate-600">
                                                        {type.pros.map((p, i) => (
                                                            <li key={i} className="flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3 text-green-500" /> {p}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-red-700">CONS</p>
                                                    <ul className="text-sm text-slate-600">
                                                        {type.cons.map((c, i) => (
                                                            <li key={i} className="flex items-center gap-1">
                                                                <AlertCircle className="w-3 h-3 text-red-400" /> {c}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                                item.impact === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
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
                                title={`Life Insurance FAQs for ${stateName}`}
                                items={faqs}
                            />
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <CTABanner 
                            title="Protect Your Family"
                            subtitle="Get a free life insurance quote in minutes"
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
