'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { Search, BookOpen, Car, Home, Heart, Stethoscope, Building2, ChevronRight } from 'lucide-react';

const glossaryTerms = [
    // A
    { term: 'Actual Cash Value (ACV)', definition: 'The value of your property at the time of loss, calculated as replacement cost minus depreciation. Used to determine claim payouts.', category: 'General' },
    { term: 'Adjuster', definition: 'An insurance professional who investigates claims, assesses damage, and determines the appropriate payout amount on behalf of the insurance company.', category: 'General' },
    { term: 'Agent', definition: 'A licensed professional who sells insurance policies and provides guidance on coverage options. Can be independent (representing multiple insurers) or captive (representing one company).', category: 'General' },

    // B
    { term: 'Beneficiary', definition: 'The person or entity designated to receive the death benefit from a life insurance policy when the insured person passes away.', category: 'Life' },
    { term: 'Binder', definition: 'A temporary agreement that provides insurance coverage until the formal policy is issued. Commonly used in auto and home insurance.', category: 'General' },
    { term: 'Bodily Injury Liability', definition: 'Auto insurance coverage that pays for injuries you cause to others in an accident, including medical expenses, lost wages, and legal fees.', category: 'Auto' },

    // C
    { term: 'Claim', definition: 'A formal request to your insurance company for coverage or compensation for a covered loss or damage.', category: 'General' },
    { term: 'Coinsurance', definition: 'Your share of the costs of a covered service, calculated as a percentage (e.g., 20%) of the allowed amount after you meet your deductible.', category: 'Health' },
    { term: 'Collision Coverage', definition: 'Auto insurance that pays for damage to your vehicle from a collision with another vehicle or object, regardless of who is at fault.', category: 'Auto' },
    { term: 'Comprehensive Coverage', definition: 'Auto insurance that covers damage to your vehicle from non-collision events such as theft, vandalism, fire, natural disasters, or animal strikes.', category: 'Auto' },
    { term: 'Copay (Copayment)', definition: 'A fixed amount you pay for a covered health care service at the time you receive the service (e.g., $25 for a doctor visit).', category: 'Health' },
    { term: 'Coverage Limit', definition: 'The maximum amount your insurance company will pay for a covered claim. Can be per incident, per person, or aggregate.', category: 'General' },

    // D
    { term: 'Declarations Page', definition: 'The first page of your insurance policy summarizing your coverage, limits, deductibles, premium, and policy period.', category: 'General' },
    { term: 'Deductible', definition: 'The amount you pay out of pocket before your insurance coverage kicks in. Higher deductibles typically mean lower premiums.', category: 'General' },
    { term: 'Depreciation', definition: 'The decrease in value of property over time due to age, wear, and tear. Used in calculating actual cash value payouts.', category: 'General' },
    { term: 'Dwelling Coverage', definition: 'Home insurance coverage that pays to repair or rebuild your home if it is damaged by a covered peril like fire, wind, or hail.', category: 'Home' },

    // E
    { term: 'Endorsement', definition: 'A written amendment to your insurance policy that adds, removes, or modifies coverage. Also called a rider or floater.', category: 'General' },
    { term: 'Exclusion', definition: 'Specific conditions, circumstances, or types of damage that are not covered by your insurance policy.', category: 'General' },

    // F
    { term: 'Filing', definition: 'A document (like SR-22) that proves you have the required minimum insurance coverage, often required after serious driving violations.', category: 'Auto' },
    { term: 'Floater', definition: 'Additional coverage for valuable items (jewelry, art, electronics) that exceed standard policy limits.', category: 'Home' },

    // G
    { term: 'Grace Period', definition: 'A set time after your premium due date during which you can make a payment without losing coverage or incurring penalties.', category: 'General' },
    { term: 'Guaranteed Renewal', definition: 'A policy provision ensuring the insurer cannot cancel your coverage as long as you pay premiums on time.', category: 'Health' },

    // H
    { term: 'HO-3 Policy', definition: 'The most common type of homeowners insurance, providing open-peril coverage for the dwelling and named-peril coverage for personal property.', category: 'Home' },

    // I
    { term: 'Indemnity', definition: 'The principle of restoring the insured to the same financial position they were in before the loss occurred, without profiting from the claim.', category: 'General' },
    { term: 'Insured', definition: 'The person or entity protected by an insurance policy. Also called the policyholder.', category: 'General' },

    // L
    { term: 'Liability Coverage', definition: 'Insurance that pays for damage or injuries you cause to others. Required in most states for auto insurance.', category: 'Auto' },
    { term: 'Loss of Use', definition: 'Coverage that pays for additional living expenses if your home becomes uninhabitable due to a covered loss.', category: 'Home' },

    // M
    { term: 'Medical Payments Coverage', definition: 'Coverage that pays for medical expenses for you and your passengers regardless of fault in an auto accident.', category: 'Auto' },

    // N
    { term: 'Named Perils', definition: 'A policy that only covers losses from specific causes listed in the policy (e.g., fire, theft, windstorm).', category: 'General' },
    { term: 'No-Fault Insurance', definition: 'Auto insurance system where your own insurer pays for your injuries regardless of who caused the accident. Required in some states.', category: 'Auto' },

    // O
    { term: 'Out-of-Pocket Maximum', definition: 'The most you have to pay for covered health services in a year. After reaching this limit, insurance pays 100% of covered services.', category: 'Health' },

    // P
    { term: 'Personal Injury Protection (PIP)', definition: 'Auto coverage that pays for medical expenses, lost wages, and other costs regardless of fault. Required in no-fault states.', category: 'Auto' },
    { term: 'Personal Property Coverage', definition: 'Home insurance that covers your belongings (furniture, clothing, electronics) if damaged, destroyed, or stolen.', category: 'Home' },
    { term: 'Policy', definition: 'The written contract between you and the insurance company detailing coverage, terms, conditions, and exclusions.', category: 'General' },
    { term: 'Policy Limit', definition: 'The maximum amount your insurance company will pay for a single claim or all claims during the policy period.', category: 'General' },
    { term: 'Premium', definition: 'The amount you pay for your insurance policy, typically on a monthly, quarterly, or annual basis.', category: 'General' },
    { term: 'Property Damage Liability', definition: 'Auto insurance that pays for damage you cause to another person\'s property (vehicle, fence, building) in an accident.', category: 'Auto' },

    // R
    { term: 'Replacement Cost', definition: 'Coverage that pays to replace damaged property with new items of similar kind and quality, without deducting for depreciation.', category: 'General' },
    { term: 'Rider', definition: 'An add-on to your insurance policy that provides additional coverage or benefits beyond the standard policy.', category: 'General' },

    // S
    { term: 'SR-22', definition: 'A certificate of financial responsibility filed with the state proving you have minimum required auto insurance. Often required after DUI or driving without insurance.', category: 'Auto' },
    { term: 'Subrogation', definition: 'The process where your insurance company seeks reimbursement from the at-fault party after paying your claim.', category: 'General' },

    // T
    { term: 'Term Life Insurance', definition: 'Life insurance that provides coverage for a specific period (10, 20, or 30 years). If you die during the term, beneficiaries receive the death benefit.', category: 'Life' },
    { term: 'Total Loss', definition: 'When damage to your vehicle or property exceeds its actual cash value, making it more economical to replace than repair.', category: 'Auto' },

    // U
    { term: 'Umbrella Insurance', definition: 'Extra liability coverage that kicks in when you exceed the limits of your auto, home, or other policies. Provides broader protection.', category: 'General' },
    { term: 'Underinsured Motorist Coverage', definition: 'Coverage that pays when the at-fault driver has insurance, but not enough to cover all your damages.', category: 'Auto' },
    { term: 'Underwriting', definition: 'The process insurers use to evaluate risk, determine eligibility, and set your premium based on factors like age, health, driving record, etc.', category: 'General' },
    { term: 'Uninsured Motorist Coverage', definition: 'Coverage that pays for your injuries and damages when hit by a driver who has no insurance.', category: 'Auto' },

    // W
    { term: 'Waiting Period', definition: 'The time between when coverage begins and when certain benefits become available. Common in health and disability insurance.', category: 'Health' },
    { term: 'Whole Life Insurance', definition: 'Permanent life insurance that covers you for your entire life and includes a cash value component that grows over time.', category: 'Life' },
];

