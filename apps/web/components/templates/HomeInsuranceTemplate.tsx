import Link from 'next/link';
import {
    Phone, Home, Search, List, ShieldCheck,
    DollarSign, Flame, Star, ChevronDown, ChevronRight,
    CheckCircle, MapPin, ExternalLink, FileWarning, Shield,
    AlertTriangle, Umbrella, Droplets, Wind, CloudRain, Percent, Globe,
    ArrowRight, Car, Heart, Stethoscope, Dog, Briefcase, Plane, Zap, Smartphone, Truck
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
    FAQItem,
    // New SEO Components
    CostBreakdown,
    ProviderComparison,
    DiscountsList,
    LocalStats,
    CoverageGuide,
    ClaimsProcess,
    BuyersGuide,
    CostBreakdownItem,
    ComparisonItem,
    DiscountItem,
    LocalStatItem,
    CoverageGuideItem,
    ClaimsProcessContent,
    BuyersGuideContent
} from './shared';

interface HomeInsuranceTemplateProps {
    variables: Record<string, any>;
    affiliates: any[];
    relatedLinks: any;
    insuranceTypeId?: string;
    stateId?: string;
    insuranceTypeName?: string;
}

// Helper to get Lucide icon for insurance type (replaces emojis)
const getInsuranceIcon = (slug: string, className: string = "w-3 h-3") => {
    if (slug?.includes('auto') || slug?.includes('car')) return <Car className={className} />;
    if (slug?.includes('home') || slug?.includes('rent')) return <Home className={className} />;
    if (slug?.includes('life')) return <Heart className={className} />;
    if (slug?.includes('health') || slug?.includes('medicare')) return <Stethoscope className={className} />;
    if (slug?.includes('pet')) return <Dog className={className} />;
    if (slug?.includes('business') || slug?.includes('commercial')) return <Briefcase className={className} />;
    if (slug?.includes('travel')) return <Plane className={className} />;
    if (slug?.includes('motorcycle')) return <Zap className={className} />;
    if (slug?.includes('phone') || slug?.includes('mobile')) return <Smartphone className={className} />;
    if (slug?.includes('truck')) return <Truck className={className} />;
    if (slug?.includes('umbrella')) return <Umbrella className={className} />;
    return <Shield className={className} />;
};

