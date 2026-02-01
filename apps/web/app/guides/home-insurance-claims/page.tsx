import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Home, ArrowRight, CheckCircle, Shield, AlertTriangle,
  DollarSign, FileText, Clock, Camera, Phone, Users,
  Scale, ClipboardList, MessageSquare, XCircle, HelpCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Home Insurance Claims: Step-by-Step Guide 2024 | MyInsuranceBuddy',
  description: 'Learn how to file home insurance claims successfully. Step-by-step guide covering documentation, working with adjusters, timelines, dispute resolution, and maximizing your settlement.',
  keywords: 'home insurance claims, how to file insurance claim, insurance adjuster, claim documentation, insurance claim dispute, home insurance settlement',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function HomeInsuranceClaimsPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Claims Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Home Insurance Claims: A Step-by-Step Guide
            </h1>
            <p className="text-emerald-100 text-lg mb-6">
              Navigate the claims process like a pro. Learn how to document damage, work with adjusters, 
              and get the settlement you deserve.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-emerald-200 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Intermediate</span>
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
                Filing a home insurance claim can feel overwhelming, especially when you're already dealing 
                with the stress of property damage or loss. But knowing the right steps to take can make 
                the difference between a smooth settlement and a frustrating dispute. This comprehensive 
                guide walks you through everything you need to know about filing and managing home insurance claims.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Before You File: Important Considerations</h3>
                    <p className="text-slate-700 text-sm mb-3">
                      Not every incident warrants a claim. Consider these factors first:
                    </p>
                    <ul className="space-y-2 text-slate-700 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Your deductible:</strong> If damage is close to or less than your deductible, paying out-of-pocket may be smarter</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Rate impact:</strong> Claims can increase premiums for 3-5 years</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Claim history:</strong> Multiple claims in a short period can lead to non-renewal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Emergency repairs:</strong> You can make urgent repairs before filing without affecting coverage</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 1: Document Everything Immediately</h2>

              <p className="text-slate-600 mb-6">
                Thorough documentation is the foundation of a successful claim. The more evidence you have, 
                the stronger your position when negotiating your settlement.
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  Documentation Checklist
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Photograph and Video Everything</h4>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Take wide shots of entire rooms, then close-ups of specific damage</li>
                      <li>• Capture multiple angles and lighting conditions</li>
                      <li>• Don't forget ceilings, floors, and hidden areas</li>
                      <li>• Include timestamps on photos when possible</li>
                      <li>• Take video walkthroughs with narration describing damage</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Create Detailed Inventory Lists</h4>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• List every damaged or destroyed item</li>
                      <li>• Include brand names, model numbers, and purchase dates</li>
                      <li>• Estimate replacement costs (not what you paid originally)</li>
                      <li>• Note the condition before the damage occurred</li>
                      <li>• Gather receipts, warranty documents, and appraisals if available</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Preserve Physical Evidence</h4>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Don't throw away damaged items until the adjuster sees them</li>
                      <li>• Move items to a safe, dry location if possible</li>
                      <li>• Keep samples of damaged materials (carpet, flooring, etc.)</li>
                      <li>• Save repair estimates and receipts for emergency repairs</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 2: Prevent Further Damage</h2>

              <p className="text-slate-600 mb-6">
                Your insurance policy requires you to take reasonable steps to prevent additional damage. 
                This is called your "duty to mitigate." Failing to do so could reduce your settlement.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { action: 'Cover roof holes', reason: 'Prevent water intrusion from rain' },
                  { action: 'Board up broken windows', reason: 'Prevent theft and weather damage' },
                  { action: 'Turn off water', reason: 'Stop ongoing leaks from broken pipes' },
                  { action: 'Remove standing water', reason: 'Prevent mold growth' },
                  { action: 'Secure the property', reason: 'Prevent vandalism or unauthorized entry' },
                  { action: 'Move undamaged items', reason: 'Protect belongings from further harm' },
                ].map((item) => (
                  <div key={item.action} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 text-sm">{item.action}</span>
                      <p className="text-slate-600 text-xs">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Keep All Emergency Receipts</h4>
                    <p className="text-slate-600 text-sm">
                      Save receipts for tarps, boards, fans, dehumidifiers, and other emergency supplies. 
                      These are typically reimbursable under your policy's mitigation coverage.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 3: Contact Your Insurance Company</h2>

              <p className="text-slate-600 mb-6">
                Time is important when filing a claim. Most policies require "prompt" or "timely" notification, 
                and waiting too long could jeopardize your coverage.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-slate-600" />
                  When You Call, Be Ready With:
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {[
                    'Your policy number',
                    'Date and time of the incident',
                    'Type of damage or loss',
                    'Brief description of what happened',
                    'Current condition of the property',
                    'Whether temporary repairs were made',
                    'Police or fire report numbers (if applicable)',
                    'Contact information where you can be reached',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Understanding Claim Timelines</h3>
              <p className="text-slate-600 mb-4">
                Insurance companies have specific timeframes they must follow. These vary by state, but here's 
                what you can generally expect:
              </p>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-700 font-bold text-sm">24h</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Initial Response</h4>
                      <p className="text-slate-600 text-sm">
                        Most insurers acknowledge your claim within 24-48 hours and assign a claim number.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-sm">3-5d</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Adjuster Assignment</h4>
                      <p className="text-slate-600 text-sm">
                        An adjuster is typically assigned within 3-5 business days for routine claims.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-violet-700 font-bold text-sm">15-30d</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Investigation</h4>
                      <p className="text-slate-600 text-sm">
                        Complex claims may require 15-30 days for full investigation.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-700 font-bold text-sm">30-60d</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Settlement Decision</h4>
                      <p className="text-slate-600 text-sm">
                        Most states require claims to be resolved within 30-60 days of filing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 4: Work With the Insurance Adjuster</h2>

              <p className="text-slate-600 mb-6">
                The adjuster is your primary contact throughout the claims process. Building a professional 
                relationship while protecting your interests is key to a fair settlement.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Do's
                  </h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>Be present during the inspection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>Point out all damage, even hidden areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>Ask questions about the process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>Request a copy of the adjuster's report</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>Take your own photos during their visit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>Get contractor estimates independently</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>Keep notes of all conversations</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Don'ts
                  </h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✗</span>
                      <span>Sign anything you don't understand</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✗</span>
                      <span>Accept the first offer without review</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✗</span>
                      <span>Make permanent repairs before approval</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✗</span>
                      <span>Admit fault or speculate about causes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✗</span>
                      <span>Accept estimates for substandard repairs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✗</span>
                      <span>Let the adjuster rush the inspection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✗</span>
                      <span>Forget to mention additional damage found later</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Types of Adjusters</h3>
              <div className="space-y-4 mb-8">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Company Adjuster (Staff Adjuster)</h4>
                  <p className="text-slate-600 text-sm">
                    Employed directly by your insurance company. They represent the insurer's interests 
                    but are trained to handle claims fairly.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Independent Adjuster</h4>
                  <p className="text-slate-600 text-sm">
                    Contracted by your insurance company for specific claims. They work for the insurer 
                    but may handle claims for multiple companies.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Public Adjuster (Your Representative)</h4>
                  <p className="text-slate-600 text-sm mb-2">
                    <strong>Hired by you</strong> to represent your interests. They negotiate with the 
                    insurance company on your behalf and typically charge 10-20% of the settlement.
                  </p>
                  <p className="text-slate-600 text-sm">
                    Consider hiring a public adjuster for large, complex claims or if you feel the 
                    insurance offer is unfair.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 5: Review Your Settlement Offer</h2>

              <p className="text-slate-600 mb-6">
                Once the adjuster completes their investigation, you'll receive a settlement offer. 
                Don't rush to accept it—take time to ensure it's fair and complete.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">Settlement Review Checklist</h3>
                <div className="space-y-3">
                  {[
                    'Does the settlement cover all documented damage?',
                    'Are replacement costs or actual cash values clearly stated?',
                    'Are code upgrade requirements included if applicable?',
                    'Does the estimate use appropriate materials and quality levels?',
                    'Are all damaged items from your inventory included?',
                    'Is additional living expenses coverage addressed?',
                    'Do you understand what is being withheld and why?',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ClipboardList className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Understanding Replacement Cost vs. Actual Cash Value</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Replacement Cost Value (RCV)</h4>
                  <p className="text-slate-600 text-sm mb-2">
                    Pays to replace damaged items with new ones of similar quality.
                  </p>
                  <p className="text-emerald-700 text-sm">
                    <strong>Better coverage</strong> - You get full replacement value after completing repairs.
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Actual Cash Value (ACV)</h4>
                  <p className="text-slate-600 text-sm mb-2">
                    Pays depreciated value (replacement cost minus depreciation).
                  </p>
                  <p className="text-amber-700 text-sm">
                    <strong>Lower payout</strong> - Older items receive less compensation.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 6: Handling Claim Disputes</h2>

              <p className="text-slate-600 mb-6">
                If you disagree with your settlement offer, you have options. Don't feel pressured to 
                accept an inadequate settlement.
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Request a Detailed Explanation</h4>
                      <p className="text-slate-600 text-sm">
                        Ask your adjuster to walk through how they calculated the settlement. There may be 
                        misunderstandings that can be easily resolved.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Get Independent Estimates</h4>
                      <p className="text-slate-600 text-sm">
                        Obtain contractor estimates that detail the true cost of repairs. Present these 
                        to your insurer as evidence.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">File a Formal Appeal</h4>
                      <p className="text-slate-600 text-sm">
                        Submit a written appeal with supporting documentation. Most insurers have an 
                        internal appeals process.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Contact Your State Insurance Department</h4>
                      <p className="text-slate-600 text-sm">
                        If the dispute isn't resolved, file a complaint with your state's insurance regulator. 
                        They can investigate and mediate.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-700 font-bold text-sm">5</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Consider Professional Help</h4>
                      <p className="text-slate-600 text-sm">
                        For significant disputes, hire a public adjuster or an attorney who specializes 
                        in insurance claims. They work on contingency for large claims.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Appraisal Clause</h4>
                    <p className="text-slate-600 text-sm">
                      Many policies include an appraisal clause that allows you and the insurer to each 
                      hire an appraiser. If they disagree, a neutral umpire decides. This can be faster 
                      and less expensive than litigation.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 7: Complete Repairs and Close the Claim</h2>

              <p className="text-slate-600 mb-6">
                Once you've accepted a settlement, it's time to complete repairs and finalize your claim.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Choose licensed, reputable contractors (get multiple bids)',
                  'Verify contractor insurance and references',
                  'Get a written contract with detailed scope of work',
                  'Never pay full amount upfront (10-20% deposit is typical)',
                  'Document all repair work with photos',
                  'Keep all receipts and invoices',
                  'Complete a final walkthrough before final payment',
                  'Notify insurer when work is complete for any holdback releases',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Special Claim Situations</h2>

              <div className="space-y-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Total Loss Claims
                  </h3>
                  <p className="text-slate-600 text-sm mb-3">
                    When damage exceeds a certain percentage of your home's value (typically 50-70%), 
                    your insurer may declare it a total loss.
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• You'll receive the policy limit for dwelling coverage (minus deductible)</li>
                    <li>• Mortgage company may need to approve settlement</li>
                    <li>• Consider whether rebuilding or buying elsewhere makes more sense</li>
                    <li>• Ensure debris removal costs are included</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Liability Claims
                  </h3>
                  <p className="text-slate-600 text-sm mb-3">
                    When someone is injured on your property, the claims process differs from property damage.
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Never admit fault or liability</li>
                    <li>• Refer all inquiries to your insurance company</li>
                    <li>• Insurer will provide legal defense if needed</li>
                    <li>• Keep detailed records of the incident</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5 text-violet-600" />
                    Additional Living Expenses (ALE)
                  </h3>
                  <p className="text-slate-600 text-sm mb-3">
                    If your home is uninhabitable, ALE coverage pays for temporary housing and related costs.
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Keep all receipts for hotel, meals, laundry, and storage</li>
                    <li>• Coverage is typically limited to "similar standard of living"</li>
                    <li>• Expenses must be above your normal living costs</li>
                    <li>• Time limits may apply (typically 12-24 months)</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Tips for a Smooth Claim Experience</h2>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <ul className="space-y-3 text-slate-700">
                  {[
                    'Document your home with photos/videos before disasters occur',
                    'Keep an updated home inventory with receipts and appraisals',
                    'Store important documents in a fireproof safe or digitally in the cloud',
                    'Know your policy coverage and exclusions before you need to file',
                    'Build a relationship with local contractors before emergencies',
                    'Keep your insurer contact information easily accessible',
                    'Respond promptly to all insurer requests for information',
                    'Stay organized with a dedicated claims folder (physical or digital)',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Need Help With Your Coverage?</h3>
              <p className="text-emerald-100 mb-6">
                Make sure you have the right insurance before you need to file a claim. Compare policies and get expert guidance.
              </p>
              <Link 
                href="/get-quote?type=home"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
              >
                Get Home Insurance Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/how-much-home-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Home className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">How Much Home Insurance Do You Need?</span>
                </Link>
                <Link 
                  href="/guides/renters-insurance-worth"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Is Renters Insurance Worth It?</span>
                </Link>
                <Link 
                  href="/guides/flood-insurance-guide"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <AlertTriangle className="w-5 h-5 text-cyan-600" />
                  <span className="font-medium text-slate-700">Flood Insurance Guide</span>
                </Link>
                <Link 
                  href="/guides/lower-home-premium"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">Lower Your Home Insurance Premium</span>
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
