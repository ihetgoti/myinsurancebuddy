import Link from 'next/link';
import {
    Phone, Building2, Shield, DollarSign, CheckCircle,
    Users, Briefcase, FileText, AlertTriangle, Scale,
    TrendingDown
} from 'lucide-react';
import MarketCallCTA from '@/components/MarketCallCTA';
import { RelatedContentExplorer } from '@/components/navigation';
import {
    TableOfContents, QuickAnswerBox, EnhancedFAQ, CTABanner, CoverageCard,
    TOCItem, FAQItem
} from './shared';

interface BusinessInsuranceTemplateProps {
    variables: Record<string, any>;
    affiliates: any[];
    relatedLinks: any;
    insuranceTypeId?: string;
    stateId?: string;
    insuranceTypeName?: string;
}

export default function BusinessInsuranceTemplate({
    variables,
    affiliates,
    relatedLinks,
    insuranceTypeId,
    stateId,
    insuranceTypeName = 'Business Insurance',
}: BusinessInsuranceTemplateProps) {
    const stateName = variables.state_name || variables.state || 'Your State';
    const avgPremium = variables.avg_premium || '$750/year';
    const lastUpdated = variables.last_updated || new Date().toISOString().split('T')[0];

    // Coverage types
    const coverageTypes = [
        {
            title: 'General Liability',
            description: 'Protects against injury claims and property damage to third parties.',
            bestFor: 'All businesses',
            typicalCost: '$400-1,500/year',
            icon: 'shield' as const
        },
        {
            title: 'Professional Liability (E&O)',
            description: 'Covers mistakes and negligence in professional services.',
            bestFor: 'Consultants, agencies',
            typicalCost: '$500-3,000/year',
            icon: 'briefcase' as const
        },
        {
            title: 'Workers\' Compensation',
            description: 'Required if you have employees. Covers workplace injuries.',
            bestFor: 'Businesses with employees',
            typicalCost: '$2,000-10,000/year',
            icon: 'users' as const
        },
        {
            title: 'Commercial Property',
            description: 'Protects your building, equipment, and inventory.',
            bestFor: 'Businesses with physical locations',
            typicalCost: '$500-5,000/year',
            icon: 'home' as const
        }
    ];

    // Cost factors
    const costFactors = [
        { factor: 'Industry Type', impact: 'high', description: 'Construction costs more than retail' },
        { factor: 'Business Size', impact: 'high', description: 'More employees = higher premiums' },
        { factor: 'Revenue', impact: 'medium', description: 'Higher revenue means more exposure' },
        { factor: 'Location', impact: 'medium', description: 'Litigation rates vary by state' },
        { factor: 'Claims History', impact: 'high', description: 'Past claims increase future rates' },
        { factor: 'Coverage Limits', impact: 'high', description: 'Higher limits cost more' }
    ];

    // FAQs
    const faqs: FAQItem[] = [
        {
            question: `Is business insurance required in ${stateName}?`,
            answer: `General liability insurance is not required by law in ${stateName} for most businesses. However, workers' compensation is mandatory if you have employees. Some contracts and commercial leases require liability insurance. Professional liability may be required for certain licensed professions.`
        },
        {
            question: 'How much business insurance do I need?',
            answer: 'Most small businesses start with $1 million general liability coverage. Consider your assets, industry risks, and contract requirements. Higher-risk businesses (construction, healthcare) need more. We recommend consulting with an agent to assess your specific needs.'
        },
        {
            question: 'Does my LLC protect me from lawsuits?',
            answer: 'An LLC protects your personal assets from business debts, but NOT from liability claims. If someone sues your business for negligence or injury, you need liability insurance. An LLC does not substitute for proper insurance coverage.'
        },
        {
            question: 'What is a Business Owner\'s Policy (BOP)?',
            answer: 'A BOP bundles general liability and commercial property coverage at a discounted rate. It\'s designed for small businesses and typically costs 20-30% less than buying separately. Many BOPs also include business interruption coverage.'
        },
        {
            question: 'Do I need insurance if I work from home?',
            answer: 'Yes! Homeowner\'s insurance typically excludes business activities. You need separate coverage for business equipment, liability for clients visiting your home, and professional liability. A home-based business endorsement or separate policy is essential.'
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
            <section className="relative bg-gradient-to-br from-blue-700 to-indigo-800 text-white overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Building2 className="w-4 h-4" />
                                Updated {new Date(lastUpdated).toLocaleDateString()}
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                Business Insurance in {stateName}
                            </h1>
                            <p className="text-blue-100 text-lg mb-6 max-w-xl">
                                Protect your business from liability, property damage, and unexpected losses. 
                                Coverage starting at {avgPremium}/year.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Starting at {avgPremium}/yr
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> BOP Bundles Available
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Industry-Specific
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
                                question={`What business insurance is required in ${stateName}?`}
                                answer={`In ${stateName}, workers' compensation insurance is required if you have employees. General liability is not legally required but is highly recommended. Some industries (construction, healthcare) have specific requirements. Commercial auto insurance is required for business vehicles.`}
                                source={`${stateName} Department of Insurance`}
                            />
                        </section>

                        {/* Coverage Types */}
                        <section id="coverage" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Coverage Types</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {coverageTypes.map((type, idx) => (
                                    <CoverageCard
                                        key={idx}
                                        title={type.title}
                                        description={type.description}
                                        icon={type.icon}
                                        accentColor="blue"
                                    />
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
                                title={`Business Insurance FAQs for ${stateName}`}
                                items={faqs}
                            />
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <CTABanner 
                            title="Protect Your Business"
                            subtitle="Get quotes tailored to your industry"
                            primaryButtonText="Get Business Quote"
                            accentColor="blue"
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
