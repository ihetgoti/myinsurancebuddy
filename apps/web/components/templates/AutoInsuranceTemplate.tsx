import Link from 'next/link';
import {
    Phone, Car, FileSearch, Shield, FileCheck,
    DollarSign, AlertTriangle, Star, ChevronDown,
    CheckCircle, MapPin, ExternalLink, TrendingDown,
    Percent, Users, CreditCard, Gauge, Calendar
} from 'lucide-react';
import MarketcallCTA from '@/components/MarketcallCTA';
import CopyAsMarkdown from '@/components/CopyAsMarkdown';
import AskAIButtons from '@/components/AskAIButtons';
import {
    TableOfContents,
    QuickAnswerBox,
    AuthorByline,
    LastUpdated,
    EnhancedFAQ,
    CTABanner,
    TrustSignals,
    CoverageCard,
    TOCItem,
    FAQItem
} from './shared';

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
    // Core variables
    const stateName = variables.state_name || variables.state || 'Your State';
    const stateCode = variables.state_code || '';
    const avgPremium = variables.avg_premium || '$1,500/year';
    const minCoverage = variables.coverage_format || '15/30/5';
    const uninsuredRate = variables.uninsured_rate || '12%';
    const topInsurer = variables.top_insurer || 'State Farm';
    const lastUpdated = variables.last_updated || new Date().toISOString().split('T')[0];

    // Coverage breakdown
    const coverageBreakdown = variables.coverage_breakdown || {
        bodily_per_person: '15,000',
        bodily_per_accident: '30,000',
        property: '5,000'
    };

    // State-specific info
    const isNoFaultState = variables.is_no_fault_state || false;
    const pipRequired = variables.pip_required || false;
    const stateLawsSummary = variables.state_laws_summary || '';

    // AI-generated content slots (from customData)
    const introContent = variables.intro_content || variables.ai_intro ||
        `Finding affordable auto insurance in ${stateName} requires understanding local requirements and comparing rates from multiple providers. ${stateName} mandates minimum liability coverage of ${minCoverage}, but most experts recommend higher limits to fully protect your assets. Our comprehensive guide helps you navigate the insurance landscape and find the best coverage for your needs.`;

    const requirementsContent = variables.requirements_content || variables.ai_requirements ||
        `${stateName} requires all drivers to carry minimum liability insurance of ${minCoverage}. This means $${coverageBreakdown.bodily_per_person} per person for bodily injury, $${coverageBreakdown.bodily_per_accident} per accident for total bodily injury, and $${coverageBreakdown.property} for property damage. ${isNoFaultState ? `As a no-fault state, ${stateName} also requires Personal Injury Protection (PIP) coverage.` : 'This coverage protects you financially if you cause an accident that injures others or damages their property.'}`;

    const tipsContent: string[] = variables.tips_content || variables.ai_tips || [
        'Compare quotes from at least 3-5 different insurers to find the best rate',
        'Bundle your auto and home insurance for potential discounts of 10-25%',
        'Maintain a clean driving record - accidents can raise rates by 20-40%',
        'Ask about discounts for safe driving apps, low mileage, and safety features',
        'Consider raising your deductible to lower your monthly premium',
        'Review your coverage annually as your needs may change'
    ];

    const faqItems: FAQItem[] = variables.faqs || variables.ai_faq || [
        {
            question: `What is the minimum auto insurance required in ${stateName}?`,
            answer: `${stateName} requires minimum liability coverage of ${minCoverage}, which means $${coverageBreakdown.bodily_per_person} per person for bodily injury, $${coverageBreakdown.bodily_per_accident} per accident total, and $${coverageBreakdown.property} for property damage.`
        },
        {
            question: `How much does car insurance cost in ${stateName}?`,
            answer: `The average car insurance premium in ${stateName} is ${avgPremium}. However, your actual rate depends on factors like your age, driving record, vehicle type, and coverage level.`
        },
        {
            question: `What factors affect auto insurance rates in ${stateName}?`,
            answer: `Key factors include your driving history, age, credit score (in most states), vehicle make and model, annual mileage, coverage limits, and deductible choices. ${stateName}-specific factors like weather risks and traffic density also play a role.`
        },
        {
            question: 'Is full coverage required?',
            answer: `No, ${stateName} only requires liability insurance. However, if you have a car loan or lease, your lender will typically require comprehensive and collision coverage.`
        },
        {
            question: 'How can I lower my car insurance premium?',
            answer: 'You can lower your premium by maintaining a clean driving record, bundling policies, increasing your deductible, asking about available discounts, and comparing quotes from multiple insurers.'
        }
    ];

    // Cost factors
    const costFactors = variables.cost_factors || [
        { factor: 'Driving Record', impact: 'high', description: 'Accidents and violations can increase rates 20-40%' },
        { factor: 'Age & Experience', impact: 'high', description: 'Younger drivers pay significantly more' },
        { factor: 'Vehicle Type', impact: 'medium', description: 'Sports cars and luxury vehicles cost more to insure' },
        { factor: 'Credit Score', impact: 'medium', description: 'Better credit often means lower premiums' },
        { factor: 'Annual Mileage', impact: 'medium', description: 'More driving = higher risk = higher rates' },
        { factor: 'Coverage Level', impact: 'high', description: 'Higher limits and lower deductibles cost more' }
    ];

    // Discounts
    const discounts = variables.discounts || [
        { name: 'Multi-Policy Bundle', savings: '10-25%', description: 'Combine auto with home or renters insurance' },
        { name: 'Safe Driver', savings: '10-20%', description: 'Clean driving record for 3-5 years' },
        { name: 'Good Student', savings: '8-15%', description: 'Students with B average or better' },
        { name: 'Low Mileage', savings: '5-15%', description: 'Drive less than 7,500 miles per year' },
        { name: 'Safety Features', savings: '5-10%', description: 'Anti-theft devices, airbags, anti-lock brakes' },
        { name: 'Pay in Full', savings: '5-10%', description: 'Pay your annual premium upfront' }
    ];

    const keyTakeaways = [
        `${stateName} requires minimum ${minCoverage} liability coverage`,
        `Average premium in ${stateName}: ${avgPremium}`,
        `${uninsuredRate} of drivers are uninsured - consider UM/UIM coverage`,
        `Top insurer by market share: ${topInsurer}`,
        isNoFaultState ? `${stateName} is a no-fault state requiring PIP coverage` : null
    ].filter(Boolean) as string[];

    const pageUrl = `https://myinsurancebuddies.com/car-insurance/us/${variables.state_slug || 'state'}`;
    const pageTitle = `Auto Insurance in ${stateName}`;

    // Table of Contents items
    const tocItems: TOCItem[] = [
        { id: 'requirements', label: 'Coverage Requirements' },
        { id: 'coverage-types', label: 'Coverage Types Explained' },
        { id: 'cost-factors', label: 'What Affects Your Rate' },
        { id: 'discounts', label: 'Available Discounts' },
        { id: 'compare', label: 'Compare Providers' },
        { id: 'tips', label: 'Money-Saving Tips' },
        { id: 'faq', label: 'FAQs' }
    ];

    // JSON-LD Schemas
    const schemas = {
        insuranceAgency: {
            '@context': 'https://schema.org',
            '@type': 'InsuranceAgency',
            name: 'MyInsuranceBuddies',
            url: 'https://myinsurancebuddies.com',
            logo: 'https://myinsurancebuddies.com/logo.png',
            description: `Compare auto insurance rates in ${stateName}`,
            areaServed: {
                '@type': 'State',
                name: stateName
            },
            serviceType: 'Auto Insurance',
            priceRange: avgPremium
        },
        howTo: {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: `How to Get Auto Insurance in ${stateName}`,
            description: `Step-by-step guide to getting the best auto insurance rates in ${stateName}`,
            step: [
                {
                    '@type': 'HowToStep',
                    position: 1,
                    name: 'Enter Vehicle Information',
                    text: 'Provide details about your vehicle including make, model, year, and VIN'
                },
                {
                    '@type': 'HowToStep',
                    position: 2,
                    name: 'Compare Rates',
                    text: 'Review quotes from multiple insurance providers to find the best rate'
                },
                {
                    '@type': 'HowToStep',
                    position: 3,
                    name: 'Choose Coverage',
                    text: 'Select your coverage limits and deductibles based on your needs'
                },
                {
                    '@type': 'HowToStep',
                    position: 4,
                    name: 'Get Your Policy',
                    text: 'Complete the application and receive your insurance documents'
                }
            ]
        },
        article: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: pageTitle,
            description: `Complete guide to auto insurance requirements, rates, and coverage options in ${stateName}`,
            author: {
                '@type': 'Organization',
                name: 'MyInsuranceBuddies Editorial Team'
            },
            publisher: {
                '@type': 'Organization',
                name: 'MyInsuranceBuddies',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://myinsurancebuddies.com/logo.png'
                }
            },
            datePublished: '2024-01-01',
            dateModified: lastUpdated
        }
    };

    return (
        <article
            className="min-h-screen bg-white"
            itemScope
            itemType="https://schema.org/Article"
        >
            {/* JSON-LD Schemas */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.insuranceAgency) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.howTo) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }}
            />

            {/* Hero Section */}
            <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
                                <MapPin size={16} />
                                <span>{stateName} Auto Insurance Guide</span>
                            </div>
                            <h1
                                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                                itemProp="headline"
                            >
                                Auto Insurance in {stateName}
                            </h1>
                            <p className="text-slate-300 text-lg mb-6 max-w-xl" itemProp="description">
                                Compare rates from top providers, understand {stateName}'s coverage requirements,
                                and save on your auto insurance. Average premium: <strong className="text-white">{avgPremium}</strong>
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
                                <a
                                    href="tel:18552052412"
                                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3
                                             rounded-lg font-semibold transition-colors inline-flex items-center gap-2 border border-white/20"
                                >
                                    <Phone size={18} />
                                    Call for Quote
                                </a>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap gap-4 mt-8 text-sm font-medium text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Shield className="text-blue-400" size={18} />
                                    <span>Compare 100+ Companies</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="text-blue-400" size={18} />
                                    <span>Free Quotes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="text-blue-400" size={18} />
                                    <span>No Spam Calls</span>
                                </div>
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
            </header>

            {/* Quick Answer Box */}
            <section className="py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <QuickAnswerBox
                            question={`What is the minimum car insurance required in ${stateName}?`}
                            answer={`${stateName} requires minimum liability coverage of ${minCoverage}. This means $${coverageBreakdown.bodily_per_person} per person for bodily injury, $${coverageBreakdown.bodily_per_accident} per accident total, and $${coverageBreakdown.property} for property damage. ${isNoFaultState ? 'As a no-fault state, PIP coverage is also required.' : ''}`}
                            source={`${stateName} Department of Motor Vehicles`}
                        />
                    </div>
                </div>
            </section>

            {/* Key Takeaways + AI Tools */}
            <section className="py-8 bg-amber-50 border-b border-amber-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                                <CheckCircle size={20} />
                                Key Takeaways
                            </h2>
                            <div className="flex items-center gap-2">
                                <LastUpdated date={lastUpdated} variant="badge" />
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

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar - Table of Contents */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <TableOfContents items={tocItems} />
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="lg:col-span-3 space-y-12">
                        {/* Visual Flow Diagram */}
                        <section className="bg-slate-50 rounded-2xl p-8">
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
                                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-2 shadow-lg">
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
                        </section>

                        {/* Local Stats Cards */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <DollarSign size={24} className="mx-auto text-blue-600 mb-2" />
                                <p className="text-2xl font-bold text-slate-900">{avgPremium}</p>
                                <p className="text-sm text-slate-500">Avg. Premium</p>
                            </div>
                            <div className="bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <Shield size={24} className="mx-auto text-blue-600 mb-2" />
                                <p className="text-2xl font-bold text-slate-900">{minCoverage}</p>
                                <p className="text-sm text-slate-500">Min. Coverage</p>
                            </div>
                            <div className="bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <AlertTriangle size={24} className="mx-auto text-amber-500 mb-2" />
                                <p className="text-2xl font-bold text-slate-900">{uninsuredRate}</p>
                                <p className="text-sm text-slate-500">Uninsured Rate</p>
                            </div>
                            <div className="bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <Star size={24} className="mx-auto text-yellow-500 mb-2" />
                                <p className="text-2xl font-bold text-slate-900">{topInsurer}</p>
                                <p className="text-sm text-slate-500">Top Insurer</p>
                            </div>
                        </section>

                        {/* Introduction */}
                        <section id="requirements" aria-labelledby="requirements-heading" className="prose prose-slate max-w-none">
                            <h2 id="requirements-heading" className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Shield className="text-blue-600" size={28} />
                                Understanding Auto Insurance in {stateName}
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {introContent}
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                                {stateName} Minimum Requirements
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {requirementsContent}
                            </p>

                            {/* Coverage Breakdown Table */}
                            <div className="bg-blue-50 rounded-xl p-6 mt-6 not-prose">
                                <h4 className="font-bold text-slate-900 mb-4">
                                    {stateName} Minimum Liability Limits ({minCoverage})
                                </h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                                        <p className="text-sm text-slate-500 mb-1">Bodily Injury (Per Person)</p>
                                        <p className="text-2xl font-bold text-blue-600">${coverageBreakdown.bodily_per_person}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                                        <p className="text-sm text-slate-500 mb-1">Bodily Injury (Per Accident)</p>
                                        <p className="text-2xl font-bold text-blue-600">${coverageBreakdown.bodily_per_accident}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                                        <p className="text-sm text-slate-500 mb-1">Property Damage</p>
                                        <p className="text-2xl font-bold text-blue-600">${coverageBreakdown.property}</p>
                                    </div>
                                </div>
                                {isNoFaultState && (
                                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-amber-800 text-sm">
                                            <strong>No-Fault State:</strong> {stateName} requires Personal Injury Protection (PIP) coverage in addition to liability insurance.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Coverage Types */}
                        <section id="coverage-types" aria-labelledby="coverage-heading">
                            <h2 id="coverage-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Car className="text-blue-600" size={28} />
                                Coverage Types Explained
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <CoverageCard
                                    title="Liability Coverage"
                                    description="Covers damages and injuries you cause to others. Required in all states. Includes bodily injury and property damage."
                                    icon="shield"
                                    isRequired={true}
                                    limit={minCoverage}
                                    accentColor="blue"
                                />
                                <CoverageCard
                                    title="Collision Coverage"
                                    description="Pays for damage to your vehicle from accidents, regardless of fault. Required for financed vehicles."
                                    icon="car"
                                    deductible="$500 - $1,000"
                                    accentColor="slate"
                                />
                                <CoverageCard
                                    title="Comprehensive Coverage"
                                    description="Covers non-collision damage: theft, vandalism, weather, animal strikes. Also called 'other than collision'."
                                    icon="umbrella"
                                    deductible="$250 - $500"
                                    accentColor="slate"
                                />
                                <CoverageCard
                                    title="Uninsured/Underinsured Motorist"
                                    description={`Protects you if hit by a driver with no/insufficient insurance. Important since ${uninsuredRate} of ${stateName} drivers are uninsured.`}
                                    icon="alert"
                                    accentColor="orange"
                                />
                                {isNoFaultState && (
                                    <CoverageCard
                                        title="Personal Injury Protection (PIP)"
                                        description="Covers medical expenses and lost wages regardless of fault. Required in no-fault states like yours."
                                        icon="heart"
                                        isRequired={true}
                                        accentColor="red"
                                    />
                                )}
                                <CoverageCard
                                    title="Medical Payments"
                                    description="Covers medical expenses for you and passengers, regardless of fault. Lower limits than PIP but available everywhere."
                                    icon="heart"
                                    accentColor="emerald"
                                />
                            </div>
                        </section>

                        {/* Cost Factors */}
                        <section id="cost-factors" aria-labelledby="cost-heading">
                            <h2 id="cost-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <TrendingDown className="text-blue-600" size={28} />
                                What Affects Your Insurance Rate
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Understanding what impacts your premium helps you find ways to save. Here are the key factors insurers consider:
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {costFactors.map((item: any, i: number) => (
                                    <div key={i} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                item.impact === 'high'
                                                    ? 'bg-red-100 text-red-700'
                                                    : item.impact === 'medium'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {item.impact.toUpperCase()} IMPACT
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-slate-900 mb-1">{item.factor}</h4>
                                        <p className="text-sm text-slate-600">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Discounts */}
                        <section id="discounts" aria-labelledby="discounts-heading">
                            <h2 id="discounts-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Percent className="text-green-600" size={28} />
                                Available Discounts in {stateName}
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Most insurers offer discounts that can significantly reduce your premium. Ask your agent about these common savings:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {discounts.map((discount: any, i: number) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                                        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {discount.savings}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{discount.name}</h4>
                                            <p className="text-sm text-slate-600">{discount.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Mid-Page CTA */}
                        <CTABanner
                            title={`Ready to Save on Auto Insurance in ${stateName}?`}
                            subtitle="Compare rates from top providers and find the coverage that fits your budget."
                            accentColor="blue"
                            urgencyText="Rates can change daily - lock in your quote now"
                        />

                        {/* Comparison Table - Affiliates */}
                        <section id="compare" aria-labelledby="compare-heading">
                            <h2 id="compare-heading" className="text-2xl font-bold text-slate-900 mb-2 text-center">
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
                                            rel="noopener noreferrer sponsored"
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
                                    <div className="text-center py-8 bg-slate-50 rounded-xl">
                                        <p className="text-slate-500 mb-2">Compare top insurers to find the best rate</p>
                                        <Link href="/get-quote" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                                            Get a personalized quote
                                            <ExternalLink size={14} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Tips Section */}
                        <section id="tips" aria-labelledby="tips-heading">
                            <h2 id="tips-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <DollarSign className="text-green-600" size={28} />
                                Tips to Save on Auto Insurance in {stateName}
                            </h2>
                            <div className="space-y-4">
                                {tipsContent.map((tip: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 bg-green-50 rounded-lg p-4 border border-green-100">
                                        <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {i + 1}
                                        </span>
                                        <p className="text-slate-700">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <EnhancedFAQ
                            items={faqItems}
                            title={`Auto Insurance FAQs for ${stateName}`}
                            description="Get answers to common questions about car insurance requirements and coverage"
                            accentColor="blue"
                        />

                        {/* Author & Last Updated */}
                        <AuthorByline
                            authorName="Insurance Editorial Team"
                            authorTitle="Licensed Insurance Experts"
                            reviewerName="James Wilson"
                            reviewerTitle="Senior Auto Insurance Analyst"
                        />
                    </main>
                </div>
            </div>

            {/* Related Links */}
            {(relatedLinks?.nearbyCities?.length > 0 || relatedLinks?.otherNiches?.length > 0) && (
                <section className="py-12 border-t bg-slate-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">Explore More</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {relatedLinks.nearbyCities?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <MapPin size={18} className="text-blue-600" />
                                        Nearby Cities
                                    </h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.nearbyCities.slice(0, 8).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 text-sm flex items-center gap-1">
                                                    <ChevronDown size={14} className="rotate-[-90deg]" />
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {relatedLinks.otherNiches?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Shield size={18} className="text-blue-600" />
                                        Other Insurance Types
                                    </h3>
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
                                                <Link href={link.href} className="text-slate-600 hover:text-blue-600 text-sm flex items-center gap-1">
                                                    <ChevronDown size={14} className="rotate-[-90deg]" />
                                                    {link.label}
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

            {/* Sticky Bottom CTA (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 shadow-lg z-50 md:hidden">
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
        </article>
    );
}
