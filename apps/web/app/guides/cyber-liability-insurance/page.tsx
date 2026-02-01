import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, ArrowRight, CheckCircle, AlertTriangle, Lock,
  DollarSign, Users, Server, FileText, Clock, Laptop,
  Database, Mail, Globe, HelpCircle, TrendingUp, AlertOctagon
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cyber Liability Insurance for Businesses: Complete Coverage Guide (2024) | MyInsuranceBuddy',
  description: 'Learn what cyber liability insurance covers including data breaches and ransomware. Understand first vs third party coverage, who needs it, and typical costs.',
  keywords: 'cyber liability insurance, data breach insurance, cyber insurance coverage, ransomware insurance, cyber attack protection, business cyber security',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function CyberLiabilityInsurancePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Lock className="w-4 h-4" />
              Digital Protection Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Cyber Liability Insurance for Businesses: Your Complete Protection Guide
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-amber-100 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 13 min read</span>
              <span className="px-2 py-1 bg-amber-500/30 text-amber-100 rounded text-xs font-medium">Essential for Digital Age</span>
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
                Cyber attacks are no longer a question of "if" but "when." From small mom-and-pop shops to Fortune 500 companies, 
                businesses of every size face constant threats from hackers, ransomware gangs, and data thieves. A single data 
                breach can cost hundreds of thousands of dollars in recovery costs, legal fees, and lost business. Cyber liability 
                insurance has become an essential protection for any business that handles sensitive data—and in today's digital 
                world, that's nearly every business.
              </p>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-red-600" />
                  The Growing Threat: Why Cyber Insurance Matters Now
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>43% of cyber attacks</strong> target small businesses</li>
                  <li>• <strong>Average data breach cost:</strong> $4.45 million (IBM 2023 report)</li>
                  <li>• <strong>Ransomware attack every 11 seconds</strong> globally</li>
                  <li>• <strong>60% of small businesses</strong> close within 6 months of a cyber attack</li>
                  <li>• <strong>Human error</strong> causes 95% of cybersecurity breaches</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is Cyber Liability Insurance?</h2>
              <p className="text-slate-600 mb-6">
                Cyber liability insurance—also called cyber insurance or data breach insurance—protects businesses from the 
                financial consequences of cyber attacks, data breaches, and other digital threats. It covers costs that your 
                general liability policy explicitly excludes, including notification expenses, credit monitoring, legal fees, 
                and ransomware payments.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  Quick Answer
                </h3>
                <p className="text-slate-700">
                  Cyber liability insurance covers costs related to data breaches, cyber attacks, ransomware, and privacy incidents. 
                  It includes first-party coverage (your direct costs) and third-party coverage (liability to others affected).
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Does Cyber Liability Insurance Cover?</h2>
              <p className="text-slate-600 mb-6">
                Cyber liability policies typically include two main types of coverage: first-party (your costs) and third-party 
                (costs you're liable for). Understanding both is crucial for selecting the right policy.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">First-Party Coverage: Your Direct Costs</h3>
              <p className="text-slate-600 mb-4">
                First-party coverage pays for expenses your business incurs directly as a result of a cyber incident:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-600" />
                    Data Breach Response
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Forensic investigation to determine what happened</li>
                    <li>• Customer notification costs (legally required in most states)</li>
                    <li>• Credit monitoring services for affected individuals</li>
                    <li>• Call center setup for customer inquiries</li>
                    <li>• Crisis management and public relations</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-600" />
                    Ransomware and Cyber Extortion
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Ransom payments (though payment is controversial)</li>
                    <li>• Negotiation with cyber criminals</li>
                    <li>• Costs of restoring systems and data</li>
                    <li>• Bitcoin/cryptocurrency procurement fees</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Server className="w-5 h-5 text-amber-600" />
                    Business Interruption
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Lost income during system downtime</li>
                    <li>• Operating expenses that continue during shutdown</li>
                    <li>• Extra expenses to maintain operations</li>
                    <li>• Dependent business interruption (if a key vendor is attacked)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-amber-600" />
                    Data Recovery and System Restoration
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Data restoration from backups</li>
                    <li>• Hardware and software replacement</li>
                    <li>• IT consultant fees</li>
                    <li>• System rebuilding and hardening</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Third-Party Coverage: Your Liability to Others</h3>
              <p className="text-slate-600 mb-4">
                Third-party coverage protects you when others sue your business for damages related to a cyber incident:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Network Security and Privacy Liability
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Defense costs for lawsuits from customers or partners</li>
                    <li>• Settlements and judgments</li>
                    <li>• Regulatory fines and penalties (where insurable)</li>
                    <li>• PCI DSS fines for credit card data breaches</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Media Liability
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Defamation, libel, or slander claims from online content</li>
                    <li>• Copyright or trademark infringement</li>
                    <li>• invasion of privacy claims</li>
                    <li>• Website content errors and omissions</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Regulatory Defense and Penalties
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Defense costs for regulatory investigations</li>
                    <li>• HIPAA fines for healthcare data breaches</li>
                    <li>• GDPR fines for EU citizen data</li>
                    <li>• State breach notification law violations</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">First-Party vs Third-Party: What's the Difference?</h2>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="text-left p-3 font-bold text-slate-900">Aspect</th>
                      <th className="text-left p-3 font-bold text-slate-900">First-Party Coverage</th>
                      <th className="text-left p-3 font-bold text-slate-900">Third-Party Coverage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Who It Protects</td>
                      <td className="p-3 text-slate-600">Your business directly</td>
                      <td className="p-3 text-slate-600">Your business against claims by others</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Typical Claims</td>
                      <td className="p-3 text-slate-600">Breach response, ransomware, business interruption</td>
                      <td className="p-3 text-slate-600">Customer lawsuits, regulatory fines</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Claim Trigger</td>
                      <td className="p-3 text-slate-600">Cyber incident affecting your systems/data</td>
                      <td className="p-3 text-slate-600">Lawsuit or claim by affected party</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Payment To</td>
                      <td className="p-3 text-slate-600">Directly to your business</td>
                      <td className="p-3 text-slate-600">To plaintiffs, regulators, or on your behalf</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Which Do You Need?
                </h3>
                <p className="text-slate-700 mb-3">
                  Most businesses need <strong>both</strong> types of coverage:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>First-party is essential</strong> because you'll definitely incur costs if you're breached</li>
                  <li>• <strong>Third-party is essential</strong> because you can be sued even if you did nothing wrong</li>
                  <li>• Some policies bundle both; others sell them separately</li>
                  <li>• Standalone cyber policies typically offer broader coverage than endorsements</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Who Needs Cyber Liability Insurance?</h2>
              <p className="text-slate-600 mb-6">
                If your business handles sensitive data, uses computers, accepts credit cards, or has an online presence, 
                you need cyber insurance. Here are the businesses that need it most:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">High-Risk: Critical Priority</h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Healthcare providers (HIPAA data)</li>
                    <li>• Financial services (banking, investments)</li>
                    <li>• E-commerce businesses</li>
                    <li>• Payment processors</li>
                    <li>• Companies with 10,000+ customer records</li>
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <AlertOctagon className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Medium-Risk: Strongly Recommended</h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Professional services</li>
                    <li>• Retail stores with customer databases</li>
                    <li>• Manufacturers with trade secrets</li>
                    <li>• Real estate agencies</li>
                    <li>• Companies with 1,000+ customer records</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <Shield className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Lower-Risk: Still Recommended</h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Small professional practices</li>
                    <li>• Contractors with minimal data</li>
                    <li>• Restaurants with basic POS systems</li>
                    <li>• Any business with email</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Users className="w-6 h-6 text-slate-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">By Data Type</h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Personal identifiable information (PII)</li>
                    <li>• Payment card data (PCI)</li>
                    <li>• Protected health information (PHI)</li>
                    <li>• Intellectual property or trade secrets</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Real-World Cyber Attack Scenarios</h2>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Scenario 1: The Ransomware Attack</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4">
                  A 25-employee manufacturing company is hit with ransomware that encrypts all their files, including customer 
                  orders, inventory systems, and financial records. The attackers demand $150,000 in Bitcoin.
                </p>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-2">Covered Costs with Cyber Insurance:</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Ransom negotiation services: $15,000</li>
                    <li>• Ransom payment: $75,000 (negotiated down)</li>
                    <li>• Forensic investigation: $25,000</li>
                    <li>• System restoration: $30,000</li>
                    <li>• Business interruption (5 days): $50,000</li>
                    <li>• <strong>Total claim: $195,000</strong></li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Scenario 2: The Data Breach</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4">
                  A medical practice's patient database is hacked, exposing 5,000 patient records including names, addresses, 
                  Social Security numbers, and medical histories.
                </p>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-2">Covered Costs with Cyber Insurance:</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Forensic investigation: $40,000</li>
                    <li>• Legal fees: $75,000</li>
                    <li>• Patient notification (5,000 @ $5 each): $25,000</li>
                    <li>• Credit monitoring (5,000 @ $100/year): $500,000</li>
                    <li>• HIPAA fines: $100,000</li>
                    <li>• PR and crisis management: $30,000</li>
                    <li>• <strong>Total claim: $770,000</strong></li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Scenario 3: The Business Email Compromise</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4">
                  An employee receives a phishing email that appears to be from the CEO, requesting an urgent wire transfer 
                  to a vendor. The employee transfers $75,000 to a fraudulent account.
                </p>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-2">Covered Costs with Cyber Insurance:</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Social engineering fraud coverage: $75,000</li>
                    <li>• Investigation of breach: $10,000</li>
                    <li>• Employee training program: $5,000</li>
                    <li>• <strong>Total claim: $90,000</strong></li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Does Cyber Liability Insurance Cost?</h2>
              <p className="text-slate-600 mb-6">
                Cyber insurance premiums have increased significantly in recent years due to the surge in ransomware attacks. 
                However, coverage remains surprisingly affordable compared to the potential costs of an attack.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-700 mb-1">$500-$1,500</div>
                  <div className="text-sm text-slate-600">Small businesses<br/>Low data volume</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
                  <div className="text-2xl font-bold text-amber-700 mb-1">$1,500-$5,000</div>
                  <div className="text-sm text-slate-600">Medium businesses<br/>Standard risk profile</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                  <div className="text-2xl font-bold text-red-700 mb-1">$5,000-$25,000+</div>
                  <div className="text-sm text-slate-600">Large businesses<br/>High-risk industries</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Factors Affecting Your Premium</h3>
              <div className="space-y-3 mb-8">
                {[
                  { factor: 'Industry type', desc: 'Healthcare and financial services pay more due to sensitive data' },
                  { factor: 'Number of records', desc: 'More customer records = higher potential breach costs' },
                  { factor: 'Revenue size', desc: 'Larger businesses face bigger targets and higher business interruption exposure' },
                  { factor: 'Security measures', desc: 'MFA, encryption, and employee training can reduce premiums 10-30%' },
                  { factor: 'Claims history', desc: 'Previous breaches significantly increase rates' },
                  { factor: 'Coverage limits', desc: '$1M coverage costs less than $5M; typical is $1M-$5M' }
                ].map((item) => (
                  <div key={item.factor} className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                    <DollarSign className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.factor}:</span>
                      <span className="text-slate-600"> {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What's NOT Covered by Cyber Insurance?</h2>
              <p className="text-slate-600 mb-6">
                Understanding exclusions is crucial. Standard cyber policies typically do NOT cover:
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { type: 'Future lost profits', desc: 'Long-term revenue decline after an attack' },
                  { type: 'Intangible property', desc: 'Loss of intellectual property value (though recovery costs may be covered)' },
                  { type: 'Self-inflicted damage', desc: 'Damage caused intentionally by employees' },
                  { type: 'Prior acts', desc: 'Breach of data before the policy retroactive date' },
                  { type: 'Infrastructure failure', desc: 'Power outages, internet failures not caused by cyber attacks' },
                  { type: 'War and terrorism', desc: 'Acts of war, terrorism, or nation-state attacks (may be excluded)' }
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

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Choose the Right Cyber Policy</h2>
              <ol className="list-decimal pl-6 text-slate-600 mb-8 space-y-4">
                <li>
                  <strong>Assess your data:</strong> How many records do you store? What type (PII, PHI, payment data)?
                </li>
                <li>
                  <strong>Calculate potential costs:</strong> Use average breach costs ($200-250 per record) to estimate your exposure
                </li>
                <li>
                  <strong>Choose appropriate limits:</strong> Most small businesses need $1M-$2M; larger or high-risk businesses need $5M+
                </li>
                <li>
                  <strong>Verify retroactive date:</strong> Make sure it covers past data collection activities
                </li>
                <li>
                  <strong>Check for critical coverages:</strong> Ensure ransomware, social engineering, and business interruption are included
                </li>
                <li>
                  <strong>Compare incident response:</strong> Look for policies with 24/7 response teams and pre-vetted vendors
                </li>
              </ol>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Ways to Reduce Cyber Insurance Costs
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Implement multi-factor authentication (MFA) on all accounts</li>
                  <li>• Conduct regular employee security training</li>
                  <li>• Maintain encrypted backups offline</li>
                  <li>• Use endpoint detection and response (EDR) software</li>
                  <li>• Develop and test incident response plans</li>
                  <li>• Conduct regular vulnerability assessments</li>
                  <li>• Document your cybersecurity policies</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Does cyber insurance cover ransomware payments?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Most policies do cover ransom payments, but this is increasingly controversial. Some insurers are removing 
                    this coverage or requiring specific security measures. Even with coverage, paying ransoms is discouraged 
                    by law enforcement. The policy also covers the costs of restoring systems without paying the ransom.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Do I need cyber insurance if I use cloud services?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Yes! While cloud providers secure their infrastructure, you remain responsible for securing your data, 
                    access credentials, and configurations. Most cloud provider agreements explicitly state they are not 
                    responsible for your data security. You need your own coverage.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Will cyber insurance cover regulatory fines?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    It depends. Some policies cover regulatory fines where legally insurable. HIPAA fines, PCI DSS penalties, 
                    and state breach notification fines may be covered. However, some fines (like GDPR administrative fines 
                    in certain circumstances) may be excluded. Read your policy carefully.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Protect Your Business from Cyber Threats</h3>
              <p className="text-amber-100 mb-6">
                Get cyber liability insurance quotes from leading carriers. Coverage starts at just $500/year for small businesses.
              </p>
              <Link 
                href="/get-quote?type=business"
                className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-3 rounded-xl font-bold hover:bg-amber-50 transition"
              >
                Get Free Cyber Insurance Quotes
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
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Professional vs General Liability</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-amber-50 transition"
                >
                  <Lock className="w-5 h-5 text-violet-600" />
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
