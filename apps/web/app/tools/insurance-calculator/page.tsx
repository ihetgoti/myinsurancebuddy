import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import { Calculator, Shield, TrendingDown, Clock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Insurance Calculator - Estimate Your Rates',
    description: 'Use our free insurance calculators to estimate your monthly premiums for car, home, life, health, pet, and business insurance. Get instant results.',
    keywords: ['insurance calculator', 'auto insurance estimate', 'home insurance calculator', 'life insurance calculator', 'health insurance estimate'],
};

export const dynamic = 'force-dynamic'; // Prevent build-time static generation

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
        name: 'Car Insurance Calculator',
        url: 'https://myinsurancebuddies.com/tools/insurance-calculator',
        description: 'Free car insurance calculator to estimate monthly premiums based on your profile.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
            />

            {/* Hero */}
            <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/40 border border-green-700 mb-6">
                            <Calculator className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-medium text-green-300 uppercase tracking-wider">Free Tool</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Insurance Calculator
                        </h1>
                        <p className="text-lg text-slate-300">
                            Estimate your monthly premiums for car, home, life, health, pet, or business insurance in under 2 minutes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-8 bg-white border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Quick Estimate</p>
                                <p className="text-sm text-slate-500">Results in 2 minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">No Personal Info</p>
                                <p className="text-sm text-slate-500">Completely anonymous</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <TrendingDown className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Compare Options</p>
                                <p className="text-sm text-slate-500">See different coverage levels</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calculator */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <InsuranceCalculator />
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">How Our Calculator Works</h2>

                    <div className="max-w-3xl mx-auto prose prose-slate">
                        <p>
                            Our car insurance calculator uses industry-standard rating factors to estimate your monthly premium:
                        </p>
                        <ul>
                            <li><strong>Age:</strong> Drivers under 25 typically pay higher rates due to less experience.</li>
                            <li><strong>Vehicle:</strong> Newer, more expensive vehicles cost more to insure.</li>
                            <li><strong>Driving Record:</strong> Clean records qualify for significant discounts.</li>
                            <li><strong>Deductible:</strong> Higher deductibles lower your monthly payment.</li>
                            <li><strong>Location:</strong> Rates vary by state and city based on local factors.</li>
                        </ul>
                        <p className="text-sm text-slate-500">
                            <strong>Disclaimer:</strong> This calculator provides estimates only. Actual insurance rates are determined by
                            individual carriers using many additional factors including credit history, specific vehicle make/model,
                            claims history, and more. Always get quotes from multiple insurers for accurate pricing.
                        </p>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
