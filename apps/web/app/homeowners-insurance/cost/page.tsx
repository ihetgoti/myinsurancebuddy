import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DollarSign, TrendingDown, Home, MapPin, ArrowRight, Calculator, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Homeowners Insurance Cost 2024 | Average Rates by State',
  description: 'Learn about average homeowners insurance costs in 2024. See rates by state, factors that affect pricing, and tips to lower your premium.',
  keywords: 'homeowners insurance cost, average home insurance rates, home insurance prices, home insurance by state, lower home insurance cost',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

const stateRates = [
  { state: 'Hawaii', avgAnnual: '$499', avgMonthly: '$42', note: 'Lowest rates' },
  { state: 'Vermont', avgAnnual: '$750', avgMonthly: '$63', note: '' },
  { state: 'Utah', avgAnnual: '$802', avgMonthly: '$67', note: '' },
  { state: 'Delaware', avgAnnual: '$838', avgMonthly: '$70', note: '' },
  { state: 'Nevada', avgAnnual: '$872', avgMonthly: '$73', note: '' },
  { state: 'Wisconsin', avgAnnual: '$986', avgMonthly: '$82', note: 'Near average' },
  { state: 'Arizona', avgAnnual: '$1,054', avgMonthly: '$88', note: '' },
  { state: 'Illinois', avgAnnual: '$1,236', avgMonthly: '$103', note: '' },
  { state: 'Texas', avgAnnual: '$1,967', avgMonthly: '$164', note: 'High storm risk' },
  { state: 'Florida', avgAnnual: '$2,219', avgMonthly: '$185', note: 'Highest rates' },
];

const costFactors = [
  {
    title: 'Location',
    icon: MapPin,
    description: 'Your state and ZIP code significantly impact rates due to weather risks, crime rates, and local building costs.',
    impact: 'High Impact',
  },
  {
    title: 'Home Value',
    icon: Home,
    description: 'Higher-value homes cost more to insure because replacement costs are greater.',
    impact: 'High Impact',
  },
  {
    title: 'Deductible',
    icon: DollarSign,
    description: 'Higher deductibles mean lower premiums, but more out-of-pocket costs when you file a claim.',
    impact: 'Medium Impact',
  },
  {
    title: 'Credit Score',
    icon: Shield,
    description: 'In most states, better credit scores lead to lower insurance rates.',
    impact: 'Medium Impact',
  },
];

const moneySavingTips = [
  {
    title: 'Bundle Your Policies',
    desc: 'Combine home and auto insurance for discounts up to 25%.',
    savings: 'Save 10-25%',
  },
  {
    title: 'Raise Your Deductible',
    desc: 'Increasing from $500 to $1,000 can lower premiums significantly.',
    savings: 'Save 15-20%',
  },
  {
    title: 'Improve Home Security',
    desc: 'Install smoke detectors, security systems, and deadbolts.',
    savings: 'Save 5-15%',
  },
  {
    title: 'Maintain Good Credit',
    desc: 'Pay bills on time and reduce debt to improve your insurance score.',
    savings: 'Save 10-20%',
  },
  {
    title: 'Shop Around Annually',
    desc: 'Compare quotes from multiple companies every year.',
    savings: 'Save $500+',
  },
  {
    title: 'Ask About Discounts',
    desc: 'Claim-free, new home, and loyalty discounts can add up.',
    savings: 'Save 5-20%',
  },
];

export default async function HomeownersInsuranceCostPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              2024 Pricing Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Homeowners Insurance Cost
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              The average homeowners insurance costs $1,500/year nationally. 
              See rates by state and learn how to lower your premium.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-quote"
                className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
              >
                Get Your Custom Quote
              </Link>
              <Link
                href="/tools/insurance-calculator"
                className="inline-block bg-blue-500/30 text-white border border-blue-400/30 px-8 py-4 rounded-xl font-bold hover:bg-blue-500/40 transition"
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Cost Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* National Average */}
      <section className="py-12 sm:py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">$1,500</div>
                <p className="text-slate-600 font-medium">Average Annual Cost</p>
                <p className="text-xs text-slate-500 mt-1">National average for $250k dwelling</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">$125</div>
                <p className="text-slate-600 font-medium">Average Monthly</p>
                <p className="text-xs text-slate-500 mt-1">Spread over 12 months</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl sm:text-5xl font-bold text-emerald-600 mb-2">25%</div>
                <p className="text-slate-600 font-medium">Potential Savings</p>
                <p className="text-xs text-slate-500 mt-1">With discounts & shopping</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rates by State */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">Average Cost by State</h2>
            <p className="text-slate-600 text-center mb-8">Home insurance rates vary significantly based on location and local risks</p>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-4 px-4 sm:px-6 font-semibold text-slate-900">State</th>
                      <th className="text-center py-4 px-4 sm:px-6 font-semibold text-slate-900">Annual</th>
                      <th className="text-center py-4 px-4 sm:px-6 font-semibold text-slate-900">Monthly</th>
                      <th className="text-left py-4 px-4 sm:px-6 font-semibold text-slate-900 hidden sm:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stateRates.map((rate, index) => (
                      <tr key={rate.state} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="py-4 px-4 sm:px-6 font-medium text-slate-900">{rate.state}</td>
                        <td className="py-4 px-4 sm:px-6 text-center font-bold text-slate-900">{rate.avgAnnual}</td>
                        <td className="py-4 px-4 sm:px-6 text-center text-slate-600">{rate.avgMonthly}</td>
                        <td className="py-4 px-4 sm:px-6 text-slate-500 text-sm hidden sm:table-cell">{rate.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link href="/states" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-2">
                View All 50 States <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Factors */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">What Affects Your Premium?</h2>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">Several factors determine how much you&apos;ll pay for homeowners insurance</p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {costFactors.map((factor) => (
              <div key={factor.title} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <factor.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-slate-900">{factor.title}</h3>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        {factor.impact}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{factor.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Money Saving Tips */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">How to Lower Your Premium</h2>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">Proven strategies to reduce your homeowners insurance cost</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {moneySavingTips.map((tip) => (
              <div key={tip.title} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-bold text-sm">{tip.savings}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{tip.title}</h3>
                <p className="text-slate-600 text-sm">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Get Your Exact Cost</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Rates vary based on your specific home and location. Get a personalized quote in minutes.
          </p>
          <Link
            href="/get-quote"
            className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
          >
            Get Your Free Quote
          </Link>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
