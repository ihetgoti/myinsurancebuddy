import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Heart, ArrowRight, CheckCircle, DollarSign, Calculator,
  Briefcase, FileText, Clock, TrendingUp, AlertCircle,
  PiggyBank, Receipt, Users, Shield
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Health Insurance Tax Deductions Guide: Save on Taxes | MyInsuranceBuddy',
  description: 'Complete guide to health insurance tax deductions. Learn about self-employed health insurance deduction, HSA contributions, medical expense deductions, and premium tax credits.',
  keywords: 'health insurance tax deduction, self-employed health insurance, HSA tax benefits, medical expense deduction, premium tax credit, health savings account',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function HealthInsuranceTaxPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <DollarSign className="w-4 h-4" />
              Tax Savings Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Health Insurance Tax Deductions: A Complete Guide
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 7 min read</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Advanced</span>
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
                Health insurance can be expensive, but the tax code offers several ways to reduce your 
                costs through deductions and credits. Whether you're self-employed, have a high-deductible 
                health plan, or face significant medical expenses, understanding these tax benefits can 
                save you hundreds or even thousands of dollars each year.
              </p>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl mb-8">
                <p className="text-slate-700">
                  <strong>Key Distinction:</strong> <strong>Tax deductions</strong> reduce your taxable income, 
                  while <strong>tax credits</strong> directly reduce your tax bill dollar-for-dollar. Premium 
                  tax credits for marketplace insurance are credits; most health insurance deductions are deductions.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Self-Employed Health Insurance Deduction</h2>
              <p className="text-slate-600 mb-6">
                If you're self-employed, this is one of the most valuable tax breaks available. You can deduct 
                100% of your health insurance premiums for yourself, your spouse, and your dependents directly 
                from your gross income.
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Who Qualifies?
                </h3>
                <p className="text-slate-700 mb-4">
                  You can claim this deduction if you meet all these criteria:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>You're self-employed as a sole proprietor, partner, or LLC member</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>You report business income on Schedule C, Schedule F, or as a partner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>You (or your spouse) aren't eligible for employer-subsidized health coverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>You have a net profit from your business for the year</span>
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">What Can You Deduct?</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  'Medical insurance premiums',
                  'Dental insurance premiums',
                  'Vision insurance premiums',
                  'Long-term care insurance premiums (with age-based limits)',
                  'Medicare Part B and Part D premiums',
                  'Medicare Advantage (Part C) premiums',
                  'COBRA continuation coverage premiums',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 mb-8">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Limitation
                </h4>
                <p className="text-slate-700 text-sm">
                  Your deduction cannot exceed your net self-employment income for the year. If your premiums 
                  exceed your business profit, you can deduct the excess as an itemized medical expense deduction 
                  (subject to the 7.5% AGI floor).
                </p>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">How to Claim the Deduction</h3>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <ol className="space-y-3 text-slate-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-emerald-600">1.</span>
                    <span>Enter the deduction on <strong>Schedule 1 (Form 1040), Line 17</strong> "Self-employed health insurance deduction"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-emerald-600">2.</span>
                    <span>Complete <strong>Form 7206</strong> (Self-Employed Health Insurance Deduction) to calculate your allowable deduction</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-emerald-600">3.</span>
                    <span>The deduction reduces your Adjusted Gross Income (AGI), which can make you eligible for other tax benefits</span>
                  </li>
                </ol>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Long-Term Care Insurance Limits</h3>
              <p className="text-slate-600 mb-4">
                While most premiums are fully deductible, long-term care insurance has age-based annual limits 
                for 2024:
              </p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-3 border border-slate-200 font-bold text-slate-900">Age at Year End</th>
                      <th className="text-right p-3 border border-slate-200 font-bold text-slate-900">Maximum Deductible Premium</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr>
                      <td className="p-3 border border-slate-200">40 or younger</td>
                      <td className="p-3 border border-slate-200 text-right">$480</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 border border-slate-200">41 – 50</td>
                      <td className="p-3 border border-slate-200 text-right">$890</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-slate-200">51 – 60</td>
                      <td className="p-3 border border-slate-200 text-right">$1,790</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 border border-slate-200">61 – 70</td>
                      <td className="p-3 border border-slate-200 text-right">$4,770</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-slate-200">71 or older</td>
                      <td className="p-3 border border-slate-200 text-right">$5,960</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Health Savings Account (HSA) Tax Benefits</h2>
              <p className="text-slate-600 mb-6">
                An HSA is one of the most tax-advantaged accounts available, offering triple tax benefits: 
                tax-deductible contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses.
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                  <PiggyBank className="w-5 h-5" />
                  The Triple Tax Advantage
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Tax-Deductible Contributions</h4>
                      <p className="text-slate-700 text-sm">Contributions reduce your taxable income dollar-for-dollar, even if you don't itemize deductions.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Tax-Free Growth</h4>
                      <p className="text-slate-700 text-sm">Interest, dividends, and capital gains grow tax-free within the account.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Tax-Free Withdrawals</h4>
                      <p className="text-slate-700 text-sm">Money withdrawn for qualified medical expenses is never taxed.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">HSA Eligibility Requirements</h3>
              <p className="text-slate-600 mb-4">
                To contribute to an HSA, you must meet all these requirements:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  'Be enrolled in a High Deductible Health Plan (HDHP)',
                  'Have no other health coverage (with some exceptions)',
                  'Not be enrolled in Medicare',
                  'Not be claimed as a dependent on someone else\'s tax return',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">2024 HSA Contribution Limits</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-3 border border-slate-200 font-bold text-slate-900">Coverage Type</th>
                      <th className="text-right p-3 border border-slate-200 font-bold text-slate-900">Contribution Limit</th>
                      <th className="text-right p-3 border border-slate-200 font-bold text-slate-900">Age 55+ Catch-Up</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr>
                      <td className="p-3 border border-slate-200">Self-only</td>
                      <td className="p-3 border border-slate-200 text-right font-semibold">$4,150</td>
                      <td className="p-3 border border-slate-200 text-right">+$1,000</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 border border-slate-200">Family</td>
                      <td className="p-3 border border-slate-200 text-right font-semibold">$8,300</td>
                      <td className="p-3 border border-slate-200 text-right">+$1,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">HDHP Requirements for 2024</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-3 border border-slate-200 font-bold text-slate-900">Coverage Type</th>
                      <th className="text-right p-3 border border-slate-200 font-bold text-slate-900">Minimum Deductible</th>
                      <th className="text-right p-3 border border-slate-200 font-bold text-slate-900">Out-of-Pocket Max</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr>
                      <td className="p-3 border border-slate-200">Self-only</td>
                      <td className="p-3 border border-slate-200 text-right">$1,600</td>
                      <td className="p-3 border border-slate-200 text-right">$8,050</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 border border-slate-200">Family</td>
                      <td className="p-3 border border-slate-200 text-right">$3,200</td>
                      <td className="p-3 border border-slate-200 text-right">$16,100</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">How to Claim HSA Deductions</h3>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <ul className="space-y-2 text-slate-700">
                  <li>• Report HSA contributions on <strong>Form 8889</strong></li>
                  <li>• The deduction transfers to <strong>Schedule 1 (Form 1040), Line 13</strong></li>
                  <li>• Employer contributions are not deductible (already excluded from W-2 wages)</li>
                  <li>• You have until the tax filing deadline (April 15) to contribute for the prior year</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Medical Expense Deduction</h2>
              <p className="text-slate-600 mb-6">
                If you itemize deductions on your tax return, you can deduct qualified medical expenses that 
                exceed 7.5% of your Adjusted Gross Income (AGI).
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3">The 7.5% AGI Threshold</h3>
                <p className="text-slate-700 mb-4">
                  Only medical expenses exceeding 7.5% of your AGI are deductible.
                </p>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-600 mb-2"><strong>Example:</strong></p>
                  <ul className="space-y-1 text-slate-700 text-sm">
                    <li>Your AGI: $60,000</li>
                    <li>7.5% of AGI: $4,500</li>
                    <li>Total medical expenses: $8,000</li>
                    <li><strong>Deductible amount: $3,500</strong> ($8,000 - $4,500)</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Deductible Medical Expenses</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  'Health insurance premiums (if not already deducted)',
                  'Doctor and dentist fees',
                  'Hospital services',
                  'Prescription medications',
                  'Medical equipment and supplies',
                  'Transportation to medical care',
                  'Long-term care services',
                  'Mental health treatment',
                  'Chiropractic care',
                  'Weight-loss programs (for diagnosed conditions)',
                  'Smoking cessation programs',
                  'Guide dogs and service animals',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Non-Deductible Expenses</h3>
              <div className="bg-red-50 rounded-xl p-5 border border-red-200 mb-8">
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li>• Non-prescription drugs (except insulin)</li>
                  <li>• Cosmetic surgery (unless medically necessary)</li>
                  <li>• Health club dues</li>
                  <li>• Nutritional supplements (unless prescribed)</li>
                  <li>• Funeral or burial expenses</li>
                  <li>• Over-the-counter medications (without prescription)</li>
                  <li>• Toiletries and personal care items</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Premium Tax Credits (PTC)</h2>
              <p className="text-slate-600 mb-6">
                While not a deduction, premium tax credits are a significant way the ACA helps reduce 
                health insurance costs. These credits directly reduce your monthly premiums for marketplace plans.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  How Premium Tax Credits Work
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Based on your estimated annual income and household size</li>
                  <li>• Applied in advance to lower your monthly premiums (APTC)</li>
                  <li>• Or claimed as a credit when you file your tax return</li>
                  <li>• Available to those earning 100% – 400%+ of the Federal Poverty Level</li>
                  <li>• Income cap temporarily removed through 2025 (premiums capped at 8.5% of income)</li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Reconciling Your Credits</h3>
              <p className="text-slate-600 mb-4">
                When you file your taxes, you'll reconcile the advance credits you received with your actual income:
              </p>
              <ul className="space-y-2 text-slate-700 mb-6">
                <li>• If your actual income was lower than estimated: You may receive additional credit</li>
                <li>• If your actual income was higher than estimated: You may need to repay some credit</li>
                <li>• Report income changes promptly during the year to avoid surprises</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Other Tax-Advantaged Accounts</h2>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Flexible Spending Account (FSA)</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-700 mb-3 text-sm">
                  Employer-sponsored FSAs let you contribute pre-tax dollars for medical expenses. 
                  For 2024, you can contribute up to <strong>$3,200</strong>.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Pros</h4>
                    <ul className="text-slate-700 space-y-1">
                      <li>• Immediate tax savings</li>
                      <li>• No HDHP required</li>
                      <li>• Available with any employer plan</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Cons</h4>
                    <ul className="text-slate-700 space-y-1">
                      <li>• Use-it-or-lose-it (mostly)</li>
                      <li>• Employer-sponsored only</li>
                      <li>• Limited annual contribution</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Health Reimbursement Arrangement (HRA)</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-8">
                <p className="text-slate-700 text-sm">
                  Employer-funded accounts that reimburse employees tax-free for medical expenses and 
                  premiums. Types include Integrated HRA, QSEHRA (for small employers), and ICHRA 
                  (Individual Coverage HRA). Contributions are tax-deductible for employers and tax-free for employees.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Strategic Tax Planning Tips</h2>

              <div className="space-y-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 mb-2">Bunch Medical Expenses</h3>
                  <p className="text-slate-700 text-sm">
                    If you're close to the 7.5% AGI threshold, consider scheduling elective procedures, 
                    dental work, or vision care in the same tax year to maximize your deduction.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 mb-2">Maximize HSA Contributions</h3>
                  <p className="text-slate-700 text-sm">
                    If you have an HDHP, contribute the maximum to your HSA. If you're 55 or older, 
                    don't forget the $1,000 catch-up contribution.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 mb-2">Self-Employed Strategy</h3>
                  <p className="text-slate-700 text-sm">
                    Deduct self-employed health insurance premiums above-the-line (reducing AGI), 
                    which may make you eligible for additional deductions and credits.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 mb-2">Report Income Changes</h3>
                  <p className="text-slate-700 text-sm">
                    If receiving premium tax credits, report income changes to the marketplace promptly 
                    to avoid owing money at tax time or missing out on additional credits.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Record Keeping</h2>
              <p className="text-slate-600 mb-6">
                Good documentation is essential for claiming health insurance tax benefits:
              </p>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <ul className="space-y-2 text-slate-700">
                  <li>• Keep all insurance premium statements and receipts</li>
                  <li>• Save medical bills and payment records</li>
                  <li>• Maintain HSA contribution and distribution records</li>
                  <li>• Store Form 1095-A (Marketplace coverage) with tax documents</li>
                  <li>• Keep Form 1095-B or 1095-C (employer/insurer coverage)</li>
                  <li>• Document mileage for medical transportation</li>
                  <li>• Retain records for at least 3 years (7 years recommended)</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When to Consult a Tax Professional</h2>
              <p className="text-slate-600 mb-6">
                While many people can handle health insurance tax benefits themselves, consider professional help if:
              </p>
              <ul className="space-y-2 text-slate-700 mb-8">
                <li>• You're self-employed with complex business structures</li>
                <li>• You received advance premium tax credits and had significant income changes</li>
                <li>• You're considering long-term care insurance deductions</li>
                <li>• You have questions about which expenses qualify</li>
                <li>• You need to optimize multiple deduction strategies</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Maximize Your Health Insurance Savings</h3>
              <p className="text-emerald-100 mb-6">
                Compare HSA-eligible plans and other tax-advantaged health insurance options.
              </p>
              <Link 
                href="/get-quote?type=health"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
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
                  href="/guides/aca-marketplace-enrollment"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">ACA Marketplace Enrollment</span>
                </Link>
                <Link 
                  href="/guides/hmo-vs-ppo"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Heart className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">HMO vs PPO Comparison</span>
                </Link>
                <Link 
                  href="/guides/medicare-vs-medicaid"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Shield className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">Medicare vs Medicaid</span>
                </Link>
                <Link 
                  href="/guides/short-term-health-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Clock className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">Short-Term Health Insurance</span>
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
