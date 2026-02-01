import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Heart, ArrowRight, CheckCircle, Calendar, DollarSign,
  Users, Star, Shield, Clock, FileText, AlertCircle,
  TrendingUp, Award, MapPin
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'ACA Marketplace Enrollment Guide: How to Enroll & Get Subsidies | MyInsuranceBuddy',
  description: 'Complete guide to ACA marketplace enrollment. Learn about open enrollment, special enrollment periods, premium tax credits, cost-sharing reductions, and metal tiers.',
  keywords: 'ACA marketplace enrollment, Obamacare enrollment, open enrollment period, special enrollment period, premium tax credits, health insurance subsidies',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function ACAEnrollmentPage() {
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
              ACA Marketplace Enrollment Guide: How to Get Covered
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
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
                The Affordable Care Act (ACA) Health Insurance Marketplace has made quality health coverage 
                accessible to millions of Americans. Whether you're enrolling for the first time or looking 
                to switch plans, understanding the enrollment process, available subsidies, and plan options 
                is essential for making the most of this important benefit.
              </p>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl mb-8">
                <p className="text-slate-700">
                  <strong>Good News:</strong> Thanks to the enhanced subsidies from the American Rescue Plan 
                  (extended through 2025), more Americans than ever qualify for financial help to lower their 
                  monthly premiums and out-of-pocket costs.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is the Health Insurance Marketplace?</h2>
              <p className="text-slate-600 mb-6">
                The Health Insurance Marketplace, also known as the Exchange, is a service available in every 
                state where individuals, families, and small businesses can shop for and enroll in affordable 
                health insurance plans. The marketplace was created by the Affordable Care Act (ACA) in 2010 
                and has helped over 35 million Americans obtain coverage.
              </p>

              <div className="bg-rose-50 rounded-xl p-6 border border-rose-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-600" />
                  State-Based vs. Federal Marketplaces
                </h3>
                <p className="text-slate-700 mb-4">
                  Depending on where you live, you'll use different platforms to enroll:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">State-Based Marketplaces</h4>
                    <p className="text-sm text-slate-700">
                      18 states and D.C. run their own marketplaces (e.g., Covered California, NY State of Health, 
                      Get Covered NJ). You'll enroll through your state's specific website.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Federal Marketplace</h4>
                    <p className="text-sm text-slate-700">
                      32 states use Healthcare.gov, the federal marketplace platform, for enrollment.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Enrollment Periods</h2>
              <p className="text-slate-600 mb-6">
                Unlike employer-sponsored insurance, marketplace plans have specific times when you can enroll 
                or make changes to your coverage. Missing these windows could mean waiting months for coverage.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Open Enrollment Period (OEP)</h3>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h4 className="font-bold text-blue-900">2025 Open Enrollment Period</h4>
                </div>
                <p className="text-slate-700 mb-4">
                  <strong>November 1, 2024 – January 15, 2025</strong> (dates may vary slightly by state)
                </p>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li>• Enroll by December 15 for coverage starting January 1</li>
                  <li>• Enroll between December 16 – January 15 for coverage starting February 1</li>
                  <li>• This is the main opportunity to sign up or change plans for the year</li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Special Enrollment Period (SEP)</h3>
              <p className="text-slate-600 mb-4">
                If you experience certain life events, you may qualify for a Special Enrollment Period, 
                allowing you to enroll outside of Open Enrollment. Most SEPs last 60 days from the event date.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Losing existing health coverage (job loss, aging off parent\'s plan)',
                  'Getting married or divorced',
                  'Having a baby, adopting, or fostering a child',
                  'Moving to a new ZIP code or county',
                  'Becoming a U.S. citizen or gaining lawful presence',
                  'Leaving incarceration',
                  'Income changes affecting subsidy eligibility',
                  'Gaining membership in a federally recognized tribe',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 mb-8">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Note: Loss of Coverage
                </h4>
                <p className="text-slate-700 text-sm">
                  Losing job-based coverage, aging off a parent's plan at 26, or losing Medicaid/CHIP eligibility 
                  all trigger a Special Enrollment Period. However, voluntarily quitting coverage or losing it 
                  due to non-payment of premiums does NOT qualify you for an SEP.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Metal Tiers</h2>
              <p className="text-slate-600 mb-6">
                Marketplace plans are categorized into four "metal" tiers based on how costs are split between 
                you and your insurance company. These tiers differ in premium costs and out-of-pocket expenses.
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-amber-800">B</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Bronze Plans</h3>
                      <span className="text-sm text-slate-600">Insurance pays 60%, You pay 40%</span>
                    </div>
                  </div>
                  <ul className="space-y-1 text-slate-700 text-sm ml-13">
                    <li>• Lowest monthly premiums</li>
                    <li>• Highest deductibles and out-of-pocket costs</li>
                    <li>• Best for: Those who want protection from worst-case scenarios and rarely need care</li>
                    <li>• All preventive care covered at 100%</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-300 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-slate-800">S</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Silver Plans</h3>
                      <span className="text-sm text-slate-600">Insurance pays 70%, You pay 30%</span>
                    </div>
                  </div>
                  <ul className="space-y-1 text-slate-700 text-sm ml-13">
                    <li>• Moderate monthly premiums</li>
                    <li>• Moderate deductibles and out-of-pocket costs</li>
                    <li>• <strong>ONLY tier eligible for cost-sharing reductions</strong> (if income qualifies)</li>
                    <li>• Best for: Those who qualify for extra savings or need moderate care</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center border border-amber-300">
                      <span className="font-bold text-amber-700">G</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Gold Plans</h3>
                      <span className="text-sm text-slate-600">Insurance pays 80%, You pay 20%</span>
                    </div>
                  </div>
                  <ul className="space-y-1 text-slate-700 text-sm ml-13">
                    <li>• Higher monthly premiums</li>
                    <li>• Lower deductibles and out-of-pocket costs</li>
                    <li>• Best for: Those who expect to need regular medical care or take expensive medications</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-300">
                      <span className="font-bold text-slate-700">P</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Platinum Plans</h3>
                      <span className="text-sm text-slate-600">Insurance pays 90%, You pay 10%</span>
                    </div>
                  </div>
                  <ul className="space-y-1 text-slate-700 text-sm ml-13">
                    <li>• Highest monthly premiums</li>
                    <li>• Lowest deductibles and out-of-pocket costs</li>
                    <li>• Best for: Those with significant ongoing medical needs</li>
                    <li>• Not available in all areas</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl mb-8">
                <p className="text-slate-700 text-sm">
                  <strong>Important:</strong> The metal tier describes how you and your plan split costs, 
                  NOT the quality of care. All marketplace plans must cover the same essential health benefits 
                  and meet quality standards.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Subsidies (Financial Assistance)</h2>
              <p className="text-slate-600 mb-6">
                The ACA provides two types of financial assistance to help lower the cost of health coverage. 
                In 2024, 4 out of 5 marketplace enrollees received financial help, with average monthly 
                premiums of just $84 after subsidies.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Premium Tax Credits (APTC)</h3>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  How Premium Tax Credits Work
                </h4>
                <p className="text-slate-700 mb-4 text-sm">
                  Premium tax credits reduce your monthly premium payments. They're based on your estimated 
                  annual income and household size.
                </p>
                <div className="space-y-2 text-slate-700 text-sm">
                  <p><strong>Income Eligibility (2024-2025):</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Household income between 100% and 400% of the Federal Poverty Level (FPL)</li>
                    <li>Above 400% FPL may still qualify (subsidy caps premium at 8.5% of income through 2025)</li>
                    <li>Not eligible for other affordable coverage (like Medicaid or employer insurance)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-3">2024 Federal Poverty Level Guidelines (48 Contiguous States)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-200">
                        <th className="p-2 text-left">Household Size</th>
                        <th className="p-2 text-right">100% FPL</th>
                        <th className="p-2 text-right">400% FPL</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr><td className="p-2 border-t">1 person</td><td className="p-2 border-t text-right">$14,580</td><td className="p-2 border-t text-right">$58,320</td></tr>
                      <tr><td className="p-2 border-t">2 people</td><td className="p-2 border-t text-right">$19,720</td><td className="p-2 border-t text-right">$78,880</td></tr>
                      <tr><td className="p-2 border-t">3 people</td><td className="p-2 border-t text-right">$24,860</td><td className="p-2 border-t text-right">$99,440</td></tr>
                      <tr><td className="p-2 border-t">4 people</td><td className="p-2 border-t text-right">$30,000</td><td className="p-2 border-t text-right">$120,000</td></tr>
                      <tr><td className="p-2 border-t">5 people</td><td className="p-2 border-t text-right">$35,140</td><td className="p-2 border-t text-right">$140,560</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Cost-Sharing Reductions (CSR)</h3>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Extra Savings on Silver Plans
                </h4>
                <p className="text-slate-700 mb-4 text-sm">
                  Cost-sharing reductions lower your out-of-pocket costs (deductibles, copayments, coinsurance, 
                  and out-of-pocket maximum) when you choose a Silver plan. These are available in addition 
                  to premium tax credits.
                </p>
                <p className="text-slate-700 text-sm">
                  <strong>Eligibility:</strong> Household income between 100% and 250% of the Federal Poverty Level
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step-by-Step Enrollment Process</h2>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Gather Your Documents</h3>
                    <ul className="space-y-1 text-slate-700 text-sm">
                      <li>• Social Security numbers for all household members</li>
                      <li>• Income documents (W-2s, pay stubs, tax returns)</li>
                      <li>• Immigration documents (if applicable)</li>
                      <li>• Employer coverage information (if offered)</li>
                      <li>• Current health insurance policy numbers (if any)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Create an Account</h3>
                    <p className="text-slate-700 text-sm">
                      Visit <strong>Healthcare.gov</strong> (or your state's marketplace website) and create 
                      an account. You'll provide basic information about yourself and your household.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Complete the Application</h3>
                    <p className="text-slate-700 text-sm">
                      Fill out the detailed application with household information, income details, and 
                      current insurance status. The system will automatically determine your eligibility 
                      for Medicaid, CHIP, or marketplace subsidies.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">4</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Compare Plans</h3>
                    <p className="text-slate-700 text-sm">
                      Review available plans in your area, comparing premiums, deductibles, provider networks, 
                      and prescription drug coverage. Your eligible subsidies will be applied automatically.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">5</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Choose and Enroll</h3>
                    <p className="text-slate-700 text-sm">
                      Select your plan and complete enrollment. Pay your first premium to activate your 
                      coverage. You'll receive insurance cards and plan materials from your chosen insurer.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Essential Health Benefits</h2>
              <p className="text-slate-600 mb-6">
                All ACA marketplace plans must cover these 10 essential health benefit categories:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {[
                  'Ambulatory patient services (outpatient care)',
                  'Emergency services',
                  'Hospitalization',
                  'Pregnancy, maternity, and newborn care',
                  'Mental health and substance use disorder services',
                  'Prescription drugs',
                  'Rehabilitative services and devices',
                  'Laboratory services',
                  'Preventive and wellness services',
                  'Pediatric services (including dental and vision)',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Common Enrollment Mistakes to Avoid</h2>

              <div className="space-y-4 mb-8">
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2">Underestimating Income</h3>
                  <p className="text-slate-700 text-sm">
                    If your actual income is higher than your estimate, you may have to repay some or all 
                    of your premium tax credits when you file your taxes. It's better to slightly overestimate 
                    and receive a refund than to owe money.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2">Not Checking Provider Networks</h3>
                  <p className="text-slate-700 text-sm">
                    Always verify that your preferred doctors, hospitals, and pharmacies are in-network 
                    before selecting a plan. Going out-of-network can result in significantly higher costs 
                    or no coverage at all.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2">Ignoring Prescription Drug Formularies</h3>
                  <p className="text-slate-700 text-sm">
                    If you take medications, check each plan's drug formulary (list of covered drugs) and 
                    tier levels. The same medication can have very different costs across plans.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2">Missing Enrollment Deadlines</h3>
                  <p className="text-slate-700 text-sm">
                    Missing Open Enrollment without a qualifying life event means waiting until the next 
                    year for coverage (unless you qualify for Medicaid or CHIP, which enroll year-round).
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Getting Help with Enrollment</h2>
              <p className="text-slate-600 mb-6">
                Free assistance is available to help you navigate the marketplace:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Healthcare.gov Assistance</h3>
                  <p className="text-slate-700 text-sm">
                    Call <strong>1-800-318-2596</strong> (TTY: 1-855-889-4325) for 24/7 assistance in 
                    multiple languages.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Navigators and Assisters</h3>
                  <p className="text-slate-700 text-sm">
                    Trained, unbiased experts who provide free enrollment help. Find local assistance at 
                    <strong> LocalHelp.Healthcare.gov</strong>.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Insurance Agents/Brokers</h3>
                  <p className="text-slate-700 text-sm">
                    Licensed professionals who can help you compare plans. Their services are free to you 
                    (they're paid by insurance companies).
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Community Organizations</h3>
                  <p className="text-slate-700 text-sm">
                    Many local nonprofits, libraries, and health centers offer enrollment assistance during 
                    Open Enrollment.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">After Enrollment: What to Expect</h2>
              <p className="text-slate-600 mb-6">
                Once you've enrolled in a marketplace plan, here's what happens next:
              </p>

              <ol className="list-decimal pl-6 text-slate-700 space-y-3 mb-8">
                <li><strong>Pay your first premium</strong> – Coverage isn't active until your first payment is received</li>
                <li><strong>Receive your insurance cards</strong> – Typically within 7-14 days of enrollment</li>
                <li><strong>Review your plan materials</strong> – Understand your benefits, network, and costs</li>
                <li><strong>Update your income information</strong> – Report changes promptly as they may affect your subsidies</li>
                <li><strong>File taxes</strong> – You'll receive Form 1095-A to reconcile your premium tax credits</li>
                <li><strong>Annual renewal</strong> – Review and update your coverage each Open Enrollment</li>
              </ol>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Ready to Enroll in Health Coverage?</h3>
              <p className="text-rose-100 mb-6">
                Compare ACA marketplace plans and find out what subsidies you qualify for.
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
                  <TrendingUp className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">HMO vs PPO Comparison</span>
                </Link>
                <Link 
                  href="/guides/medicare-vs-medicaid"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <Heart className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">Medicare vs Medicaid</span>
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
