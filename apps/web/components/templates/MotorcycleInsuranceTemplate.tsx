import Link from 'next/link';
import {
    Phone, Bike, Shield, DollarSign, CheckCircle,
    TrendingDown, MapPin, Star, Zap, AlertTriangle,
    Wrench, Umbrella
} from 'lucide-react';
import MarketCallCTA from '@/components/MarketCallCTA';
import { RelatedContentExplorer } from '@/components/navigation';
import {
    TableOfContents, QuickAnswerBox, EnhancedFAQ, CTABanner, CoverageCard,
    TOCItem, FAQItem
} from './shared';

interface MotorcycleInsuranceTemplateProps {
    variables: Record<string, any>;
    affiliates: any[];
    relatedLinks: any;
    insuranceTypeId?: string;
    stateId?: string;
    insuranceTypeName?: string;
}

export default function MotorcycleInsuranceTemplate({
    variables,
    affiliates,
    relatedLinks,
    insuranceTypeId,
    stateId,
    insuranceTypeName = 'Motorcycle Insurance',
}: MotorcycleInsuranceTemplateProps) {
    const stateName = variables.state_name || variables.state || 'Your State';
    const avgPremium = variables.avg_premium || '$65/month';
    const lastUpdated = variables.last_updated || new Date().toISOString().split('T')[0];

    // Coverage types
    const coverageTypes = [
        {
            title: 'Liability',
            description: 'Required in most states. Covers injury/damage you cause to others.',
            required: true,
            typical: '$25k/$50k/$10k',
            icon: 'shield' as const
        },
        {
            title: 'Collision',
            description: 'Pays for damage to your bike from accidents, regardless of fault.',
            required: false,
            typical: 'Actual cash value',
            icon: 'car' as const
        },
        {
            title: 'Comprehensive',
            description: 'Covers theft, vandalism, fire, and non-collision damage.',
            required: false,
            typical: 'Actual cash value',
            icon: 'umbrella' as const
        },
        {
            title: 'Uninsured/Underinsured',
            description: 'Protects you if hit by a driver with no/insufficient insurance.',
            required: false,
            typical: '$25k/$50k',
            icon: 'alert' as const
        }
    ];

    // Cost factors
    const costFactors = [
        { factor: 'Bike Type', impact: 'high', description: 'Sports bikes cost more than cruisers' },
        { factor: 'Engine Size', impact: 'high', description: 'Larger engines = higher premiums' },
        { factor: 'Age & Experience', impact: 'high', description: 'Younger, less experienced riders pay more' },
        { factor: 'Driving Record', impact: 'high', description: 'Tickets and accidents increase rates' },
        { factor: 'Usage', impact: 'medium', description: 'Daily commuting costs more than weekend riding' },
        { factor: 'Storage', impact: 'medium', description: 'Garage parking reduces premiums' }
    ];

    // FAQs
    const faqs: FAQItem[] = [
        {
            question: `Is motorcycle insurance required in ${stateName}?`,
            answer: `Yes, ${stateName} requires minimum liability insurance for motorcycles, just like cars. Requirements are typically $15,000-25,000 per person for bodily injury, $30,000-50,000 per accident, and $5,000-25,000 for property damage. We recommend higher limits for better protection.`
        },
        {
            question: 'Why is motorcycle insurance so expensive?',
            answer: 'Motorcycles are riskier than cars - riders are 28x more likely to die in a crash per mile traveled. Sports bikes and high-performance motorcycles cost the most to insure. You can lower costs by choosing a smaller bike, taking safety courses, and maintaining a clean driving record.'
        },
        {
            question: 'Does motorcycle insurance cover passengers?',
            answer: 'Liability coverage typically covers passengers, but check your policy. For passenger injuries, you need sufficient bodily injury liability. Some insurers offer guest passenger liability as a separate coverage. Medical payments coverage can also help with passenger injuries.'
        },
        {
            question: 'Is my gear and helmet covered?',
            answer: 'Most policies include some coverage for riding gear - helmets, jackets, gloves, boots - typically $1,000-3,000. Some insurers offer higher gear coverage as an add-on. Aftermarket parts and customizations may need additional coverage beyond standard collision/comprehensive.'
        },
        {
            question: 'Can I get insurance for track days?',
            answer: 'Standard motorcycle insurance does NOT cover track days or racing. Some specialty insurers offer track day coverage as an add-on or separate policy. Expect to pay significantly more for this coverage. Always confirm coverage before riding on a track.'
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
            <section className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Bike className="w-4 h-4" />
                                Updated {new Date(lastUpdated).toLocaleDateString()}
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                Motorcycle Insurance in {stateName}
                            </h1>
                            <p className="text-slate-300 text-lg mb-6 max-w-xl">
                                Hit the road with confidence. Find affordable coverage for your bike 
                                starting at {avgPremium}/month.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Starting at {avgPremium}/mo
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Gear Coverage Available
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Roadside Assistance
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
                                question={`Is motorcycle insurance required in ${stateName}?`}
                                answer={`Yes, ${stateName} requires motorcycle insurance with at least liability coverage. Minimum requirements are typically $15,000-25,000 per person for bodily injury, $30,000-50,000 per accident, and $5,000-25,000 for property damage. Full coverage including collision and comprehensive is recommended for newer bikes.`}
                                source={`${stateName} Department of Motor Vehicles`}
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
                                        isRequired={type.required}
                                        limit={type.typical}
                                        accentColor="slate"
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
                                title={`Motorcycle Insurance FAQs for ${stateName}`}
                                items={faqs}
                            />
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <CTABanner 
                            title="Get Motorcycle Insurance"
                            subtitle="Compare quotes from top motorcycle insurers"
                            primaryButtonText="Start Comparison"
                            accentColor="orange"
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
