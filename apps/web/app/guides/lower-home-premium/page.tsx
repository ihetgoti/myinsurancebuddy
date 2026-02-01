import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Home, ArrowRight, CheckCircle, Shield, AlertTriangle,
  DollarSign, FileText, Clock, Lock, TrendingDown,
  Package, Search, Award, Wrench, Percent, Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'How to Lower Home Insurance Premium: 15+ Proven Ways | MyInsuranceBuddy',
  description: 'Discover proven strategies to lower your home insurance premium. Learn about bundling, security systems, raising deductibles, home improvements, and shopping for better rates.',
  keywords: 'lower home insurance premium, reduce home insurance cost, home insurance discounts, save on home insurance, cheaper home insurance',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function LowerHomePremiumPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingDown className="w-4 h-4" />
              Money-Saving Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              How to Lower Your Home Insurance Premium
            </h1>
            <p className="text-emerald-100 text-lg mb-6">
              Proven strategies to reduce your home insurance costs without sacrificing coverage. 
              Save hundreds—or even thousands—each year.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-emerald-200 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min read</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Beginner</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Savings */}
      <section className="py-8 bg-emerald-50 border-b border-emerald-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-emerald-900 font-bold text-lg mb-4">Average Annual Savings Potential</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-emerald-700">$300</div>
                <div className="text-xs text-slate-600">Bundling</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-emerald-700">$200</div>
                <div className="text-xs text-slate-600">Security System</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-emerald-700">$250</div>
                <div className="text-xs text-slate-600">Higher Deductible</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-emerald-700">$400+</div>
                <div className="text-xs text-slate-600">Shopping Around</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Home insurance is essential, but that doesn't mean you have to overpay for it. The average 
                homeowner spends over $1,400 annually on insurance, but with the right strategies, you could 
                significantly reduce that cost. This guide covers every proven method to lower your premium 
                while maintaining the protection your home needs.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. Bundle Your Insurance Policies</h2>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-bold text-slate-900">The Multi-Policy Discount</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  One of the easiest ways to save is to purchase multiple policies from the same insurer. 
                  Most companies offer significant discounts when you bundle home and auto insurance.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Typical Savings</h4>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Home + Auto: <strong>10-25%</strong> off home premium</li>
                      <li>• Additional policies: Extra 5-10% each</li>
                      <li>• Average annual savings: <strong>$200-$400</strong></li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">What You Can Bundle</h4>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Homeowners insurance</li>
                      <li>• Auto insurance</li>
                      <li>• Life insurance</li>
                      <li>• Umbrella policy</li>
                      <li>• Boat or RV insurance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Important Consideration</h4>
                    <p className="text-slate-600 text-sm">
                      While bundling usually saves money, don't assume it's always the cheapest option. 
                      Sometimes separate policies from different insurers cost less overall. Always compare 
                      bundled vs. separate quotes.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. Increase Your Deductible</h2>

              <p className="text-slate-600 mb-6">
                Your deductible is the amount you pay out-of-pocket before insurance kicks in. Choosing a 
                higher deductible lowers your premium because you're assuming more risk.
              </p>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-8">
                <h3 className="font-bold text-slate-900 mb-4">How Deductibles Affect Premiums</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3 font-semibold text-slate-900">Deductible</th>
                        <th className="text-center py-2 px-3 font-semibold text-slate-900">Premium Change</th>
                        <th className="text-right py-2 px-3 font-semibold text-slate-900">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 px-3 text-slate-700">$500</td>
                        <td className="text-center py-2 px-3 text-slate-600">Baseline</td>
                        <td className="text-right py-2 px-3 text-slate-600">Those who expect frequent small claims</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 px-3 text-slate-700">$1,000</td>
                        <td className="text-center py-2 px-3 text-emerald-600">~10% lower</td>
                        <td className="text-right py-2 px-3 text-slate-600">Most homeowners</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 px-3 text-slate-700">$2,500</td>
                        <td className="text-center py-2 px-3 text-emerald-600">~15-20% lower</td>
                        <td className="text-right py-2 px-3 text-slate-600">Those with emergency savings</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-slate-700">$5,000+</td>
                        <td className="text-center py-2 px-3 text-emerald-600">~25-30% lower</td>
                        <td className="text-right py-2 px-3 text-slate-600">High-value homes, substantial savings</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">The Math: When Higher Deductibles Make Sense</h4>
                    <p className="text-slate-600 text-sm mb-2">
                      If raising your deductible from $1,000 to $2,500 saves you $200/year, it will take 
                      about 7.5 years of claim-free history to break even on one claim. If you have 
                      sufficient emergency savings and are a low-risk homeowner, the math usually favors 
                      higher deductibles.
                    </p>
                    <p className="text-slate-600 text-sm">
                      <strong>Remember:</strong> Only choose a deductible you can comfortably afford to pay 
                      if disaster strikes.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. Install a Security System</h2>

              <p className="text-slate-600 mb-6">
                Insurance companies love security systems because they reduce the likelihood of claims. 
                The more comprehensive your system, the bigger your discount.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3">Security Features That Lower Premiums</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Burglar alarm</strong> (5-20% discount)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Deadbolt locks</strong> on all exterior doors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Smoke detectors</strong> on each floor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Fire sprinkler system</strong> (5-15% discount)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>CO detectors</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Security cameras</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>24/7 monitoring</strong> (bigger discounts)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="font-bold text-slate-900 mb-3">Smart Home Discounts</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Modern smart home devices can also qualify for discounts:
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Smart water leak detectors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Smart thermostats (fire prevention)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Smart doorbells with cameras</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Automatic water shut-off valves</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 text-sm mt-3">
                    <strong>Tip:</strong> Ask your insurer which specific systems qualify for discounts before purchasing.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Make Strategic Home Improvements</h2>

              <p className="text-slate-600 mb-6">
                Certain upgrades make your home safer and less risky to insure, leading to lower premiums.
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-slate-900">Roof Upgrades</h4>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">
                    A new roof can reduce premiums by 5-35%. Impact-resistant roofing materials (Class 4 rated) 
                    may qualify for additional discounts, especially in hail-prone areas.
                  </p>
                  <p className="text-slate-500 text-xs">
                    <strong>Savings potential:</strong> $100-$500/year
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-slate-900">Electrical System Updates</h4>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">
                    Replacing knob-and-tube or aluminum wiring with modern copper wiring reduces fire risk 
                    significantly. Some insurers won't cover homes with outdated electrical systems.
                  </p>
                  <p className="text-slate-500 text-xs">
                    <strong>Savings potential:</strong> $50-$200/year; may be required for coverage
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-5 h-5 text-violet-600" />
                    <h4 className="font-bold text-slate-900">Plumbing Updates</h4>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">
                    Replacing galvanized or polybutylene pipes with copper or PEX reduces leak risk. 
                    Installing a water shut-off device can also qualify for discounts.
                  </p>
                  <p className="text-slate-500 text-xs">
                    <strong>Savings potential:</strong> $50-$150/year
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-slate-900">Storm Resistance Improvements</h4>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">
                    In hurricane or tornado-prone areas, impact-resistant windows, storm shutters, 
                    reinforced garage doors, and roof straps can lead to significant savings.
                  </p>
                  <p className="text-slate-500 text-xs">
                    <strong>Savings potential:</strong> $100-$1,000+/year in high-risk areas
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">5. Shop Around and Compare Quotes</h2>

              <p className="text-slate-600 mb-6">
                Insurance rates can vary dramatically between companies for the exact same coverage. 
                Shopping around is one of the most effective ways to lower your premium.
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-bold text-slate-900">Smart Shopping Strategies</h3>
                </div>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">1.</span>
                    <span><strong>Get at least 3-5 quotes</strong> from different insurers for meaningful comparison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">2.</span>
                    <span><strong>Use comparison websites</strong> to save time, but also contact agents directly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">3.</span>
                    <span><strong>Compare identical coverage levels</strong>—don't sacrifice protection for price</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">4.</span>
                    <span><strong>Check insurer ratings</strong> with AM Best, J.D. Power, and state insurance departments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">5.</span>
                    <span><strong>Shop annually</strong> or when your policy renews—loyalty doesn't always pay</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">When to Shop for New Insurance</h4>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Every 2-3 years as a general rule</li>
                      <li>• After significant life changes (marriage, new roof, security system installation)</li>
                      <li>• When your rates increase at renewal</li>
                      <li>• After major home improvements that reduce risk</li>
                      <li>• When you pay off your mortgage (new insurers may offer better rates)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">6. Ask About Available Discounts</h2>

              <p className="text-slate-600 mb-6">
                Insurance companies offer dozens of discounts, but they don't always advertise them. 
                You have to ask.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { name: 'Claims-Free Discount', desc: 'No claims for 3-5 years', savings: '10-20%' },
                  { name: 'New Home Discount', desc: 'Home built within last 10 years', savings: '10-25%' },
                  { name: 'Age-Based Discount', desc: 'Senior or retired homeowner', savings: '5-10%' },
                  { name: 'Group Membership', desc: 'Alumni, professional, or employer groups', savings: '5-10%' },
                  { name: 'Payment Discounts', desc: 'Pay in full, automatic payments, paperless', savings: '2-10%' },
                  { name: 'Non-Smoker Discount', desc: 'No smokers in household', savings: '5-15%' },
                  { name: 'Married Couple Discount', desc: 'Statistically lower risk', savings: '5-10%' },
                  { name: 'Gated Community', desc: 'Living in secured community', savings: '5-10%' },
                  { name: 'New Purchase Discount', desc: 'Bought home within last 12 months', savings: '5-10%' },
                  { name: 'Early Shopper', desc: 'Get quote before current policy expires', savings: '5-10%' },
                ].map((discount) => (
                  <div key={discount.name} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-900 text-sm">{discount.name}</span>
                      <span className="text-emerald-600 font-bold text-sm">{discount.savings}</span>
                    </div>
                    <p className="text-slate-600 text-xs">{discount.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">7. Maintain Good Credit</h2>

              <p className="text-slate-600 mb-6">
                In most states, insurers use credit-based insurance scores to help determine premiums. 
                Better credit typically means lower rates.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">How Credit Affects Home Insurance</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
                    <div className="text-emerald-600 font-bold">Excellent</div>
                    <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-slate-600">Best rates</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
                    <div className="text-blue-600 font-bold">Good</div>
                    <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-slate-600">Standard rates</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
                    <div className="text-amber-600 font-bold">Fair</div>
                    <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-amber-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-slate-600">Higher rates</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
                    <div className="text-red-600 font-bold">Poor</div>
                    <div className="flex-1 h-2 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full w-1/4 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-slate-600">Highest rates</div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mt-4">
                  <strong>Note:</strong> California, Maryland, and Massachusetts prohibit the use of credit 
                  scores in home insurance pricing.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">8. Review Your Coverage Annually</h2>

              <p className="text-slate-600 mb-6">
                Your insurance needs change over time. Annual reviews ensure you're not over-insured 
                or paying for coverage you no longer need.
              </p>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-8">
                <h3 className="font-bold text-slate-900 mb-4">Annual Review Checklist</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Has your home value decreased significantly?',
                    'Have you sold valuable items that were scheduled?',
                    'Have you paid off your mortgage?',
                    'Have you made home improvements that reduce risk?',
                    'Have you reached an age that qualifies for discounts?',
                    'Has your credit score improved significantly?',
                    'Do you have riders for risks that no longer apply?',
                    'Are your coverage limits still appropriate?',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">9. Avoid Small Claims</h2>

              <p className="text-slate-600 mb-6">
                Filing multiple small claims can lead to premium increases or even non-renewal. 
                Sometimes paying out-of-pocket for minor issues is the smarter financial move.
              </p>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">The Claims Penalty</h4>
                    <p className="text-slate-600 text-sm">
                      A single claim can increase premiums by 9-20% for 3-5 years. Multiple claims in 
                      a short period can result in non-renewal. For damage that's only slightly above 
                      your deductible, consider whether the payout is worth the long-term cost increase.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">10. Consider Usage-Based or Telematics Programs</h2>

              <p className="text-slate-600 mb-6">
                Some insurers now offer programs that monitor your home's condition or your habits 
                to potentially offer discounts for low-risk behavior.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Quick Action Plan: Lower Your Premium Today</h2>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <ol className="space-y-3">
                  {[
                    'Call your current insurer and ask about unapplied discounts',
                    'Get quotes from at least 3 other insurance companies',
                    'Consider raising your deductible if you have emergency savings',
                    'Bundle your home and auto insurance if you haven\'t already',
                    'Install deadbolts and smoke detectors if missing',
                    'Improve your credit score by paying down debt',
                    'Schedule a consultation with an independent insurance agent',
                    'Set a calendar reminder to shop rates annually',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-slate-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-emerald-900 text-center mb-4">
                  Total Potential Annual Savings
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-700 mb-2">$500 - $1,500+</div>
                  <p className="text-emerald-800">
                    By combining multiple strategies, the average homeowner can save significantly 
                    on their annual premium while maintaining excellent coverage.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Ready to Lower Your Premium?</h3>
              <p className="text-emerald-100 mb-6">
                Compare quotes from multiple insurers and find the best rate for your coverage needs.
              </p>
              <Link 
                href="/get-quote?type=home"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
              >
                Get Free Home Insurance Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/how-much-home-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Home className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">How Much Home Insurance Do You Need?</span>
                </Link>
                <Link 
                  href="/guides/renters-insurance-worth"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Is Renters Insurance Worth It?</span>
                </Link>
                <Link 
                  href="/guides/flood-insurance-guide"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <AlertTriangle className="w-5 h-5 text-cyan-600" />
                  <span className="font-medium text-slate-700">Flood Insurance Guide</span>
                </Link>
                <Link 
                  href="/guides/home-insurance-claims"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <FileText className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Filing Home Insurance Claims</span>
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
