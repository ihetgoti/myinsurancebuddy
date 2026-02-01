import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, ArrowRight, CheckCircle, Calculator, DollarSign,
  Heart, Users, TrendingUp, AlertCircle, Clock, Star,
  Briefcase, Home, GraduationCap, PiggyBank
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'How Much Life Insurance Do You Need? Complete Coverage Guide | MyInsuranceBuddy',
  description: 'Learn how to calculate your life insurance needs using the DIME method, income replacement formula, and rule of thumb approaches. Find the right coverage amount for your family.',
  keywords: 'life insurance calculator, how much life insurance do I need, DIME method life insurance, income replacement life insurance, life insurance coverage amount',
  openGraph: {
    title: 'How Much Life Insurance Do You Need? Complete Coverage Guide',
    description: 'Learn the DIME method, income replacement formula, and expert tips to calculate your ideal life insurance coverage.',
  },
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function LifeInsuranceCoveragePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              Coverage Calculator Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              How Much Life Insurance Do You Need?
            </h1>
            <p className="text-lg text-violet-200 mb-6">
              A complete guide to calculating your coverage needs using proven methods and expert strategies.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
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
                One of the most common questions people ask when shopping for life insurance is: 
                <strong>"How much coverage do I actually need?"</strong> The answer isn't one-size-fits-all, 
                but with the right methods and calculations, you can find the perfect amount to protect your loved ones.
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  Quick Answer: The Rule of Thumb
                </h3>
                <p className="text-slate-700 mb-3">
                  Most financial experts recommend carrying life insurance coverage equal to <strong>10-12 times your annual income</strong>. 
                  This provides enough cushion for your family to maintain their lifestyle, pay off debts, and plan for the future.
                </p>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-600 mb-2">If you earn $75,000/year:</p>
                  <p className="text-2xl font-bold text-violet-700">$750,000 - $900,000</p>
                  <p className="text-sm text-slate-500">Recommended coverage amount</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The DIME Method: A Comprehensive Approach</h2>
              <p className="text-slate-600 mb-6">
                The DIME method is one of the most thorough ways to calculate your life insurance needs. 
                It accounts for four critical financial obligations your family would face:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                    <DollarSign className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">D - Debt</h3>
                  <p className="text-sm text-slate-600">
                    Total outstanding debts excluding mortgage: credit cards, student loans, car loans, personal loans, and any other obligations.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">I - Income Replacement</h3>
                  <p className="text-sm text-slate-600">
                    Multiply your annual income by the number of years your family will need support (typically until children are adults).
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                    <Home className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">M - Mortgage Balance</h3>
                  <p className="text-sm text-slate-600">
                    The remaining balance on your mortgage to ensure your family can stay in their home without financial strain.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">E - Education Expenses</h3>
                  <p className="text-sm text-slate-600">
                    Estimated college costs for children: $100,000-$200,000+ per child depending on public vs. private and in-state vs. out-of-state.
                  </p>
                </div>
              </div>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">DIME Method Example</h3>
                <div className="space-y-3 text-slate-700">
                  <div className="flex justify-between pb-2 border-b border-violet-200">
                    <span>Outstanding debts (credit cards, loans)</span>
                    <span className="font-semibold">$25,000</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-violet-200">
                    <span>Income replacement ($75,000 × 10 years)</span>
                    <span className="font-semibold">$750,000</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-violet-200">
                    <span>Mortgage balance</span>
                    <span className="font-semibold">$200,000</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-violet-200">
                    <span>Education (2 children × $100,000)</span>
                    <span className="font-semibold">$200,000</span>
                  </div>
                  <div className="flex justify-between pt-2 text-lg font-bold text-violet-900">
                    <span>Total Coverage Needed</span>
                    <span>$1,175,000</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Income Replacement Strategy</h2>
              <p className="text-slate-600 mb-6">
                The primary purpose of life insurance is to replace your income so your family can maintain their standard of living. 
                Here's how to calculate the right amount:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Step 1: Determine Your Annual Income</h3>
              <p className="text-slate-600 mb-4">
                Start with your gross annual income. If you're a stay-at-home parent, estimate the cost of replacing your services 
                (childcare, housekeeping, etc.), which typically ranges from $35,000 to $75,000 annually.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Step 2: Choose a Multiplier</h3>
              <p className="text-slate-600 mb-4">
                Financial advisors typically recommend multiplying your income by 10-12 times. Consider these factors when choosing:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li><strong>Young children:</strong> Use 12-15x to cover more years of support</li>
                <li><strong>Older children:</strong> 8-10x may be sufficient</li>
                <li><strong>Spouse with income:</strong> 8-10x may work if your spouse also earns</li>
                <li><strong>Single income household:</strong> 12-15x for maximum protection</li>
                <li><strong>Existing savings:</strong> Can reduce the multiplier if you have significant assets</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Step 3: Factor in Inflation</h3>
              <p className="text-slate-600 mb-4">
                Remember that $1 today won't have the same purchasing power in 10-20 years. At 3% annual inflation, 
                money loses about half its value over 23 years. Consider adding 20-30% to your calculation for long-term protection.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Don't Forget These Additional Expenses
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                    <span><strong>Final expenses:</strong> Funeral and burial costs average $7,000-$12,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                    <span><strong>Estate taxes:</strong> If your estate exceeds exemption limits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                    <span><strong>Emergency fund:</strong> 6 months of expenses for unexpected costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                    <span><strong>Medical expenses:</strong> Outstanding medical bills not covered by health insurance</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Life Insurance Calculator: Key Factors</h2>
              <p className="text-slate-600 mb-6">
                When determining your coverage amount, consider these important factors that affect your family's financial needs:
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Factor</th>
                      <th className="px-4 py-3">Impact on Coverage</th>
                      <th className="px-4 py-3 rounded-tr-lg">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">Age of Children</td>
                      <td className="px-4 py-3 text-slate-600">Younger children need more coverage</td>
                      <td className="px-4 py-3 text-slate-600">Add $100K per child under 10</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Spouse's Income</td>
                      <td className="px-4 py-3 text-slate-600">May reduce needed coverage</td>
                      <td className="px-4 py-3 text-slate-600">Factor in their earning potential</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Existing Savings</td>
                      <td className="px-4 py-3 text-slate-600">Can offset insurance needs</td>
                      <td className="px-4 py-3 text-slate-600">Subtract 401(k), investments, savings</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Group Life Insurance</td>
                      <td className="px-4 py-3 text-slate-600">Supplement, don't rely solely</td>
                      <td className="px-4 py-3 text-slate-600">Usually 1-2x salary, ends with job</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Health Status</td>
                      <td className="px-4 py-3 text-slate-600">Affects premium costs</td>
                      <td className="px-4 py-3 text-slate-600">Buy when healthy for best rates</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Common Mistakes to Avoid</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Underestimating coverage needs</p>
                    <p className="text-slate-600 text-sm">Many people buy only 1-2x their salary through employer plans, which is rarely enough.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Ignoring stay-at-home parent value</p>
                    <p className="text-slate-600 text-sm">Services provided by stay-at-home parents would cost $35,000-$75,000+ to replace.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Forgetting about inflation</p>
                    <p className="text-slate-600 text-sm">Today's coverage won't have the same purchasing power in 10-20 years.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Not reviewing coverage regularly</p>
                    <p className="text-slate-600 text-sm">Major life events (marriage, children, home purchase) require coverage adjustments.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Special Considerations for Different Life Stages</h2>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Young Singles (20s)</h3>
              <p className="text-slate-600 mb-4">
                Even without dependents, consider a small policy to cover final expenses and lock in low rates while you're young and healthy. 
                A $100,000-$250,000 20-year term policy is often very affordable.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Newly Married (Late 20s - Early 30s)</h3>
              <p className="text-slate-600 mb-4">
                Both spouses should have coverage, even if only one works. Consider 10-15x your income each. 
                This protects against the loss of either income and covers debts like student loans that may have cosigners.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Parents with Young Children</h3>
              <p className="text-slate-600 mb-4">
                This is when you need the most coverage. Use the DIME method and aim for 12-15x your income. 
                Consider a 20-30 year term to cover children through college years.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Empty Nesters (50s+)</h3>
              <p className="text-slate-600 mb-4">
                Coverage needs typically decrease as children become independent and debts are paid off. 
                Focus on final expenses, any remaining mortgage, and income replacement until retirement.
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-600" />
                  Pro Tips for Getting the Best Coverage
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Buy term life insurance for the best value - it offers the most coverage per dollar</li>
                  <li>• Get coverage while you're young and healthy for the lowest premiums</li>
                  <li>• Ladder multiple policies with different term lengths for changing needs</li>
                  <li>• Review your coverage every 3-5 years or after major life events</li>
                  <li>• Work with an independent agent to compare quotes from multiple companies</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When to Review and Adjust Your Coverage</h2>
              <p className="text-slate-600 mb-6">
                Life insurance isn't a "set it and forget it" purchase. Review your coverage when these events occur:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-8 space-y-2">
                <li>Marriage or divorce</li>
                <li>Birth or adoption of a child</li>
                <li>Purchase of a new home</li>
                <li>Significant salary increase</li>
                <li>Children reaching financial independence</li>
                <li>Paying off major debts</li>
                <li>Starting a business</li>
                <li>Approaching retirement</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Ready to Get the Right Coverage?</h3>
              <p className="text-violet-100 mb-6">
                Compare life insurance quotes from top-rated companies and find the perfect policy for your family's needs.
              </p>
              <Link 
                href="/get-quote?type=life"
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
              >
                Get Free Life Insurance Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/life-insurance-parents"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Users className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Life Insurance for Parents</span>
                </Link>
                <Link 
                  href="/guides/life-insurance-riders"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Shield className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Understanding Life Insurance Riders</span>
                </Link>
                <Link 
                  href="/guides/no-exam-life-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Heart className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">No-Exam Life Insurance Guide</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <PiggyBank className="w-5 h-5 text-violet-600" />
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
