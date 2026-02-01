import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, ArrowRight, CheckCircle, AlertTriangle, Building2,
  DollarSign, Users, Scale, FileText, Briefcase, Clock,
  TrendingUp, HelpCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'General Liability Insurance Explained: Coverage, Costs & Who Needs It | MyInsuranceBuddy',
  description: 'Learn what general liability insurance covers including bodily injury, property damage, and advertising injury. Find out who needs it and how much it costs in 2024.',
  keywords: 'general liability insurance, business liability coverage, bodily injury insurance, property damage insurance, advertising injury, commercial general liability',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function GeneralLiabilityExplainedPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Business Protection Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              General Liability Insurance Explained: What Every Business Owner Needs to Know
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-amber-100 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
              <span className="px-2 py-1 bg-amber-500/30 text-amber-100 rounded text-xs font-medium">Essential Reading</span>
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
                General liability insurance is the foundation of business protection. Whether you're a startup or an established company, 
                understanding this essential coverage can mean the difference between surviving a lawsuit and closing your doors. 
                This comprehensive guide breaks down exactly what general liability insurance covers, who needs it, and how much you can expect to pay.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Quick Answer: What is General Liability Insurance?
                </h3>
                <p className="text-slate-700">
                  General liability insurance protects your business from financial losses resulting from claims of bodily injury, 
                  property damage, and advertising injury caused by your business operations, products, or services. It's often 
                  the first insurance policy business owners purchase.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Does General Liability Insurance Cover?</h2>
              <p className="text-slate-600 mb-6">
                General liability insurance, also known as commercial general liability (CGL) or business liability insurance, 
                provides coverage for three main types of claims:
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    1. Bodily Injury
                  </h3>
                  <p className="text-slate-600 mb-3">
                    Covers medical expenses and legal costs if someone is injured on your business premises or because of your business operations.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-700"><strong>Example:</strong> A customer slips on a wet floor in your retail store and breaks their arm. 
                    General liability insurance covers their medical bills, rehabilitation costs, and any legal fees if they sue.</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    2. Property Damage
                  </h3>
                  <p className="text-slate-600 mb-3">
                    Pays for damage you or your employees cause to someone else's property while conducting business.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-700"><strong>Example:</strong> A contractor accidentally damages a client's expensive flooring while 
                    moving equipment. The insurance covers repair or replacement costs.</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-600" />
                    3. Advertising Injury
                  </h3>
                  <p className="text-slate-600 mb-3">
                    Protects against claims of libel, slander, copyright infringement, and false advertising in your marketing materials.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-700"><strong>Example:</strong> A competitor claims your advertisement made false statements that damaged 
                    their reputation. Your insurance covers legal defense costs and potential settlements.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Additional Coverages Included</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Medical payments for minor injuries (regardless of fault)',
                  'Legal defense costs and attorney fees',
                  'Settlement and judgment costs',
                  'Products-completed operations coverage',
                  'Damages to premises you rent',
                  'Claims arising from your products'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Who Needs General Liability Insurance?</h2>
              <p className="text-slate-600 mb-6">
                The short answer: almost every business. Here are specific scenarios where general liability insurance is essential:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Briefcase className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Small Business Owners</h4>
                  <p className="text-sm text-slate-600">Even home-based businesses face liability risks from client visits or product deliveries.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Building2 className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Retail Stores</h4>
                  <p className="text-sm text-slate-600">High foot traffic increases the risk of customer slip-and-fall accidents.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Users className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Contractors & Construction</h4>
                  <p className="text-sm text-slate-600">Working at client locations creates constant property damage and injury risks.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <TrendingUp className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Professional Services</h4>
                  <p className="text-sm text-slate-600">Consultants and agencies need protection against advertising injury claims.</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  When is General Liability Insurance Required?
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>Lease agreements:</strong> Most commercial landlords require proof of coverage</li>
                  <li>• <strong>Client contracts:</strong> Many businesses require vendors and contractors to carry GL insurance</li>
                  <li>• <strong>Professional licenses:</strong> Some industries mandate coverage for licensing</li>
                  <li>• <strong>Government contracts:</strong> Federal and state contracts typically require coverage</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Does General Liability Insurance Cost?</h2>
              <p className="text-slate-600 mb-6">
                General liability insurance costs vary widely based on your industry, location, business size, and coverage limits. 
                Here's what you can expect:
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-700 mb-1">$500</div>
                  <div className="text-sm text-slate-600">Low-risk businesses<br/>(consultants, IT)</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
                  <div className="text-2xl font-bold text-amber-700 mb-1">$1,000-$3,000</div>
                  <div className="text-sm text-slate-600">Average annual cost<br/>(retail, office)</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                  <div className="text-2xl font-bold text-red-700 mb-1">$5,000+</div>
                  <div className="text-sm text-slate-600">High-risk industries<br/>(construction, manufacturing)</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Factors Affecting Your Premium</h3>
              <div className="space-y-3 mb-8">
                {[
                  { factor: 'Industry type', impact: 'Construction pays more than consulting' },
                  { factor: 'Business size', impact: 'Revenue and number of employees affect rates' },
                  { factor: 'Location', impact: 'Urban areas typically cost more than rural' },
                  { factor: 'Coverage limits', impact: '$2M aggregate costs more than $1M' },
                  { factor: 'Claims history', impact: 'Past claims increase future premiums' },
                  { factor: 'Deductible amount', impact: 'Higher deductible = lower premium' }
                ].map((item) => (
                  <div key={item.factor} className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                    <DollarSign className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.factor}:</span>
                      <span className="text-slate-600"> {item.impact}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Common Coverage Limits</h2>
              <p className="text-slate-600 mb-6">
                General liability policies have two main coverage limits you need to understand:
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="text-left p-3 font-bold text-slate-900">Limit Type</th>
                      <th className="text-left p-3 font-bold text-slate-900">Typical Amount</th>
                      <th className="text-left p-3 font-bold text-slate-900">What It Covers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Per Occurrence</td>
                      <td className="p-3 text-slate-600">$1M</td>
                      <td className="p-3 text-slate-600">Maximum per single claim</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Aggregate</td>
                      <td className="p-3 text-slate-600">$2M</td>
                      <td className="p-3 text-slate-600">Maximum for all claims in policy period</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What's NOT Covered by General Liability?</h2>
              <p className="text-slate-600 mb-6">
                Understanding exclusions is just as important as knowing what's covered. General liability insurance does NOT cover:
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { type: 'Professional errors', desc: 'Mistakes in professional services (needs E&O insurance)' },
                  { type: 'Employee injuries', desc: 'Workplace injuries to employees (needs workers compensation)' },
                  { type: 'Auto accidents', desc: 'Business vehicle accidents (needs commercial auto insurance)' },
                  { type: 'Intentional acts', desc: 'Deliberate harm or damage caused by you or employees' },
                  { type: 'Your property', desc: 'Damage to your own business property (needs property insurance)' },
                  { type: 'Cyber incidents', desc: 'Data breaches and cyber attacks (needs cyber liability insurance)' }
                ].map((item) => (
                  <div key={item.type} className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border border-red-100">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.type}:</span>
                      <span className="text-slate-600"> {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Choose the Right Coverage</h2>
              <ol className="list-decimal pl-6 text-slate-600 mb-8 space-y-4">
                <li>
                  <strong>Assess your risks:</strong> Consider your industry, location, number of employees, and customer interaction level.
                </li>
                <li>
                  <strong>Evaluate your assets:</strong> Your coverage should protect your business assets. Higher assets mean you need higher limits.
                </li>
                <li>
                  <strong>Check contract requirements:</strong> Review client contracts and lease agreements for minimum coverage requirements.
                </li>
                <li>
                  <strong>Compare multiple quotes:</strong> Rates can vary significantly between insurers for the same coverage.
                </li>
                <li>
                  <strong>Consider a BOP:</strong> A Business Owner's Policy bundles general liability with property insurance at a discount.
                </li>
              </ol>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Tips for Lowering Your Premium
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Bundle with other policies (BOP) for discounts up to 20%</li>
                  <li>• Implement safety protocols and document them</li>
                  <li>• Choose a higher deductible if you can afford it</li>
                  <li>• Pay annually instead of monthly to avoid installment fees</li>
                  <li>• Maintain a claims-free history</li>
                  <li>• Shop around and compare quotes from multiple carriers</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Is general liability insurance required by law?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Generally, no—it's not required by state or federal law. However, landlords, clients, and licensing boards often require it. 
                    Some industries have specific requirements.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    What's the difference between general liability and professional liability?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    General liability covers physical injuries and property damage. Professional liability (E&O) covers financial losses 
                    from professional mistakes, errors, or negligence in your services.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Can I get general liability insurance for a home-based business?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Yes, and you should. Homeowner's insurance typically doesn't cover business activities or liabilities. 
                    A standalone general liability policy or home-based business endorsement is recommended.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Protect Your Business Today</h3>
              <p className="text-amber-100 mb-6">
                Get free general liability insurance quotes from top-rated carriers. Compare coverage options and save up to 30%.
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
                  href="/guides/professional-vs-general-liability"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Scale className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">Professional vs General Liability</span>
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