const categories = [
    { name: 'All', icon: BookOpen, color: 'blue' },
    { name: 'Auto', icon: Car, color: 'cyan' },
    { name: 'Home', icon: Home, color: 'orange' },
    { name: 'Health', icon: Stethoscope, color: 'emerald' },
    { name: 'Life', icon: Heart, color: 'rose' },
    { name: 'General', icon: Building2, color: 'slate' },
];

export default function GlossaryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredTerms = glossaryTerms
        .filter(item => {
            const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.definition.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => a.term.localeCompare(b.term));

    // Group terms by first letter
    const groupedTerms = filteredTerms.reduce((acc, term) => {
        const letter = term.term[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(term);
        return acc;
    }, {} as Record<string, typeof glossaryTerms>);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <div className="min-h-screen bg-slate-50">
            <Header insuranceTypes={[]} states={[]} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        <BookOpen className="w-4 h-4" />
                        50+ Insurance Terms Explained
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Insurance Glossary
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Understanding insurance terminology is the first step to making informed decisions.
                        Browse our comprehensive glossary of terms.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for a term..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="bg-white border-b border-slate-200 sticky top-16 z-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 py-4 overflow-x-auto">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = selectedCategory === cat.name;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Alphabet Navigation */}
            <section className="bg-slate-100 py-3">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {alphabet.map((letter) => {
                            const hasTerms = groupedTerms[letter]?.length > 0;
                            return (
                                <a
                                    key={letter}
                                    href={hasTerms ? `#letter-${letter}` : undefined}
                                    className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold transition-colors ${
                                        hasTerms
                                            ? 'text-slate-700 hover:bg-blue-600 hover:text-white'
                                            : 'text-slate-300 cursor-not-allowed'
                                    }`}
                                >
                                    {letter}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Terms List */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {filteredTerms.length === 0 ? (
                        <div className="text-center py-16">
                            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No terms found</h3>
                            <p className="text-slate-500">Try adjusting your search or category filter</p>
                        </div>
                    ) : (
                        Object.keys(groupedTerms).sort().map((letter) => (
                            <div key={letter} id={`letter-${letter}`} className="mb-8 scroll-mt-40">
                                <div className="sticky top-32 bg-slate-50 py-2 z-10">
                                    <h2 className="text-2xl font-bold text-blue-600">{letter}</h2>
                                </div>
                                <div className="space-y-4 mt-4">
                                    {groupedTerms[letter].map((item) => (
                                        <div
                                            key={item.term}
                                            className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                            {item.term}
                                                        </h3>
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                            item.category === 'Auto' ? 'bg-cyan-100 text-cyan-700' :
                                                            item.category === 'Home' ? 'bg-orange-100 text-orange-700' :
                                                            item.category === 'Health' ? 'bg-emerald-100 text-emerald-700' :
                                                            item.category === 'Life' ? 'bg-rose-100 text-rose-700' :
                                                            'bg-slate-100 text-slate-700'
                                                        }`}>
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 leading-relaxed">{item.definition}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
                    <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                        Our licensed insurance experts are here to help explain any terms and find the right coverage for you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
                        >
                            Contact an Expert
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/get-quote"
                            className="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-400 transition-colors"
                        >
                            Get Free Quotes
                        </Link>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}
