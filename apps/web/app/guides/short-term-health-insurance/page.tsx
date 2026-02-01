import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Heart, ArrowRight, CheckCircle, XCircle, Clock, Shield,
  AlertTriangle, DollarSign, MapPin, FileText, Users,
  Calendar, TrendingUp, AlertCircle, Briefcase
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Short-Term Health Insurance: Pros, Cons & State Regulations | MyInsuranceBuddy',
  description: 'Complete guide to short-term health insurance. Learn what it covers, coverage gaps, when it makes sense, and state-by-state regulations. Compare alternatives.',
  keywords: 'short term health insurance, temporary health insurance, gap coverage, short term medical, short term health plans, bridge insurance',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function ShortTermHealthInsurancePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Clock className="w-4 h-4" />
              Health Insurance Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Short-Term Health Insurance: Complete Guide to Pros & Cons
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 6 min read</span>
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
                Short-term health insurance provides temporary medical coverage for individuals who are 
                between comprehensive health insurance plans. While these plans offer an affordable safety 
                net, they come with significant limitations that every consumer should understand before enrolling.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl mb-8">
                <p className="text-slate-700">
                  <strong>Important:</strong> Short-term plans are not ACA-compliant. They don't cover 
                  pre-existing conditions, preventive care, or essential health benefits required by the 
                  Affordable Care Act. They should not be viewed as a long-term replacement for comprehensive coverage.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is Short-Term Health Insurance?</h2>
              <p className="text-slate-600 mb-6">
                Short-term health insurance, also called temporary health insurance or short-term limited 
                duration insurance (STLDI), provides medical coverage for a limited time period. These plans 
                are designed to bridge gaps in coverage, such as between jobs, after graduation, or while 
                waiting for Medicare or marketplace coverage to begin.
              </p>

              <div className="bg-rose-50 rounded-xl p-6 border border-rose-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-rose-600" />
                  Typical Coverage Periods
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Initial terms typically range from 1 month to 12 months</li>
                  <li>• Federal rules allow renewal up to 36 months total (varies by state)</li>
                  <li>• Some states limit initial terms to 3 months</li>
                  <li>• Coverage can often start as soon as the next day</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Short-Term Plans Cover</h2>
              <p className="text-slate-600 mb-6">
                Short-term plans typically focus on unexpected illnesses and injuries rather than routine 
                or preventive care. Coverage varies significantly by plan and insurer.
              </p>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Typically Covered
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    'Emergency room visits',
                    'Urgent care visits',
                    'Hospital room and board',
                    'Surgical services',
                    'Doctor office visits (limited)',
                    'Some diagnostic services (X-rays, labs)',
                    'Ambulance services',
                    'Limited prescription drug coverage',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Typically NOT Covered
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    'Pre-existing conditions',
                    'Preventive care and screenings',
                    'Maternity and newborn care',
                    'Mental health services',
                    'Substance abuse treatment',
                    'Prescription drugs (comprehensive)',
                    'Chronic disease management',
                    'Rehabilitative services',
                    'Pediatric services (vision, dental)',
                    'Contraception',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Pros of Short-Term Health Insurance</h2>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Lower Monthly Premiums
                  </h3>
                  <p className="text-slate-700 text-sm">
                    Short-term plans typically cost 50-80% less than ACA marketplace plans. Monthly premiums 
                    can range from $50 to $300 depending on age, coverage level, and location.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Year-Round Enrollment
                  </h3>
                  <p className="text-slate-700 text-sm">
                    Unlike ACA plans with limited open enrollment, you can apply for short-term coverage 
                    any time of year with coverage starting as soon as the next day.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-600" />
                    No Network Restrictions
                  </h3>
                  <p className="text-slate-700 text-sm">
                    Many short-term plans allow you to see any doctor or visit any hospital without 
                    network restrictions, giving you flexibility in choosing providers.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    No Open Enrollment Required
                  </h3>
                  <p className="text-slate-700 text-sm">
                    You can cancel at any time without penalty, making these plans ideal for truly 
                    temporary coverage gaps.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Cons of Short-Term Health Insurance</h2>

              <div className="space-y-4 mb-8">
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    No Pre-Existing Condition Coverage
                  </h3>
                  <p className="text-slate-700 text-sm">
                    Short-term plans can deny coverage or claims based on pre-existing conditions. 
                    Even conditions you didn't know about can result in claim denials or policy rescission.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    High Out-of-Pocket Costs
                  </h3>
                  <p className="text-slate-700 text-sm">
                    Annual limits on coverage are common, with some plans capping benefits at $1 million 
                    or less. Deductibles can be high, and coinsurance rates may leave you paying 30-50% of costs.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Limited Essential Benefits
                  </h3>
                  <p className="text-slate-700 text-sm">
                    These plans don't have to cover the 10 essential health benefits required by the ACA, 
                    leaving significant gaps in coverage for maternity care, mental health, and prescriptions.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Not Guaranteed Renewable
                  </h3>
                  <p className="text-slate-700 text-sm">
                    If you develop a health condition while covered, the insurer may refuse to renew your 
                    policy, leaving you uninsured and potentially uninsurable until the next open enrollment period.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    No Tax Penalty Protection
                  </h3>
                  <p className="text-slate-700 text-sm">
                    While the federal individual mandate penalty has been eliminated, some states (CA, NJ, MA, DC) 
                    still have penalties for not having ACA-compliant coverage.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When Short-Term Insurance Makes Sense</h2>
              <p className="text-slate-600 mb-6">
                Short-term health insurance may be appropriate in these situations:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Waiting for employer coverage to begin',
                  'Between jobs and COBRA is too expensive',
                  'Missed open enrollment and don\'t qualify for special enrollment',
                  'Waiting for Medicare eligibility at age 65',
                  'Early retirement before Medicare kicks in',
                  'Graduated from college and off parents\' plan',
                  'Need temporary coverage while traveling',
                  'Waiting for a marketplace plan to start',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When to Avoid Short-Term Insurance</h2>
              <p className="text-slate-600 mb-6">
                Short-term plans are NOT recommended if you:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Have pre-existing health conditions',
                  'Take regular prescription medications',
                  'Are pregnant or planning pregnancy',
                  'Have chronic health conditions (diabetes, asthma, etc.)',
                  'Need mental health or substance abuse treatment',
                  'Qualify for Medicaid or ACA subsidies',
                  'Want comprehensive preventive care coverage',
                  'Need guaranteed coverage renewal',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">State Regulations on Short-Term Insurance</h2>
              <p className="text-slate-600 mb-6">
                States have significant authority to regulate short-term plans. Regulations vary widely:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">States That Ban or Severely Limit Short-Term Plans</h3>
              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'California – Short-term plans prohibited',
                    'New Jersey – Plans limited to 3 months, no renewal',
                    'New York – Short-term plans prohibited',
                    'Massachusetts – Plans limited to 3 months',
                    'Vermont – Plans limited to 3 months',
                    'Colorado – Plans limited to 3 months',
                    'Connecticut – Plans limited to 3 months',
                    'Hawaii – Strict limitations apply',
                    'New Mexico – Plans limited to 3 months',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">States with Favorable Short-Term Regulations</h3>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-8">
                <p className="text-slate-700 mb-4 text-sm">
                  These states generally follow federal guidelines allowing initial terms up to 364 days 
                  and renewals up to 36 months total:
                </p>
                <div className="grid sm:grid-cols-3 gap-2 text-sm text-slate-700">
                  <span>• Texas</span>
                  <span>• Florida</span>
                  <span>• Ohio</span>
                  <span>• Georgia</span>
                  <span>• North Carolina</span>
                  <span>• Michigan</span>
                  <span>• Arizona</span>
                  <span>• Tennessee</span>
                  <span>• Indiana</span>
                  <span>• Missouri</span>
                  <span>• Wisconsin</span>
                  <span>• South Carolina</span>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 mb-8">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Check Your State's Rules
                </h4>
                <p className="text-slate-700 text-sm">
                  Short-term insurance regulations change frequently. Always verify current rules in your 
                  state before purchasing a plan.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Alternatives to Short-Term Health Insurance</h2>
              <p className="text-slate-600 mb-6">
                Before choosing a short-term plan, consider these alternatives:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-2">ACA Marketplace Plans</h3>
                  <p className="text-slate-700 text-sm mb-2">
                    If you qualify for a Special Enrollment Period, marketplace plans offer comprehensive 
                    coverage regardless of pre-existing conditions.
                  </p>
                  <p className="text-slate-700 text-sm">
                    <strong>Best for:</strong> Those with health conditions, expecting significant medical needs, 
                    or who qualify for premium subsidies.
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <h3 className="font-bold text-green-900 mb-2">Medicaid</h3>
                  <p className="text-slate-700 text-sm mb-2">
                    Free or low-cost coverage for low-income individuals and families. Enrollment is 
                    year-round in all states.
                  </p>
                  <p className="text-slate-700 text-sm">
                    <strong>Best for:</strong> Those with limited income who qualify based on their state's criteria.
                  </p>
                </div>
                <div className="bg-violet-50 rounded-xl p-5 border border-violet-200">
                  <h3 className="font-bold text-violet-900 mb-2">COBRA Coverage</h3>
                  <p className="text-slate-700 text-sm mb-2">
                    Continue your employer's health plan for up to 18 months after job loss (longer in some cases).
                  </p>
                  <p className="text-slate-700 text-sm">
                    <strong>Best for:</strong> Those with ongoing medical needs who can afford the full premium cost.
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h3 className="font-bold text-amber-900 mb-2">Health Care Sharing Ministries</h3>
                  <p className="text-slate-700 text-sm mb-2">
                    Faith-based cost-sharing arrangements that are not insurance but may help with medical bills.
                  </p>
                  <p className="text-slate-700 text-sm">
                    <strong>Best for:</strong> Healthy individuals with strong religious convictions who understand the risks.
                  </p>
                </div>
                <div className="bg-rose-50 rounded-xl p-5 border border-rose-200">
                  <h3 className="font-bold text-rose-900 mb-2">Fixed Indemnity Plans</h3>
                  <p className="text-slate-700 text-sm mb-2">
                    Pay fixed amounts for specific services regardless of actual costs. Can supplement other coverage.
                  </p>
                  <p className="text-slate-700 text-sm">
                    <strong>Best for:</strong> Those who want supplemental coverage rather than primary insurance.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Questions to Ask Before Buying</h2>
              <p className="text-slate-600 mb-6">
                If you're considering a short-term plan, get answers to these questions:
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>What is the maximum coverage limit (lifetime and per incident)?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>What is the deductible, and does it apply to all services?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>What percentage of costs am I responsible for after the deductible?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>Are my current doctors and preferred hospitals in the network?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>What prescription drugs are covered, and at what cost?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>Does the plan have a "look-back" period for pre-existing conditions?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>Is the plan renewable, and under what conditions?</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Final Thoughts</h2>
              <p className="text-slate-600 mb-6">
                Short-term health insurance can provide valuable protection during temporary coverage gaps, 
                but it's not a substitute for comprehensive health insurance. The low premiums are attractive, 
                but the coverage gaps and exclusions can leave you vulnerable to significant financial risk 
                if you develop a health condition or need unexpected care.
              </p>
              <p className="text-slate-600 mb-6">
                Before purchasing a short-term plan, carefully consider your health status, financial situation, 
                and coverage needs. If you have pre-existing conditions, take regular medications, or want 
                comprehensive coverage, an ACA marketplace plan—even with higher premiums—may provide better 
                protection and peace of mind.
              </p>
              <p className="text-slate-600 mb-6">
                Remember: the goal of insurance is to protect you from financial catastrophe. A plan with 
                low premiums but high out-of-pocket costs and significant coverage gaps may not provide 
                that protection when you need it most.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Compare All Your Health Insurance Options</h3>
              <p className="text-rose-100 mb-6">
                Find ACA marketplace plans, short-term options, and see if you qualify for subsidies.
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
                  <span className="font-medium text-slate-700">ACA Marketplace Enrollment</span>
                </Link>
                <Link 
                  href="/guides/hmo-vs-ppo"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <Heart className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">HMO vs PPO Comparison</span>
                </Link>
                <Link 
                  href="/guides/medicare-vs-medicaid"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <Shield className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">Medicare vs Medicaid</span>
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
