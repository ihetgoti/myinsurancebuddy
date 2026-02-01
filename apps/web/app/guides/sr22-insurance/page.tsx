import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  FileText, ArrowRight, CheckCircle, AlertTriangle, Car,
  DollarSign, Clock, Shield, AlertOctagon, Info, MapPin,
  Phone, Calendar, XCircle, Award
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'SR-22 Insurance: What It Is, Who Needs It & How to Get It | MyInsuranceBuddy',
  description: 'Complete guide to SR-22 insurance. Learn what an SR-22 is, who needs it, how to file, costs, duration requirements, and state-specific regulations.',
  keywords: 'SR22 insurance, SR-22 filing, SR22 certificate, high risk auto insurance, SR22 cost, SR22 requirements, how long do I need SR22',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function SR22InsurancePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              High-Risk Insurance Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              SR-22 Insurance: What It Is, Who Needs It & How to Get It
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min read</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">High-Risk</span>
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
                If you've been told you need an SR-22, you might be confused about what it means and why you need it. 
                Despite common misconceptions, an SR-22 is not actually insurance—it's a certificate of financial 
                responsibility. This guide explains everything you need to know about SR-22 requirements, 
                how to obtain one, and what to expect during the filing period.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is an SR-22?</h2>
              <p className="text-slate-600 mb-6">
                An SR-22 (sometimes called an SR-22 bond or certificate of financial responsibility) is a document 
                your insurance company files with your state's Department of Motor Vehicles (DMV) to prove you carry 
                the minimum required auto insurance coverage.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Important Clarifications
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>An SR-22 is <strong>NOT</strong> a type of insurance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>An SR-22 does <strong>NOT</strong> provide additional coverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span>An SR-22 is a <strong>form filed by your insurer</strong> with the state</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span>It <strong>proves</strong> you have the required minimum liability coverage</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Who Needs an SR-22?</h2>
              <p className="text-slate-600 mb-6">
                SR-22 requirements typically follow serious driving violations or incidents that demonstrate 
                a pattern of high-risk behavior. Here are the most common reasons states require an SR-22:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { reason: 'DUI/DWI Conviction', severity: 'High', desc: 'Driving under the influence of alcohol or drugs' },
                  { reason: 'Driving Without Insurance', severity: 'Medium', desc: 'Caught operating a vehicle without coverage' },
                  { reason: 'At-Fault Accidents', severity: 'Medium', desc: 'Serious accidents while uninsured' },
                  { reason: 'License Suspension', severity: 'High', desc: 'License suspended due to violations' },
                  { reason: 'Multiple Violations', severity: 'Medium', desc: 'Accumulating too many points on your record' },
                  { reason: 'License Reinstatement', severity: 'Medium', desc: 'Required to restore driving privileges' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900">{item.reason}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${item.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.severity} Impact
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Get an SR-22</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Contact Your Insurance Company</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Call your current insurer and inform them you need an SR-22 filing. Not all companies 
                      offer SR-22 services—if yours doesn't, you'll need to find a new insurer.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Purchase Minimum Required Coverage</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Ensure your policy meets or exceeds your state's minimum liability requirements. 
                      You cannot file an SR-22 without active coverage.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Pay the SR-22 Filing Fee</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Most insurers charge a one-time filing fee between $15 and $50. This is separate from 
                      your premium and any reinstatement fees owed to the DMV.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Wait for Confirmation</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Your insurer will file the SR-22 electronically with the state. Processing typically 
                      takes 1-3 business days. Request confirmation that the filing was received.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Does SR-22 Insurance Cost?</h2>
              <p className="text-slate-600 mb-6">
                The SR-22 filing itself is relatively inexpensive, but the underlying violations that require 
                it will significantly increase your insurance premiums.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">$15-50</div>
                  <div className="text-sm text-slate-600 font-medium">SR-22 Filing Fee</div>
                  <div className="text-xs text-slate-500 mt-1">One-time charge by insurer</div>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200 text-center">
                  <div className="text-3xl font-bold text-red-700 mb-1">$1,500+</div>
                  <div className="text-sm text-slate-600 font-medium">Annual Increase</div>
                  <div className="text-xs text-slate-500 mt-1">Additional premium vs. standard</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-center">
                  <div className="text-3xl font-bold text-amber-700 mb-1">$300-800</div>
                  <div className="text-sm text-slate-600 font-medium">Reinstatement Fee</div>
                  <div className="text-xs text-slate-500 mt-1">Paid to DMV (varies by state)</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-4">Estimated Annual Premiums with SR-22</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Standard Driver (for comparison)</span>
                    <span className="font-bold text-emerald-600">~$1,500/year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">SR-22: Driving Without Insurance</span>
                    <span className="font-bold text-amber-600">~$2,500/year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">SR-22: Multiple Violations</span>
                    <span className="font-bold text-amber-600">~$3,000/year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">SR-22: DUI/DWI</span>
                    <span className="font-bold text-red-600">~$4,000+/year</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Long Do You Need an SR-22?</h2>
              <p className="text-slate-600 mb-6">
                Most states require you to maintain an SR-22 for 3 years from the date your license was 
                reinstated or from the date of the violation. However, requirements vary:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Standard Duration: 3 Years
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Most states require 3 years of continuous SR-22 coverage. The clock typically starts 
                    from your conviction date or license reinstatement date.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-red-600" />
                    Extended Duration: 5 Years
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Some states or serious violations (repeat DUIs, major accidents) may require 5 years 
                    or longer. Multiple violations can reset the clock.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Critical: Don't Let Coverage Lapse
                </h4>
                <p className="text-slate-700 text-sm mb-3">
                  If your insurance lapses or cancels during the SR-22 period, your insurer is required 
                  to notify the state immediately. This typically results in:
                </p>
                <ul className="space-y-1 text-slate-700 text-sm">
                  <li>• Immediate license suspension</li>
                  <li>• Reset of your SR-22 time requirement</li>
                  <li>• Additional fines and reinstatement fees</li>
                  <li>• Potential vehicle registration suspension</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">State-Specific SR-22 Requirements</h2>
              <p className="text-slate-600 mb-6">
                While most states use the SR-22 system, there are important variations to be aware of:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    States Without SR-22
                  </h4>
                  <p className="text-slate-700 text-sm mb-2">
                    These states don't use the SR-22 system but have alternative requirements:
                  </p>
                  <ul className="space-y-1 text-slate-700 text-sm">
                    <li>• <strong>Delaware:</strong> Uses SR-22 in specific cases only</li>
                    <li>• <strong>Kentucky:</strong> Uses alternative certification</li>
                    <li>• <strong>Minnesota:</strong> Uses different filing system</li>
                    <li>• <strong>New Mexico:</strong> No SR-22 requirement</li>
                    <li>• <strong>New York:</strong> Uses different processes</li>
                    <li>• <strong>North Carolina:</strong> Uses SR-22 only for out-of-state filings</li>
                    <li>• <strong>Oklahoma:</strong> Alternative systems</li>
                    <li>• <strong>Pennsylvania:</strong> Limited SR-22 use</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Special State Variations
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li><strong>Florida & Virginia:</strong> Also have FR-44 for DUI convictions (higher liability requirements)</li>
                    <li><strong>Indiana:</strong> Uses SR-50 for specific violations</li>
                    <li><strong>Texas:</strong> Has SR-22A for non-owner policies</li>
                    <li><strong>Missouri:</strong> Uses SR-22 with additional monitoring</li>
                    <li><strong>Ohio:</strong> Requires proof of financial responsibility filing</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Types of SR-22 Coverage</h2>
              
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Owner SR-22</h4>
                  <p className="text-slate-600 text-sm">
                    For drivers who own a vehicle. Covers you when driving your own car and typically 
                    provides the broadest coverage. This is the most common type of SR-22.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Non-Owner SR-22</h4>
                  <p className="text-slate-600 text-sm">
                    For drivers who don't own a vehicle but need to maintain insurance coverage. 
                    Covers you when driving borrowed or rented vehicles. Typically cheaper than owner policies.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Operator SR-22</h4>
                  <p className="text-slate-600 text-sm">
                    Similar to non-owner but may have different coverage limitations. Covers you as 
                    a driver regardless of vehicle ownership.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Finding Affordable SR-22 Insurance</h2>
              
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h4 className="font-bold text-emerald-900 mb-4">Tips to Minimize SR-22 Costs</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <span className="text-slate-700">Shop multiple high-risk insurers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <span className="text-slate-700">Consider a non-owner policy if you don't own a car</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <span className="text-slate-700">Take a defensive driving course</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <span className="text-slate-700">Choose higher deductibles</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <span className="text-slate-700">Drive an older, less expensive vehicle</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <span className="text-slate-700">Maintain continuous coverage without gaps</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Happens When SR-22 Period Ends?</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Contact Your Insurer</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      About 30-45 days before your SR-22 requirement ends, contact your insurance company 
                      to confirm the end date and request they cancel the filing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Get Confirmation</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Request written confirmation that the SR-22 filing has been terminated and your 
                      requirement is satisfied with the state.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Shop for Better Rates</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Once the SR-22 is removed, shop around for new quotes. Your rates should decrease 
                      significantly, especially if you've maintained a clean record during the filing period.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Need SR-22 Insurance? We Can Help</h3>
              <p className="text-amber-100 mb-6">
                Connect with insurers who specialize in high-risk coverage and SR-22 filings.
              </p>
              <Link 
                href="/get-quote?type=auto"
                className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-3 rounded-xl font-bold hover:bg-amber-50 transition"
              >
                Get SR-22 Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/auto-insurance-basics"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Car className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">Auto Insurance Basics</span>
                </Link>
                <Link 
                  href="/guides/factors-affecting-premium"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">What Affects Your Premium</span>
                </Link>
                <Link 
                  href="/guides/cheapest-car-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Award className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Finding Affordable Insurance</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Shield className="w-5 h-5 text-blue-600" />
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
