import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  Shield, ArrowRight, CheckCircle, Clock, Star, AlertCircle,
  Heart, Zap, UserPlus, Users, TrendingUp, DollarSign, FileText,
  PiggyBank, Baby, Briefcase, Activity
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Understanding Life Insurance Riders: Complete Guide | MyInsuranceBuddy',
  description: 'Learn about essential life insurance riders including waiver of premium, accelerated death benefit, child rider, and guaranteed insurability. Enhance your coverage.',
  keywords: 'life insurance riders, waiver of premium rider, accelerated death benefit, child rider life insurance, guaranteed insurability rider, life insurance add-ons',
  openGraph: {
    title: 'Understanding Life Insurance Riders: Complete Guide',
    description: 'A comprehensive guide to life insurance riders that can enhance and customize your coverage.',
  },
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function LifeInsuranceRidersPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Advanced Coverage Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Understanding Life Insurance Riders
            </h1>
            <p className="text-lg text-violet-200 mb-6">
              Enhance your life insurance policy with riders that provide additional benefits, flexibility, and protection for specific situations.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min read</span>
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
                A standard life insurance policy provides essential protection, but riders allow you to customize your coverage
                to better fit your unique needs. Think of riders as add-ons or upgrades that enhance your policy's benefits
                for a relatively small additional cost.
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-600" />
                  What Are Life Insurance Riders?
                </h3>
                <p className="text-slate-700">
                  Riders are optional provisions that can be added to a life insurance policy to provide additional benefits
                  or flexibility. They allow you to tailor your coverage without buying a separate policy. Most riders add
                  between $5 to $50 per month to your premium, depending on the type and amount of coverage.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Essential Life Insurance Riders Explained</h2>

              {/* Waiver of Premium Rider */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Waiver of Premium Rider</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                      Highly Recommended
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 mb-4">
                  This rider waives your premium payments if you become totally disabled and unable to work.
                  Your life insurance coverage continues in full force even though you're no longer paying premiums.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">How It Works:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li>Kicks in after a waiting period (typically 6 months of continuous disability)</li>
                  <li>Covers premiums for the base policy and other riders</li>
                  <li>Remains in effect as long as you're disabled</li>
                  <li>Premiums resume when you recover and return to work</li>
                </ul>

                <h4 className="font-semibold text-slate-900 mb-2">Cost:</h4>
                <p className="text-slate-600 mb-4">
                  Typically 5-15% of your base premium. For a $50/month policy, expect to pay an additional $3-8/month.
                </p>

                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Best for:</strong> Primary breadwinners, self-employed individuals, and anyone whose family
                    depends on their income to maintain insurance coverage.
                  </p>
                </div>
              </div>

              {/* Accelerated Death Benefit Rider */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Accelerated Death Benefit Rider</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded-full font-medium">
                      Often Included Free
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 mb-4">
                  Also known as a living benefits rider, this allows you to access a portion of your death benefit
                  while you're still alive if diagnosed with a terminal illness or specific qualifying conditions.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">Qualifying Conditions Typically Include:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li>Terminal illness with 12-24 months life expectancy</li>
                  <li>Critical illness (heart attack, stroke, cancer)</li>
                  <li>Chronic illness requiring long-term care</li>
                  <li>Permanent nursing home confinement</li>
                </ul>

                <h4 className="font-semibold text-slate-900 mb-2">Key Details:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li>Can access 25-100% of death benefit, up to policy maximums (often $500,000-$1,000,000)</li>
                  <li>Benefits received are generally income tax-free</li>
                  <li>Remaining death benefit goes to beneficiaries upon death</li>
                  <li>May reduce the amount your beneficiaries receive</li>
                </ul>

                <div className="bg-rose-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Best for:</strong> Everyone—many policies include this at no extra cost. If yours doesn't,
                    it's worth adding for peace of mind.
                  </p>
                </div>
              </div>

              {/* Child Rider */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Baby className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Child Rider</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Affordable Option
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 mb-4">
                  Provides term life insurance coverage for all your children under one rider. Typically covers children
                  from 15 days old to age 25, with coverage amounts ranging from $5,000 to $25,000 per child.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">Key Benefits:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li>One rider covers all current and future children</li>
                  <li>Very affordable—typically $5-10 per month regardless of number of children</li>
                  <li>Guaranteed conversion to permanent policy when child reaches adulthood (up to 5x the original amount)</li>
                  <li>No medical exam required for children</li>
                </ul>

                <h4 className="font-semibold text-slate-900 mb-2">Conversion Options:</h4>
                <p className="text-slate-600 mb-4">
                  When a child reaches the maximum age (usually 25), they can convert the coverage to a permanent policy
                  at standard rates without proving insurability. This guarantees they can get life insurance even if they
                  develop health conditions later.
                </p>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Best for:</strong> Parents who want affordable protection for final expenses and guaranteed
                    future insurability for their children without buying separate policies.
                  </p>
                </div>
              </div>

              {/* Guaranteed Insurability Rider */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Guaranteed Insurability Rider</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      Future Planning
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 mb-4">
                  Also called the guaranteed purchase option, this rider allows you to purchase additional life insurance
                  coverage at specified future dates or life events without taking a medical exam or proving insurability.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">How It Works:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li>Option periods typically at ages 25, 28, 31, 34, 37, and 40</li>
                  <li>Also available after major life events: marriage, birth of child, adoption</li>
                  <li>Can purchase additional coverage in specified amounts (e.g., $25,000 increments)</li>
                  <li>Premiums based on your attained age, but health status doesn't matter</li>
                </ul>

                <h4 className="font-semibold text-slate-900 mb-2">Why It's Valuable:</h4>
                <p className="text-slate-600 mb-4">
                  If you develop a serious health condition like diabetes, heart disease, or cancer, you might become
                  uninsurable. This rider guarantees you can still increase your coverage regardless of health changes.
                </p>

                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Best for:</strong> Young adults who expect their insurance needs to grow, and anyone with
                    a family history of health conditions that might affect future insurability.
                  </p>
                </div>
              </div>

              {/* Additional Riders */}
              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Other Important Riders to Consider</h2>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-violet-600" />
                    Spousal Rider
                  </h3>
                  <p className="text-slate-600 text-sm mb-2">
                    Adds term coverage for your spouse under your policy. Similar to a child rider but for your partner.
                    Typically offers $25,000-$100,000 in coverage.
                  </p>
                  <p className="text-xs text-slate-500">
                    <strong>Cost:</strong> $10-30/month depending on spouse's age and coverage amount
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-violet-600" />
                    Accidental Death Benefit Rider
                  </h3>
                  <p className="text-slate-600 text-sm mb-2">
                    Pays an additional death benefit (usually equal to the base amount, effectively doubling the payout)
                    if death occurs due to an accident.
                  </p>
                  <p className="text-xs text-slate-500">
                    <strong>Cost:</strong> Very affordable, often just a few dollars per month
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-violet-600" />
                    Long-Term Care Rider
                  </h3>
                  <p className="text-slate-600 text-sm mb-2">
                    Allows you to use a portion of your death benefit to pay for long-term care expenses if you need
                    assistance with daily living activities. Different from accelerated death benefit—specifically for
                    chronic care needs.
                  </p>
                  <p className="text-xs text-slate-500">
                    <strong>Cost:</strong> 10-20% increase to base premium
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-600" />
                    Term Conversion Rider
                  </h3>
                  <p className="text-slate-600 text-sm mb-2">
                    Guarantees the right to convert your term policy to a permanent policy (whole or universal life)
                    without a medical exam. Must typically convert before age 65 or within the conversion period specified.
                  </p>
                  <p className="text-xs text-slate-500">
                    <strong>Cost:</strong> Usually included free with term policies
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Choose the Right Riders</h2>
              <p className="text-slate-600 mb-6">
                Not every rider makes sense for every person. Here's how to decide which ones to add:
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">Rider Selection Framework</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-violet-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-violet-700">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Assess Your Risks</h4>
                      <p className="text-sm text-slate-600">Consider your occupation, health history, family situation, and financial obligations.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-violet-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-violet-700">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Calculate the Value</h4>
                      <p className="text-sm text-slate-600">Compare the rider cost to buying separate coverage or self-insuring the risk.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-violet-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-violet-700">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Consider Future Needs</h4>
                      <p className="text-sm text-slate-600">Think about how your situation might change over the life of the policy.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-violet-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-violet-700">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Stay Within Budget</h4>
                      <p className="text-sm text-slate-600">Don't let riders push your premium beyond what you can comfortably afford.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Rider Comparison Table</h2>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Rider</th>
                      <th className="px-4 py-3">Typical Cost</th>
                      <th className="px-4 py-3">Best For</th>
                      <th className="px-4 py-3 rounded-tr-lg">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">Waiver of Premium</td>
                      <td className="px-4 py-3 text-slate-600">5-15% of premium</td>
                      <td className="px-4 py-3 text-slate-600">Primary earners</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">High</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Accelerated Death Benefit</td>
                      <td className="px-4 py-3 text-slate-600">Often free</td>
                      <td className="px-4 py-3 text-slate-600">Everyone</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">High</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Child Rider</td>
                      <td className="px-4 py-3 text-slate-600">$5-10/month</td>
                      <td className="px-4 py-3 text-slate-600">Parents</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Medium</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Guaranteed Insurability</td>
                      <td className="px-4 py-3 text-slate-600">5-10% of premium</td>
                      <td className="px-4 py-3 text-slate-600">Young adults</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Medium</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Accidental Death</td>
                      <td className="px-4 py-3 text-slate-600">$5-15/month</td>
                      <td className="px-4 py-3 text-slate-600">High-risk occupations</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Low</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Important Considerations
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Riders must typically be added when you purchase the policy or during specific option periods</li>
                  <li>• Some riders cannot be removed once added; others can be dropped to reduce premiums</li>
                  <li>• Rider benefits may be taxable in certain situations—consult a tax professional</li>
                  <li>• Using accelerated benefits will reduce the death benefit your beneficiaries receive</li>
                  <li>• Not all riders are available with all policy types or from all insurers</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Add Riders to Your Policy</h2>
              <p className="text-slate-600 mb-6">
                Adding riders typically happens during the application process, but some can be added later:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">At Application</h4>
                  <p className="text-slate-600 text-sm">
                    Most riders are selected when you first apply for coverage. This is when you have the most options available.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">After Policy Issue</h4>
                  <p className="text-slate-600 text-sm">
                    Some riders (like child riders) can be added after the policy is in force, usually within the first few years
                    or at specific option dates. May require evidence of insurability for certain riders.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Life Events</h4>
                  <p className="text-slate-600 text-sm">
                    Riders with guaranteed insurability provisions can be exercised after qualifying life events like marriage,
                    birth of a child, or adoption.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Customize Your Perfect Life Insurance Policy</h3>
              <p className="text-violet-100 mb-6">
                Compare quotes from top insurers and explore rider options to build the coverage that's right for you.
              </p>
              <Link
                href="/get-quote?type=life"
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
              >
                Get Customized Quotes
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
                  <DollarSign className="w-5 h-5 text-violet-600" />
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
                  <Heart className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">No-Exam Life Insurance</span>
                </Link>
                <Link
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <FileText className="w-5 h-5 text-violet-600" />
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
