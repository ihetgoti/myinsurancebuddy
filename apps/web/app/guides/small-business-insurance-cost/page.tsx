import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  DollarSign, ArrowRight, CheckCircle, AlertTriangle, TrendingDown,
  Building2, Briefcase, Users, Package, Shield, FileText,
  Clock, PiggyBank, Calculator, Percent, HelpCircle, Award
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Small Business Insurance Cost Guide (2024): Average Prices by Industry | MyInsuranceBuddy',
  description: 'Complete guide to small business insurance costs. See average prices by industry, factors affecting rates, money-saving tips, and BOP value analysis.',
  keywords: 'small business insurance cost, BOP insurance, business insurance rates, commercial insurance costs, business owners policy',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function SmallBusinessInsuranceCostPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <DollarSign className="w-4 h-4" />
              Cost Guide 2024
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Small Business Insurance Cost Guide: What You'll Actually Pay
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-amber-100 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 14 min read</span>
              <span className="px-2 py-1 bg-amber-500/30 text-amber-100 rounded text-xs font-medium">Budget Planning</span>
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
                Understanding small business insurance costs is crucial for budgeting and financial planning. Whether you're 
                launching a startup or reviewing expenses for an established company, knowing what to expect—and how to save—can 
                significantly impact your bottom line. This comprehensive guide breaks down average costs by industry, explains 
                what drives your premiums, and reveals proven strategies to reduce your insurance expenses without sacrificing protection.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  Quick Cost Overview
                </h3>
                <p className="text-slate-700 mb-3">
                  Most small businesses pay between <strong>$500 and $3,000 per year</strong> for basic general liability insurance. 
                  A comprehensive Business Owner's Policy (BOP) that includes property coverage typically ranges from 
                  <strong> $1,000 to $5,000 annually</strong>. However, your actual costs depend heavily on your industry, 
                  location, business size, and coverage needs.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Average Small Business Insurance Costs by Coverage Type</h2>
              <p className="text-slate-600 mb-6">
                Most small businesses need multiple types of insurance. Here's what you can expect to pay for each:
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="text-left p-3 font-bold text-slate-900">Coverage Type</th>
                      <th className="text-left p-3 font-bold text-slate-900">Average Annual Cost</th>
                      <th className="text-left p-3 font-bold text-slate-900">What It Covers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">General Liability</td>
                      <td className="p-3 text-slate-600">$500 - $3,000</td>
                      <td className="p-3 text-slate-600">Bodily injury, property damage, advertising injury</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Business Owner's Policy (BOP)</td>
                      <td className="p-3 text-slate-600">$1,000 - $5,000</td>
                      <td className="p-3 text-slate-600">GL + property + business interruption</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Professional Liability (E&O)</td>
                      <td className="p-3 text-slate-600">$500 - $5,000+</td>
                      <td className="p-3 text-slate-600">Professional mistakes, errors, negligence</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Workers Compensation</td>
                      <td className="p-3 text-slate-600">$2,000 - $10,000+</td>
                      <td className="p-3 text-slate-600">Employee injuries, medical, lost wages</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Commercial Auto</td>
                      <td className="p-3 text-slate-600">$1,200 - $2,500/vehicle</td>
                      <td className="p-3 text-slate-600">Business vehicle accidents and damage</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Cyber Liability</td>
                      <td className="p-3 text-slate-600">$500 - $5,000</td>
                      <td className="p-3 text-slate-600">Data breaches, cyber attacks, ransomware</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Umbrella Insurance</td>
                      <td className="p-3 text-slate-600">$400 - $1,500</td>
                      <td className="p-3 text-slate-600">Extra liability protection beyond primary policies</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Average Costs by Industry</h2>
              <p className="text-slate-600 mb-6">
                Your industry is one of the biggest factors affecting insurance costs. Higher-risk industries pay more:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900">Low-Risk Industries</h4>
                    <span className="text-emerald-700 font-semibold">$500 - $1,500/year</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Consulting, IT services, accounting, graphic design, real estate agencies</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Office-based</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">No physical products</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Low injury risk</span>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900">Medium-Risk Industries</h4>
                    <span className="text-amber-700 font-semibold">$1,500 - $5,000/year</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Retail stores, restaurants, manufacturing, wholesale, healthcare clinics</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Customer traffic</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Physical inventory</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Moderate liability</span>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900">High-Risk Industries</h4>
                    <span className="text-red-700 font-semibold">$5,000 - $25,000+/year</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Construction, roofing, tree services, heavy manufacturing, transportation</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Physical labor</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Heavy machinery</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">High injury risk</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Detailed Industry Breakdown</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="text-left p-3 font-bold text-slate-900">Industry</th>
                      <th className="text-left p-3 font-bold text-slate-900">General Liability</th>
                      <th className="text-left p-3 font-bold text-slate-900">Workers Comp*</th>
                      <th className="text-left p-3 font-bold text-slate-900">Total Est.**</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-slate-700">IT/Technology</td>
                      <td className="p-3 text-slate-600">$500 - $1,000</td>
                      <td className="p-3 text-slate-600">$800 - $2,000</td>
                      <td className="p-3 text-slate-600">$1,300 - $3,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Consulting</td>
                      <td className="p-3 text-slate-600">$400 - $800</td>
                      <td className="p-3 text-slate-600">$600 - $1,500</td>
                      <td className="p-3 text-slate-600">$1,000 - $2,300</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Accounting/Tax</td>
                      <td className="p-3 text-slate-600">$500 - $1,200</td>
                      <td className="p-3 text-slate-600">$700 - $1,800</td>
                      <td className="p-3 text-slate-600">$1,200 - $3,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Real Estate</td>
                      <td className="p-3 text-slate-600">$600 - $1,500</td>
                      <td className="p-3 text-slate-600">$1,000 - $2,500</td>
                      <td className="p-3 text-slate-600">$1,600 - $4,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Retail Store</td>
                      <td className="p-3 text-slate-600">$800 - $2,500</td>
                      <td className="p-3 text-slate-600">$2,000 - $5,000</td>
                      <td className="p-3 text-slate-600">$2,800 - $7,500</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Restaurant</td>
                      <td className="p-3 text-slate-600">$1,500 - $4,000</td>
                      <td className="p-3 text-slate-600">$3,000 - $8,000</td>
                      <td className="p-3 text-slate-600">$4,500 - $12,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Manufacturing</td>
                      <td className="p-3 text-slate-600">$1,000 - $3,500</td>
                      <td className="p-3 text-slate-600">$4,000 - $15,000</td>
                      <td className="p-3 text-slate-600">$5,000 - $18,500</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Construction</td>
                      <td className="p-3 text-slate-600">$3,000 - $10,000</td>
                      <td className="p-3 text-slate-600">$8,000 - $50,000+</td>
                      <td className="p-3 text-slate-600">$11,000 - $60,000+</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-slate-500 mt-2">*Workers comp costs vary significantly by payroll amount and specific job classifications</p>
                <p className="text-xs text-slate-500">**Excludes professional liability, cyber, and other specialized coverages</p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Factors That Affect Your Insurance Costs</h2>
              <p className="text-slate-600 mb-6">
                Insurance companies use numerous factors to calculate your premiums. Understanding these can help you make 
                informed decisions:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Building2 className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Business Location</h4>
                  <p className="text-sm text-slate-600">Urban areas typically have higher premiums due to increased crime, higher property values, and more lawsuits. State regulations also affect costs significantly.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Users className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Number of Employees</h4>
                  <p className="text-sm text-slate-600">More employees mean higher workers comp costs and increased general liability exposure. Payroll amount directly affects workers compensation premiums.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <DollarSign className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Annual Revenue</h4>
                  <p className="text-sm text-slate-600">Higher revenue often means larger contracts and higher liability exposure. Some insurers use revenue to determine general liability rates.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Briefcase className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Years in Business</h4>
                  <p className="text-sm text-slate-600">Established businesses with good claims history often receive better rates than startups. Experience shows stability to insurers.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Shield className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Claims History</h4>
                  <p className="text-sm text-slate-600">Past claims significantly impact future premiums. A single major claim can increase rates by 20-50% for several years.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Package className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Coverage Limits</h4>
                  <p className="text-sm text-slate-600">Higher limits mean higher premiums. A $2M aggregate limit costs more than $1M. Deductible choices also affect pricing.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Business Owner's Policy (BOP): The Best Value</h2>
              <p className="text-slate-600 mb-6">
                A Business Owner's Policy (BOP) combines general liability and commercial property insurance into one package 
                at a discounted rate. It's often the most cost-effective option for small businesses.
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Why BOPs Offer Great Value
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>Bundle discount:</strong> Typically 10-20% cheaper than buying coverages separately</li>
                  <li>• <strong>Convenience:</strong> One policy, one renewal date, one insurer to contact</li>
                  <li>• <strong>Business interruption:</strong> Most BOPs include income replacement if you can't operate due to covered damage</li>
                  <li>• <strong>Tailored for small business:</strong> Designed specifically for companies with less than $1M in revenue and fewer than 100 employees</li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">What's Included in a BOP?</h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">General Liability:</span>
                    <span className="text-slate-600"> Bodily injury, property damage, advertising injury protection</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Commercial Property:</span>
                    <span className="text-slate-600"> Building, equipment, inventory, furniture, and fixtures</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Business Interruption:</span>
                    <span className="text-slate-600"> Lost income and operating expenses if you can't operate due to covered damage</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Additional Coverages:</span>
                    <span className="text-slate-600"> Often includes debris removal, property off-premises, and more</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">BOP Average Costs by Business Type</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="text-left p-3 font-bold text-slate-900">Business Type</th>
                      <th className="text-left p-3 font-bold text-slate-900">Annual BOP Cost</th>
                      <th className="text-left p-3 font-bold text-slate-900">Typical Coverage Limits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-slate-700">Home-based business</td>
                      <td className="p-3 text-slate-600">$500 - $1,200</td>
                      <td className="p-3 text-slate-600">$300K property / $1M liability</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Small retail store</td>
                      <td className="p-3 text-slate-600">$1,200 - $3,500</td>
                      <td className="p-3 text-slate-600">$50K property / $1M-2M liability</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Restaurant</td>
                      <td className="p-3 text-slate-600">$2,500 - $6,000</td>
                      <td className="p-3 text-slate-600">$100K property / $2M liability</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Small office/professional</td>
                      <td className="p-3 text-slate-600">$800 - $2,000</td>
                      <td className="p-3 text-slate-600">$25K property / $1M-2M liability</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Light manufacturing</td>
                      <td className="p-3 text-slate-600">$3,000 - $8,000</td>
                      <td className="p-3 text-slate-600">$250K property / $2M liability</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">10 Proven Ways to Save on Business Insurance</h2>
              
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-700 text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Bundle Your Policies</h4>
                      <p className="text-sm text-slate-600">Purchase multiple coverages from one insurer. A BOP can save 10-20%, and adding other coverages often brings additional discounts.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-700 text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Increase Your Deductible</h4>
                      <p className="text-sm text-slate-600">Going from a $500 to $1,000 deductible can reduce premiums by 10-15%. Make sure you have the cash reserves to cover the higher out-of-pocket cost if you file a claim.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-700 text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Implement Risk Management</h4>
                      <p className="text-sm text-slate-600">Document safety protocols, conduct regular training, and maintain a clean claims history. Many insurers offer discounts for formal safety programs.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-700 text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Pay Annually Instead of Monthly</h4>
                      <p className="text-sm text-slate-600">Monthly payment plans often include installment fees of $5-15 per month. Paying annually can save $60-180 per year.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-700 text-sm">5</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Compare Multiple Quotes</h4>
                      <p className="text-sm text-slate-600">Rates can vary by 50% or more between insurers for identical coverage. Get at least 3-5 quotes before buying.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-700 text-sm">6</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Review Coverage Annually</h4>
                      <p className="text-sm text-slate-600">Your insurance needs change as your business grows. Don't over-insure or under-insure—adjust coverage to match your current risk exposure.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-700 text-sm">7</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Join Industry Associations</h4>
                      <p className="text-sm text-slate-600">Many professional associations offer group insurance rates that are 10-30% lower than individual policies.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-700 text-sm">8</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Improve Security</h4>
                      <p className="text-sm text-slate-600">Install security systems, smoke detectors, and sprinkler systems. Many insurers offer discounts for these risk-reduction measures.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-700 text-sm">9</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Choose the Right Limits</h4>
                      <p className="text-sm text-slate-600">Don't over-insure. Match your coverage limits to your actual exposure. A small consulting firm doesn't need the same limits as a major manufacturer.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-700 text-sm">10</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Maintain Good Credit</h4>
                      <p className="text-sm text-slate-600">Many insurers use credit scores as a rating factor. Better credit can lead to significantly lower premiums.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Sample Annual Insurance Budgets</h2>
              <p className="text-slate-600 mb-6">
                Here are realistic annual insurance budgets for different business scenarios:
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-slate-900 mb-3">Solo Consultant</h4>
                  <ul className="space-y-2 text-sm text-slate-700 mb-4">
                    <li className="flex justify-between"><span>General Liability:</span> <span>$600</span></li>
                    <li className="flex justify-between"><span>Professional Liability:</span> <span>$900</span></li>
                    <li className="flex justify-between"><span>Cyber Liability:</span> <span>$500</span></li>
                  </ul>
                  <div className="pt-3 border-t border-emerald-200">
                    <div className="flex justify-between font-bold text-emerald-800">
                      <span>Total:</span> <span>$2,000/year</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h4 className="font-bold text-slate-900 mb-3">Retail Store (5 employees)</h4>
                  <ul className="space-y-2 text-sm text-slate-700 mb-4">
                    <li className="flex justify-between"><span>BOP:</span> <span>$2,500</span></li>
                    <li className="flex justify-between"><span>Workers Comp:</span> <span>$3,500</span></li>
                    <li className="flex justify-between"><span>Umbrella:</span> <span>$800</span></li>
                  </ul>
                  <div className="pt-3 border-t border-amber-200">
                    <div className="flex justify-between font-bold text-amber-800">
                      <span>Total:</span> <span>$6,800/year</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h4 className="font-bold text-slate-900 mb-3">Tech Startup (10 employees)</h4>
                  <ul className="space-y-2 text-sm text-slate-700 mb-4">
                    <li className="flex justify-between"><span>General Liability:</span> <span>$1,200</span></li>
                    <li className="flex justify-between"><span>Professional Liability:</span> <span>$3,000</span></li>
                    <li className="flex justify-between"><span>Workers Comp:</span> <span>$2,500</span></li>
                    <li className="flex justify-between"><span>Cyber Liability:</span> <span>$2,500</span></li>
                  </ul>
                  <div className="pt-3 border-t border-blue-200">
                    <div className="flex justify-between font-bold text-blue-800">
                      <span>Total:</span> <span>$9,200/year</span>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Can I deduct business insurance on my taxes?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Yes! Business insurance premiums are generally tax-deductible as a business expense. This includes general liability, 
                    professional liability, workers comp, commercial auto, and property insurance. Consult your tax advisor for specifics.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    What's the minimum insurance a small business needs?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    At minimum, most businesses should have general liability insurance. If you have employees, workers compensation 
                    is required by law in most states. Beyond that, consider your specific risks—cyber for tech, E&O for consultants, etc.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Do I need insurance if I'm a sole proprietor?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Yes! As a sole proprietor, you have unlimited personal liability for business debts and lawsuits. Without insurance, 
                    your personal assets (home, savings, etc.) are at risk. General liability is essential, and professional liability 
                    if you provide services.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Get Affordable Business Insurance</h3>
              <p className="text-amber-100 mb-6">
                Compare quotes from top-rated carriers and find the best coverage for your budget. 
                Save up to 30% by comparing multiple options.
              </p>
              <Link 
                href="/get-quote?type=business"
                className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-3 rounded-xl font-bold hover:bg-amber-50 transition"
              >
                Get Free Business Insurance Quotes
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
                  href="/guides/workers-comp-requirements"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Workers Comp Requirements</span>
                </Link>
                <Link 
                  href="/guides/professional-vs-general-liability"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <TrendingDown className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Professional vs General Liability</span>
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
