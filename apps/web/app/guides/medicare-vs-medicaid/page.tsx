import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Heart, ArrowRight, CheckCircle, Users, Calendar,
  DollarSign, Stethoscope, Building2, Shield, Clock,
  FileText, AlertCircle, Star, Briefcase
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Medicare vs Medicaid: Understanding the Key Differences | MyInsuranceBuddy',
  description: 'Learn the differences between Medicare and Medicaid. Compare eligibility requirements, coverage, costs, enrollment periods, and dual eligibility options.',
  keywords: 'Medicare vs Medicaid, Medicare eligibility, Medicaid coverage, dual eligibility, Medicare enrollment, Medicaid benefits',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function MedicareVsMedicaidPage() {
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
              Medicare vs Medicaid: Understanding the Key Differences
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min read</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Intermediate</span>
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
                Medicare and Medicaid are two cornerstone government health insurance programs in the United States, 
                yet they serve distinctly different populations and have different eligibility requirements, coverage 
                options, and costs. Understanding these differences is crucial for making informed healthcare decisions 
                for yourself or aging family members.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl mb-8">
                <p className="text-slate-700">
                  <strong>Quick Distinction:</strong> Medicare is primarily an <strong>age-based</strong> federal program 
                  for seniors 65+ and certain younger people with disabilities. Medicaid is primarily an <strong>income-based</strong> 
                  joint federal-state program for low-income individuals and families of all ages.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is Medicare?</h2>
              <p className="text-slate-600 mb-6">
                Medicare is a federal health insurance program established in 1965 that primarily serves Americans 
                aged 65 and older, as well as some younger individuals with specific disabilities or medical conditions. 
                The program is administered uniformly nationwide by the Centers for Medicare & Medicaid Services (CMS).
              </p>

              <div className="bg-rose-50 rounded-xl p-6 border border-rose-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-600" />
                  The Four Parts of Medicare
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-rose-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-rose-800">A</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Hospital Insurance (Part A)</h4>
                      <p className="text-slate-700 text-sm">Covers inpatient hospital stays, skilled nursing facility care, hospice care, and limited home health services. Most people don't pay a premium for Part A.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-rose-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-rose-800">B</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Medical Insurance (Part B)</h4>
                      <p className="text-slate-700 text-sm">Covers doctor visits, outpatient care, preventive services, and medical supplies. Requires a monthly premium (typically $174.70 in 2024).</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-rose-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-rose-800">C</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Medicare Advantage (Part C)</h4>
                      <p className="text-slate-700 text-sm">Alternative to Original Medicare offered by private insurers. Combines Parts A and B, often includes prescription drug coverage and additional benefits.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-rose-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-rose-800">D</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Prescription Drug Coverage (Part D)</h4>
                      <p className="text-slate-700 text-sm">Optional coverage for prescription medications offered by private insurers approved by Medicare.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is Medicaid?</h2>
              <p className="text-slate-600 mb-6">
                Medicaid is a joint federal and state program that provides health coverage to millions of 
                low-income Americans, including eligible low-income adults, children, pregnant women, elderly 
                adults, and people with disabilities. Unlike Medicare, Medicaid programs vary significantly 
                from state to state.
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  Medicaid Key Features
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Jointly funded by federal government and individual states</li>
                  <li>• Each state administers its own program within federal guidelines</li>
                  <li>• Coverage and eligibility vary significantly by state</li>
                  <li>• Generally low or no cost to beneficiaries</li>
                  <li>• Covers long-term care services that Medicare doesn't cover</li>
                  <li>• Includes the Children's Health Insurance Program (CHIP)</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Eligibility Requirements</h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-rose-50 rounded-xl p-6 border border-rose-200">
                  <h3 className="font-bold text-rose-900 mb-4 text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Medicare Eligibility
                  </h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Age 65 or older (U.S. citizens or legal residents of 5+ years)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Under 65 with certain disabilities (after 24 months of SSDI)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Any age with End-Stage Renal Disease (ESRD)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Any age with ALS (Lou Gehrig's disease)
                    </li>
                  </ul>
                  <p className="text-sm text-slate-600 mt-4 italic">
                    Income level is not a factor for Medicare eligibility.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 mb-4 text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Medicaid Eligibility
                  </h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Low-income adults (criteria varies by state)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Pregnant women meeting income requirements
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Children in low-income families
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Elderly and disabled individuals with limited resources
                    </li>
                  </ul>
                  <p className="text-sm text-slate-600 mt-4 italic">
                    Income limits vary by state; some states expanded Medicaid under the ACA.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Comprehensive Comparison</h2>

              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-4 border border-slate-200 font-bold text-slate-900">Feature</th>
                      <th className="text-center p-4 border border-slate-200 font-bold text-rose-700">Medicare</th>
                      <th className="text-center p-4 border border-slate-200 font-bold text-emerald-700">Medicaid</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 text-sm">
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Primary Basis</td>
                      <td className="p-4 border border-slate-200 text-center">Age/Disability</td>
                      <td className="p-4 border border-slate-200 text-center">Income/Resources</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Administration</td>
                      <td className="p-4 border border-slate-200 text-center">Federal (Uniform nationwide)</td>
                      <td className="p-4 border border-slate-200 text-center">State (Varies by state)</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Monthly Premium</td>
                      <td className="p-4 border border-slate-200 text-center">Part A: Usually $0<br/>Part B: $174.70 (2024)</td>
                      <td className="p-4 border border-slate-200 text-center">Generally $0 or minimal</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Deductibles & Copays</td>
                      <td className="p-4 border border-slate-200 text-center">Yes, varies by part</td>
                      <td className="p-4 border border-slate-200 text-center">Minimal or none</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Long-Term Care</td>
                      <td className="p-4 border border-slate-200 text-center">Limited coverage only</td>
                      <td className="p-4 border border-slate-200 text-center">Comprehensive coverage</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200 font-medium">Provider Network</td>
                      <td className="p-4 border border-slate-200 text-center">Broad nationwide</td>
                      <td className="p-4 border border-slate-200 text-center">State-specific networks</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200 font-medium">Prescription Drugs</td>
                      <td className="p-4 border border-slate-200 text-center">Part D (separate enrollment)</td>
                      <td className="p-4 border border-slate-200 text-center">Included in most states</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Coverage Differences</h2>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">What Medicare Covers</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  'Inpatient hospital care (Part A)',
                  'Skilled nursing facility care (limited)',
                  'Hospice care',
                  'Doctor visits and outpatient care (Part B)',
                  'Preventive services',
                  'Durable medical equipment',
                  'Mental health services',
                  'Prescription drugs (with Part D)',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-8">
                <p className="text-slate-700 text-sm">
                  <strong>Important Gap:</strong> Medicare does NOT cover most long-term care (nursing home stays 
                  beyond 100 days), dental care, eye exams for glasses, hearing aids, or routine foot care. 
                  Many beneficiaries purchase Medigap policies or Medicare Advantage plans to fill these gaps.
                </p>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">What Medicaid Covers</h3>
              <p className="text-slate-600 mb-4">
                Medicaid covers all mandatory services plus optional services that vary by state:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  'Inpatient and outpatient hospital services',
                  'Physician services',
                  'Laboratory and X-ray services',
                  'Nursing facility services',
                  'Home health services',
                  'EPSDT (Early Periodic Screening) for children',
                  'Family planning services',
                  'Long-term care (nursing homes)',
                  'Dental services (varies by state)',
                  'Vision services (varies by state)',
                  'Prescription drugs',
                  'Physical therapy',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Enrollment Periods</h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-rose-50 rounded-xl p-6 border border-rose-200">
                  <h3 className="font-bold text-rose-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Medicare Enrollment
                  </h3>
                  <ul className="space-y-3 text-slate-700 text-sm">
                    <li>
                      <strong>Initial Enrollment Period:</strong> 7-month window (3 months before, month of, 3 months after your 65th birthday)
                    </li>
                    <li>
                      <strong>General Enrollment Period:</strong> January 1 - March 31 each year (may incur penalties)
                    </li>
                    <li>
                      <strong>Open Enrollment:</strong> October 15 - December 7 (for Medicare Advantage and Part D changes)
                    </li>
                    <li>
                      <strong>Special Enrollment Periods:</strong> Available for qualifying life events
                    </li>
                  </ul>
                </div>
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Medicaid Enrollment
                  </h3>
                  <ul className="space-y-3 text-slate-700 text-sm">
                    <li>
                      <strong>Year-Round Enrollment:</strong> No limited enrollment periods
                    </li>
                    <li>
                      <strong>Apply Anytime:</strong> Through your state's Medicaid agency or Healthcare.gov
                    </li>
                    <li>
                      <strong>Coverage Retroactivity:</strong> Can cover medical bills from up to 3 months prior to application
                    </li>
                    <li>
                      <strong>Fast Processing:</strong> Urgent applications for pregnant women processed within specific timeframes
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Dual Eligibility: Having Both Medicare and Medicaid</h2>
              <p className="text-slate-600 mb-6">
                Some individuals qualify for both Medicare and Medicaid, known as "dual eligible" beneficiaries. 
                This typically includes low-income seniors and people with disabilities who qualify for Medicare 
                based on age/disability and Medicaid based on income.
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-violet-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Benefits of Dual Eligibility
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Medicaid pays Medicare premiums, deductibles, and coinsurance</li>
                  <li>• Coverage for services Medicare doesn't cover (dental, vision, long-term care)</li>
                  <li>• Prescription drug coverage at minimal cost</li>
                  <li>• Special Medicare Advantage plans (D-SNPs) designed for dual eligibles</li>
                  <li>• Care coordination services</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cost Comparison: What You Actually Pay</h2>

              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-4 border border-slate-200 font-bold text-slate-900">Cost Type</th>
                      <th className="text-center p-4 border border-slate-200 font-bold text-rose-700">Medicare</th>
                      <th className="text-center p-4 border border-slate-200 font-bold text-emerald-700">Medicaid</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 text-sm">
                    <tr>
                      <td className="p-4 border border-slate-200">Monthly Premium</td>
                      <td className="p-4 border border-slate-200 text-center">$0 - $505 (Part A)<br/>$174.70+ (Part B)</td>
                      <td className="p-4 border border-slate-200 text-center">$0 (most states)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200">Hospital Deductible</td>
                      <td className="p-4 border border-slate-200 text-center">$1,632 per benefit period (2024)</td>
                      <td className="p-4 border border-slate-200 text-center">$0 or minimal</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200">Annual Deductible</td>
                      <td className="p-4 border border-slate-200 text-center">$240 (Part B, 2024)</td>
                      <td className="p-4 border border-slate-200 text-center">$0 or minimal</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-4 border border-slate-200">Coinsurance</td>
                      <td className="p-4 border border-slate-200 text-center">Typically 20% for Part B services</td>
                      <td className="p-4 border border-slate-200 text-center">Minimal or $0</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-slate-200">Out-of-Pocket Maximum</td>
                      <td className="p-4 border border-slate-200 text-center">No limit (Original Medicare)<br/>$8,850 max (Advantage plans)</td>
                      <td className="p-4 border border-slate-200 text-center">Minimal or $0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Making Your Decision</h2>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">Questions to Consider</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Am I approaching age 65 or do I have a qualifying disability?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Does my income qualify for Medicaid in my state?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Do I need long-term care coverage?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Can I afford Medicare premiums and out-of-pocket costs?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Do my preferred doctors accept the coverage?</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Apply</h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-rose-50 rounded-xl p-6 border border-rose-200">
                  <h3 className="font-bold text-rose-900 mb-3">Applying for Medicare</h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li>• Online at <strong>SSA.gov</strong> (3 months before turning 65)</li>
                    <li>• Call Social Security at <strong>1-800-772-1213</strong></li>
                    <li>• Visit your local Social Security office</li>
                    <li>• If receiving Social Security benefits, automatic enrollment at 65</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 mb-3">Applying for Medicaid</h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li>• Online at <strong>Healthcare.gov</strong> or your state marketplace</li>
                    <li>• Contact your <strong>state Medicaid agency</strong> directly</li>
                    <li>• Visit a local <strong>Department of Human Services</strong> office</li>
                    <li>• Apply year-round; no limited enrollment periods</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Final Thoughts</h2>
              <p className="text-slate-600 mb-6">
                Understanding the differences between Medicare and Medicaid helps you make informed decisions 
                about your healthcare coverage. While Medicare serves primarily older Americans and those with 
                specific disabilities regardless of income, Medicaid provides a safety net for low-income 
                individuals of all ages.
              </p>
              <p className="text-slate-600 mb-6">
                Many people find themselves navigating both systems, especially as they age and their financial 
                situations change. If you're unsure which program you qualify for or how they might work together, 
                consider speaking with a licensed insurance agent or contacting your State Health Insurance 
                Assistance Program (SHIP) for free, unbiased counseling.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Need Help Navigating Your Options?</h3>
              <p className="text-rose-100 mb-6">
                Compare Medicare Advantage, Medigap, and health insurance plans from top-rated carriers.
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
                  href="/guides/hmo-vs-ppo"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <Stethoscope className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">HMO vs PPO Comparison</span>
                </Link>
                <Link 
                  href="/guides/aca-marketplace-enrollment"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <FileText className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">ACA Marketplace Enrollment</span>
                </Link>
                <Link 
                  href="/guides/health-insurance-tax"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Health Insurance Tax Deductions</span>
                </Link>
                <Link 
                  href="/guides/short-term-health-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
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
