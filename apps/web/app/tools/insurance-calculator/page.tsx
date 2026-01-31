import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import { Calculator, Shield, TrendingDown, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Insurance Calculator - Estimate Your Rates',
    description: 'Use our free insurance calculators to estimate your monthly premiums for car, home, life, health, pet, and business insurance. Get instant results in under 2 minutes.',
    keywords: ['insurance calculator', 'auto insurance estimate', 'home insurance calculator', 'life insurance calculator', 'health insurance estimate', 'free insurance quote'],
};

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        }),
        prisma.state.findMany({
            where: { isActive: true },
            include: { country: true },
            orderBy: { name: 'asc' },
            take: 12,
        }),
    ]);
    return { insuranceTypes, states };
}

export default async function CalculatorPage() {
    const { insuranceTypes, states } = await getData();

    // Schema.org for the calculator
    const calculatorSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Insurance Calculator',
        url: 'https://myinsurancebuddies.com/tools/insurance-calculator',
        description: 'Free insurance calculator to estimate monthly premiums based on your profile.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        }
    };

    const benefits = [
        {
            icon: Clock,
            title: 'Quick Estimate',
            description: 'Get results in just 2 minutes',
            color: 'blue',
        },
        {
            icon: Shield,
            title: 'No Personal Info',
            description: 'Completely anonymous calculations',
            color: 'green',
        },
        {
            icon: TrendingDown,
            title: 'Compare Options',
            description: 'See different coverage levels',
            color: 'purple',
        },
    ];

    const features = [
        'Car Insurance Estimates',
        'Home Insurance Calculator',
        'Life Insurance Quotes',
        'Health Insurance Estimates',
        'Pet Insurance Calculator',
        'Business Insurance Quotes',
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/40 border border-green-700 mb-4 sm:mb-6">
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                            <span className="text-xs sm:text-sm font-medium text-green-300 uppercase tracking-wider">Free Tool</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                            Insurance Calculator
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto px-2 sm:px-0">
                            Estimate your monthly premiums for car, home, life, health, pet, or business insurance in under 2 minutes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Bar */}
            <section className="py-6 sm:py-8 bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-slate-50">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    benefit.color === 'blue' ? 'bg-blue-100' :
                                    benefit.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                                }`}>
                                    <benefit.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                        benefit.color === 'blue' ? 'text-blue-600' :
                                        benefit.color === 'green' ? 'text-green-600' : 'text-purple-600'
                                    }`} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm sm:text-base">{benefit.title}</p>
                                    <p className="text-xs sm:text-sm text-slate-500">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <InsuranceCalculator />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-slate-900 mb-8 sm:mb-12">
                            Calculate Any Type of Insurance
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 sm:p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm font-medium text-slate-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-slate-900 mb-8 sm:mb-12">
                            How Our Calculator Works
                        </h2>

                        <div className="prose prose-slate max-w-none">
                            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 border border-slate-200">
                                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                                    Our insurance calculator uses industry-standard rating factors to estimate your monthly premium:
                                </p>
                                <ul className="space-y-3 sm:space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                                        <div>
                                            <strong className="text-slate-900 text-sm sm:text-base">Age:</strong>
                                            <span className="text-slate-600 text-sm sm:text-base"> Drivers under 25 typically pay higher rates due to less experience.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                                        <div>
                                            <strong className="text-slate-900 text-sm sm:text-base">Vehicle/Property:</strong>
                                            <span className="text-slate-600 text-sm sm:text-base"> Newer, more expensive items cost more to insure.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                                        <div>
                                            <strong className="text-slate-900 text-sm sm:text-base">Driving/Claim Record:</strong>
                                            <span className="text-slate-600 text-sm sm:text-base"> Clean records qualify for significant discounts.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                                        <div>
                                            <strong className="text-slate-900 text-sm sm:text-base">Coverage Level:</strong>
                                            <span className="text-slate-600 text-sm sm:text-base"> Higher deductibles lower your monthly payment.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">5</span>
                                        <div>
                                            <strong className="text-slate-900 text-sm sm:text-base">Location:</strong>
                                            <span className="text-slate-600 text-sm sm:text-base"> Rates vary by state and city based on local factors.</span>
                                        </div>
                                    </li>
                                </ul>
                                <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-xs sm:text-sm text-amber-800">
                                        <strong>Disclaimer:</strong> This calculator provides estimates only. Actual insurance rates are determined by individual carriers using many additional factors including credit history, specific details, claims history, and more. Always get quotes from multiple insurers for accurate pricing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
