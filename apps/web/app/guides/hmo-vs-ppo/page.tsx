import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Heart, ArrowRight, CheckCircle, XCircle, Shield, 
  DollarSign, Stethoscope, Users, MapPin, Building2,
  FileText, Clock
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'HMO vs PPO: Which Health Insurance Plan is Right for You? | MyInsuranceBuddy',
  description: 'Compare HMO and PPO health insurance plans. Understand costs, flexibility, referrals, out-of-network coverage, and which plan type fits your healthcare needs.',
  keywords: 'HMO vs PPO, health insurance plans, HMO insurance, PPO insurance, health plan comparison, PPO vs HMO costs',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function HMOvsPPOPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Health Insurance Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              HMO vs PPO: Which Health Insurance Plan is Right for You?
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 8 min read</span>
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
                Choosing between an HMO and PPO health insurance plan is one of the most important decisions 
                you'll make during open enrollment. These two popular plan types offer very different 
                approaches to healthcare access, costs, and flexibility. Understanding their key differences 
                can save you thousands of dollars and ensure you get the care you need.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is an HMO?</h2>
              <p className="text-slate-600 mb-6">
                <strong>Health Maintenance Organization (HMO)</strong> plans focus on providing comprehensive 
                care through a specific network of doctors, hospitals, and healthcare providers. HMOs emphasize 
                preventive care and coordinate treatment through a primary care physician (PCP) who serves as 
                your healthcare quarterback.
              </p>

              <div className="bg-rose-50 rounded-xl p-6 border border-rose-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-rose-600" />
                  How HMOs Work
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• You select a primary care physician (PCP) from the plan's network</li>
                  <li>• Your PCP coordinates all your healthcare needs</li>
                  <li>• You need referrals from your PCP to see specialists</li>
                  <li>• Coverage is limited to in-network providers (except emergencies)</li>
                  <li>• Lower monthly premiums and out-of-pocket costs</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is a PPO?</h2>
              <p className="text-slate-600 mb-6">
                <strong>Preferred Provider Organization (PPO)</strong> plans offer more flexibility in choosing 
                healthcare providers. You can see any doctor or specialist you want, either in-network or 
                out-of-network, without needing referrals. This freedom comes with higher costs but provides 
                greater control over your healthcare decisions.
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-violet-600" />
                  How PPOs Work
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• No primary care physician required</li>
                  <li>• See specialists without referrals</li>
                  <li>• Out-of-network coverage available (at higher cost)</li>
                  <li>• Larger network of providers to choose from</li>
                  <li>• Higher monthly premiums but greater flexibility</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Side-by-Side Comparison</h2>
              
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-4 border border-slate-200 font-bold text-slate-900">Feature</th>
                      <th className="text-center p-4 border border-slate-200 font-bold text-rose-700">HMO</th>
                      <th className="text-center p-4 border border-slate-200 font-bold text-violet-700">PPO</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Primary Care Physician</td>
                      <td className="p-4 border border-slate-200 text-center">Required</td>
                      <td className="p-4 border border-slate-200 text-center">Not Required</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Specialist Referrals</td>
                      <td className="p-4 border border-slate-200 text-center">Required</td>
                      <td className="p-4 border border-slate-200 text-center">Not Required</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Out-of-Network Coverage</td>
                      <td className="p-4 border border-slate-200 text-center">
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      </td>
                      <td className="p-4 border border-slate-200 text-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Monthly Premium</td>
                      <td className="p-4 border border-slate-200 text-center text-green-700 font-semibold">Lower</td>
                      <td className="p-4 border border-slate-200 text-center text-amber-700 font-semibold">Higher</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Deductible</td>
                      <td className="p-4 border border-slate-200 text-center text-green-700 font-semibold">Lower/None</td>
                      <td className="p-4 border border-slate-200 text-center text-amber-700 font-semibold">Higher</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Copays</td>
                      <td className="p-4 border border-slate-200 text-center">Fixed, lower amounts</td>
                      <td className="p-4 border border-slate-200 text-center">Percentage or higher fixed</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Provider Network</td>
                      <td className="p-4 border border-slate-200 text-center">Smaller, local</td>
                      <td className="p-4 border border-slate-200 text-center">Larger, nationwide</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Paperwork</td>
                      <td className="p-4 border border-slate-200 text-center">Minimal</td>
                      <td className="p-4 border border-slate-200 text-center">More (for out-of-network)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cost Comparison: Real Numbers</h2>
              <p className="text-slate-600 mb-6">
                Understanding the financial impact of your choice is crucial. Here's what typical costs look like:
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-rose-50 rounded-xl p-6 border border-rose-200">
                  <h3 className="font-bold text-rose-900 mb-4 text-lg">Average HMO Costs</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex justify-between">
                      <span>Monthly Premium (Individual)</span>
                      <span className="font-semibold">$400 - $550</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Monthly Premium (Family)</span>
                      <span className="font-semibold">$1,100 - $1,500</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Deductible</span>
                      <span className="font-semibold">$0 - $1,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Primary Care Visit</span>
                      <span className="font-semibold">$10 - $25</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Specialist Visit</span>
                      <span className="font-semibold">$25 - $50</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-violet-50 rounded-xl p-6 border border-violet-200">
                  <h3 className="font-bold text-violet-900 mb-4 text-lg">Average PPO Costs</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex justify-between">
                      <span>Monthly Premium (Individual)</span>
                      <span className="font-semibold">$550 - $750</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Monthly Premium (Family)</span>
                      <span className="font-semibold">$1,500 - $2,100</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Deductible</span>
                      <span className="font-semibold">$1,000 - $3,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>In-Network Visit</span>
                      <span className="font-semibold">$25 - $45</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Out-of-Network Visit</span>
                      <span className="font-semibold">40% - 50% coinsurance</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When to Choose an HMO</h2>
              <p className="text-slate-600 mb-6">
                An HMO might be the right choice if you:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Want lower monthly premiums and predictable costs',
                  'Prefer having a primary doctor coordinate your care',
                  'Don\'t mind getting referrals for specialists',
                  'Are generally healthy with few medical needs',
                  'Live in an area with good HMO network coverage',
                  'Want minimal paperwork and claims hassle',
                  'Value preventive care and wellness programs',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When to Choose a PPO</h2>
              <p className="text-slate-600 mb-6">
                A PPO might be the better option if you:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Want freedom to see any doctor or specialist',
                  'Have existing relationships with specific doctors',
                  'Travel frequently and need nationwide coverage',
                  'Require specialized care from out-of-network providers',
                  'Don\'t want to deal with referral requirements',
                  'Have complex medical conditions requiring multiple specialists',
                  'Value flexibility over lower costs',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Referrals</h2>
              <p className="text-slate-600 mb-6">
                The referral system is one of the biggest differences between HMOs and PPOs. Here's what you need to know:
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3">HMO Referral Process</h3>
                <ol className="list-decimal pl-6 text-slate-700 space-y-2">
                  <li>Visit your PCP with a health concern</li>
                  <li>PCP evaluates your condition</li>
                  <li>If specialist care is needed, PCP provides referral</li>
                  <li>You schedule with the referred specialist</li>
                  <li>Without referral, the visit isn't covered (except emergencies)</li>
                </ol>
                <p className="text-sm text-slate-600 mt-4 italic">
                  <strong>Note:</strong> Some services like OB/GYN, mental health, and annual eye exams may not require referrals.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Out-of-Network Coverage Explained</h2>
              <p className="text-slate-600 mb-6">
                Emergency situations are treated differently from routine care when it comes to network coverage:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Emergency Care
                  </h3>
                  <p className="text-slate-700 text-sm">
                    Both HMOs and PPOs cover emergency care at in-network rates, even if you go to an 
                    out-of-network emergency room. This is required by law.
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Non-Emergency Care
                  </h3>
                  <p className="text-slate-700 text-sm">
                    HMOs typically don't cover non-emergency out-of-network care. PPOs cover it but 
                    at a significantly higher cost to you.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Other Plan Types to Consider</h2>
              <p className="text-slate-600 mb-6">
                Beyond HMOs and PPOs, you might encounter these plan types:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">EPO (Exclusive Provider Organization)</h3>
                  <p className="text-slate-700 text-sm">
                    Like an HMO, you must stay in-network for coverage (except emergencies). Like a PPO, 
                    you don't need referrals to see specialists. Mid-range premiums.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">POS (Point of Service)</h3>
                  <p className="text-slate-700 text-sm">
                    A hybrid option combining HMO and PPO features. You need a PCP and referrals like an HMO, 
                    but you can go out-of-network like a PPO (at higher cost).
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">HDHP (High Deductible Health Plan)</h3>
                  <p className="text-slate-700 text-sm">
                    Can be HMO or PPO style. Lower premiums, higher deductibles. Often paired with Health 
                    Savings Accounts (HSAs) for tax advantages.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Making Your Decision: Key Questions</h2>
              <p className="text-slate-600 mb-6">
                Ask yourself these questions when choosing between an HMO and PPO:
              </p>

              <div className="bg-rose-50 rounded-xl p-6 border border-rose-200 mb-8">
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>What's my budget for monthly premiums vs. potential out-of-pocket costs?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>Do I have preferred doctors I want to keep seeing?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Stethoscope className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>Do I have chronic conditions requiring specialist care?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>How much do I travel, and will I need care away from home?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>How much paperwork and administrative hassle am I willing to handle?</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Final Thoughts</h2>
              <p className="text-slate-600 mb-6">
                There's no one-size-fits-all answer when choosing between an HMO and PPO. If you prioritize 
                lower costs and don't mind the structure of coordinated care, an HMO could save you significant 
                money. If flexibility and choice are more important than premium savings, a PPO might be worth 
                the extra cost.
              </p>
              <p className="text-slate-600 mb-6">
                Remember that plan details vary significantly between insurance companies. Always review the 
                specific Summary of Benefits and Coverage (SBC) for any plan you're considering, and verify 
                that your preferred doctors and hospitals are in-network before enrolling.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Find the Right Health Insurance Plan</h3>
              <p className="text-rose-100 mb-6">
                Compare HMO, PPO, and other health plans from top-rated insurers in your area.
              </p>
              <Link 
                href="/get-quote?type=health"
                className="inline-flex items-center gap-2 bg-white text-rose-700 px-8 py-3 rounded-xl font-bold hover:bg-rose-50 transition"
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
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <FileText className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">ACA Marketplace Enrollment Guide</span>
                </Link>
                <Link 
                  href="/guides/medicare-vs-medicaid"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <Heart className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">Medicare vs Medicaid</span>
                </Link>
                <Link 
                  href="/guides/short-term-health-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <Clock className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">Short-Term Health Insurance</span>
                </Link>
                <Link 
                  href="/guides/health-insurance-tax"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Health Insurance Tax Deductions</span>
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
