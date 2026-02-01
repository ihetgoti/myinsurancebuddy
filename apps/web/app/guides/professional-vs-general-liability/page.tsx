import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Scale, ArrowRight, CheckCircle, AlertTriangle, Building2,
  DollarSign, Users, Briefcase, FileText, Clock, Shield,
  TrendingUp, HelpCircle, XCircle, Stethoscope, GraduationCap
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Professional Liability vs General Liability: Key Differences (2024) | MyInsuranceBuddy',
  description: 'Understand the difference between professional liability (E&O) and general liability insurance. Learn who needs which coverage and when to combine both.',
  keywords: 'professional liability insurance, E&O insurance, errors and omissions, general liability vs professional liability, business insurance comparison',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function ProfessionalVsGeneralLiabilityPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Scale className="w-4 h-4" />
              Coverage Comparison Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Professional Liability vs General Liability: Understanding the Critical Differences
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-amber-100 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min read</span>
              <span className="px-2 py-1 bg-amber-500/30 text-amber-100 rounded text-xs font-medium">Essential for Service Businesses</span>
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
                One of the most common questions business owners ask is: "Do I need professional liability insurance if I already 
                have general liability?" The answer depends entirely on what your business does. While these two coverages might 
                sound similar, they protect against completely different types of risks. Understanding the distinction is crucial 
                for ensuring your business is fully protected.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  The Bottom Line
                </h3>
                <p className="text-slate-700 mb-3">
                  <strong>General liability</strong> covers physical injuries and property damage. <strong>Professional liability</strong> (also called E&O) 
                  covers financial losses from professional mistakes, errors, or negligence in your services or advice.
                </p>
                <p className="text-slate-700">
                  Many businesses need <strong>both</strong> types of coverage for complete protection.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is General Liability Insurance?</h2>
              <p className="text-slate-600 mb-6">
                General liability insurance (GL) protects your business against claims involving physical injury, property damage, 
                and advertising injury. It's often called "slip-and-fall" insurance because it covers accidents that occur on 
                your premises or as a result of your operations.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  What General Liability Covers
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Bodily Injury:</span>
                      <span className="text-slate-600"> A customer slips in your store and breaks their wrist</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Property Damage:</span>
                      <span className="text-slate-600"> Your employee damages a client's computer while working at their office</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Advertising Injury:</span>
                      <span className="text-slate-600"> A competitor claims your ad libeled their business</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Medical Payments:</span>
                      <span className="text-slate-600"> Minor injuries to third parties regardless of fault</span>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is Professional Liability Insurance?</h2>
              <p className="text-slate-600 mb-6">
                Professional liability insurance, also known as Errors & Omissions (E&O) or malpractice insurance (for medical/legal 
                professionals), protects against claims of negligence, errors, or failure to perform professional duties. It covers 
                the cost of defending against such claims and any damages awarded.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  What Professional Liability Covers
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Professional Negligence:</span>
                      <span className="text-slate-600"> An accountant makes an error causing a client to owe back taxes and penalties</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Errors & Omissions:</span>
                      <span className="text-slate-600"> A consultant gives advice that leads to a client losing money</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Failure to Deliver:</span>
                      <span className="text-slate-600"> A web developer misses a deadline causing the client to lose a major contract</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Breach of Contract:</span>
                      <span className="text-slate-600"> You fail to meet contractual obligations, causing client financial loss</span>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Key Differences at a Glance</h2>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="text-left p-3 font-bold text-slate-900">Feature</th>
                      <th className="text-left p-3 font-bold text-slate-900">General Liability</th>
                      <th className="text-left p-3 font-bold text-slate-900">Professional Liability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Also Called</td>
                      <td className="p-3 text-slate-600">Commercial General Liability (CGL), Business Liability</td>
                      <td className="p-3 text-slate-600">Errors & Omissions (E&O), Malpractice Insurance</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Protects Against</td>
                      <td className="p-3 text-slate-600">Physical injuries, property damage</td>
                      <td className="p-3 text-slate-600">Financial losses from professional mistakes</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Typical Claims</td>
                      <td className="p-3 text-slate-600">Slip-and-fall, damaged equipment, libel in ads</td>
                      <td className="p-3 text-slate-600">Missed deadlines, professional errors, bad advice</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Trigger</td>
                      <td className="p-3 text-slate-600">Accidents, physical events</td>
                      <td className="p-3 text-slate-600">Professional services, advice, expertise</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Coverage Basis</td>
                      <td className="p-3 text-slate-600">Usually occurrence-based</td>
                      <td className="p-3 text-slate-600">Usually claims-made</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Legal Defense</td>
                      <td className="p-3 text-slate-600">Included within limits</td>
                      <td className="p-3 text-slate-600">Often included in addition to limits</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Occurrence vs Claims-Made: What It Means
                </h3>
                <p className="text-slate-700 mb-3">
                  This is a crucial difference between these coverages:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li><strong>Occurrence-based (General Liability):</strong> Covers incidents that occur during the policy period, 
                  regardless of when the claim is filed. If someone slips in your store today and sues you three years later, 
                  your current policy covers it.</li>
                  <li><strong>Claims-made (Professional Liability):</strong> Covers claims made during the policy period for 
                  incidents that occurred after the retroactive date. If you need coverage for past work, you may need 
                  "tail coverage."</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Who Needs General Liability Insurance?</h2>
              <p className="text-slate-600 mb-6">
                Almost every business should have general liability insurance. It's the foundation of business protection 
                and is often required by landlords, clients, and licensing boards.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { business: 'Retail stores', reason: 'Customer foot traffic creates slip-and-fall risk' },
                  { business: 'Restaurants', reason: 'Food service and high customer volume' },
                  { business: 'Contractors', reason: 'Working at client locations, potential property damage' },
                  { business: 'Manufacturers', reason: 'Products could cause injury or damage' },
                  { business: 'Landlords', reason: 'Tenants and visitors on property' },
                  { business: 'Any business with a physical location', reason: 'Premises liability exposure' }
                ].map((item) => (
                  <div key={item.business} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">{item.business}</h4>
                    <p className="text-sm text-slate-600">{item.reason}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Who Needs Professional Liability Insurance?</h2>
              <p className="text-slate-600 mb-6">
                If your business provides professional services, advice, or expertise, you need professional liability insurance. 
                A single mistake or oversight could cost a client thousands—or millions—and leave you facing a lawsuit.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <GraduationCap className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Consultants & Advisors</h4>
                  <p className="text-sm text-slate-600 mb-2">Management consultants, business advisors, financial planners</p>
                  <p className="text-xs text-blue-700">Risk: Bad advice leading to client losses</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <FileText className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Accountants & Tax Preparers</h4>
                  <p className="text-sm text-slate-600 mb-2">CPAs, bookkeepers, enrolled agents</p>
                  <p className="text-xs text-blue-700">Risk: Tax errors, missed deductions, penalties</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <Building2 className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Real Estate Professionals</h4>
                  <p className="text-sm text-slate-600 mb-2">Agents, brokers, property managers</p>
                  <p className="text-xs text-blue-700">Risk: Disclosure failures, misrepresentation</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <Briefcase className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Technology Professionals</h4>
                  <p className="text-sm text-slate-600 mb-2">Software developers, IT consultants, web designers</p>
                  <p className="text-xs text-blue-700">Risk: Project failures, security breaches, missed deadlines</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <Stethoscope className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Healthcare Professionals</h4>
                  <p className="text-sm text-slate-600 mb-2">Doctors, nurses, therapists (called malpractice insurance)</p>
                  <p className="text-xs text-blue-700">Risk: Treatment errors, misdiagnosis</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <Scale className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Legal Professionals</h4>
                  <p className="text-sm text-slate-600 mb-2">Attorneys, paralegals, legal consultants</p>
                  <p className="text-xs text-blue-700">Risk: Missed deadlines, conflicts of interest, errors</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Real-World Scenarios: Which Coverage Applies?</h2>
              
              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Scenario 1: The Consulting Firm</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4">
                  A management consultant advises a client to restructure their business. The advice turns out to be flawed, 
                  costing the client $200,000. The client sues for professional negligence.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-slate-900 text-sm">General Liability</span>
                    </div>
                    <p className="text-xs text-slate-600">Does NOT cover—no physical injury or property damage</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-900 text-sm">Professional Liability</span>
                    </div>
                    <p className="text-xs text-slate-600">COVERS—professional negligence claim</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Scenario 2: The IT Contractor</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4">
                  An IT technician is working at a client's office and accidentally spills coffee on a server, causing $50,000 
                  in damage and data loss.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-900 text-sm">General Liability</span>
                    </div>
                    <p className="text-xs text-slate-600">COVERS—property damage to client's equipment</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-slate-900 text-sm">Professional Liability</span>
                    </div>
                    <p className="text-xs text-slate-600">Does NOT cover—this was an accident, not professional error</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Scenario 3: The Accounting Firm</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4">
                  An accountant makes an error on a client's tax return. The IRS audits the client, who owes $75,000 in 
                  back taxes and penalties. The client sues the accountant.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-slate-900 text-sm">General Liability</span>
                    </div>
                    <p className="text-xs text-slate-600">Does NOT cover—financial loss from professional error</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-900 text-sm">Professional Liability</span>
                    </div>
                    <p className="text-xs text-slate-600">COVERS—error in professional services</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When You Need Both Coverages</h2>
              <p className="text-slate-600 mb-6">
                Many businesses need both general liability and professional liability insurance for complete protection. 
                Here are common scenarios:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Contractors Who Provide Design Services</h4>
                  <p className="text-sm text-slate-600">A general contractor who also does design work needs GL for construction 
                  accidents and E&O for design errors that cause structural problems.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Healthcare Practices</h4>
                  <p className="text-sm text-slate-600">A medical clinic needs malpractice insurance (professional liability) for 
                  treatment errors AND general liability for slip-and-fall accidents in the waiting room.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Marketing Agencies</h4>
                  <p className="text-sm text-slate-600">An agency needs professional liability for campaign strategy errors AND 
                  general liability for advertising injury (covered under GL) and office accidents.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Real Estate Agencies</h4>
                  <p className="text-sm text-slate-600">Agents need E&O for disclosure failures and misrepresentation, plus GL 
                  for open house accidents and property damage during showings.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cost Comparison</h2>
              <p className="text-slate-600 mb-6">
                Both types of insurance are surprisingly affordable considering the protection they provide. Here's what you can expect:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    General Liability Costs
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Low-risk business:</span>
                      <span className="font-semibold text-slate-900">$400 - $800/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Average small business:</span>
                      <span className="font-semibold text-slate-900">$1,000 - $3,000/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">High-risk industries:</span>
                      <span className="font-semibold text-slate-900">$5,000 - $15,000/year</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Professional Liability Costs
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Low-risk profession:</span>
                      <span className="font-semibold text-slate-900">$500 - $1,500/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Average professional:</span>
                      <span className="font-semibold text-slate-900">$1,500 - $3,500/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">High-risk (medical/legal):</span>
                      <span className="font-semibold text-slate-900">$5,000 - $50,000+/year</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Ways to Save on Both Coverages
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>Bundle policies:</strong> Many insurers offer discounts for purchasing both coverages together</li>
                  <li>• <strong>Business Owner's Policy (BOP):</strong> Combines GL with property insurance at a discount</li>
                  <li>• <strong>Risk management:</strong> Document safety protocols and quality control procedures</li>
                  <li>• <strong>Higher deductibles:</strong> Accepting more risk lowers your premiums</li>
                  <li>• <strong>Annual payment:</strong> Pay yearly instead of monthly to avoid fees</li>
                  <li>• <strong>Compare quotes:</strong> Rates vary significantly between carriers</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Can professional liability replace general liability?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    No. These coverages protect against completely different risks. If someone slips in your office, 
                    professional liability won't help. If you give bad advice, general liability won't help. Many businesses need both.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Do independent contractors need these coverages?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Yes, often more than employees do. Contractors don't have an employer's insurance to fall back on. 
                    Many clients require contractors to carry both GL and professional liability before they'll hire you.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    What happens if a claim involves both coverages?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Sometimes both policies could apply. For example, if a contractor's design error causes a building to fail 
                    (professional liability) and injures someone (general liability). In such cases, insurers coordinate to 
                    determine which policy responds to which part of the claim.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Get the Right Coverage for Your Business</h3>
              <p className="text-amber-100 mb-6">
                Compare quotes for general liability, professional liability, or both. Find the best coverage at the best price.
              </p>
              <Link 
                href="/get-quote?type=business"
                className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-3 rounded-xl font-bold hover:bg-amber-50 transition"
              >
                Get Free Liability Insurance Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Business Insurance Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/general-liability-explained"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Shield className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">General Liability Explained</span>
                </Link>
                <Link 
                  href="/guides/small-business-insurance-cost"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Small Business Insurance Costs</span>
                </Link>
                <Link 
                  href="/guides/workers-comp-requirements"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Workers Comp Requirements</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
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
