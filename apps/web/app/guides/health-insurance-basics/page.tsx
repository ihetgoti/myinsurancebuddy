import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Heart, ArrowRight, CheckCircle, Shield, AlertTriangle,
  DollarSign, FileText, Clock, Users, Building2,
  Stethoscope, HelpCircle, TrendingUp, Activity, Calculator
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Health Insurance 101: Complete Guide to Understanding Coverage | MyInsuranceBuddy',
  description: 'Learn health insurance basics: premiums, deductibles, copays, coinsurance, out-of-pocket maximums, and networks. Master the essentials of health coverage.',
  keywords: 'health insurance basics, health insurance 101, what is a deductible, copay vs coinsurance, out of pocket maximum, health insurance explained',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function HealthInsuranceBasicsPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Health Insurance 101
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Understanding Health Insurance: The Complete Guide
            </h1>
            <p className="text-rose-100 text-lg mb-6">
              Master the fundamentals of health insurance—from premiums and deductibles to networks 
              and out-of-pocket costs. Make informed decisions about your healthcare coverage.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-rose-200 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 15 min read</span>
              <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-medium">Beginner</span>
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
                Health insurance is one of the most important financial protections you can have—but 
                it's also one of the most confusing. With confusing terminology, complex cost structures, 
                and numerous plan options, many people struggle to understand what they're paying for 
                and how to use their coverage effectively. This comprehensive guide breaks down everything 
                you need to know about health insurance in plain English.
              </p>

              <div className="bg-rose-50 rounded-xl p-6 border border-rose-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-600" />
                  Why Health Insurance Matters
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-rose-700 mb-1">$10,000+</div>
                    <p className="text-slate-600">Average cost of a 3-day hospital stay without insurance</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-rose-700 mb-1">$400,000+</div>
                    <p className="text-slate-600">Average cost of cancer treatment without insurance</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Five Key Components of Health Insurance Costs</h2>

              <p className="text-slate-600 mb-6">
                Understanding these five elements is essential to choosing and using health insurance 
                effectively. Think of them as the building blocks of your healthcare costs.
              </p>

              {/* Premium */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl">1. Premium</h3>
                    <p className="text-slate-500 text-sm">Your monthly membership fee for coverage</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  The premium is the amount you pay each month to keep your health insurance active—whether 
                  you use medical services or not. Think of it like a subscription fee for coverage.
                </p>
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm">What Affects Your Premium?</h4>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>Age (older = higher premium)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>Location</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>Tobacco use</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>Plan type and coverage level</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>Number of people covered</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>Income (for ACA subsidies)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="bg-rose-50 rounded-lg px-4 py-2">
                    <span className="text-slate-600">Average employer plan:</span>
                    <span className="font-bold text-rose-700 ml-2">$100-200/month</span>
                  </div>
                  <div className="bg-rose-50 rounded-lg px-4 py-2">
                    <span className="text-slate-600">Average marketplace plan:</span>
                    <span className="font-bold text-rose-700 ml-2">$300-600/month</span>
                  </div>
                </div>
              </div>

              {/* Deductible */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl">2. Deductible</h3>
                    <p className="text-slate-500 text-sm">What you pay before insurance kicks in</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  Your deductible is the amount you must pay out-of-pocket for covered healthcare services 
                  before your insurance starts paying. Once you hit your deductible, cost-sharing begins.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Low Deductible Plans</h4>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• $0 - $1,500 deductible</li>
                      <li>• Higher monthly premiums</li>
                      <li>• Better for frequent healthcare users</li>
                      <li>• Predictable costs</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2 text-sm">High Deductible Plans</h4>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• $3,000+ deductible</li>
                      <li>• Lower monthly premiums</li>
                      <li>• Better for healthy individuals</li>
                      <li>• Can pair with HSA</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm">Example in Action</h4>
                  <p className="text-slate-600 text-sm">
                    If your deductible is $2,000 and you have a $5,000 surgery, you pay the first $2,000 
                    and insurance helps with the remaining $3,000 (subject to coinsurance).
                  </p>
                </div>
              </div>

              {/* Copay */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl">3. Copayment (Copay)</h3>
                    <p className="text-slate-500 text-sm">Fixed fee for specific services</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  A copay is a fixed amount you pay for specific healthcare services, like doctor visits 
                  or prescriptions. Copays typically don't count toward your deductible but do count 
                  toward your out-of-pocket maximum.
                </p>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 text-sm">Typical Copay Amounts</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="font-bold text-slate-900">$15-30</div>
                      <div className="text-slate-500 text-xs">Primary Care</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="font-bold text-slate-900">$30-60</div>
                      <div className="text-slate-500 text-xs">Specialist</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="font-bold text-slate-900">$50-150</div>
                      <div className="text-slate-500 text-xs">ER Visit</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="font-bold text-slate-900">$5-50</div>
                      <div className="text-slate-500 text-xs">Prescription</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coinsurance */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl">4. Coinsurance</h3>
                    <p className="text-slate-500 text-sm">Percentage of costs you share after deductible</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  After you meet your deductible, coinsurance is the percentage of costs you pay for 
                  covered services. Your insurance pays the rest. Common splits are 80/20 or 70/30.
                </p>
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3 text-sm">How Coinsurance Works</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-right font-bold text-slate-900">80/20</div>
                      <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-violet-500 rounded-full"></div>
                      </div>
                      <div className="text-sm text-slate-600">Insurance pays 80%, you pay 20%</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-right font-bold text-slate-900">70/30</div>
                      <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-violet-500 rounded-full"></div>
                      </div>
                      <div className="text-sm text-slate-600">Insurance pays 70%, you pay 30%</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-right font-bold text-slate-900">60/40</div>
                      <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-3/5 bg-violet-500 rounded-full"></div>
                      </div>
                      <div className="text-sm text-slate-600">Insurance pays 60%, you pay 40%</div>
                    </div>
                  </div>
                </div>
                <div className="bg-violet-50 rounded-lg p-4">
                  <p className="text-slate-700 text-sm">
                    <strong>Example:</strong> With 80/20 coinsurance and a $10,000 hospital bill (after deductible), 
                    you pay $2,000 and insurance pays $8,000.
                  </p>
                </div>
              </div>

              {/* Out-of-Pocket Maximum */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl">5. Out-of-Pocket Maximum</h3>
                    <p className="text-slate-500 text-sm">Your financial protection cap</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  The out-of-pocket maximum is the most you'll pay for covered services in a plan year. 
                  Once you reach this limit, your insurance pays 100% of covered costs for the rest of the year.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2 text-sm">2024 ACA Limits</h4>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Individual: <strong>$9,450</strong> maximum</li>
                      <li>• Family: <strong>$18,900</strong> maximum</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2 text-sm">What Counts?</h4>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>✓ Deductible payments</li>
                      <li>✓ Coinsurance payments</li>
                      <li>✓ Copayments</li>
                      <li>✗ Premiums don't count</li>
                      <li>✗ Out-of-network costs may not count</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-900 text-sm font-medium">
                    This is your financial safety net. Even with a catastrophic illness, your annual 
                    healthcare costs are capped.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Provider Networks</h2>

              <p className="text-slate-600 mb-6">
                Your network determines which doctors you can see and how much you'll pay. Staying 
                in-network saves you money.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900">HMO</h3>
                  </div>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Lower premiums</li>
                    <li>• Requires primary care doctor</li>
                    <li>• Need referrals for specialists</li>
                    <li>• No out-of-network coverage (except emergencies)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900">PPO</h3>
                  </div>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Higher premiums</li>
                    <li>• No referrals needed</li>
                    <li>• Out-of-network coverage available</li>
                    <li>• More provider flexibility</li>
                  </ul>
                </div>
                <div className="bg-violet-50 rounded-xl p-5 border border-violet-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-violet-600" />
                    <h3 className="font-bold text-slate-900">EPO</h3>
                  </div>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Mid-range premiums</li>
                    <li>• No referrals needed</li>
                    <li>• No out-of-network coverage</li>
                    <li>• Must stay in-network</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">In-Network vs. Out-of-Network Costs</h4>
                    <p className="text-slate-600 text-sm mb-2">
                      Seeing an out-of-network provider can cost significantly more—or may not be covered at all.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <span className="font-semibold text-emerald-700">In-Network:</span>
                        <p className="text-slate-600">Negotiated rates, full benefits apply</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="font-semibold text-red-700">Out-of-Network:</span>
                        <p className="text-slate-600">Higher rates, higher deductibles, may not count toward max</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Essential Health Benefits</h2>

              <p className="text-slate-600 mb-6">
                Under the Affordable Care Act (ACA), all marketplace and most employer plans must cover 
                these essential health benefits:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {[
                  'Outpatient care (doctor visits)',
                  'Emergency services',
                  'Hospitalization',
                  'Maternity and newborn care',
                  'Mental health and substance abuse treatment',
                  'Prescription drugs',
                  'Rehabilitative services',
                  'Laboratory services',
                  'Preventive and wellness services',
                  'Pediatric services (including dental/vision)',
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Preventive Care: Free Services</h2>

              <p className="text-slate-600 mb-6">
                Most health plans must cover preventive services at no cost to you—even before you meet 
                your deductible. Take advantage of these free services:
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3">Free Preventive Services Include:</h3>
                <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Annual physical exams</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Screenings (blood pressure, cholesterol, diabetes)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Cancer screenings (mammograms, colonoscopies)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Immunizations and vaccines</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Contraceptive counseling and methods</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Depression screening</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Tobacco cessation programs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Well-woman visits</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Health Savings Accounts (HSAs) and FSAs</h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Health Savings Account (HSA)
                  </h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Available with high-deductible health plans (HDHPs). Triple tax advantage:
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Tax-deductible contributions</li>
                    <li>• Tax-free growth</li>
                    <li>• Tax-free withdrawals for medical expenses</li>
                    <li>• Funds roll over year to year</li>
                    <li>• Can invest for long-term growth</li>
                    <li>• Portable (yours even if you change jobs)</li>
                  </ul>
                  <div className="mt-3 text-sm text-slate-500">
                    2024 Contribution Limits: $4,150 (individual) / $8,300 (family)
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Flexible Spending Account (FSA)
                  </h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Employer-sponsored account with tax benefits:
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Pre-tax contributions</li>
                    <li>• Use for qualified medical expenses</li>
                    <li>• Available with any plan type</li>
                    <li>• "Use it or lose it" (mostly)</li>
                    <li>• Employer may offer grace period</li>
                    <li>• Not portable (tied to employer)</li>
                  </ul>
                  <div className="mt-3 text-sm text-slate-500">
                    2024 Contribution Limit: $3,200
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Choose the Right Health Plan</h2>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">Decision Framework</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-rose-700 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Assess Your Health Needs</h4>
                      <p className="text-slate-600 text-sm">
                        Do you have chronic conditions? Take regular medications? Expect surgery? 
                        Higher usage favors lower deductibles.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-rose-700 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Check Your Doctors</h4>
                      <p className="text-slate-600 text-sm">
                        Make sure your preferred doctors and hospitals are in-network for any plan you're considering.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-rose-700 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Calculate Total Cost</h4>
                      <p className="text-slate-600 text-sm">
                        Don't just look at premiums. Add up: Premiums + Estimated out-of-pocket costs = True annual cost
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-rose-700 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Consider HSA Eligibility</h4>
                      <p className="text-slate-600 text-sm">
                        If you're healthy and want tax advantages, an HDHP with HSA might be optimal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Key Terms Glossary</h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { term: 'EOB (Explanation of Benefits)', def: 'Statement from insurer showing what was billed and what they paid' },
                  { term: 'Formulary', def: 'List of prescription drugs covered by your plan' },
                  { term: 'Prior Authorization', def: 'Approval needed from insurer before certain services are covered' },
                  { term: 'Qualifying Life Event', def: 'Life change that allows you to enroll outside open enrollment' },
                  { term: 'Specialist', def: 'Doctor who focuses on a specific area of medicine' },
                  { term: 'Urgent Care', def: 'Facility for non-emergency issues that need prompt attention' },
                  { term: 'Step Therapy', def: 'Requirement to try less expensive drugs before covered for brand-name' },
                  { term: 'Pre-existing Condition', def: 'Health issue you had before coverage started (ACA prohibits exclusions)' },
                ].map((item) => (
                  <div key={item.term} className="bg-slate-50 rounded-lg p-4">
                    <span className="font-semibold text-slate-900 text-sm">{item.term}</span>
                    <p className="text-slate-600 text-xs mt-1">{item.def}</p>
                  </div>
                ))}
              </div>

              <div className="bg-rose-50 rounded-xl p-6 border border-rose-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-rose-600" />
                  Quick Tips for Using Your Insurance
                </h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>Always verify a provider is in-network before scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>Ask about costs upfront for planned procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>Use urgent care instead of ER for non-life-threatening issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>Take advantage of free preventive services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>Review your EOBs for billing errors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>Use your HSA or FSA for eligible expenses</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Find the Right Health Coverage</h3>
              <p className="text-rose-100 mb-6">
                Compare health insurance plans and find coverage that fits your needs and budget.
              </p>
              <Link 
                href="/get-quote?type=health"
                className="inline-flex items-center gap-2 bg-white text-rose-700 px-8 py-3 rounded-xl font-bold hover:bg-rose-50 transition"
              >
                Get Health Insurance Quotes
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
                  <Users className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-slate-700">HMO vs PPO: Which is Right for You?</span>
                </Link>
                <Link 
                  href="/guides/medicare-vs-medicaid"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Medicare vs Medicaid: Key Differences</span>
                </Link>
                <Link 
                  href="/guides/aca-marketplace-enrollment"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">ACA Marketplace: How to Enroll</span>
                </Link>
                <Link 
                  href="/guides/short-term-health-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-rose-50 transition"
                >
                  <Activity className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Short-Term Health Insurance Pros & Cons</span>
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
