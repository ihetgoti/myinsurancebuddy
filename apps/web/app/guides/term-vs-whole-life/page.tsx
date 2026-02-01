import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, ArrowRight, CheckCircle, XCircle, DollarSign,
  Clock, TrendingUp, Users, Calculator, Award,
  FileText, AlertCircle, PiggyBank, RefreshCw
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Term vs Whole Life Insurance: Complete Comparison Guide | MyInsuranceBuddy',
  description: 'Compare term vs whole life insurance. Learn about costs, cash value, policy duration, convertible policies, and which type is right for your needs.',
  keywords: 'term vs whole life insurance, term life insurance, whole life insurance, cash value life insurance, permanent life insurance, convertible term policy',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function TermVsWholeLifePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900 via-violet-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Life Insurance Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Term vs Whole Life Insurance: Which Should You Choose?
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min read</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Beginner</span>
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
                Choosing between term and whole life insurance is one of the most significant financial 
                decisions you'll make for your family's security. While both provide a death benefit to 
                protect your loved ones, they differ dramatically in cost, duration, and features. This 
                comprehensive guide will help you understand these differences and make the right choice 
                for your specific situation.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Term Life Insurance</h2>
              <p className="text-slate-600 mb-6">
                <strong>Term life insurance</strong> provides coverage for a specific period—typically 10, 
                20, or 30 years. If you pass away during the term, your beneficiaries receive the death benefit. 
                If you outlive the term, the policy expires with no value (unless you renew or convert).
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-violet-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Key Features of Term Life
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Fixed premiums</strong> for the duration of the term</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Guaranteed death benefit</strong> if you die during the term</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span><strong>No cash value</strong> component—pure insurance protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Convertible options</strong> available with many policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Most affordable</strong> way to get substantial coverage</span>
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Common Term Lengths</h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">10-Year Term</h4>
                  <p className="text-slate-700 text-sm">
                    Best for short-term needs like covering a business loan or bridging to retirement.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">20-Year Term</h4>
                  <p className="text-slate-700 text-sm">
                    Ideal for parents with young children, covering the years until kids are independent.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">30-Year Term</h4>
                  <p className="text-slate-700 text-sm">
                    Covers a new mortgage, provides extended protection for young families, or income replacement.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Whole Life Insurance</h2>
              <p className="text-slate-600 mb-6">
                <strong>Whole life insurance</strong> is a type of permanent life insurance that provides 
                coverage for your entire lifetime, as long as premiums are paid. It includes a cash value 
                component that grows over time on a tax-deferred basis.
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Key Features of Whole Life
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Lifetime coverage</strong>—never expires as long as premiums are paid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Cash value accumulation</strong> with guaranteed growth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Fixed premiums</strong> that never increase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Guaranteed death benefit</strong> for beneficiaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Policy loans</strong> available against cash value</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cost Comparison: The Numbers</h2>
              <p className="text-slate-600 mb-6">
                Cost is often the deciding factor when choosing between term and whole life. Here's how 
                they compare for a healthy 30-year-old non-smoker seeking $500,000 in coverage:
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-4 border border-slate-200 font-bold text-slate-900">Policy Type</th>
                      <th className="text-right p-4 border border-slate-200 font-bold text-slate-900">Monthly Premium</th>
                      <th className="text-right p-4 border border-slate-200 font-bold text-slate-900">Annual Cost</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr>
                      <td className="p-4 border border-slate-200">20-Year Term</td>
                      <td className="p-4 border border-slate-200 text-right font-semibold text-violet-700">$25 – $35</td>
                      <td className="p-4 border border-slate-200 text-right">$300 – $420</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200">30-Year Term</td>
                      <td className="p-4 border border-slate-200 text-right font-semibold text-violet-700">$40 – $55</td>
                      <td className="p-4 border border-slate-200 text-right">$480 – $660</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200">Whole Life</td>
                      <td className="p-4 border border-slate-200 text-right font-semibold text-emerald-700">$350 – $500</td>
                      <td className="p-4 border border-slate-200 text-right">$4,200 – $6,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl mb-8">
                <p className="text-slate-700">
                  <strong>Key Takeaway:</strong> Whole life insurance typically costs <strong>10-15 times more</strong> than 
                  term insurance for the same death benefit. This significant cost difference is why many 
                  financial advisors recommend "buy term and invest the difference."
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Side-by-Side Comparison</h2>

              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-4 border border-slate-200 font-bold text-slate-900">Feature</th>
                      <th className="text-center p-4 border border-slate-200 font-bold text-violet-700">Term Life</th>
                      <th className="text-center p-4 border border-slate-200 font-bold text-emerald-700">Whole Life</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Coverage Duration</td>
                      <td className="p-4 border border-slate-200 text-center">Fixed term (10-30 years)</td>
                      <td className="p-4 border border-slate-200 text-center">Lifetime</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Premium Cost</td>
                      <td className="p-4 border border-slate-200 text-center text-green-700 font-semibold">Lower</td>
                      <td className="p-4 border border-slate-200 text-center text-red-700 font-semibold">Higher (10-15x)</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Cash Value</td>
                      <td className="p-4 border border-slate-200 text-center">
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      </td>
                      <td className="p-4 border border-slate-200 text-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Premium Stability</td>
                      <td className="p-4 border border-slate-200 text-center">Fixed during term only</td>
                      <td className="p-4 border border-slate-200 text-center">Fixed for life</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Death Benefit</td>
                      <td className="p-4 border border-slate-200 text-center">Fixed amount</td>
                      <td className="p-4 border border-slate-200 text-center">Fixed + dividends (if paid)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Investment Component</td>
                      <td className="p-4 border border-slate-200 text-center">None</td>
                      <td className="p-4 border border-slate-200 text-center">Guaranteed cash value growth</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Policy Loans</td>
                      <td className="p-4 border border-slate-200 text-center">Not available</td>
                      <td className="p-4 border border-slate-200 text-center">Available against cash value</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Convertible</td>
                      <td className="p-4 border border-slate-200 text-center">Often yes (to permanent)</td>
                      <td className="p-4 border border-slate-200 text-center">N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Cash Value</h2>
              <p className="text-slate-600 mb-6">
                The cash value component is the primary differentiator of whole life insurance. Here's 
                how it works and what you need to know:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">How Cash Value Accumulates</h3>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Guaranteed minimum growth:</strong> Cash value grows at a guaranteed rate set by the insurer (typically 1-3%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Dividends:</strong> Participating policies may pay dividends that can increase cash value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Tax-deferred growth:</strong> You don't pay taxes on gains while they remain in the policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Slow initial growth:</strong> Little cash value accumulates in early years due to insurance costs</span>
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Using Cash Value</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Policy Loans
                  </h4>
                  <p className="text-slate-700 text-sm">
                    Borrow against your cash value at relatively low interest rates. The loan isn't taxable, 
                    but unpaid loans reduce the death benefit.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Withdrawals
                  </h4>
                  <p className="text-slate-700 text-sm">
                    Withdraw cash value, which may be tax-free up to your basis (premiums paid). Withdrawals 
                    reduce the death benefit.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Premium Payments
                  </h4>
                  <p className="text-slate-700 text-sm">
                    Use cash value to pay premiums, potentially allowing you to stop out-of-pocket payments 
                    while keeping coverage.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Surrender
                  </h4>
                  <p className="text-slate-700 text-sm">
                    Cancel the policy and receive the cash value (minus surrender charges in early years). 
                    Gains are taxable.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 mb-8">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Cash Value Reality
                </h4>
                <p className="text-slate-700 text-sm">
                  Cash value grows slowly. In the first 5-10 years, most of your premium goes toward 
                  insurance costs and fees, not cash value accumulation. It often takes 10-15 years 
                  before cash value exceeds total premiums paid.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When to Choose Term Life</h2>
              <p className="text-slate-600 mb-6">
                Term life insurance is the right choice for most people. Consider term if you:
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Need maximum coverage at the lowest cost',
                    'Have temporary obligations (mortgage, children\'s education)',
                    'Want simple, straightforward protection',
                    'Plan to self-insure later through savings and investments',
                    'Are on a budget but need substantial death benefit',
                    'Want coverage during peak earning years only',
                    'Prefer to invest separately rather than through insurance',
                    'Need coverage for specific debts or business obligations',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When to Choose Whole Life</h2>
              <p className="text-slate-600 mb-6">
                Whole life insurance makes sense in specific situations. Consider whole life if you:
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Have a lifelong dependent (special needs child)',
                    'Need estate planning for tax liquidity',
                    'Want guaranteed coverage regardless of future health',
                    'Have maxed out other tax-advantaged investments',
                    'Own a business needing succession planning',
                    'Want forced savings discipline',
                    'Need coverage that builds accessible cash value',
                    'Have significant assets to protect from estate taxes',
                    'Want to leave a guaranteed inheritance',
                    'Have a permanent need for life insurance',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Convertible Term Policies</h2>
              <p className="text-slate-600 mb-6">
                Many term life policies include a conversion option, providing valuable flexibility:
              </p>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  How Conversion Works
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Convert term policy to permanent insurance without a new medical exam</li>
                  <li>• Conversion typically allowed until age 65-70</li>
                  <li>• Premiums based on your age at conversion, not original policy age</li>
                  <li>• Convert all or part of your coverage</li>
                  <li>• Provides flexibility if your needs or health change</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The "Buy Term and Invest the Difference" Strategy</h2>
              <p className="text-slate-600 mb-6">
                A popular alternative to whole life is buying term insurance and investing the premium 
                difference yourself. Here's how the math typically works:
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">Example Comparison Over 30 Years</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Whole Life Approach</h4>
                    <ul className="text-slate-700 text-sm space-y-1 ml-4">
                      <li>• Monthly premium: $400</li>
                      <li>• 30-year cash value (estimated): $150,000</li>
                      <li>• Death benefit: $500,000 + cash value</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Term + Invest Approach</h4>
                    <ul className="text-slate-700 text-sm space-y-1 ml-4">
                      <li>• Monthly term premium: $50</li>
                      <li>• Monthly investment: $350 (the difference)</li>
                      <li>• 30-year investment at 7% return: ~$425,000</li>
                      <li>• Death benefit (during term): $500,000 + investments</li>
                    </ul>
                  </div>
                </div>
                <p className="text-slate-700 mt-4 text-sm italic">
                  <strong>Note:</strong> Actual results vary based on investment returns, fees, and policy performance. 
                  This example illustrates potential outcomes but is not a guarantee.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Other Permanent Life Insurance Options</h2>
              <p className="text-slate-600 mb-6">
                Beyond whole life, other permanent options exist with different features:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Universal Life Insurance</h3>
                  <p className="text-slate-700 text-sm">
                    Offers flexible premiums and adjustable death benefits. Cash value earns interest based 
                    on market rates or a minimum guarantee. More flexibility than whole life but requires 
                    monitoring to ensure adequate funding.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Variable Life Insurance</h3>
                  <p className="text-slate-700 text-sm">
                    Cash value is invested in sub-accounts (similar to mutual funds) with potential for 
                    higher returns but also investment risk. Death benefit may vary based on investment performance.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Indexed Universal Life</h3>
                  <p className="text-slate-700 text-sm">
                    Cash value growth is tied to a stock market index (like the S&P 500) with floors and 
                    caps. Offers potential for higher returns than traditional whole life with downside protection.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Guaranteed Universal Life</h3>
                  <p className="text-slate-700 text-sm">
                    Focuses on providing a guaranteed death benefit with minimal cash value accumulation. 
                    Lower premiums than whole life with lifelong coverage guarantees.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Making Your Decision</h2>
              <p className="text-slate-600 mb-6">
                Use this decision framework to determine the right type of life insurance for your situation:
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">Key Questions to Ask</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>What can I comfortably afford in monthly premiums?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>How long do I need coverage?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>Who depends on my income and for how long?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <PiggyBank className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>Do I need a policy that builds cash value?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>Am I disciplined enough to invest the difference if I buy term?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>Do I have estate planning needs?</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Final Thoughts</h2>
              <p className="text-slate-600 mb-6">
                For most people, term life insurance provides the most cost-effective way to protect their 
                family's financial future. The significant premium savings allow you to get the coverage 
                amount you actually need during your highest-responsibility years.
              </p>
              <p className="text-slate-600 mb-6">
                Whole life insurance serves specific purposes—particularly for estate planning, business 
                succession, and those with lifelong dependents. However, the high cost means many people 
                are underinsured when they choose whole life over term.
              </p>
              <p className="text-slate-600 mb-6">
                Remember: the primary purpose of life insurance is to provide financial protection for 
                those who depend on you. Choose the type and amount of coverage that ensures your loved 
                ones would be financially secure if you were no longer there to provide for them.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Find the Right Life Insurance for You</h3>
              <p className="text-violet-100 mb-6">
                Compare term and permanent life insurance quotes from top-rated carriers.
              </p>
              <Link 
                href="/get-quote?type=life"
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
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
                  href="/guides/life-insurance-coverage"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Calculator className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">How Much Life Insurance Do You Need?</span>
                </Link>
                <Link 
                  href="/guides/life-insurance-parents"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Users className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Life Insurance for Parents</span>
                </Link>
                <Link 
                  href="/guides/no-exam-life-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Award className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">No-Exam Life Insurance</span>
                </Link>
                <Link 
                  href="/guides/life-insurance-riders"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <FileText className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Understanding Life Insurance Riders</span>
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
