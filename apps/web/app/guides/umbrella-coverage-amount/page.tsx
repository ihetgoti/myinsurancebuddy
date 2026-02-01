import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Umbrella, ArrowRight, CheckCircle, Shield, AlertTriangle,
  DollarSign, TrendingUp, Calculator, Scale, Wallet, 
  Home, Car, Activity, Clock, FileText
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'How Much Umbrella Insurance Coverage Do You Need? | MyInsuranceBuddy',
  description: 'Learn how to determine the right umbrella insurance coverage amount. Understand the net worth rule, coverage levels ($1M, $2M, $5M), and factors to consider when deciding.',
  keywords: 'umbrella insurance coverage, how much umbrella insurance, umbrella policy limits, net worth rule insurance, million dollar umbrella policy, umbrella insurance cost',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function UmbrellaCoverageAmountPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-900 via-teal-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Umbrella className="w-4 h-4" />
              Coverage Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              How Much Umbrella Insurance Coverage Do You Need?
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min read</span>
              <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-medium">Essential Reading</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Umbrella insurance provides an extra layer of liability protection beyond your standard 
                auto and home insurance policies. But how much coverage do you actually need? This 
                comprehensive guide will help you determine the right amount of umbrella coverage for 
                your unique situation.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Is Umbrella Insurance?</h2>
              <p className="text-slate-600 mb-6">
                Umbrella insurance is a type of personal liability coverage that kicks in when the 
                limits of your underlying policies—such as auto, home, or boat insurance—are exhausted. 
                It covers claims that exceed these limits, protecting your personal assets from lawsuits 
                and major claims.
              </p>

              <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-600" />
                  Key Benefits of Umbrella Insurance
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Provides coverage from $1 million to $10 million or more</li>
                  <li>• Covers legal defense costs even if you're not at fault</li>
                  <li>• Protects against claims not covered by standard policies</li>
                  <li>• Offers worldwide coverage (except in specific excluded countries)</li>
                  <li>• Covers certain claims like libel, slander, and false arrest</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Net Worth Rule: A Starting Point</h2>
              <p className="text-slate-600 mb-6">
                One of the most commonly recommended methods for determining umbrella coverage is the 
                <strong> net worth rule</strong>. This straightforward approach suggests that your umbrella 
                policy should cover your total net worth.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-slate-600" />
                  How to Calculate Your Net Worth
                </h3>
                <div className="space-y-4 text-slate-700">
                  <div>
                    <p className="font-semibold mb-2">Assets to Include:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Home equity (market value minus mortgage)</li>
                      <li>Investment accounts (401k, IRA, stocks, bonds)</li>
                      <li>Savings and checking accounts</li>
                      <li>Real estate investments</li>
                      <li>Business ownership interests</li>
                      <li>Valuable personal property (jewelry, art, collectibles)</li>
                      <li>Vehicles and recreational equipment</li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm">
                      <strong>Formula:</strong> Total Assets − Total Liabilities = Net Worth
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Important Considerations Beyond Net Worth
                </h3>
                <p className="text-slate-700 text-sm mb-3">
                  While the net worth rule is helpful, it may not be sufficient for everyone. Consider these factors:
                </p>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li>• <strong>Future earnings potential:</strong> Lawsuits can target future income, not just current assets</li>
                  <li>• <strong>Retirement accounts:</strong> While often protected, this varies by state</li>
                  <li>• <strong>Home equity:</strong> In some states, homestead exemptions protect only a portion</li>
                  <li>• <strong>Joint assets:</strong> Married couples may need more coverage</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Common Coverage Levels Explained</h2>
              <p className="text-slate-600 mb-6">
                Umbrella policies typically start at $1 million in coverage and increase in $1 million 
                increments. Here's what each level typically covers and who should consider it:
              </p>

              <div className="space-y-6 mb-8">
                {/* $1M Coverage */}
                <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">$1 Million Coverage</h3>
                      <p className="text-sm text-slate-600">Starting point for most families</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm mb-3">
                    Best for: Young professionals, renters, homeowners with moderate assets ($200k-$500k net worth), 
                    families with teenage drivers.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-700 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Typical annual cost: $150-$300</span>
                  </div>
                </div>

                {/* $2M Coverage */}
                <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">$2 Million Coverage</h3>
                      <p className="text-sm text-slate-600">Recommended for established homeowners</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm mb-3">
                    Best for: Homeowners with significant equity ($500k-$1M net worth), families with 
                    multiple vehicles, households with high income ($150k+ annually), landlords with rental properties.
                  </p>
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Typical annual cost: $225-$400</span>
                  </div>
                </div>

                {/* $3-5M Coverage */}
                <div className="bg-gradient-to-r from-violet-50 to-white rounded-xl p-6 border border-violet-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                      <Scale className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">$3-5 Million Coverage</h3>
                      <p className="text-sm text-slate-600">For high-net-worth individuals</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm mb-3">
                    Best for: High-net-worth individuals ($1M+ net worth), business owners, professionals 
                    with high earning potential (doctors, lawyers, executives), families with significant 
                    investment portfolios.
                  </p>
                  <div className="flex items-center gap-2 text-violet-700 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Typical annual cost: $300-$600</span>
                  </div>
                </div>

                {/* $5M+ Coverage */}
                <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">$5 Million+ Coverage</h3>
                      <p className="text-sm text-slate-600">Ultra-high-net-worth protection</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm mb-3">
                    Best for: Ultra-high-net-worth families ($5M+ net worth), celebrities and public figures, 
                    large real estate investors, C-suite executives with substantial stock compensation.
                  </p>
                  <div className="flex items-center gap-2 text-amber-700 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Typical annual cost: $500-$1,000+</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Key Factors to Consider</h2>
              <p className="text-slate-600 mb-6">
                Beyond the net worth calculation, several lifestyle and risk factors should influence 
                your umbrella coverage decision:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Car className="w-5 h-5 text-cyan-600" />
                    Driving Factors
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Teenage drivers in household</li>
                    <li>• Long daily commute</li>
                    <li>• Multiple vehicles</li>
                    <li>• History of accidents</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Home className="w-5 h-5 text-cyan-600" />
                    Property Factors
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Swimming pool or hot tub</li>
                    <li>• Trampoline or play equipment</li>
                    <li>• Rental properties owned</li>
                    <li>• Vacation homes</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-600" />
                    Lifestyle Factors
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Dog ownership (certain breeds)</li>
                    <li>• Boats, ATVs, or recreational vehicles</li>
                    <li>• Frequent hosting of parties/events</li>
                    <li>• Coaching youth sports</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-600" />
                    Financial Factors
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• High annual income</li>
                    <li>• Expected inheritance</li>
                    <li>• Business ownership</li>
                    <li>• Significant stock options</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cost vs. Benefit Analysis</h2>
              <p className="text-slate-600 mb-6">
                Umbrella insurance offers one of the best values in the insurance market. The cost per 
                dollar of coverage decreases significantly as you increase your coverage amount.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">Average Annual Premiums</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-300">
                        <th className="text-left py-2 px-3 font-semibold text-slate-900">Coverage Amount</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-900">Annual Cost</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-900">Cost per $1M</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr className="border-b border-slate-200">
                        <td className="py-2 px-3">$1 Million</td>
                        <td className="py-2 px-3">$150 - $300</td>
                        <td className="py-2 px-3">$150 - $300</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-2 px-3">$2 Million</td>
                        <td className="py-2 px-3">$225 - $400</td>
                        <td className="py-2 px-3">$112 - $200</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-2 px-3">$3 Million</td>
                        <td className="py-2 px-3">$300 - $500</td>
                        <td className="py-2 px-3">$100 - $167</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-2 px-3">$5 Million</td>
                        <td className="py-2 px-3">$450 - $750</td>
                        <td className="py-2 px-3">$90 - $150</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">$10 Million</td>
                        <td className="py-2 px-3">$800 - $1,500</td>
                        <td className="py-2 px-3">$80 - $150</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  *Costs vary based on location, driving record, and underlying policy limits. 
                  Quotes typically require minimum liability limits of 250/500/100 on auto and $300k on home.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  The Bottom Line on Value
                </h3>
                <p className="text-slate-700 mb-3">
                  For just a few hundred dollars per year, umbrella insurance provides millions in protection. 
                  Consider this: a single serious car accident with multiple injuries can result in claims 
                  exceeding $1 million in medical expenses, lost wages, and pain and suffering.
                </p>
                <p className="text-slate-700">
                  Without adequate coverage, your home, savings, and future earnings could be at risk. 
                  The peace of mind alone often justifies the modest premium.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Requirements for Umbrella Insurance</h2>
              <p className="text-slate-600 mb-6">
                To qualify for umbrella insurance, most carriers require you to maintain specific minimum 
                liability limits on your underlying policies:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-cyan-50 rounded-xl p-5 border border-cyan-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5 text-cyan-600" />
                    Auto Insurance Minimums
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li className="flex justify-between">
                      <span>Bodily Injury (per person):</span>
                      <strong>$250,000</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Bodily Injury (per accident):</span>
                      <strong>$500,000</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Property Damage:</span>
                      <strong>$100,000</strong>
                    </li>
                  </ul>
                </div>
                <div className="bg-cyan-50 rounded-xl p-5 border border-cyan-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5 text-cyan-600" />
                    Home Insurance Minimums
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li className="flex justify-between">
                      <span>Personal Liability:</span>
                      <strong>$300,000</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Some carriers require:</span>
                      <strong>$500,000</strong>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Final Recommendations</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Start with at least $1 million</p>
                    <p className="text-slate-600 text-sm">Everyone with assets to protect should have at least $1M in umbrella coverage.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Match your coverage to your net worth</p>
                    <p className="text-slate-600 text-sm">Your total liability coverage (underlying + umbrella) should equal or exceed your net worth.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Consider future earnings</p>
                    <p className="text-slate-600 text-sm">If you're young with high earning potential, add extra coverage to protect future income.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Review annually</p>
                    <p className="text-slate-600 text-sm">Reassess your coverage needs as your assets, income, and lifestyle change.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Ready to Get Protected?</h3>
              <p className="text-cyan-100 mb-6">
                Compare umbrella insurance quotes from top-rated carriers. Get the coverage you need at the best price.
              </p>
              <Link 
                href="/get-quote?type=umbrella"
                className="inline-flex items-center gap-2 bg-white text-cyan-700 px-8 py-3 rounded-xl font-bold hover:bg-cyan-50 transition"
              >
                Get Free Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/umbrella-insurance-claims"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <Shield className="w-5 h-5 text-cyan-600" />
                  <span className="font-medium text-slate-700">When Umbrella Insurance Pays Off</span>
                </Link>
                <Link 
                  href="/guides/umbrella-insurance-explained"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <Umbrella className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">What Is Umbrella Insurance?</span>
                </Link>
                <Link 
                  href="/guides/auto-insurance-basics"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Auto Insurance Basics</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <Activity className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">All Insurance Guides</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
