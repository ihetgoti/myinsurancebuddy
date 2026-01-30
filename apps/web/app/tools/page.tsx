import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Calculator, Shield, FileText, TrendingUp, Car, Home, Heart, DollarSign, PiggyBank, BarChart3, Target, Zap, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Insurance Tools & Calculators | MyInsuranceBuddies',
    description: 'Free insurance calculators and tools to estimate premiums, compare coverage options, and find potential savings on your policies.',
};

const mainTools = [
    {
        title: 'Insurance Premium Calculator',
        description: 'Calculate estimated premiums for auto, home, life, and health insurance based on your profile and coverage needs.',
        icon: <Calculator className="w-8 h-8" />,
        href: '/tools/insurance-calculator',
        color: 'blue',
        popular: true,
        features: ['Instant estimates', 'Multiple insurance types', 'Personalized results'],
    },
    {
        title: 'Coverage Needs Estimator',
        description: 'Determine how much coverage you actually need based on your assets, income, and risk profile.',
        icon: <Shield className="w-8 h-8" />,
        href: '/tools/coverage-estimator',
        color: 'emerald',
        popular: true,
        features: ['Asset-based calculation', 'Risk assessment', 'Expert recommendations'],
    },
    {
        title: 'Insurance Savings Finder',
        description: 'Discover potential discounts, bundling opportunities, and strategies to lower your insurance costs.',
        icon: <PiggyBank className="w-8 h-8" />,
        href: '/tools/savings-finder',
        color: 'amber',
        popular: false,
        features: ['Discount identification', 'Bundle analysis', 'Custom savings plan'],
    },
    {
        title: 'Policy Comparison Tool',
        description: 'Compare insurance policies side-by-side to understand coverage differences and find the best value.',
        icon: <BarChart3 className="w-8 h-8" />,
        href: '/tools/policy-comparison',
        color: 'purple',
        popular: false,
        features: ['Side-by-side comparison', 'Coverage breakdown', 'Value scoring'],
    },
];

const quickTools = [
    {
        title: 'Car Insurance Estimator',
        description: 'Get quick auto insurance estimates',
        icon: <Car className="w-6 h-6" />,
        href: '/car-insurance',
        color: 'blue',
    },
    {
        title: 'Home Insurance Estimator',
        description: 'Calculate home coverage costs',
        icon: <Home className="w-6 h-6" />,
        href: '/home-insurance',
        color: 'green',
    },
    {
        title: 'Life Insurance Calculator',
        description: 'Find your ideal coverage amount',
        icon: <Heart className="w-6 h-6" />,
        href: '/life-insurance',
        color: 'red',
    },
    {
        title: 'Deductible Analyzer',
        description: 'Find your optimal deductible',
        icon: <DollarSign className="w-6 h-6" />,
        href: '/guides/deductibles',
        color: 'purple',
    },
];

const colorClasses: Record<string, { bg: string; text: string; hover: string; light: string }> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', hover: 'hover:bg-blue-50', light: 'bg-blue-100' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', hover: 'hover:bg-emerald-50', light: 'bg-emerald-100' },
    amber: { bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-50', light: 'bg-amber-100' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', hover: 'hover:bg-purple-50', light: 'bg-purple-100' },
    green: { bg: 'bg-green-600', text: 'text-green-600', hover: 'hover:bg-green-50', light: 'bg-green-100' },
    red: { bg: 'bg-red-600', text: 'text-red-600', hover: 'hover:bg-red-50', light: 'bg-red-100' },
};

export default async function ToolsPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-slate-50">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-6">
                        <Calculator className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Insurance Tools & Calculators
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                        Free tools to help you estimate costs, compare coverage, and make smarter insurance decisions.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span>Instant Results</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-green-400" />
                            <span>Personalized Estimates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span>100% Free</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Tools Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Popular Calculators</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Our most-used tools to help you understand your insurance needs and potential costs.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-16">
                            {mainTools.map((tool) => {
                                const colors = colorClasses[tool.color];
                                return (
                                    <Link
                                        key={tool.title}
                                        href={tool.href}
                                        className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className={`p-4 ${colors.light} rounded-xl group-hover:scale-110 transition-transform`}>
                                                <div className={colors.text}>{tool.icon}</div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {tool.title}
                                                    </h3>
                                                    {tool.popular && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full tracking-wide">
                                                            Popular
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-slate-600 leading-relaxed mb-4">
                                                    {tool.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {tool.features.map((feature, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Tools Section */}
            <section className="py-16 bg-white border-y border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Estimators</h2>
                            <p className="text-slate-600">Get fast estimates for specific insurance types.</p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4">
                            {quickTools.map((tool) => {
                                const colors = colorClasses[tool.color];
                                return (
                                    <Link
                                        key={tool.title}
                                        href={tool.href}
                                        className="group bg-slate-50 p-6 rounded-xl hover:bg-white hover:shadow-lg border border-transparent hover:border-slate-200 transition-all"
                                    >
                                        <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <div className={colors.text}>{tool.icon}</div>
                                        </div>
                                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {tool.title}
                                        </h3>
                                        <p className="text-sm text-slate-500">{tool.description}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">How Our Tools Work</h2>
                            <p className="text-slate-600">Simple, accurate, and designed to help you make better decisions.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-blue-600">1</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Enter Your Info</h3>
                                <p className="text-sm text-slate-600">
                                    Provide basic details about yourself and what you want to insure. Takes less than 2 minutes.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-blue-600">2</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Get Instant Results</h3>
                                <p className="text-sm text-slate-600">
                                    Our algorithms calculate estimates based on industry data and your specific profile.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-blue-600">3</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Compare & Decide</h3>
                                <p className="text-sm text-slate-600">
                                    Use your estimates to compare options and get real quotes when you're ready.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="py-8 bg-slate-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-xs text-slate-500 leading-relaxed">
                            <strong>Disclaimer:</strong> The calculators and tools provided are for informational and educational purposes only.
                            Results are estimates based on the information you provide and may not reflect actual insurance rates.
                            For accurate quotes, please request a personalized quote from our licensed insurance partners.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to See Real Rates?</h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                        Calculators provide estimates, but real quotes show you what you'll actually pay.
                        Compare rates from 120+ insurance companies in minutes.
                    </p>
                    <Link
                        href="/get-quote"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                    >
                        Get Real Quotes Now
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
