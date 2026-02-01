import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Car, ArrowRight, CheckCircle, Shield, AlertTriangle,
  DollarSign, FileText, Clock, Star, Users, MapPin,
  Gauge, HeartHandshake, Activity, BookOpen
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Auto Insurance Basics: A Complete Beginner\'s Guide | MyInsuranceBuddy',
  description: 'Learn auto insurance fundamentals: types of coverage, state minimum requirements, how to choose the right policy, and common mistakes to avoid as a first-time buyer.',
  keywords: 'auto insurance basics, car insurance guide, car insurance for beginners, types of auto insurance, liability coverage explained, how to buy car insurance',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function AutoInsuranceBasicsPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Beginner's Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Auto Insurance Basics: A Complete Guide for Beginners
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 15 min read</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Essential</span>
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
                Whether you're buying your first car or shopping for better rates, understanding auto 
                insurance is essential. This comprehensive guide breaks down everything you need to know 
                about car insurance—from basic coverage types to money-saving strategies.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Why Is Auto Insurance Required?</h2>
              <p className="text-slate-600 mb-6">
                Auto insurance serves two primary purposes: it protects you financially if you cause an 
                accident, and it ensures you can compensate others for injuries or damage you cause. 
                That's why every state except New Hampshire requires drivers to carry minimum liability coverage.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  The Real Cost of Accidents
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-slate-700">
                  <div>
                    <p className="font-semibold text-sm mb-2">Average Costs (2024):</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Property damage claim: $4,500</li>
                      <li>• Bodily injury claim: $22,000</li>
                      <li>• Comprehensive claim: $2,300</li>
                      <li>• Collision claim: $4,000</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-2">Serious Accidents:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Hospital stay: $10,000+/day</li>
                      <li>• Emergency surgery: $50,000+</li>
                      <li>• Long-term care: $100,000+</li>
                      <li>• Wrongful death: $500,000+</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Types of Auto Insurance Coverage</h2>
              <p className="text-slate-600 mb-6">
                Understanding the different types of coverage is crucial for building a policy that 
                actually protects you. Here's what each type covers:
              </p>

              {/* Liability Coverage */}
              <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl p-6 border border-emerald-200 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Liability Coverage (Required)</h3>
                    <span className="text-xs text-emerald-600 font-medium">Mandatory in nearly all states</span>
                  </div>
                </div>
                <p className="text-slate-700 text-sm mb-3">
                  Covers damage and injuries you cause to others. This is the foundation of any auto 
                  insurance policy and is required by law in almost every state.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-emerald-100">
                    <p className="font-semibold text-slate-900">Bodily Injury (BI)</p>
                    <p className="text-slate-600">Medical expenses, lost wages, pain and suffering for people you injure</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-100">
                    <p className="font-semibold text-slate-900">Property Damage (PD)</p>
                    <p className="text-slate-600">Repairs to other vehicles and property you damage</p>
                  </div>
                </div>
              </div>

              {/* Collision Coverage */}
              <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 border border-blue-200 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Collision Coverage (Optional)</h3>
                    <span className="text-xs text-blue-600 font-medium">Required for financed/leased vehicles</span>
                  </div>
                </div>
                <p className="text-slate-700 text-sm mb-3">
                  Covers damage to your own vehicle from collisions, regardless of who's at fault. 
                  Includes hitting another vehicle, a tree, guardrail, or other objects.
                </p>
                <div className="bg-white rounded-lg p-3 border border-blue-100 text-sm">
                  <p className="text-slate-700">
                    <strong>When it applies:</strong> Accidents where your car hits something, 
                    rollover accidents, hit-and-run damage (in most states)
                  </p>
                </div>
              </div>

              {/* Comprehensive Coverage */}
              <div className="bg-gradient-to-r from-violet-50 to-white rounded-xl p-6 border border-violet-200 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Comprehensive Coverage (Optional)</h3>
                    <span className="text-xs text-violet-600 font-medium">"Full coverage" includes this</span>
                  </div>
                </div>
                <p className="text-slate-700 text-sm mb-3">
                  Covers non-collision damage to your vehicle. Often called "other than collision" coverage.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white rounded-lg p-2 border border-violet-100 text-slate-600">• Theft & vandalism</div>
                  <div className="bg-white rounded-lg p-2 border border-violet-100 text-slate-600">• Fire & explosions</div>
                  <div className="bg-white rounded-lg p-2 border border-violet-100 text-slate-600">• Natural disasters</div>
                  <div className="bg-white rounded-lg p-2 border border-violet-100 text-slate-600">• Falling objects</div>
                  <div className="bg-white rounded-lg p-2 border border-violet-100 text-slate-600">• Animal strikes</div>
                  <div className="bg-white rounded-lg p-2 border border-violet-100 text-slate-600">• Glass damage</div>
                </div>
              </div>

              {/* PIP / Medical */}
              <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-6 border border-amber-200 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Personal Injury Protection (PIP)</h3>
                    <span className="text-xs text-amber-600 font-medium">Required in no-fault states</span>
                  </div>
                </div>
                <p className="text-slate-700 text-sm mb-3">
                  Covers medical expenses for you and your passengers, regardless of who caused the accident. 
                  Required in no-fault states, optional or unavailable in others.
                </p>
                <div className="bg-white rounded-lg p-3 border border-amber-100 text-sm">
                  <p className="text-slate-700">
                    <strong>May also cover:</strong> Lost wages, funeral expenses, essential services 
                    (childcare, house cleaning) if you're unable to perform them
                  </p>
                </div>
              </div>

              {/* Uninsured Motorist */}
              <div className="bg-gradient-to-r from-rose-50 to-white rounded-xl p-6 border border-rose-200 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Uninsured/Underinsured Motorist (UM/UIM)</h3>
                    <span className="text-xs text-rose-600 font-medium">Required in some states, highly recommended</span>
                  </div>
                </div>
                <p className="text-slate-700 text-sm mb-3">
                  Protects you when the at-fault driver has no insurance or insufficient coverage. 
                  About 1 in 8 drivers on the road are uninsured.
                </p>
                <div className="bg-white rounded-lg p-3 border border-rose-100 text-sm">
                  <p className="text-slate-700">
                    <strong>Important:</strong> Hit-and-run accidents are typically covered under UM coverage. 
                    Some states require a police report for these claims.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">State Minimum Requirements</h2>
              <p className="text-slate-600 mb-6">
                Every state sets its own minimum liability requirements. While these minimums satisfy 
                legal requirements, they often don't provide adequate protection in serious accidents.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  Understanding Liability Limits
                </h3>
                <p className="text-slate-700 text-sm mb-4">
                  Liability limits are typically expressed as three numbers, such as <strong>25/50/25</strong>:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-200">
                    <span className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold">25</span>
                    <div>
                      <p className="font-semibold text-slate-900">$25,000</p>
                      <p className="text-sm text-slate-600">Bodily injury per person</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-200">
                    <span className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold">50</span>
                    <div>
                      <p className="font-semibold text-slate-900">$50,000</p>
                      <p className="text-sm text-slate-600">Bodily injury per accident (total)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-200">
                    <span className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center text-violet-700 font-bold">25</span>
                    <div>
                      <p className="font-semibold text-slate-900">$25,000</p>
                      <p className="text-sm text-slate-600">Property damage per accident</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Expert recommendation:</strong> Most insurance professionals recommend at least 
                    <strong> 100/300/100</strong> coverage for adequate protection.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Choose the Right Coverage</h2>
              <p className="text-slate-600 mb-6">
                Selecting the right coverage involves balancing protection with affordability. Here's 
                how to make informed decisions:
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Step 1: Assess Your Assets</h4>
                  <p className="text-slate-600 text-sm">
                    Your liability coverage should at least equal your net worth (assets minus debts). 
                    If you have significant assets or a high income, consider an umbrella policy for 
                    additional protection beyond $300,000-$500,000.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Step 2: Evaluate Your Vehicle</h4>
                  <p className="text-slate-600 text-sm">
                    If your car is worth less than $3,000-$4,000, you might skip collision and comprehensive 
                    coverage. For newer or financed vehicles, full coverage is essential and often required 
                    by lenders.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Step 3: Choose Your Deductible</h4>
                  <p className="text-slate-600 text-sm">
                    Higher deductibles ($1,000+) lower your premium but increase out-of-pocket costs 
                    when you file a claim. Choose an amount you can comfortably afford in an emergency.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Step 4: Consider Add-Ons</h4>
                  <p className="text-slate-600 text-sm">
                    Roadside assistance, rental car reimbursement, and gap insurance can provide valuable 
                    protection. Evaluate based on your lifestyle and peace of mind needs.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Auto Insurance Costs</h2>
              <p className="text-slate-600 mb-6">
                Auto insurance premiums vary widely based on numerous factors. Understanding what 
                influences your rates can help you find savings:
              </p>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3">Average Annual Premiums (2024)</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600 mb-1">$650</p>
                    <p className="text-sm text-slate-600">Minimum Coverage</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600 mb-1">$2,100</p>
                    <p className="text-sm text-slate-600">Full Coverage</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600 mb-1">$4,500</p>
                    <p className="text-sm text-slate-600">Teen Driver Added</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Factors That Affect Your Premium</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {[
                  'Age and driving experience',
                  'Driving record (accidents, tickets)',
                  'Credit score (in most states)',
                  'Vehicle make, model, and year',
                  'ZIP code and garaging location',
                  'Annual mileage driven',
                  'Coverage limits selected',
                  'Deductible amount',
                  'Marital status',
                  'Previous insurance history',
                ].map((factor, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{factor}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Common Mistakes to Avoid</h2>
              <p className="text-slate-600 mb-6">
                First-time buyers and even experienced drivers often make these costly mistakes:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border border-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Buying only state minimum coverage</p>
                    <p className="text-slate-600 text-sm">A single serious accident can easily exceed minimum limits, leaving you personally responsible for tens of thousands of dollars.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border border-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Not comparing multiple quotes</p>
                    <p className="text-slate-600 text-sm">Rates for identical coverage can vary by hundreds or thousands of dollars between insurers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border border-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Lying on your application</p>
                    <p className="text-slate-600 text-sm">Misrepresenting your driving history, address, or vehicle use can result in claim denials or policy cancellation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border border-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Letting coverage lapse</p>
                    <p className="text-slate-600 text-sm">A gap in coverage can significantly increase your future premiums and may violate state laws.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border border-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Ignoring discounts</p>
                    <p className="text-slate-600 text-sm">Most insurers offer discounts for bundling, safe driving, good grades, and more—make sure you're getting them all.</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-600" />
                  Money-Saving Tips
                </h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li>• <strong>Bundle policies:</strong> Save 10-25% by combining auto and home/renters insurance</li>
                  <li>• <strong>Maintain good credit:</strong> In most states, better credit means lower rates</li>
                  <li>• <strong>Ask about discounts:</strong> Safe driver, good student, low mileage, professional affiliations</li>
                  <li>• <strong>Shop around regularly:</strong> Compare quotes every 6-12 months</li>
                  <li>• <strong>Consider usage-based insurance:</strong> Pay-per-mile programs for low-mileage drivers</li>
                  <li>• <strong>Raise your deductible:</strong> Higher out-of-pocket costs = lower premiums</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Getting Started: Your Action Plan</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                  <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</span>
                  <div>
                    <p className="font-semibold text-slate-900">Gather your information</p>
                    <p className="text-slate-600 text-sm">Driver's license, VIN, current mileage, and driving history for all drivers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                  <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</span>
                  <div>
                    <p className="font-semibold text-slate-900">Determine your coverage needs</p>
                    <p className="text-slate-600 text-sm">Use this guide to decide on liability limits and whether you need collision/comprehensive.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                  <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</span>
                  <div>
                    <p className="font-semibold text-slate-900">Get multiple quotes</p>
                    <p className="text-slate-600 text-sm">Compare rates from at least 3-5 insurance companies for the same coverage levels.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                  <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</span>
                  <div>
                    <p className="font-semibold text-slate-900">Review and purchase</p>
                    <p className="text-slate-600 text-sm">Check company ratings, read reviews, and confirm all discounts before buying.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Ready to Find the Best Auto Insurance?</h3>
              <p className="text-blue-100 mb-6">
                Compare quotes from 100+ top insurance companies and save up to $500+ per year.
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
                  href="/guides/how-to-shop"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Gauge className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">How to Shop for Car Insurance</span>
                </Link>
                <Link 
                  href="/guides/liability-vs-full-coverage"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Liability vs Full Coverage</span>
                </Link>
                <Link 
                  href="/guides/discounts"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">Car Insurance Discounts Guide</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
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
