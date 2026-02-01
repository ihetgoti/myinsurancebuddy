import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, ArrowRight, CheckCircle, AlertTriangle, Car,
  DollarSign, Scale, Clock, Info, TrendingUp, XCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Liability vs Full Coverage: Which Auto Insurance Do You Need? | MyInsuranceBuddy',
  description: 'Understand the difference between liability and full coverage auto insurance. Learn when to choose each, costs, and recommendations based on your vehicle age and value.',
  keywords: 'liability vs full coverage, liability insurance, full coverage car insurance, collision coverage, comprehensive coverage, minimum coverage',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function LiabilityVsFullCoveragePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Scale className="w-4 h-4" />
              Coverage Comparison
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Liability vs Full Coverage: Which Auto Insurance Do You Need?
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min read</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Essential Guide</span>
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
                Choosing between liability-only and full coverage auto insurance is one of the most important decisions 
                you'll make as a driver. The right choice depends on your vehicle's value, your financial situation, 
                and your risk tolerance. This comprehensive guide will help you make an informed decision.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is Liability Insurance?</h2>
              <p className="text-slate-600 mb-6">
                Liability insurance is the minimum coverage required by law in almost every state. It covers damage 
                and injuries you cause to others in an accident where you're at fault. However, it does <strong>not</strong> 
                cover damage to your own vehicle or your own injuries.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  What Liability Insurance Covers
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span><strong>Bodily Injury Liability:</strong> Medical expenses, lost wages, and legal fees for people you injure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span><strong>Property Damage Liability:</strong> Repairs to other vehicles and property you damage</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <h4 className="font-semibold text-slate-900 mb-2">What It Does NOT Cover:</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Damage to your own vehicle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Your medical expenses or lost wages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Theft, vandalism, or natural disasters</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is Full Coverage Insurance?</h2>
              <p className="text-slate-600 mb-6">
                Full coverage isn't actually a specific insurance product—it's a combination of coverages that 
                provides comprehensive protection. It includes liability insurance plus coverage for your own vehicle.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    Collision Coverage
                  </h4>
                  <p className="text-sm text-slate-600">
                    Pays for damage to your vehicle from collisions with other vehicles or objects, regardless of fault.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-600" />
                    Comprehensive Coverage
                  </h4>
                  <p className="text-sm text-slate-600">
                    Covers non-collision damage: theft, vandalism, fire, weather damage, and animal collisions.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cost Comparison: Liability vs Full Coverage</h2>
              <p className="text-slate-600 mb-6">
                Full coverage typically costs 2-3 times more than liability-only insurance. Here's a breakdown of 
                average annual premiums:
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 text-center">
                  <div className="text-3xl font-bold text-emerald-700 mb-1">$600</div>
                  <div className="text-sm text-slate-600 font-medium">Liability Only</div>
                  <div className="text-xs text-slate-500 mt-1">Minimum coverage</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-1">$1,800</div>
                  <div className="text-sm text-slate-600 font-medium">Full Coverage</div>
                  <div className="text-xs text-slate-500 mt-1">Liability + Collision + Comprehensive</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-center">
                  <div className="text-3xl font-bold text-amber-700 mb-1">$3,200+</div>
                  <div className="text-sm text-slate-600 font-medium">Full Coverage</div>
                  <div className="text-xs text-slate-500 mt-1">For young drivers (under 25)</div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  Factors Affecting Your Premium
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Vehicle value and age</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Driving record and claims history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Your age and credit score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Location and zip code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Deductible amount chosen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Insurance company rates</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When to Choose Liability Only</h2>
              <p className="text-slate-600 mb-6">
                Liability-only insurance may be the right choice in these situations:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Your Car is Older or Low Value</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      If your vehicle is worth less than $3,000-$4,000, the cost of full coverage may exceed 
                      the value of your car. Consider dropping collision and comprehensive coverage.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">You're on a Tight Budget</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      If you need to minimize monthly expenses and can afford to replace your car out-of-pocket 
                      if it's totaled, liability-only can save you hundreds annually.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">You Own Your Car Free and Clear</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      If you don't have a loan or lease requiring full coverage, you have the flexibility 
                      to choose liability-only.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When You Need Full Coverage</h2>
              <p className="text-slate-600 mb-6">
                Full coverage is essential or highly recommended in these scenarios:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">You Have a Car Loan or Lease</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Lenders and leasing companies require full coverage to protect their investment. 
                      Dropping coverage could violate your contract.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Your Car is Worth More Than $5,000</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      If replacing your vehicle would cause financial hardship, full coverage provides 
                      essential protection for your asset.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">You Can't Afford to Replace Your Car</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      If losing your vehicle to an accident would significantly impact your life 
                      (work, family obligations), full coverage is worth the extra cost.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Vehicle Age Recommendations</h2>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-3 font-bold text-slate-900 rounded-tl-lg">Vehicle Age</th>
                      <th className="text-left p-3 font-bold text-slate-900">Typical Value</th>
                      <th className="text-left p-3 font-bold text-slate-900 rounded-tr-lg">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 text-slate-700">0-3 years</td>
                      <td className="p-3 text-slate-700">$20,000+</td>
                      <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Full Coverage Required</span></td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="p-3 text-slate-700">4-7 years</td>
                      <td className="p-3 text-slate-700">$10,000-$20,000</td>
                      <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Full Coverage Recommended</span></td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 text-slate-700">8-10 years</td>
                      <td className="p-3 text-slate-700">$5,000-$10,000</td>
                      <td className="p-3"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium">Evaluate Annually</span></td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 text-slate-700 rounded-bl-lg">10+ years</td>
                      <td className="p-3 text-slate-700">Under $5,000</td>
                      <td className="p-3 rounded-br-lg"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">Liability May Suffice</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Common Mistakes to Avoid</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Dropping Coverage Too Early</p>
                    <p className="text-slate-600 text-sm">Don't drop full coverage just because your car is paid off. Consider the actual value and your financial situation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Buying Only State Minimum Liability</p>
                    <p className="text-slate-600 text-sm">Minimum coverage often isn't enough to protect your assets in a serious accident. Consider higher limits.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Not Considering Gap Insurance</p>
                    <p className="text-slate-600 text-sm">If you owe more than your car is worth, consider gap insurance to cover the difference.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Bottom Line</h2>
              <div className="bg-slate-900 rounded-xl p-6 text-white mb-8">
                <p className="mb-4">
                  The choice between liability and full coverage depends on your unique situation. Use this rule of thumb:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>If your annual premium for collision + comprehensive exceeds 10% of your car's value, consider dropping them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Never drop liability coverage—it's legally required and protects your assets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Always maintain full coverage if you have a loan, lease, or can't afford to replace your vehicle</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Compare Liability and Full Coverage Quotes</h3>
              <p className="text-blue-100 mb-6">
                See how much you could save and find the right coverage for your needs.
              </p>
              <Link 
                href="/get-quote?type=auto"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
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
                  href="/guides/auto-insurance-basics"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Car className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Auto Insurance Basics</span>
                </Link>
                <Link 
                  href="/guides/cheapest-car-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">How to Get Cheap Car Insurance</span>
                </Link>
                <Link 
                  href="/guides/factors-affecting-premium"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">What Affects Your Premium</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Info className="w-5 h-5 text-amber-600" />
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
