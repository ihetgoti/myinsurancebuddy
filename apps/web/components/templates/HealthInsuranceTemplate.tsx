import Link from 'next/link';
import {
    Phone, ClipboardCheck, Grid, Building2, CheckCircle2,
    DollarSign, AlertTriangle, Star, ChevronDown,
    CheckCircle, MapPin, ExternalLink, Heart, Calendar, Shield,
    Clock, Users, Stethoscope, BadgePercent, FileText
} from 'lucide-react';
import MarketCallCTA from '@/components/MarketCallCTA';
import CopyAsMarkdown from '@/components/CopyAsMarkdown';
import AskAIButtons from '@/components/AskAIButtons';
import {
    TableOfContents,
    QuickAnswerBox,
    AuthorByline,
    LastUpdated,
    EnhancedFAQ,
    CTABanner,
    CoverageCard,
    TOCItem,
    FAQItem
} from './shared';

interface HealthInsuranceTemplateProps {
    variables: Record<string, any>;
    affiliates: any[];
    relatedLinks: any;
    insuranceTypeId?: string;
    stateId?: string;
}

export default function HealthInsuranceTemplate({
    variables,
    affiliates,
    relatedLinks,
    insuranceTypeId,
    stateId,
}: HealthInsuranceTemplateProps) {
    // Core variables
    const stateName = variables.state_name || variables.state || 'Your State';
    const avgPremium = variables.avg_premium || '$450/month';
    const enrollmentPeriod = variables.enrollment_period || 'Nov 1 - Jan 15';
    const enrollmentStartDate = variables.enrollment_start_date || 'November 1';
    const enrollmentEndDate = variables.enrollment_end_date || 'January 15';
    const uninsuredRate = variables.uninsured_rate || '8%';
    const topPlan = variables.top_plan || 'Blue Cross Blue Shield';
    const lastUpdated = variables.last_updated || new Date().toISOString().split('T')[0];

    // State-specific info
    const medicaidExpansionState = variables.medicaid_expansion_state !== false;
    const averageSilverPremium = variables.average_silver_premium || '$450';

    // AI-generated content slots
    const introContent = variables.intro_content || variables.ai_intro ||
        `Finding the right health insurance in ${stateName} means understanding your options, from marketplace plans to employer coverage, Medicaid, and Medicare. With average premiums around ${avgPremium} and open enrollment running ${enrollmentPeriod}, now is the time to compare plans. Our guide helps you navigate ${stateName}'s healthcare landscape and find affordable coverage that fits your needs.`;

    const requirementsContent = variables.requirements_content || variables.ai_requirements ||
        `${stateName} residents can access health insurance through multiple pathways: the Health Insurance Marketplace (healthcare.gov), employer-sponsored plans, Medicaid (for qualifying low-income individuals), or Medicare (for those 65+). ${medicaidExpansionState ? `${stateName} has expanded Medicaid, making more residents eligible for free or low-cost coverage.` : `Note: ${stateName} has not expanded Medicaid, so eligibility is more limited.`}`;

    const tipsContent: string[] = variables.tips_content || variables.ai_tips || [
        'Compare plans during Open Enrollment to find the best value for your needs',
        'Check if you qualify for subsidies - many people earning up to $60,000+ qualify',
        'Consider your healthcare needs when choosing between Bronze, Silver, Gold, and Platinum',
        'Review the provider network to ensure your doctors are covered',
        'Factor in total costs: premiums + deductibles + copays + coinsurance',
        'Look into HSA-eligible plans if you want to save pre-tax dollars for healthcare'
    ];

    const faqItems: FAQItem[] = variables.faqs || variables.ai_faq || [
        {
            question: `When is Open Enrollment for health insurance in ${stateName}?`,
            answer: `Open Enrollment for ${stateName} runs from ${enrollmentStartDate} through ${enrollmentEndDate}. During this period, you can enroll in a new plan or change your existing coverage. Outside of Open Enrollment, you can only enroll if you qualify for a Special Enrollment Period.`
        },
        {
            question: `How much does health insurance cost in ${stateName}?`,
            answer: `The average health insurance premium in ${stateName} is ${avgPremium}. However, costs vary significantly based on your age, income (subsidies), plan type (Bronze/Silver/Gold/Platinum), and coverage level. Many residents qualify for subsidies that can reduce premiums to under $100/month.`
        },
        {
            question: `Do I qualify for free or low-cost health insurance in ${stateName}?`,
            answer: `You may qualify for Medicaid if your income is below 138% of the Federal Poverty Level${medicaidExpansionState ? ` (${stateName} has expanded Medicaid)` : ''}. You may also qualify for premium subsidies through the Marketplace if your income is between 100-400% FPL.`
        },
        {
            question: 'What\'s the difference between HMO, PPO, EPO, and HDHP plans?',
            answer: 'HMO plans require referrals and using in-network providers but have lower costs. PPO plans offer more flexibility with no referrals needed but higher premiums. EPO plans are like HMOs but without referral requirements. HDHP (High-Deductible Health Plans) have lower premiums but higher deductibles, and allow HSA contributions.'
        },
        {
            question: 'What do Bronze, Silver, Gold, and Platinum plans mean?',
            answer: 'These "metal tiers" indicate how costs are split between you and the insurer. Bronze: You pay 40%, insurer pays 60% (lowest premiums). Silver: 30%/70%. Gold: 20%/80%. Platinum: 10%/90% (highest premiums, lowest out-of-pocket).'
        }
    ];

    // Plan types
    const planTypes = [
        {
            name: 'HMO',
            fullName: 'Health Maintenance Organization',
            pros: ['Lower premiums', 'Lower out-of-pocket costs', 'Coordinated care'],
            cons: ['Need referrals for specialists', 'Must use in-network providers'],
            bestFor: 'Those who want lower costs and don\'t mind choosing a primary care physician'
        },
        {
            name: 'PPO',
            fullName: 'Preferred Provider Organization',
            pros: ['No referrals needed', 'Can see out-of-network doctors', 'More flexibility'],
            cons: ['Higher premiums', 'Higher out-of-pocket for out-of-network'],
            bestFor: 'Those who want flexibility and don\'t mind paying more for it'
        },
        {
            name: 'EPO',
            fullName: 'Exclusive Provider Organization',
            pros: ['No referrals needed', 'Lower premiums than PPO', 'Simpler network rules'],
            cons: ['No out-of-network coverage', 'Must stay in-network'],
            bestFor: 'Those who want PPO flexibility but with lower costs'
        },
        {
            name: 'HDHP',
            fullName: 'High-Deductible Health Plan',
            pros: ['Lowest premiums', 'HSA eligible (tax savings)', 'Good for healthy people'],
            cons: ['High deductible before coverage kicks in', 'Higher out-of-pocket if sick'],
            bestFor: 'Healthy individuals who want to save on premiums and contribute to an HSA'
        }
    ];

    // Metal tiers
    const metalTiers = [
        { tier: 'Bronze', split: '60/40', premium: 'Lowest', outOfPocket: 'Highest', bestFor: 'Healthy, young adults' },
        { tier: 'Silver', split: '70/30', premium: 'Moderate', outOfPocket: 'Moderate', bestFor: 'Most people, CSR eligible' },
        { tier: 'Gold', split: '80/20', premium: 'Higher', outOfPocket: 'Lower', bestFor: 'Regular medical needs' },
        { tier: 'Platinum', split: '90/10', premium: 'Highest', outOfPocket: 'Lowest', bestFor: 'Chronic conditions' }
    ];

    const keyTakeaways = [
        `Open Enrollment: ${enrollmentPeriod}`,
        `Average premium in ${stateName}: ${avgPremium}`,
        `${uninsuredRate} of ${stateName} residents are uninsured`,
        medicaidExpansionState ? `${stateName} has expanded Medicaid` : `${stateName} has limited Medicaid eligibility`,
        `Top plan by enrollment: ${topPlan}`
    ];

    const pageUrl = `https://myinsurancebuddies.com/health-insurance/us/${variables.state_slug || 'state'}`;
    const pageTitle = `Health Insurance in ${stateName}`;

    // Table of Contents
    const tocItems: TOCItem[] = [
        { id: 'coverage-options', label: 'Coverage Options' },
        { id: 'plan-types', label: 'Plan Types (HMO, PPO, etc.)' },
        { id: 'metal-tiers', label: 'Metal Tiers Explained' },
        { id: 'subsidies', label: 'Financial Assistance' },
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
            description: `Compare health insurance plans in ${stateName}`,
            areaServed: { '@type': 'State', name: stateName },
            serviceType: 'Health Insurance',
            priceRange: avgPremium
        },
        howTo: {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: `How to Get Health Insurance in ${stateName}`,
            step: [
                { '@type': 'HowToStep', position: 1, name: 'Check Eligibility', text: 'Determine if you qualify for Medicaid, Medicare, or Marketplace plans' },
                { '@type': 'HowToStep', position: 2, name: 'Compare Plans', text: 'Review available plans and compare premiums, deductibles, and coverage' },
                { '@type': 'HowToStep', position: 3, name: 'Choose Network', text: 'Verify your doctors and hospitals are in-network' },
                { '@type': 'HowToStep', position: 4, name: 'Enroll', text: 'Complete enrollment during Open Enrollment or Special Enrollment Period' }
            ]
        },
        article: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: pageTitle,
            description: `Complete guide to health insurance options and enrollment in ${stateName}`,
            author: { '@type': 'Organization', name: 'MyInsuranceBuddies Editorial Team' },
            publisher: { '@type': 'Organization', name: 'MyInsuranceBuddies', logo: { '@type': 'ImageObject', url: 'https://myinsurancebuddies.com/logo.png' } },
            datePublished: '2024-01-01',
            dateModified: lastUpdated
        }
    };

    return (
        <article className="min-h-screen bg-white" itemScope itemType="https://schema.org/Article">
            {/* JSON-LD Schemas */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.insuranceAgency) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.howTo) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }} />

            {/* Hero Section */}
            <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
                                <MapPin size={16} />
                                <span>{stateName} Health Insurance Guide</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" itemProp="headline">
                                Health Insurance in {stateName}
                            </h1>
                            <p className="text-slate-300 text-lg mb-6 max-w-xl" itemProp="description">
                                Compare health plans, understand your coverage options, and find
                                affordable healthcare. Average premium: <strong className="text-white">{avgPremium}</strong>
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="#compare" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
                                    Compare Plans <ChevronDown size={18} />
                                </Link>
                                <a href="tel:18552052412" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 border border-white/20">
                                    <Phone size={18} /> Speak with Agent
                                </a>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-8 text-sm font-medium text-slate-300">
                                <div className="flex items-center gap-2"><Shield className="text-emerald-400" size={18} /><span>Compare Top Providers</span></div>
                                <div className="flex items-center gap-2"><CheckCircle className="text-emerald-400" size={18} /><span>Free Quotes</span></div>
                                <div className="flex items-center gap-2"><Shield className="text-emerald-400" size={18} /><span>Secure & Private</span></div>
                            </div>
                        </div>
                        <div className="flex justify-center md:justify-end">
                            <MarketCallCTA insuranceTypeId={insuranceTypeId} stateId={stateId} className="max-w-sm w-full" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Enrollment Urgency Banner */}
            <section className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
                        <div className="flex items-center gap-2">
                            <Clock size={20} />
                            <span className="font-bold">Open Enrollment: {enrollmentPeriod}</span>
                        </div>
                        <span className="hidden sm:inline">|</span>
                        <span>Don't miss your chance to enroll or change plans!</span>
                        <Link href="#compare" className="bg-white text-orange-600 px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-orange-50 transition-colors">
                            Compare Plans Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Answer Box */}
            <section className="py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <QuickAnswerBox
                            question={`When can I enroll in health insurance in ${stateName}?`}
                            answer={`Open Enrollment for ${stateName} runs from ${enrollmentStartDate} through ${enrollmentEndDate}. You can enroll in Marketplace plans during this window. Outside Open Enrollment, you may qualify for a Special Enrollment Period if you experience a qualifying life event (job loss, marriage, birth, moving). Medicaid enrollment is available year-round.`}
                            source="Healthcare.gov"
                            sourceUrl="https://www.healthcare.gov"
                        />
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <section className="py-8 bg-emerald-50 border-b border-emerald-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                <Heart size={20} /> Key Takeaways
                            </h2>
                            <div className="flex items-center gap-2">
                                <LastUpdated date={lastUpdated} variant="badge" />
                                <CopyAsMarkdown title={pageTitle} keyTakeaways={keyTakeaways} content={introContent} source={pageUrl} />
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {keyTakeaways.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-emerald-800">
                                    <span className="text-emerald-600 mt-1">•</span>{item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-emerald-200">
                            <AskAIButtons pageContent={introContent} pageTitle={pageTitle} pageUrl={pageUrl} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <TableOfContents items={tocItems} />
                        </div>
                    </aside>

                    <main className="lg:col-span-3 space-y-12">
                        {/* Flow Diagram */}
                        <section className="bg-slate-50 rounded-2xl p-8">
                            <h2 className="text-xl font-bold text-center text-slate-900 mb-8">How to Get Health Coverage</h2>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                                {[
                                    { icon: ClipboardCheck, label: 'Check Eligibility' },
                                    { icon: Grid, label: 'Compare Plans' },
                                    { icon: Building2, label: 'Choose Network' },
                                    { icon: CheckCircle2, label: 'Enroll' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 md:gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white mb-2 shadow-lg">
                                                <item.icon size={28} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 text-center max-w-24">{item.label}</span>
                                        </div>
                                        {i < 3 && <div className="hidden md:block text-slate-300 text-2xl">→</div>}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Stats Cards */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <DollarSign size={24} className="mx-auto text-emerald-600 mb-2" />
                                <p className="text-2xl font-bold text-slate-900">{avgPremium}</p>
                                <p className="text-sm text-slate-500">Avg. Premium</p>
                            </div>
                            <div className="bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <Calendar size={24} className="mx-auto text-emerald-600 mb-2" />
                                <p className="text-lg font-bold text-slate-900">{enrollmentPeriod}</p>
                                <p className="text-sm text-slate-500">Open Enrollment</p>
                            </div>
                            <div className="bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <AlertTriangle size={24} className="mx-auto text-amber-500 mb-2" />
                                <p className="text-2xl font-bold text-slate-900">{uninsuredRate}</p>
                                <p className="text-sm text-slate-500">Uninsured Rate</p>
                            </div>
                            <div className="bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <Star size={24} className="mx-auto text-yellow-500 mb-2" />
                                <p className="text-lg font-bold text-slate-900">{topPlan}</p>
                                <p className="text-sm text-slate-500">Top Plan</p>
                            </div>
                        </section>

                        {/* Coverage Options */}
                        <section id="coverage-options" aria-labelledby="coverage-heading" className="prose prose-slate max-w-none">
                            <h2 id="coverage-heading" className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Heart className="text-emerald-600" size={28} />
                                Understanding Health Insurance in {stateName}
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">{introContent}</p>
                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Your Coverage Options</h3>
                            <p className="text-slate-600 leading-relaxed">{requirementsContent}</p>

                            <div className="grid md:grid-cols-2 gap-4 mt-6 not-prose">
                                <CoverageCard title="Marketplace Plans" description="Individual and family plans through healthcare.gov. Subsidies available based on income." icon="users" accentColor="emerald" />
                                <CoverageCard title="Employer Coverage" description="Health benefits through your job. Usually the most affordable option." icon="briefcase" accentColor="blue" />
                                <CoverageCard title="Medicaid" description={`Free or low-cost coverage for low-income individuals. ${medicaidExpansionState ? 'Income limit: 138% FPL.' : 'Limited eligibility.'}`} icon="heart" accentColor={medicaidExpansionState ? 'emerald' : 'orange'} />
                                <CoverageCard title="Medicare" description="Federal coverage for those 65+ or with certain disabilities." icon="shield" accentColor="blue" />
                            </div>
                        </section>

                        {/* Plan Types */}
                        <section id="plan-types" aria-labelledby="plan-types-heading">
                            <h2 id="plan-types-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Stethoscope className="text-emerald-600" size={28} />
                                Plan Types Explained
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {planTypes.map((plan, i) => (
                                    <div key={i} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="bg-emerald-50 px-5 py-4 border-b border-emerald-100">
                                            <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                            <p className="text-sm text-slate-600">{plan.fullName}</p>
                                        </div>
                                        <div className="px-5 py-4">
                                            <div className="mb-4">
                                                <p className="text-xs font-semibold text-green-600 uppercase mb-2">Pros</p>
                                                <ul className="space-y-1">
                                                    {plan.pros.map((pro, j) => (
                                                        <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />{pro}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="mb-4">
                                                <p className="text-xs font-semibold text-red-600 uppercase mb-2">Cons</p>
                                                <ul className="space-y-1">
                                                    {plan.cons.map((con, j) => (
                                                        <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />{con}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="pt-3 border-t border-slate-100">
                                                <p className="text-xs text-slate-400 uppercase">Best For</p>
                                                <p className="text-sm font-medium text-slate-700">{plan.bestFor}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Metal Tiers */}
                        <section id="metal-tiers" aria-labelledby="metal-tiers-heading">
                            <h2 id="metal-tiers-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <BadgePercent className="text-emerald-600" size={28} />
                                Metal Tiers Explained
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Tier</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Cost Split</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Premium</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Out-of-Pocket</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Best For</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {metalTiers.map((tier, i) => (
                                            <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                                        tier.tier === 'Bronze' ? 'bg-amber-100 text-amber-700' :
                                                        tier.tier === 'Silver' ? 'bg-slate-200 text-slate-700' :
                                                        tier.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-slate-300 text-slate-800'
                                                    }`}>{tier.tier}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{tier.split}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{tier.premium}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{tier.outOfPocket}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{tier.bestFor}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-800 text-sm"><strong>Pro Tip:</strong> Silver plans are often the best value for those who qualify for Cost-Sharing Reductions (CSRs).</p>
                            </div>
                        </section>

                        {/* Financial Assistance */}
                        <section id="subsidies" aria-labelledby="subsidies-heading">
                            <h2 id="subsidies-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <DollarSign className="text-green-600" size={28} />
                                Financial Assistance in {stateName}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <BadgePercent className="text-green-600" size={20} /> Premium Tax Credits
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">Lower your monthly premium based on income. Available for those earning up to ~$58,000/year (400% FPL).</p>
                                    <div className="text-xs text-green-700 bg-green-100 px-3 py-2 rounded-lg">Many can get coverage for under $100/month!</div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <FileText className="text-blue-600" size={20} /> Cost-Sharing Reductions
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">Lower deductibles and copays. Only available with Silver plans for those earning up to 250% FPL.</p>
                                    <div className="text-xs text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">CSRs can turn Silver into near-Platinum coverage!</div>
                                </div>
                                <div className={`border rounded-xl p-6 ${medicaidExpansionState ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Heart className={medicaidExpansionState ? 'text-emerald-600' : 'text-orange-600'} size={20} /> Medicaid
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        {medicaidExpansionState ? `${stateName} has expanded Medicaid! Adults earning up to 138% FPL may qualify.` : `${stateName} has limited Medicaid eligibility.`}
                                    </p>
                                    <div className={`text-xs px-3 py-2 rounded-lg ${medicaidExpansionState ? 'text-emerald-700 bg-emerald-100' : 'text-orange-700 bg-orange-100'}`}>
                                        {medicaidExpansionState ? 'Apply year-round!' : 'Check healthcare.gov for options'}
                                    </div>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Users className="text-purple-600" size={20} /> CHIP
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">Free or low-cost coverage for children in families that earn too much for Medicaid.</p>
                                    <div className="text-xs text-purple-700 bg-purple-100 px-3 py-2 rounded-lg">Apply year-round through Medicaid office</div>
                                </div>
                            </div>
                        </section>

                        {/* CTA Banner */}
                        <CTABanner
                            title={`Find Affordable Health Insurance in ${stateName}`}
                            subtitle="Speak with a licensed agent to explore your options."
                            accentColor="emerald"
                            urgencyText={`Open Enrollment ends ${enrollmentEndDate}`}
                        />

                        {/* Compare Providers */}
                        <section id="compare" aria-labelledby="compare-heading">
                            <h2 id="compare-heading" className="text-2xl font-bold text-slate-900 mb-2 text-center">Compare Health Insurance Providers</h2>
                            <p className="text-slate-500 text-center mb-8">Get quotes from trusted carriers</p>
                            <div className="space-y-4">
                                {affiliates.length > 0 ? affiliates.map((partner: any) => (
                                    <a key={partner.id} href={partner.affiliateUrl || '#'} target="_blank" rel="noopener noreferrer sponsored"
                                       className="flex items-center gap-4 p-4 bg-white rounded-xl border hover:shadow-lg hover:border-emerald-300 transition-all group">
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {partner.logo ? <img src={partner.logo} alt={partner.name} className="w-12 h-12 object-contain" /> : <span className="text-2xl font-bold text-slate-400">{partner.name[0]}</span>}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600">{partner.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span className="flex text-yellow-400">★★★★★</span>
                                                <span>{partner.description || 'Health insurance provider'}</span>
                                            </div>
                                        </div>
                                        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium group-hover:bg-emerald-700 transition-colors flex items-center gap-1">
                                            Get Quote <ExternalLink size={14} />
                                        </button>
                                    </a>
                                )) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl">
                                        <p className="text-slate-500 mb-2">Compare health plans to find the best coverage</p>
                                        <Link href="/get-quote" className="text-emerald-600 hover:underline inline-flex items-center gap-1">Get a personalized quote <ExternalLink size={14} /></Link>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Tips */}
                        <section id="tips" aria-labelledby="tips-heading">
                            <h2 id="tips-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <DollarSign className="text-green-600" size={28} />
                                Tips for Finding Affordable Coverage
                            </h2>
                            <div className="space-y-4">
                                {tipsContent.map((tip: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 bg-green-50 rounded-lg p-4 border border-green-100">
                                        <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                                        <p className="text-slate-700">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ */}
                        <EnhancedFAQ items={faqItems} title={`Health Insurance FAQs for ${stateName}`} accentColor="emerald" />

                        {/* Author */}
                        <AuthorByline authorName="Insurance Editorial Team" authorTitle="Licensed Health Insurance Experts" reviewerName="Sarah Johnson" reviewerTitle="Senior Healthcare Policy Analyst" />
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
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><MapPin size={18} className="text-emerald-600" />Nearby Cities</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.nearbyCities.slice(0, 8).map((link: any, i: number) => (
                                            <li key={i}><Link href={link.href} className="text-slate-600 hover:text-emerald-600 text-sm flex items-center gap-1"><ChevronDown size={14} className="rotate-[-90deg]" />{link.label}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {relatedLinks.otherNiches?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield size={18} className="text-emerald-600" />Other Insurance</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.otherNiches.slice(0, 6).map((link: any, i: number) => (
                                            <li key={i}><Link href={link.href} className="text-slate-600 hover:text-emerald-600 text-sm flex items-center gap-2"><span>{link.icon}</span> {link.label}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {relatedLinks.parentLocations?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Browse More</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.parentLocations.map((link: any, i: number) => (
                                            <li key={i}><Link href={link.href} className="text-slate-600 hover:text-emerald-600 text-sm flex items-center gap-1"><ChevronDown size={14} className="rotate-[-90deg]" />{link.label}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-4 shadow-lg z-50 md:hidden">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <div className="flex items-center gap-2"><Phone size={18} /><span className="font-semibold">1-855-205-2412</span></div>
                    <a href="tel:18552052412" className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold">Call Now</a>
                </div>
            </div>
        </article>
    );
}
