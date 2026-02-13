import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Home, Calculator, Shield, CheckCircle, ArrowRight, AlertTriangle, Wallet } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'How Much Home Insurance Do I Need? | Coverage Calculator Guide',
  description: 'Learn how much homeowners insurance you need. Calculate dwelling coverage, personal property limits, and liability protection for your home.',
  keywords: 'how much home insurance do i need, homeowners insurance coverage, dwelling coverage calculator, home insurance limits, liability coverage',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

const coverageTypes = [
  {
    title: 'Dwelling Coverage',
    key: 'dwelling',
    description: 'Covers the physical structure of your home including attached structures.',
    rule: 'Cost to rebuild (not market value)',
    example: '$250,000 - $500,000',
    minRecommended: '100% of rebuild cost',
  },
  {
    title: 'Personal Property',
    key: 'personal-property',
    description: 'Covers your belongings like furniture, clothing, and electronics.',
    rule: '50-70% of dwelling coverage',
    example: '$125,000 - $350,000',
    minRecommended: 'Create a home inventory',
  },
  {
    title: 'Liability Protection',
    key: 'liability',
    description: 'Protects if someone is injured on your property and sues you.',
    rule: 'At least your net worth',
    example: '$300,000 - $500,000',
    minRecommended: '$300,000 minimum',
  },
  {
    title: 'Additional Living Expenses',
    key: 'ale',
    description: 'Pays for temporary housing if your home is uninhabitable.',
    rule: '20% of dwelling coverage',
    example: '$50,000 - $100,000',
    minRecommended: '12-24 months coverage',
  },
  {
    title: 'Other Structures',
    key: 'other-structures',
    description: 'Covers detached structures like garages, sheds, and fences.',
    rule: '10% of dwelling coverage',
    example: '$25,000 - $50,000',
    minRecommended: 'Based on structures owned',
  },
  {
    title: 'Medical Payments',
    key: 'medical',
    description: 'Covers minor injuries to guests regardless of fault.',
    rule: 'Small coverage amount',
    example: '$1,000 - $5,000',
    minRecommended: '$1,000 - $5,000',
  },
];

const homeValueExamples = [
  {
    homeValue: '$200,000',
    dwelling: '$200,000',
    personalProperty: '$100,000',
    liability: '$300,000',
    otherStructures: '$20,000',
    ale: '$40,000',
    estimatedPremium: '$800-1,200/year',
  },
  {
    homeValue: '$350,000',
    dwelling: '$350,000',
    personalProperty: '$175,000',
    liability: '$300,000',
    otherStructures: '$35,000',
    ale: '$70,000',
    estimatedPremium: '$1,200-1,800/year',
  },
  {
    homeValue: '$500,000',
    dwelling: '$500,000',
    personalProperty: '$250,000',
    liability: '$500,000',
    otherStructures: '$50,000',
    ale: '$100,000',
    estimatedPremium: '$1,800-2,500/year',
  },
  {
    homeValue: '$750,000',
    dwelling: '$750,000',
    personalProperty: '$375,000',
    liability: '$500,000',
    otherStructures: '$75,000',
    ale: '$150,000',
    estimatedPremium: '$2,500-3,500/year',
  },
];

const additionalCoverages = [
  {
    title: 'Flood Insurance',
    description: 'Standard policies don\'t cover flood damage. Required in flood zones.',
    recommended: 'If in flood-prone area',
    cost: '$700-1,500/year',
  },
  {
    title: 'Earthquake Insurance',
    description: 'Separate coverage for earthquake damage in high-risk areas.',
    recommended: 'CA, WA, OR, AK residents',
    cost: '$800-5,000/year',
  },
  {
    title: 'Umbrella Policy',
    description: 'Extra liability coverage beyond your home and auto policies.',
    recommended: 'If assets exceed $500k',
    cost: '$200-400/year',
  },
  {
    title: 'Scheduled Personal Property',
    description: 'Additional coverage for high-value items like jewelry and art.',
    recommended: 'For items over $1,000',
    cost: '1-2% of item value/year',
  },
];

export default async function HowMuchHomeInsurancePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" />
              Coverage Calculator
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              How Much Home Insurance Do You Need?
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Learn the right coverage amounts for your dwelling, belongings, and liability. 
              Get personalized recommendations for your situation.
            </p>
            <Link
              href="/get-quote"
              className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
            >
              Get Your Coverage Recommendation
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Answer */}
      <section className="py-12 sm:py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-blue-100">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Home className="w-6 h-6 text-blue-600" />
              Quick Answer
            </h2>
            <div className="space-y-4 text-slate-700">
              <p>
                <strong className="text-slate-900">Dwelling coverage:</strong> Should equal the cost to completely rebuild your home (not the market value).
              </p>
              <p>
                <strong className="text-slate-900">Personal property:</strong> Typically 50-70% of your dwelling coverage amount.
              </p>
              <p>
                <strong className="text-slate-900">Liability:</strong> At least $300,000, or enough to cover your net worth.
              </p>
            </div>
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Home value and rebuild cost are different. Rebuild cost is often lower than market value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Breakdown */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">Understanding Coverage Types</h2>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">Each part of your policy serves a specific purpose</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {coverageTypes.map((coverage) => (
              <div key={coverage.key} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{coverage.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{coverage.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rule of thumb:</span>
                    <span className="font-medium text-slate-700">{coverage.rule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Example:</span>
                    <span className="font-medium text-slate-700">{coverage.example}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Minimum:</span>
                    <span className="font-medium text-green-700">{coverage.minRecommended}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Examples by Home Value */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">Coverage Examples by Home Value</h2>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">See typical coverage amounts based on different home values</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] bg-white rounded-2xl overflow-hidden shadow-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left py-4 px-4 sm:px-6 font-semibold">Home Value</th>
                  <th className="text-center py-4 px-4 sm:px-6 font-semibold">Dwelling</th>
                  <th className="text-center py-4 px-4 sm:px-6 font-semibold">Personal Property</th>
                  <th className="text-center py-4 px-4 sm:px-6 font-semibold">Liability</th>
                  <th className="text-center py-4 px-4 sm:px-6 font-semibold">Est. Premium</th>
                </tr>
              </thead>
              <tbody>
                {homeValueExamples.map((example, index) => (
                  <tr key={example.homeValue} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">{example.homeValue}</td>
                    <td className="py-4 px-4 sm:px-6 text-center text-slate-700">{example.dwelling}</td>
                    <td className="py-4 px-4 sm:px-6 text-center text-slate-700">{example.personalProperty}</td>
                    <td className="py-4 px-4 sm:px-6 text-center text-slate-700">{example.liability}</td>
                    <td className="py-4 px-4 sm:px-6 text-center font-medium text-green-700">{example.estimatedPremium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Additional Coverages */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">Additional Coverage to Consider</h2>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">Standard policies don&apos;t cover everything. Consider these add-ons:</p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {additionalCoverages.map((coverage) => (
              <div key={coverage.title} className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900">{coverage.title}</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">{coverage.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Recommended:</span>
                  <span className="font-medium text-slate-700">{coverage.recommended}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-slate-500">Typical cost:</span>
                  <span className="font-medium text-green-700">{coverage.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-12 sm:py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8">Home Insurance Coverage Checklist</h2>
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Calculate rebuild cost (not market value)',
                  'Create a home inventory of belongings',
                  'Assess your total assets for liability needs',
                  'Consider high-value items needing extra coverage',
                  'Evaluate natural disaster risks in your area',
                  'Check if you need flood or earthquake insurance',
                  'Review coverage limits annually',
                  'Compare quotes from multiple insurers',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Get the Right Coverage</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Speak with a licensed agent who can help you determine the exact coverage amounts you need.
          </p>
          <Link
            href="/get-quote"
            className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
          >
            Get Personalized Recommendation
          </Link>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
