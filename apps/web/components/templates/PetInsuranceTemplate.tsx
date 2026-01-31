import Link from 'next/link';
import {
    Phone, Heart, Dog, Cat, Shield, DollarSign,
    Stethoscope, Pill, Activity, CheckCircle, AlertCircle,
    Star, TrendingDown
} from 'lucide-react';
import MarketCallCTA from '@/components/MarketCallCTA';
import { RelatedContentExplorer } from '@/components/navigation';
import {
    TableOfContents, QuickAnswerBox, LastUpdated,
    EnhancedFAQ, CTABanner, CoverageCard,
    TOCItem, FAQItem
} from './shared';

interface PetInsuranceTemplateProps {
    variables: Record<string, any>;
    affiliates: any[];
    relatedLinks: any;
    insuranceTypeId?: string;
    stateId?: string;
    insuranceTypeName?: string;
}

export default function PetInsuranceTemplate({
    variables,
    affiliates,
    relatedLinks,
    insuranceTypeId,
    stateId,
    insuranceTypeName = 'Pet Insurance',
}: PetInsuranceTemplateProps) {
    const stateName = variables.state_name || variables.state || 'Your State';
    const avgPremium = variables.avg_premium || '$45/month';
    const lastUpdated = variables.last_updated || new Date().toISOString().split('T')[0];

    // Coverage types
    const coverageTypes = [
        {
            title: 'Accident & Illness',
            description: 'Most popular option. Covers injuries, illnesses, surgeries, and prescriptions.',
            bestFor: 'All pets, especially active or older pets',
            avgCost: '$30-70/month',
            icon: 'heart' as const,
            accentColor: 'orange' as const
        },
        {
            title: 'Accident Only',
            description: 'Covers injuries from accidents but not illnesses.',
            bestFor: 'Young, healthy pets on a budget',
            avgCost: '$15-30/month',
            icon: 'alert' as const,
            accentColor: 'orange' as const
        },
        {
            title: 'Wellness Plan',
            description: 'Add-on for routine care like vaccines, checkups, and preventive treatments.',
            bestFor: 'Puppies/kittens needing frequent vet visits',
            avgCost: '$20-40/month',
            icon: 'shield' as const,
            accentColor: 'blue' as const
        }
    ];

    // What's covered
    const coveredItems = [
        { category: 'Surgeries', examples: 'ACL repair, tumor removal, foreign object removal' },
        { category: 'Diagnostic Tests', examples: 'X-rays, bloodwork, MRIs, CT scans, ultrasounds' },
        { category: 'Chronic Conditions', examples: 'Diabetes, allergies, arthritis, cancer treatment' },
        { category: 'Emergency Care', examples: 'ER visits, hospitalization, specialist consultations' }
    ];

    // Common exclusions
    const exclusions = [
        'Pre-existing conditions diagnosed before enrollment',
        'Routine/wellness care (unless you add a wellness plan)',
        'Cosmetic procedures (tail docking, ear cropping)',
        'Breeding and pregnancy costs',
        'Preventable diseases if not vaccinated'
    ];

    // Cost factors
    const costFactors = [
        { factor: 'Pet Age', impact: 'high', description: 'Older pets cost more to insure' },
        { factor: 'Breed', impact: 'high', description: 'Some breeds prone to expensive conditions' },
        { factor: 'Species', impact: 'medium', description: 'Dogs cost more than cats' },
        { factor: 'Location', impact: 'medium', description: 'Vet costs vary by area' },
        { factor: 'Coverage Level', impact: 'high', description: 'Higher limits and lower deductibles cost more' },
        { factor: 'Reimbursement Rate', impact: 'medium', description: '90% costs more than 70%' }
    ];

    // FAQs
    const faqs: FAQItem[] = [
        {
            question: 'Is pet insurance worth it?',
            answer: 'Pet insurance is worth it for most pet owners. A single emergency surgery can cost $3,000-10,000, while insurance averages $30-70/month. If your pet has one major illness or injury, the insurance pays for itself. It also provides peace of mind so you can make medical decisions based on what\'s best, not just cost.'
        },
        {
            question: 'When should I get pet insurance?',
            answer: 'Get pet insurance as early as possible - ideally when your pet is young and healthy. Pre-existing conditions are never covered, so enrolling before any health issues arise ensures maximum coverage. Most insurers accept puppies and kittens from 6-8 weeks old.'
        },
        {
            question: 'What is a waiting period?',
            answer: 'A waiting period is the time between enrolling and when coverage begins. Most policies have 14-day waiting periods for illnesses and 48 hours to 14 days for accidents. This prevents people from buying insurance only after their pet gets sick or hurt.'
        },
        {
            question: 'Can I use any veterinarian?',
            answer: 'Most pet insurance plans allow you to use any licensed veterinarian in the US, including specialists and emergency hospitals. Unlike human health insurance, there are no networks - you pay upfront, submit a claim, and get reimbursed.'
        },
        {
            question: 'Does pet insurance cover spaying/neutering?',
            answer: 'Standard accident and illness policies do not cover spaying/neutering. However, many insurers offer wellness plans as add-ons that cover routine care including spay/neuter procedures, vaccinations, and annual checkups.'
        }
    ];

    const tocItems: TOCItem[] = [
        { id: 'quick-answer', label: 'Quick Answer' },
        { id: 'coverage', label: 'Coverage Options' },
        { id: 'cost-factors', label: 'Cost Factors' },
        { id: 'faq', label: 'FAQs' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-orange-500 to-amber-600 text-white overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Dog className="w-4 h-4" />
                                Updated {new Date(lastUpdated).toLocaleDateString()}
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                Pet Insurance in {stateName}
                            </h1>
                            <p className="text-amber-100 text-lg mb-6 max-w-xl">
                                Protect your furry family members. Get coverage for accidents, 
                                illnesses, and unexpected vet bills starting at just {avgPremium}/month.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Covers up to 90%
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Any Licensed Vet
                                </span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> No Networks
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
                                question={`How much does pet insurance cost in ${stateName}?`}
                                answer={`Pet insurance in ${stateName} typically costs between $25-70 per month for dogs and $15-40 per month for cats. Accident-only plans start around $15/month, while comprehensive accident and illness coverage averages $45/month. Factors like your pet's age, breed, and chosen deductible affect pricing.`}
                                source={`${stateName} Veterinary Medical Association`}
                            />
                        </section>

                        {/* Coverage Types */}
                        <section id="coverage" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Coverage Options</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {coverageTypes.map((type, idx) => (
                                    <CoverageCard
                                        key={idx}
                                        title={type.title}
                                        description={type.description}
                                        icon={type.icon}
                                        accentColor={type.accentColor}
                                    />
                                ))}
                            </div>

                            {/* What's Covered */}
                            <div className="mt-8 bg-orange-50 rounded-xl p-6">
                                <h3 className="font-bold text-slate-900 mb-4">What&apos;s Typically Covered</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {coveredItems.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-slate-900">{item.category}</p>
                                                <p className="text-sm text-slate-600">{item.examples}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Exclusions */}
                            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
                                <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Common Exclusions
                                </h3>
                                <ul className="space-y-2">
                                    {exclusions.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-amber-800">
                                            <span className="text-amber-400">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
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
                                title={`Pet Insurance FAQs for ${stateName}`}
                                items={faqs}
                            />
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <CTABanner 
                            title="Protect Your Pet"
                            subtitle="Get peace of mind for your furry family member"
                            primaryButtonText="Compare Plans"
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
