import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, ArrowRight, CheckCircle, Clock, Star, AlertCircle,
  Briefcase, Users, DollarSign, FileText, PiggyBank, Building,
  HardHat, Lock, Stethoscope, TrendingUp, Check, XCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Business Insurance Types Every Owner Needs | MyInsuranceBuddy',
  description: 'Essential guide to business insurance: general liability, professional liability, workers compensation, BOP, and cyber liability. Protect your business with the right coverage.',
  keywords: 'business insurance types, general liability insurance, professional liability insurance, workers compensation insurance, BOP business owners policy, cyber liability insurance, commercial insurance',
  openGraph: {
    title: 'Business Insurance Types Every Owner Needs',
    description: 'Complete guide to essential business insurance coverage types and how to protect your company.',
  },
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function BusinessInsuranceTypesPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-700 via-orange-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building className="w-4 h-4" />
              Business Protection Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Business Insurance Types Every Owner Needs
            </h1>
            <p className="text-lg text-amber-200 mb-6">
              Protect your business from lawsuits, accidents, and unexpected disasters. Learn about essential coverage types for every business.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 13 min read</span>
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
                Starting and running a business involves risk. From customer injuries to professional mistakes, 
                employee accidents to cyber attacks, unexpected events can threaten your company's survival. 
                The right business insurance doesn't just protect your assets—it provides peace of mind so you 
                can focus on growing your company.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Why Business Insurance Is Essential
                </h3>
                <p className="text-slate-700 mb-3">
                  Without proper insurance, a single lawsuit or disaster could bankrupt your business. Consider these statistics:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li>• 36-53% of small businesses face lawsuits annually</li>
                  <li>• Average cost of a business lawsuit: $54,000 for liability, $91,000 for contract disputes</li>
                  <li>• 43% of cyber attacks target small businesses</li>
                  <li>• 60% of small businesses that experience a cyber attack close within 6 months</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Essential Business Insurance Types</h2>
              <p className="text-slate-600 mb-6">
                While every business has unique needs, these five types of insurance form the foundation of comprehensive business protection:
              </p>

              {/* General Liability */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">1. General Liability Insurance</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      Essential for All Businesses
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  General liability insurance (GL) is the foundation of business protection. It covers claims of bodily injury, 
                  property damage, and personal injury (like libel or slander) caused by your business operations, products, 
                  or services.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">What It Covers:</h4>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Bodily Injury</strong>
                      <p className="text-sm text-slate-600">A customer slips and falls in your store</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Property Damage</strong>
                      <p className="text-sm text-slate-600">You damage a client's property while working</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Personal Injury</strong>
                      <p className="text-sm text-slate-600">Libel, slander, copyright infringement claims</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Legal Defense</strong>
                      <p className="text-sm text-slate-600">Attorney fees, court costs, settlements</p>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-slate-900 mb-2">Typical Coverage Limits:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li>$1 million per occurrence</li>
                  <li>$2 million aggregate (total per year)</li>
                  <li>Higher limits available for high-risk businesses</li>
                </ul>

                <div className="bg-amber-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-700">
                    <strong>Average Cost:</strong> $400-$1,500 per year for small businesses, depending on industry, location, and coverage limits.
                  </p>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Who Needs It:</strong> Every business, regardless of size or industry. Some clients and landlords require proof of GL insurance.
                </p>
              </div>

              {/* Professional Liability */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">2. Professional Liability Insurance</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      For Service-Based Businesses
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  Also called Errors & Omissions (E&O) insurance, professional liability covers claims of negligence, 
                  mistakes, or failure to perform professional duties. Unlike general liability (which covers physical damage), 
                  E&O covers financial losses caused by your professional services.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">What It Covers:</h4>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Professional Negligence</strong>
                      <p className="text-sm text-slate-600">Making a mistake that costs your client money</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Failure to Deliver</strong>
                      <p className="text-sm text-slate-600">Not completing work as promised</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Breach of Contract</strong>
                      <p className="text-sm text-slate-600">Not fulfilling contractual obligations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Defense Costs</strong>
                      <p className="text-sm text-slate-600">Legal fees even if claim is baseless</p>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-slate-900 mb-2">Examples by Profession:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li><strong>Accountants:</strong> Tax preparation errors leading to IRS penalties</li>
                  <li><strong>Consultants:</strong> Bad advice that causes business losses</li>
                  <li><strong>IT Professionals:</strong> System failures, data breaches, project delays</li>
                  <li><strong>Real Estate Agents:</strong> Failure to disclose property defects</li>
                  <li><strong>Marketing Agencies:</strong> Campaigns that violate copyright or trademarks</li>
                </ul>

                <div className="bg-amber-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-700">
                    <strong>Average Cost:</strong> $500-$3,000+ per year, depending on profession, revenue, claims history, and coverage limits.
                  </p>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Who Needs It:</strong> Consultants, accountants, lawyers, IT professionals, real estate agents, marketing agencies, and any business providing professional advice or services.
                </p>
              </div>

              {/* Workers Compensation */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HardHat className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">3. Workers' Compensation Insurance</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      Required by Law in Most States
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  Workers' compensation (workers' comp) provides medical benefits and wage replacement to employees 
                  injured on the job. In exchange, employees give up the right to sue for negligence. 
                  Almost every state requires workers' comp for businesses with employees.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">What It Covers:</h4>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Medical Expenses</strong>
                      <p className="text-sm text-slate-600">Emergency treatment, surgery, rehabilitation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Lost Wages</strong>
                      <p className="text-sm text-slate-600">Partial income replacement during recovery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Disability Benefits</strong>
                      <p className="text-sm text-slate-600">For temporary or permanent disabilities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Death Benefits</strong>
                      <p className="text-sm text-slate-600">Funeral costs and survivor benefits</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Legal Requirements Vary by State
                  </h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Texas is the only state where workers' comp is truly optional</li>
                    <li>• Most states require coverage with 1-5 employees</li>
                    <li>• Penalties for non-compliance include fines and criminal charges</li>
                    <li>• Some states have state-run funds; others require private insurance</li>
                  </ul>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-700">
                    <strong>Average Cost:</strong> $0.75-$2.74 per $100 of payroll, varying dramatically by industry risk class.
                  </p>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Who Needs It:</strong> Any business with employees (requirements vary by state). Sole proprietors and partners may be exempt but can opt-in for coverage.
                </p>
              </div>

              {/* BOP */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">4. Business Owner's Policy (BOP)</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      Bundled Coverage for Small Business
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  A Business Owner's Policy bundles several essential coverages into one convenient package, 
                  typically at a lower cost than buying each policy separately. It's designed for small to 
                  medium-sized businesses with specific risk profiles.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">What's Typically Included:</h4>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <strong className="text-slate-700 block mb-1">General Liability</strong>
                    <p className="text-sm text-slate-600">Third-party injury and property damage</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <strong className="text-slate-700 block mb-1">Property Insurance</strong>
                    <p className="text-sm text-slate-600">Buildings, equipment, inventory</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <strong className="text-slate-700 block mb-1">Business Interruption</strong>
                    <p className="text-sm text-slate-600">Lost income during covered closures</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <strong className="text-slate-700 block mb-1">Optional Add-ons</strong>
                    <p className="text-sm text-slate-600">Cyber liability, hired/non-owned auto, etc.</p>
                  </div>
                </div>

                <h4 className="font-semibold text-slate-900 mb-2">Who Qualifies for a BOP:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li>Small to medium-sized businesses (usually under $10M revenue)</li>
                  <li>Low-risk industries (retail, professional services, offices)</li>
                  <li>Businesses that need both liability and property coverage</li>
                  <li>Companies operating from a physical location</li>
                </ul>

                <div className="bg-amber-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-700">
                    <strong>Average Cost:</strong> $500-$2,000+ per year depending on coverage limits, location, and business size. Often 10-20% less than buying separately.
                  </p>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Who Needs It:</strong> Small businesses with physical locations that need property and liability coverage. High-risk businesses (construction, manufacturing) may need separate policies.
                </p>
              </div>

              {/* Cyber Liability */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">5. Cyber Liability Insurance</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      Essential in the Digital Age
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  Cyber liability insurance protects your business from the financial fallout of data breaches, 
                  cyber attacks, and other technology-related risks. As businesses become increasingly digital, 
                  this coverage has become essential for companies of all sizes.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">First-Party Coverage (Your Losses):</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li><strong>Data Breach Response:</strong> Notification costs, credit monitoring for affected customers</li>
                  <li><strong>Business Interruption:</strong> Lost income during system downtime</li>
                  <li><strong>Data Recovery:</strong> Restoring lost or corrupted data</li>
                  <li><strong>Cyber Extortion:</strong> Ransom payments and negotiation costs</li>
                  <li><strong>Forensic Investigation:</strong> Determining the cause and extent of a breach</li>
                </ul>

                <h4 className="font-semibold text-slate-900 mb-2">Third-Party Coverage (Liability to Others):</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li><strong>Privacy Liability:</strong> Claims from customers whose data was exposed</li>
                  <li><strong>Network Security Liability:</strong> Claims from spreading malware or denial-of-service attacks</li>
                  <li><strong>Media Liability:</strong> Claims of defamation, copyright infringement, or privacy violations</li>
                  <li><strong>Regulatory Fines:</strong> Defense costs and fines from regulatory actions</li>
                </ul>

                <div className="bg-amber-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-700">
                    <strong>Average Cost:</strong> $500-$5,000+ per year for small businesses. Factors include industry, revenue, data volume, and security measures in place.
                  </p>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Who Needs It:</strong> Any business that collects customer data, accepts credit cards, uses email, has a website, or relies on computer systems. In other words: virtually every business today.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Additional Coverage Types to Consider</h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900">Commercial Auto Insurance</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Covers vehicles owned by your business or used for business purposes. Personal auto insurance 
                    typically excludes business use.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900">Employment Practices Liability (EPLI)</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Covers claims from employees for wrongful termination, discrimination, harassment, 
                    and other employment-related issues.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900">Key Person Insurance</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Life insurance on essential employees or owners. The business receives the payout 
                    to recover from the loss of a key person's contribution.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900">Directors & Officers (D&O)</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Protects company leadership from personal losses if sued for decisions made in their 
                    official capacity. Essential for corporations and non-profits.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900">Umbrella Insurance</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Provides additional liability coverage above your other policies' limits. 
                    Affordable way to get $1-5 million in extra protection.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <HardHat className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900">Inland Marine Insurance</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Covers equipment, tools, and property in transit or at job sites. Despite the name, 
                    it covers land-based transportation and equipment.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Business Insurance Do You Need?</h2>
              <p className="text-slate-600 mb-6">
                Determining the right amount of coverage depends on several factors specific to your business:
              </p>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">Factors to Consider:</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-amber-700">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Industry Risk Level</h4>
                      <p className="text-sm text-slate-600">Construction companies need more than retail stores. Healthcare providers face different risks than consultants.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-amber-700">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Business Assets</h4>
                      <p className="text-sm text-slate-600">Total value of property, equipment, inventory, and improvements you've made.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-amber-700">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Revenue and Payroll</h4>
                      <p className="text-sm text-slate-600">Higher revenue businesses often face larger lawsuits. Payroll affects workers' comp costs.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-amber-700">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Contract Requirements</h4>
                      <p className="text-sm text-slate-600">Many clients and landlords require specific coverage limits as a condition of doing business.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Typical Coverage Recommendations by Business Type</h2>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Business Type</th>
                      <th className="px-4 py-3">Essential Coverage</th>
                      <th className="px-4 py-3">Recommended Limits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">Retail Store</td>
                      <td className="px-4 py-3 text-slate-600">BOP + Workers' Comp</td>
                      <td className="px-4 py-3 text-slate-600">$1-2M liability, full property value</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Restaurant</td>
                      <td className="px-4 py-3 text-slate-600">GL + Workers' Comp + BOP</td>
                      <td className="px-4 py-3 text-slate-600">$2M+ liability, liquor liability if applicable</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Consulting/Professional</td>
                      <td className="px-4 py-3 text-slate-600">E&O + GL + Cyber</td>
                      <td className="px-4 py-3 text-slate-600">$1-2M professional, $1M general</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Construction</td>
                      <td className="px-4 py-3 text-slate-600">GL + Workers' Comp + Commercial Auto</td>
                      <td className="px-4 py-3 text-slate-600">$2-5M liability, umbrella recommended</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Tech Company</td>
                      <td className="px-4 py-3 text-slate-600">E&O + Cyber + GL</td>
                      <td className="px-4 py-3 text-slate-600">$2M+ cyber, $1-2M E&O</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Healthcare Provider</td>
                      <td className="px-4 py-3 text-slate-600">Malpractice + GL + Cyber</td>
                      <td className="px-4 py-3 text-slate-600">$1-5M malpractice per state requirements</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cost Overview: What to Expect</h2>
              <p className="text-slate-600 mb-6">
                Business insurance costs vary widely based on your industry, location, size, and coverage needs. 
                Here's a general idea of annual costs for small businesses:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">General Liability</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-1">$400 - $1,500</p>
                  <p className="text-sm text-slate-600">per year</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Professional Liability</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-1">$500 - $3,000+</p>
                  <p className="text-sm text-slate-600">per year</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Workers' Compensation</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-1">$0.75 - $2.74</p>
                  <p className="text-sm text-slate-600">per $100 of payroll</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Business Owner's Policy</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-1">$500 - $2,000</p>
                  <p className="text-sm text-slate-600">per year</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Cyber Liability</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-1">$500 - $5,000+</p>
                  <p className="text-sm text-slate-600">per year</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Commercial Auto</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-1">$750 - $2,500</p>
                  <p className="text-sm text-slate-600">per vehicle per year</p>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-600" />
                  Tips for Saving on Business Insurance
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>Bundle policies</strong> with a BOP or single carrier for multi-policy discounts</li>
                  <li>• <strong>Implement safety programs</strong> to reduce workers' comp claims and premiums</li>
                  <li>• <strong>Raise your deductibles</strong> if you have the cash reserves to handle smaller claims</li>
                  <li>• <strong>Pay annually</strong> instead of monthly to avoid installment fees</li>
                  <li>• <strong>Shop around</strong> every 2-3 years or work with an independent agent</li>
                  <li>• <strong>Maintain good credit</strong>—many insurers use credit in pricing</li>
                  <li>• <strong>Ask about industry associations</strong>—some offer group discounts</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Buy Business Insurance</h2>
              <p className="text-slate-600 mb-6">
                Follow these steps to get the right coverage for your business:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-amber-700">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Assess Your Risks</h4>
                    <p className="text-slate-600 text-sm">Identify what could go wrong in your business and what assets need protection.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-amber-700">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Check Legal Requirements</h4>
                    <p className="text-slate-600 text-sm">Determine what insurance is required by law, your landlord, or client contracts.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-amber-700">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Get Multiple Quotes</h4>
                    <p className="text-slate-600 text-sm">Compare options from several insurers. Consider working with an independent agent.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-amber-700">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Review and Purchase</h4>
                    <p className="text-slate-600 text-sm">Don't just look at price—review coverage details, exclusions, and insurer financial ratings.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-amber-700">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Review Annually</h4>
                    <p className="text-slate-600 text-sm">As your business grows and changes, your insurance needs will too. Review coverage yearly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Protect Your Business Today</h3>
              <p className="text-amber-100 mb-6">
                Compare business insurance quotes from top-rated carriers. Get customized coverage for your industry and business size.
              </p>
              <Link 
                href="/get-quote?type=business"
                className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-3 rounded-xl font-bold hover:bg-amber-50 transition"
              >
                Get Business Insurance Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/life-insurance-coverage"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Shield className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">How Much Life Insurance Do You Need?</span>
                </Link>
                <Link 
                  href="/guides/life-insurance-parents"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Users className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">Life Insurance for Parents</span>
                </Link>
                <Link 
                  href="/business-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">Business Insurance Overview</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <FileText className="w-5 h-5 text-amber-600" />
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