export default function HomeInsuranceTemplate({
    variables,
    affiliates,
    relatedLinks,
    insuranceTypeId,
    stateId,
    insuranceTypeName = 'Home Insurance',
}: HomeInsuranceTemplateProps) {
    // Core variables
    const stateName = variables.state_name || variables.state || 'Your State';
    const avgPremium = variables.avg_premium || '$1,200/year';
    const avgClaim = variables.avg_claim || '$15,000';
    const disasterRisk = variables.disaster_risk || variables.wildfire_risk || 'Moderate';
    const primaryDisasterRisk = variables.primary_disaster_risk || 'weather';
    const topInsurer = variables.top_insurer || 'State Farm';
    const lastUpdated = variables.last_updated || new Date().toISOString().split('T')[0];

    // State-specific disaster info
    const floodZone = variables.flood_zone || false;
    const hurricaneRisk = variables.hurricane_risk || false;
    const earthquakeRisk = variables.earthquake_risk || false;
    const wildfireRisk = variables.wildfire_risk_level || null;
    const tornadoRisk = variables.tornado_risk || false;
    const avgRebuildCost = variables.avg_rebuild_cost || '$250,000';

    // AI-generated content
    const introContent = variables.intro_content || variables.ai_intro ||
        `Protecting your home in ${stateName} requires understanding local risks and coverage options. With average premiums around ${avgPremium} and ${disasterRisk} natural disaster risk, finding the right homeowners insurance is essential. Our comprehensive guide helps you understand what's covered, what's not, and how to find the best price for your protection needs.`;

    const requirementsContent = variables.requirements_content || variables.ai_requirements ||
        `While ${stateName} doesn't legally require homeowners insurance, your mortgage lender almost certainly does. Even if you own your home outright, insurance protects your largest investment from unexpected disasters, liability claims, and theft. A standard HO-3 policy is the most common, covering your dwelling, personal property, liability, and additional living expenses.`;

    const tipsContent: string[] = variables.tips_content || variables.ai_tips || [
        'Bundle your home and auto insurance for discounts of 10-25%',
        'Increase your deductible to $1,000 or higher to lower premiums',
        'Install security systems and smoke detectors for additional discounts',
        'Review your coverage annually as home values change',
        'Document your belongings with photos and receipts for claims',
        'Ask about claims-free discounts if you haven\'t filed recently'
    ];

    const faqItems: FAQItem[] = variables.faqs || variables.ai_faq || [
        {
            question: `How much does homeowners insurance cost in ${stateName}?`,
            answer: `The average homeowners insurance premium in ${stateName} is ${avgPremium}. However, your actual cost depends on your home's value, location, age, construction type, coverage limits, and deductible. Homes in high-risk areas may pay significantly more.`
        },
        {
            question: 'What does homeowners insurance cover?',
            answer: 'A standard HO-3 policy covers your dwelling (Coverage A), other structures like garages (Coverage B), personal property (Coverage C), loss of use/additional living expenses (Coverage D), personal liability (Coverage E), and medical payments to others (Coverage F).'
        },
        {
            question: 'What\'s NOT covered by homeowners insurance?',
            answer: 'Standard policies typically exclude floods, earthquakes, maintenance issues, mold (unless caused by a covered peril), sewer backups, and damage from pests. You may need separate policies or riders for these risks.'
        },
        {
            question: `Do I need flood insurance in ${stateName}?`,
            answer: `${floodZone ? `Yes, if you're in a flood zone, your lender will require flood insurance. Even outside flood zones, it's recommended as standard homeowners policies don't cover flood damage.` : `While not required for most ${stateName} homeowners, flood insurance is recommended since standard policies don't cover flood damage. Just one inch of water can cause $25,000+ in damage.`}`
        },
        {
            question: 'How can I lower my homeowners insurance premium?',
            answer: 'You can lower your premium by bundling policies, increasing your deductible, improving home security, maintaining good credit, keeping your home in good repair, and asking about all available discounts.'
        }
    ];

    // NEW: AI-generated SEO content sections
    const aiCostBreakdown: CostBreakdownItem[] | undefined = variables.costBreakdown || variables.ai_costBreakdown;
    const aiComparison: ComparisonItem[] | undefined = variables.comparison || variables.ai_comparison;
    const aiDiscounts: DiscountItem[] | undefined = variables.discounts_ai || variables.ai_discounts;
    const aiLocalStats: LocalStatItem[] | undefined = variables.localStats || variables.ai_localStats;
    const aiCoverageGuide: CoverageGuideItem[] | undefined = variables.coverageGuide || variables.ai_coverageGuide;
    const aiClaimsProcess: ClaimsProcessContent | undefined = variables.claimsProcess || variables.ai_claimsProcess;
    const aiBuyersGuide: BuyersGuideContent | undefined = variables.buyersGuide || variables.ai_buyersGuide;

    // Coverage types for HO-3
    const coverageTypes = [
        { letter: 'A', name: 'Dwelling', description: 'Your home\'s structure including attached structures', icon: 'home', typical: '100% of rebuild cost' },
        { letter: 'B', name: 'Other Structures', description: 'Detached garage, shed, fence, pool', icon: 'home', typical: '10% of Coverage A' },
        { letter: 'C', name: 'Personal Property', description: 'Furniture, electronics, clothing, appliances', icon: 'dollar', typical: '50-70% of Coverage A' },
        { letter: 'D', name: 'Loss of Use', description: 'Temporary housing if home is uninhabitable', icon: 'home', typical: '20-30% of Coverage A' },
        { letter: 'E', name: 'Personal Liability', description: 'Lawsuits for injuries on your property', icon: 'shield', typical: '$100,000-$500,000' },
        { letter: 'F', name: 'Medical Payments', description: 'Minor injury expenses for guests', icon: 'heart', typical: '$1,000-$5,000' }
    ];

    // Discounts
    const discounts: Array<{ name: string; savings: string; description: string }> = variables.discounts || [
        { name: 'Multi-Policy Bundle', savings: '10-25%', description: 'Combine home and auto insurance' },
        { name: 'Security System', savings: '5-15%', description: 'Monitored alarm or smart home security' },
        { name: 'New Home', savings: '8-15%', description: 'Homes built in the last 10 years' },
        { name: 'Claims-Free', savings: '5-20%', description: 'No claims for 3-5 years' },
        { name: 'New Roof', savings: '5-10%', description: 'Roof replaced in last 10 years' },
        { name: 'Paid in Full', savings: '5-10%', description: 'Pay annual premium upfront' }
    ];

    const keyTakeaways = [
        `Average home insurance premium in ${stateName}: ${avgPremium}`,
        `Average claim payout: ${avgClaim}`,
        `Natural disaster risk level: ${disasterRisk}`,
        floodZone ? 'Flood insurance may be required in your area' : null,
        `Top home insurer: ${topInsurer}`
    ].filter(Boolean) as string[];

    const pageUrl = `https://myinsurancebuddies.com/home-insurance/us/${variables.state_slug || 'state'}`;
    const pageTitle = `Home Insurance in ${stateName}`;

    // Table of Contents
    const tocItems: TOCItem[] = [
        { id: 'coverage', label: 'What\'s Covered' },
        { id: 'coverage-types', label: 'Coverage Types (A-F)' },
        { id: 'not-covered', label: 'What\'s NOT Covered' },
        { id: 'disasters', label: 'Disaster Coverage' },
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
            description: `Compare home insurance rates in ${stateName}`,
            areaServed: { '@type': 'State', name: stateName },
            serviceType: 'Home Insurance',
            priceRange: avgPremium
        },
        howTo: {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: `How to Get Home Insurance in ${stateName}`,
            step: [
                { '@type': 'HowToStep', position: 1, name: 'Enter Home Details', text: 'Provide information about your home including address, size, and age' },
                { '@type': 'HowToStep', position: 2, name: 'Get Property Value', text: 'Determine your home\'s rebuild cost (not market value)' },
                { '@type': 'HowToStep', position: 3, name: 'Compare Policies', text: 'Review quotes from multiple insurers and compare coverage options' },
                { '@type': 'HowToStep', position: 4, name: 'Protect Your Home', text: 'Choose your policy and complete the application' }
            ]
        },
        article: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: pageTitle,
            description: `Complete guide to homeowners insurance coverage and rates in ${stateName}`,
            author: { '@type': 'Organization', name: 'MyInsuranceBuddies Editorial Team' },
            publisher: { '@type': 'Organization', name: 'MyInsuranceBuddies', logo: { '@type': 'ImageObject', url: 'https://myinsurancebuddies.com/logo.png' } },
            datePublished: '2024-01-01',
            dateModified: lastUpdated
        }
    };

    return (
        <article className="min-h-screen bg-white pb-20 md:pb-0" itemScope itemType="https://schema.org/Article">
            {/* JSON-LD Schemas */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.insuranceAgency) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.howTo) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }} />

            {/* Hero Section - Mobile First */}
            <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-10 sm:py-12 md:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
                                <MapPin size={16} />
                                <span>{stateName} Home Insurance Guide</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white" itemProp="headline">
                                Home Insurance in {stateName}
                            </h1>
                            <p className="text-slate-300 text-base sm:text-lg mb-6 max-w-xl" itemProp="description">
                                Protect your home and belongings with the right coverage.
                                Compare rates and save. Average premium: <strong className="text-white">{avgPremium}</strong>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="#compare" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2">
                                    Compare Rates <ChevronDown size={18} />
                                </Link>
                                <a href="tel:18552052412" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2 border border-white/20">
                                    <Phone size={18} /> Get Expert Help
                                </a>
                            </div>
                            {/* Trust Badges - Horizontal scroll on mobile */}
                            <div className="flex overflow-x-auto gap-4 mt-6 sm:mt-8 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible text-sm font-medium text-slate-300">
                                <div className="flex items-center gap-2 flex-shrink-0"><Shield className="text-blue-400 flex-shrink-0" size={18} /><span>Compare Top Insurers</span></div>
                                <div className="flex items-center gap-2 flex-shrink-0"><CheckCircle className="text-blue-400 flex-shrink-0" size={18} /><span>Free Quotes</span></div>
                                <div className="flex items-center gap-2 flex-shrink-0"><Shield className="text-blue-400 flex-shrink-0" size={18} /><span>No Hidden Fees</span></div>
                            </div>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <MarketCallCTA 
                                insuranceTypeId={insuranceTypeId} 
                                stateId={stateId}
                                insuranceTypeName={insuranceTypeName}
                                stateName={stateName}
                                className="max-w-sm w-full" 
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Answer Box */}
            <section className="py-8 sm:py-10 bg-slate-50 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <QuickAnswerBox
                            question="What does homeowners insurance cover?"
                            answer={`A standard HO-3 homeowners policy covers your dwelling, other structures (garage, shed), personal property (furniture, electronics), loss of use (temporary housing), personal liability (lawsuits), and medical payments. In ${stateName}, the average premium is ${avgPremium}. Note: Floods, earthquakes, and maintenance issues are typically NOT covered.`}
                            source="Insurance Information Institute"
                            sourceUrl="https://www.iii.org"
                        />
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <section className="py-8 sm:py-10 bg-blue-50 border-b border-blue-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Home size={20} className="text-blue-600" /> Key Takeaways
                            </h2>
                            <div className="flex items-center gap-2">
                                <LastUpdated date={lastUpdated} variant="badge" />
                                <CopyAsMarkdown title={pageTitle} keyTakeaways={keyTakeaways} content={introContent} source={pageUrl} />
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {keyTakeaways.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-slate-700 text-sm sm:text-base">
                                    <span className="text-blue-600 mt-1 flex-shrink-0">•</span>{item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-blue-200">
                            <AskAIButtons pageContent={introContent} pageTitle={pageTitle} pageUrl={pageUrl} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
                <div className="grid lg:grid-cols-4 gap-8 lg:gap-10">
                    {/* Table of Contents Sidebar - Hidden on mobile, sticky on desktop */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            <TableOfContents items={tocItems} />
                        </div>
                    </aside>

                    <main className="lg:col-span-3 space-y-10 sm:space-y-12 md:space-y-16">
                        {/* Flow Diagram */}
                        <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 lg:p-8">
                            <h2 className="text-lg sm:text-xl font-bold text-center text-slate-900 mb-6 sm:mb-8">How to Get Home Insurance</h2>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
                                {[
                                    { icon: Home, label: 'Enter Home Details' },
                                    { icon: Search, label: 'Get Property Value' },
                                    { icon: List, label: 'Compare Policies' },
                                    { icon: ShieldCheck, label: 'Protect Your Home' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 md:gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-2 shadow-lg">
                                                <item.icon size={22} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                            </div>
                                            <span className="text-xs sm:text-sm font-medium text-slate-700 text-center max-w-20 sm:max-w-24">{item.label}</span>
                                        </div>
                                        {i < 3 && (
                                            <div className="hidden md:block text-slate-400">
                                                <ArrowRight size={24} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Stats Cards - 2 cols on mobile, 4 on desktop */}
                        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div className="bg-white border rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <DollarSign size={20} className="mx-auto text-blue-600 mb-1 sm:mb-2" />
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{avgPremium}</p>
                                <p className="text-xs sm:text-sm text-slate-600">Avg. Premium</p>
                            </div>
                            <div className="bg-white border rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <FileWarning size={20} className="mx-auto text-blue-600 mb-1 sm:mb-2" />
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{avgClaim}</p>
                                <p className="text-xs sm:text-sm text-slate-600">Avg. Claim</p>
                            </div>
                            <div className="bg-white border rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <Flame size={20} className="mx-auto text-red-500 mb-1 sm:mb-2" />
                                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-slate-900">{disasterRisk}</p>
                                <p className="text-xs sm:text-sm text-slate-600">Disaster Risk</p>
                            </div>
                            <div className="bg-white border rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                <Star size={20} className="mx-auto text-amber-500 mb-1 sm:mb-2" />
                                <p className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 truncate px-1">{topInsurer}</p>
                                <p className="text-xs sm:text-sm text-slate-600">Top Insurer</p>
                            </div>
                        </section>

                        {/* What's Covered */}
                        <section id="coverage" aria-labelledby="coverage-heading" className="prose prose-slate max-w-none">
                            <h2 id="coverage-heading" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Home className="text-blue-600 flex-shrink-0" size={24} />
                                Understanding Home Insurance in {stateName}
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{introContent}</p>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-6 sm:mt-8 mb-3 sm:mb-4">Do I Need Home Insurance?</h3>
                            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{requirementsContent}</p>
                        </section>

                        {/* Coverage Types A-F - Responsive Grid */}
                        <section id="coverage-types" aria-labelledby="coverage-types-heading">
                            <h2 id="coverage-types-heading" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <Shield className="text-blue-600 flex-shrink-0" size={24} />
                                HO-3 Coverage Types Explained
                            </h2>
                            <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">A standard HO-3 policy includes six coverage types. Here&apos;s what each covers:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {coverageTypes.map((cov, i) => (
                                    <div key={i} className="bg-white border rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-base sm:text-lg font-bold text-blue-600">{cov.letter}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{cov.name}</h3>
                                                <p className="text-xs text-slate-500">Coverage {cov.letter}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-600 mb-2">{cov.description}</p>
                                        <p className="text-xs text-blue-600 font-medium">Typical: {cov.typical}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* What's NOT Covered */}
                        <section id="not-covered" aria-labelledby="not-covered-heading">
                            <h2 id="not-covered-heading" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
                                What&apos;s NOT Covered
                            </h2>
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                                <p className="text-slate-700 mb-4 text-sm sm:text-base">Standard homeowners insurance has important exclusions. You may need separate policies:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {[
                                        { name: 'Floods', desc: 'Requires separate NFIP or private flood insurance', icon: Droplets },
                                        { name: 'Earthquakes', desc: 'Requires separate earthquake policy or rider', icon: AlertTriangle },
                                        { name: 'Maintenance Issues', desc: 'Wear and tear, mold from neglect, pest damage', icon: Home },
                                        { name: 'Sewer Backups', desc: 'May need separate rider or endorsement', icon: Droplets },
                                        { name: 'High-Value Items', desc: 'Jewelry, art may need scheduled coverage', icon: DollarSign },
                                        { name: 'Business Property', desc: 'Home business equipment needs separate policy', icon: Home }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-3">
                                            <item.icon size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                                                <p className="text-xs text-slate-600">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Disaster Coverage Section - Responsive Grid */}
                        <section id="disasters" aria-labelledby="disasters-heading">
                            <h2 id="disasters-heading" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <CloudRain className="text-blue-600 flex-shrink-0" size={24} />
                                Disaster Coverage in {stateName}
                            </h2>
                            <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                {stateName} has specific disaster risks that may require additional coverage beyond a standard policy.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className={`border rounded-xl p-4 sm:p-5 ${floodZone ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Droplets size={20} className="text-blue-600 flex-shrink-0" />
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">Flood Insurance</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 mb-2">
                                        {floodZone
                                            ? 'Your area may be in a flood zone. Flood insurance is likely required by your lender and is highly recommended.'
                                            : 'While not required, flood insurance is recommended. Standard policies don\'t cover flood damage.'}
                                    </p>
                                    <p className="text-xs text-blue-700 font-medium">Available through NFIP or private insurers</p>
                                </div>

                                <div className={`border rounded-xl p-4 sm:p-5 ${hurricaneRisk ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Wind size={20} className="text-amber-600 flex-shrink-0" />
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">Hurricane/Wind</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 mb-2">
                                        {hurricaneRisk
                                            ? 'Hurricane coverage is important for your area. Note: separate wind/hurricane deductibles often apply.'
                                            : 'Wind damage is typically covered by standard policies. Coastal areas may have separate deductibles.'}
                                    </p>
                                    <p className="text-xs text-amber-700 font-medium">Check your policy&apos;s wind deductible</p>
                                </div>

                                <div className={`border rounded-xl p-4 sm:p-5 ${earthquakeRisk ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">Earthquake</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 mb-2">
                                        {earthquakeRisk
                                            ? 'Earthquake coverage is recommended in your area. Standard policies exclude earthquake damage.'
                                            : 'Earthquake risk is lower in your area, but separate coverage is available if desired.'}
                                    </p>
                                    <p className="text-xs text-amber-700 font-medium">Requires separate policy or endorsement</p>
                                </div>

                                <div className={`border rounded-xl p-4 sm:p-5 ${wildfireRisk ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Flame size={20} className="text-red-600 flex-shrink-0" />
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">Wildfire</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 mb-2">
                                        {wildfireRisk
                                            ? 'Wildfire risk is elevated in your area. Fire damage is covered, but high-risk areas may face coverage challenges.'
                                            : 'Fire damage is covered by standard policies. Keep brush cleared and maintain fire-resistant landscaping.'}
                                    </p>
                                    <p className="text-xs text-red-700 font-medium">Covered by standard HO-3 policies</p>
                                </div>
                            </div>
                        </section>

                        {/* Discounts - Stack on mobile */}
                        <section id="discounts" aria-labelledby="discounts-heading">
                            <h2 id="discounts-heading" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <Percent className="text-emerald-600 flex-shrink-0" size={24} />
                                Available Discounts in {stateName}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {discounts.map((discount, i) => (
                                    <div key={i} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-[10px] sm:text-xs font-bold flex-shrink-0 text-center leading-tight">
                                            {discount.savings}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{discount.name}</h4>
                                            <p className="text-xs sm:text-sm text-slate-600">{discount.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* CTA Banner */}
                        <CTABanner
                            title={`Protect Your Home in ${stateName}`}
                            subtitle="Compare rates from top insurers and find the coverage that fits your needs and budget."
                            accentColor="blue"
                            urgencyText="Get a free quote in minutes"
                        />

                        {/* Compare Providers - Full-width touchable cards */}
                        <section id="compare" aria-labelledby="compare-heading">
                            <h2 id="compare-heading" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 text-center">Compare Home Insurance Providers</h2>
                            <p className="text-slate-500 text-center mb-6 sm:mb-8 text-sm sm:text-base">Get quotes from trusted homeowners insurance carriers</p>
                            <div className="space-y-3 sm:space-y-4">
                                {affiliates.length > 0 ? affiliates.map((partner: any) => (
                                    <a key={partner.id} href={partner.affiliateUrl || '#'} target="_blank" rel="noopener noreferrer sponsored"
                                       className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-white rounded-xl border hover:shadow-lg hover:border-blue-300 transition-all group">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {partner.logo ? <img src={partner.logo} alt={partner.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" /> : <span className="text-xl sm:text-2xl font-bold text-slate-400">{partner.name[0]}</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 text-base sm:text-lg">{partner.name}</h3>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                                <span className="flex text-yellow-400 text-sm">★★★★★</span>
                                                <span className="text-xs sm:text-sm">{partner.description || 'Home insurance provider'}</span>
                                            </div>
                                        </div>
                                        <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium group-hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm">
                                            Get Quote <ExternalLink size={14} />
                                        </button>
                                    </a>
                                )) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl">
                                        <p className="text-slate-500 mb-2 text-sm sm:text-base">Compare home insurance to find the best coverage</p>
                                        <Link href="/get-quote" className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm sm:text-base">Get a personalized quote <ExternalLink size={14} /></Link>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Tips - Numbered items with better mobile spacing */}
                        <section id="tips" aria-labelledby="tips-heading">
                            <h2 id="tips-heading" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <DollarSign className="text-emerald-600 flex-shrink-0" size={24} />
                                Tips to Save on Home Insurance
                            </h2>
                            <div className="space-y-3">
                                {tipsContent.map((tip: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 bg-emerald-50 rounded-lg p-3 sm:p-4 border border-emerald-100">
                                        <span className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                                        <p className="text-slate-700 text-sm sm:text-base pt-0.5">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* NEW: AI-Generated SEO Sections */}

                        {/* Cost Breakdown Section */}
                        {aiCostBreakdown && aiCostBreakdown.length > 0 && (
                            <CostBreakdown
                                items={aiCostBreakdown}
                                title={`What Affects Your Home Insurance Rate in ${stateName}`}
                                description={`Understanding these factors can help you find better rates in ${stateName}`}
                                accentColor="blue"
                            />
                        )}

                        {/* Provider Comparison Section */}
                        {aiComparison && aiComparison.length > 0 && (
                            <ProviderComparison
                                items={aiComparison}
                                title={`Top Home Insurance Companies in ${stateName}`}
                                description="Compare the best insurance providers to find the right fit for your home"
                                accentColor="blue"
                            />
                        )}

                        {/* Discounts Section */}
                        {aiDiscounts && aiDiscounts.length > 0 && (
                            <DiscountsList
                                items={aiDiscounts}
                                title={`Home Insurance Discounts in ${stateName}`}
                                description="Save money by taking advantage of these available discounts"
                                accentColor="emerald"
                            />
                        )}

                        {/* Local Stats Section */}
                        {aiLocalStats && aiLocalStats.length > 0 && (
                            <LocalStats
                                items={aiLocalStats}
                                title={`${stateName} Home Insurance Statistics`}
                                description="Local data that affects your insurance rates"
                                accentColor="purple"
                            />
                        )}

                        {/* Coverage Guide Section */}
                        {aiCoverageGuide && aiCoverageGuide.length > 0 && (
                            <CoverageGuide
                                items={aiCoverageGuide}
                                title={`Home Insurance Coverage Types in ${stateName}`}
                                description="Understanding your coverage options helps you make informed decisions"
                                accentColor="blue"
                            />
                        )}

                        {/* Claims Process Section */}
                        {aiClaimsProcess && (
                            <ClaimsProcess
                                content={aiClaimsProcess}
                                title={`How to File a Home Insurance Claim in ${stateName}`}
                                description="Step-by-step guide to filing a claim"
                                accentColor="blue"
                            />
                        )}

                        {/* Buyers Guide Section */}
                        {aiBuyersGuide && (
                            <BuyersGuide
                                content={aiBuyersGuide}
                                title={`How to Buy Home Insurance in ${stateName}`}
                                description="A complete guide to finding the right coverage"
                                accentColor="emerald"
                            />
                        )}

                        {/* FAQ - Full width with touch-friendly accordion */}
                        <EnhancedFAQ items={faqItems} title={`Home Insurance FAQs for ${stateName}`} accentColor="blue" />

                        {/* Author */}
                        <AuthorByline authorName="Insurance Editorial Team" authorTitle="Licensed Property Insurance Experts" reviewerName="Michael Chen" reviewerTitle="Senior Home Insurance Analyst" />
                    </main>
                </div>
            </div>

            {/* Related Links - Responsive Grid */}
            {(relatedLinks?.nearbyCities?.length > 0 || relatedLinks?.otherNiches?.length > 0) && (
                <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8 sm:mb-12">
                            <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3 sm:mb-4">
                                Discover More Coverage Options
                            </span>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">Explore Related Insurance</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">Find the right coverage for your needs across different locations and insurance types</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                            {relatedLinks.nearbyCities?.length > 0 && (
                                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                                            <MapPin size={20} className="text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Nearby Cities</h3>
                                            <p className="text-xs text-slate-500">Coverage in your area</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-1">
                                        {relatedLinks.nearbyCities.slice(0, 8).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                                    <span className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
                                                        <ChevronRight size={12} className="text-slate-400 group-hover:text-blue-600" />
                                                    </span>
                                                    <span className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-blue-700 transition-colors truncate">{link.label}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {relatedLinks.otherNiches?.length > 0 && (
                                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                                            <Shield size={20} className="text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Other Insurance</h3>
                                            <p className="text-xs text-slate-500">Explore more coverage</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-1">
                                        {relatedLinks.otherNiches.slice(0, 6).map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                                    <span className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors text-slate-500 group-hover:text-blue-600 text-xs flex-shrink-0">
                                                        {getInsuranceIcon(link.iconSlug, "w-3 h-3 sm:w-4 sm:h-4")}
                                                    </span>
                                                    <span className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-blue-700 transition-colors truncate">{link.label}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {relatedLinks.parentLocations?.length > 0 && (
                                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-violet-200 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
                                            <Globe size={20} className="text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Browse More</h3>
                                            <p className="text-xs text-slate-500">Statewide coverage</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-1">
                                        {relatedLinks.parentLocations.map((link: any, i: number) => (
                                            <li key={i}>
                                                <Link href={link.href} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-violet-50 transition-colors">
                                                    <span className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-100 group-hover:bg-violet-100 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
                                                        <ChevronRight size={12} className="text-slate-400 group-hover:text-violet-600" />
                                                    </span>
                                                    <span className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-violet-700 transition-colors truncate">{link.label}</span>
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

            {/* Sticky Mobile CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 shadow-lg z-50 md:hidden">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <div className="flex items-center gap-2"><Phone size={18} /><span className="font-semibold text-sm">1-855-205-2412</span></div>
                    <a href="tel:18552052412" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm">Call Now</a>
                </div>
            </div>
        </article>
    );
}
