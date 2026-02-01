import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Users, ArrowRight, CheckCircle, AlertTriangle, MapPin,
  DollarSign, Briefcase, Scale, FileText, Clock, Shield,
  Building2, Gavel, HelpCircle, XCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Workers Compensation Insurance Requirements by State (2024) | MyInsuranceBuddy',
  description: 'Complete guide to workers compensation state requirements. Learn which states require coverage, exemptions, penalties for non-compliance, and cost factors.',
  keywords: 'workers compensation requirements, workers comp state laws, workers comp exemptions, workers comp penalties, employer insurance requirements',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function WorkersCompRequirementsPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Employer Requirements Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Workers Compensation Requirements by State: A Complete Guide for Employers
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-amber-100 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 15 min read</span>
              <span className="px-2 py-1 bg-amber-500/30 text-amber-100 rounded text-xs font-medium">Updated 2024</span>
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
                Workers compensation insurance is one of the most regulated areas of business insurance, with requirements 
                varying dramatically from state to state. Whether you're hiring your first employee or expanding to multiple 
                states, understanding workers comp requirements is essential to avoid costly penalties and protect your business. 
                This comprehensive guide covers everything employers need to know.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  Quick Answer: What is Workers Compensation Insurance?
                </h3>
                <p className="text-slate-700">
                  Workers compensation insurance provides wage replacement and medical benefits to employees injured on the job. 
                  In exchange, employees give up their right to sue their employer for negligence. Nearly every state requires 
                  businesses with employees to carry this coverage.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Which States Require Workers Compensation Insurance?</h2>
              <p className="text-slate-600 mb-6">
                Almost every state requires workers compensation insurance for businesses with employees. However, the specific 
                requirements, thresholds, and exemptions vary significantly. Here's what you need to know:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">States Requiring Coverage (With Employee Thresholds)</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="text-left p-3 font-bold text-slate-900">State</th>
                      <th className="text-left p-3 font-bold text-slate-900">Employee Threshold</th>
                      <th className="text-left p-3 font-bold text-slate-900">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Alabama</td>
                      <td className="p-3 text-slate-600">5+ employees</td>
                      <td className="p-3 text-slate-600">Construction: 1+ employee</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Arkansas</td>
                      <td className="p-3 text-slate-600">3+ employees</td>
                      <td className="p-3 text-slate-600">Construction: 1+ employee</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Florida</td>
                      <td className="p-3 text-slate-600">4+ employees</td>
                      <td className="p-3 text-slate-600">Construction: 1+ employee</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Georgia</td>
                      <td className="p-3 text-slate-600">3+ employees</td>
                      <td className="p-3 text-slate-600">All industries</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Mississippi</td>
                      <td className="p-3 text-slate-600">5+ employees</td>
                      <td className="p-3 text-slate-600">Domestic workers excluded</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Missouri</td>
                      <td className="p-3 text-slate-600">5+ employees</td>
                      <td className="p-3 text-slate-600">Construction: 1+ employee</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">New Mexico</td>
                      <td className="p-3 text-slate-600">3+ employees</td>
                      <td className="p-3 text-slate-600">Construction: 1+ employee</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">North Carolina</td>
                      <td className="p-3 text-slate-600">3+ employees</td>
                      <td className="p-3 text-slate-600">All industries</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">South Carolina</td>
                      <td className="p-3 text-slate-600">4+ employees</td>
                      <td className="p-3 text-slate-600">Agricultural employees excluded</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Tennessee</td>
                      <td className="p-3 text-slate-600">5+ employees</td>
                      <td className="p-3 text-slate-600">Construction: 1+ employee</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Virginia</td>
                      <td className="p-3 text-slate-600">2+ employees</td>
                      <td className="p-3 text-slate-600">All industries</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Wisconsin</td>
                      <td className="p-3 text-slate-600">3+ employees</td>
                      <td className="p-3 text-slate-600">Paid $500+ in wages</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">States Requiring Coverage (1+ Employee)</h3>
              <p className="text-slate-600 mb-4">
                Most states require workers compensation insurance as soon as you hire your first employee. These include:
              </p>
              <div className="grid sm:grid-cols-3 gap-2 mb-8">
                {['Arizona', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New York', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Dakota', 'Utah', 'Vermont', 'Washington', 'West Virginia', 'Wyoming'].map((state) => (
                  <div key={state} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-slate-700">{state}</span>
                  </div>
                ))}
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Special Cases: Texas and Wyoming
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li><strong>Texas:</strong> The only state where workers compensation is optional for private employers. 
                  However, going without means losing important legal protections and potentially facing unlimited liability in lawsuits.</li>
                  <li><strong>Wyoming:</strong> Requires coverage through the state fund for most employers. 
                  Private insurance is only available for certain industries (extraterritorial, professional sports, etc.).</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Common Workers Comp Exemptions</h2>
              <p className="text-slate-600 mb-6">
                Most states provide exemptions for certain types of workers or business structures. However, exemptions vary widely 
                by state, so always check your specific state's requirements.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Briefcase className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Sole Proprietors & Partners</h4>
                  <p className="text-sm text-slate-600">Most states exempt business owners from mandatory coverage, but they can elect to be covered.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Users className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Independent Contractors</h4>
                  <p className="text-sm text-slate-600">True independent contractors are typically exempt, but misclassification can result in penalties.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Building2 className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Domestic Workers</h4>
                  <p className="text-sm text-slate-600">Household employees (nannies, housekeepers) are often exempt depending on hours worked.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <DollarSign className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Casual/Limited Employment</h4>
                  <p className="text-sm text-slate-600">Workers employed for limited hours or specific short-term projects may be exempt.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Scale className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Family Members</h4>
                  <p className="text-sm text-slate-600">Immediate family members working for the business may be exempt in some states.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <MapPin className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Agricultural Workers</h4>
                  <p className="text-sm text-slate-600">Farm workers and seasonal agricultural employees often have different requirements.</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Warning: Independent Contractor Classification
                </h3>
                <p className="text-slate-700 mb-3">
                  Many businesses try to avoid workers comp costs by classifying workers as independent contractors. However, 
                  state agencies are cracking down on misclassification. The IRS and state labor departments use specific tests 
                  to determine worker status:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>Behavioral control:</strong> Does the company control how, when, and where work is done?</li>
                  <li>• <strong>Financial control:</strong> Does the worker have significant investment in their business?</li>
                  <li>• <strong>Relationship:</strong> Are there written contracts, benefits, or permanent positions?</li>
                </ul>
                <p className="text-slate-700 mt-3 text-sm">
                  <strong>Penalties for misclassification can include:</strong> Back taxes, unpaid workers comp premiums with interest, 
                  fines up to $25,000 per violation, and criminal charges in some cases.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Penalties for Non-Compliance</h2>
              <p className="text-slate-600 mb-6">
                Failing to carry required workers compensation insurance can result in severe penalties that vary by state. 
                Here are typical consequences:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-red-600" />
                    Financial Penalties
                  </h4>
                  <ul className="space-y-1 text-slate-700 text-sm">
                    <li>• <strong>California:</strong> $10,000+ fine and up to 1 year in jail; penalty of 2x amount of premium that should have been paid</li>
                    <li>• <strong>New York:</strong> $2,000 per 10-day period of non-compliance, plus penalties up to $50,000</li>
                    <li>• <strong>Pennsylvania:</strong> $2,500 fine and up to 1 year imprisonment for intentional non-compliance</li>
                    <li>• <strong>Illinois:</strong> $500 per day of non-compliance, minimum $10,000 fine</li>
                    <li>• <strong>Florida:</strong> Stop-work order; penalty of 2x amount of premium that should have been paid</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Business Consequences
                  </h4>
                  <ul className="space-y-1 text-slate-700 text-sm">
                    <li>• <strong>Stop-work orders:</strong> Many states can shut down your business operations</li>
                    <li>• <strong>License revocation:</strong> Professional and business licenses may be suspended</li>
                    <li>• <strong>Contract exclusion:</strong> Inability to bid on government or private contracts</li>
                    <li>• <strong>Criminal charges:</strong> Willful non-compliance can result in misdemeanor or felony charges</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-red-600" />
                    Civil Liability
                  </h4>
                  <ul className="space-y-1 text-slate-700 text-sm">
                    <li>• <strong>Employee lawsuits:</strong> Injured employees can sue for full damages plus attorney fees</li>
                    <li>• <strong>No exclusive remedy protection:</strong> Without coverage, you lose protection from negligence lawsuits</li>
                    <li>• <strong>Punitive damages:</strong> Courts may award additional damages for failure to insure</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Does Workers Compensation Cost?</h2>
              <p className="text-slate-600 mb-6">
                Workers compensation premiums are calculated based on several factors. Understanding these can help you estimate 
                and manage your costs:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Cost Factors</h3>
              <div className="space-y-3 mb-8">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <span className="font-semibold text-slate-900">Payroll amount:</span>
                  <span className="text-slate-600"> Premiums are calculated per $100 of payroll. More payroll = higher premiums.</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <span className="font-semibold text-slate-900">Classification codes:</span>
                  <span className="text-slate-600"> Different job types have different risk levels (rates from $0.50 to $50+ per $100 payroll).</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <span className="font-semibold text-slate-900">Experience modification rate (EMR):</span>
                  <span className="text-slate-600"> Your claims history affects your rates. Good history = discounts; poor history = surcharges.</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <span className="font-semibold text-slate-900">State requirements:</span>
                  <span className="text-slate-600"> Some states have higher benefit levels, resulting in higher premiums.</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Average Costs by Industry</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="text-left p-3 font-bold text-slate-900">Industry</th>
                      <th className="text-left p-3 font-bold text-slate-900">Rate per $100 Payroll</th>
                      <th className="text-left p-3 font-bold text-slate-900">Annual Cost* (5 employees)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-slate-700">Clerical/Office</td>
                      <td className="p-3 text-slate-600">$0.30 - $0.60</td>
                      <td className="p-3 text-slate-600">$750 - $1,500</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Retail</td>
                      <td className="p-3 text-slate-600">$1.50 - $3.00</td>
                      <td className="p-3 text-slate-600">$3,750 - $7,500</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Restaurant</td>
                      <td className="p-3 text-slate-600">$2.00 - $4.00</td>
                      <td className="p-3 text-slate-600">$5,000 - $10,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Manufacturing</td>
                      <td className="p-3 text-slate-600">$3.00 - $8.00</td>
                      <td className="p-3 text-slate-600">$7,500 - $20,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Construction</td>
                      <td className="p-3 text-slate-600">$5.00 - $25.00+</td>
                      <td className="p-3 text-slate-600">$12,500 - $62,500+</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-slate-500 mt-2">*Based on $50,000 average annual payroll per employee</p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Purchase Workers Compensation Insurance</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-slate-900 mb-2">Private Insurance Companies</h4>
                  <p className="text-sm text-slate-600 mb-2">Available in most states. Shop multiple carriers for best rates.</p>
                  <p className="text-xs text-emerald-700">Best for: Most employers with good safety records</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-slate-900 mb-2">State Insurance Funds</h4>
                  <p className="text-sm text-slate-600 mb-2">Required in some states; available as option in others.</p>
                  <p className="text-xs text-emerald-700">Best for: High-risk businesses, last resort coverage</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-slate-900 mb-2">Professional Employer Organizations (PEOs)</h4>
                  <p className="text-sm text-slate-600 mb-2">Co-employment arrangement often provides better rates.</p>
                  <p className="text-xs text-emerald-700">Best for: Small businesses wanting HR support</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-slate-900 mb-2">Self-Insurance</h4>
                  <p className="text-sm text-slate-600 mb-2">Large employers can self-insure with state approval.</p>
                  <p className="text-xs text-emerald-700">Best for: Large corporations with substantial assets</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Do I need workers comp for 1099 contractors?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Generally, no—true independent contractors are not employees. However, if you misclassify an employee as a 
                    contractor, you could face severe penalties. Use the IRS 20-factor test to determine proper classification.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Does workers comp cover remote employees?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Yes, in most cases. If an employee is injured while performing work duties at home, they are typically covered. 
                    However, proving the injury occurred during work can be more complex with remote workers.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    What happens if I operate in multiple states?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    You must comply with each state's requirements where you have employees. Many policies include "other states" 
                    coverage for temporary work in other states. Notify your insurer of all states where you operate.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Get Workers Compensation Insurance</h3>
              <p className="text-amber-100 mb-6">
                Compare quotes from top-rated carriers and ensure your business stays compliant. Free quotes in minutes.
              </p>
              <Link 
                href="/get-quote?type=business"
                className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-3 rounded-xl font-bold hover:bg-amber-50 transition"
              >
                Get Free Workers Comp Quotes
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
                  href="/guides/professional-vs-general-liability"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Scale className="w-5 h-5 text-blue-600" />
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
