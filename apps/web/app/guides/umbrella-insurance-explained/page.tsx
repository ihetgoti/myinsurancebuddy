import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Umbrella, ArrowRight, CheckCircle, AlertTriangle, Home,
  DollarSign, Car, Shield, Scale, FileText, Clock, Users,
  TrendingUp, HelpCircle, AlertOctagon, Heart, Building2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'What is Umbrella Insurance? Coverage, Limits & Who Needs It (2024) | MyInsuranceBuddy',
  description: 'Learn what umbrella insurance covers beyond auto and home policies. Understand coverage limits, see real examples, and find out if you need this extra protection.',
  keywords: 'umbrella insurance, excess liability coverage, umbrella policy coverage, personal umbrella insurance, liability protection',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function UmbrellaInsuranceExplainedPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Umbrella className="w-4 h-4" />
              Extra Protection Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              What is Umbrella Insurance? Your Guide to Extra Liability Protection
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-cyan-100 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
              <span className="px-2 py-1 bg-cyan-500/30 text-cyan-100 rounded text-xs font-medium">Smart Financial Protection</span>
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
                Imagine being sued for $1 million after a car accident, but your auto insurance only covers $300,000. 
                Where does the remaining $700,000 come from? Without umbrella insurance, it comes from your savings, 
                investments, home equity, and future earnings. Umbrella insurance provides an extra layer of liability 
                protection that kicks in when your other policies reach their limits, offering affordable peace of mind 
                for one of life's biggest financial risks.
              </p>

              <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Umbrella className="w-5 h-5 text-cyan-600" />
                  Quick Answer: What is Umbrella Insurance?
                </h3>
                <p className="text-slate-700">
                  Umbrella insurance is extra liability coverage that goes beyond the limits of your auto, home, or boat 
                  insurance policies. It provides an additional $1 million to $5 million (or more) in protection against 
                  major claims and lawsuits, covering both legal defense costs and judgments or settlements.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Does Umbrella Insurance Work?</h2>
              <p className="text-slate-600 mb-6">
                Think of umbrella insurance as a safety net that catches you when your primary insurance policies run out. 
                Here is how it functions:
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">The Layered Protection Model</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-32 text-sm font-semibold text-slate-700">Primary Policies</div>
                    <div className="flex-1 bg-emerald-100 rounded-lg p-3 text-sm text-slate-700">
                      Auto: $100K/$300K liability | Home: $300K liability
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 text-sm font-semibold text-slate-700">Gap</div>
                    <div className="flex-1 bg-red-100 rounded-lg p-3 text-sm text-slate-700">
                      Without umbrella: YOU pay out-of-pocket
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 text-sm font-semibold text-slate-700">Umbrella Policy</div>
                    <div className="flex-1 bg-cyan-100 rounded-lg p-3 text-sm text-slate-700">
                      Additional $1M - $5M+ coverage
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Key Features of Umbrella Insurance</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <DollarSign className="w-6 h-6 text-cyan-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">High Coverage Limits</h4>
                  <p className="text-sm text-slate-600">Typically starts at $1 million and can go up to $5 million or more for individuals with significant assets.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Scale className="w-6 h-6 text-cyan-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Legal Defense Costs</h4>
                  <p className="text-sm text-slate-600">Covers attorney fees, court costs, and other legal expenses, often in addition to your coverage limit.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <Shield className="w-6 h-6 text-cyan-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Broad Coverage</h4>
                  <p className="text-sm text-slate-600">Covers claims that might be excluded from underlying policies, such as false arrest or slander.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <TrendingUp className="w-6 h-6 text-cyan-600 mb-2" />
                  <h4 className="font-bold text-slate-900 mb-2">Worldwide Coverage</h4>
                  <p className="text-sm text-slate-600">Unlike home and auto policies, umbrella coverage extends internationally for personal liability.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Does Umbrella Insurance Cover?</h2>
              <p className="text-slate-600 mb-6">
                Umbrella insurance provides broader protection than most people realize. Here is what is covered:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Coverage Beyond Auto Insurance</h3>
              <div className="space-y-3 mb-8">
                {[
                  'Serious auto accidents where you are at fault and damages exceed your auto liability limits',
                  'Injuries to multiple passengers in another vehicle',
                  'Accidents caused by family members driving your car',
                  'Accidents in rental cars or when driving abroad',
                  'Bodily injury claims from auto accidents involving pedestrians or cyclists',
                  'Wrongful death claims resulting from auto accidents'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Coverage Beyond Home Insurance</h3>
              <div className="space-y-3 mb-8">
                {[
                  'Severe injuries to guests on your property exceeding your home liability limit',
                  'Dog bite incidents with serious injuries or multiple victims',
                  'Swimming pool accidents and drowning incidents',
                  'Trampoline injuries (often excluded from standard home policies)',
                  'Injuries from home-based business activities',
                  'Libel, slander, defamation, and invasion of privacy claims',
                  'False arrest, detention, or imprisonment claims',
                  'Malicious prosecution claims against you'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Other Important Coverages</h3>
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-600" />
                    Landlord Liability
                  </h4>
                  <p className="text-sm text-slate-600">If you own rental properties, umbrella insurance can extend coverage beyond your landlord policy limits for tenant injuries or property damage claims.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-600" />
                    Personal Injury Claims
                  </h4>
                  <p className="text-sm text-slate-600">Covers non-physical personal injuries like libel, slander, false arrest, malicious prosecution, and invasion of privacy, claims often excluded from standard policies.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-cyan-600" />
                    Volunteer Activities
                  </h4>
                  <p className="text-sm text-slate-600">Protects you when serving on boards or volunteering for nonprofit organizations if you are sued for actions taken in those roles.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is NOT Covered by Umbrella Insurance?</h2>
              <p className="text-slate-600 mb-6">
                Understanding exclusions is essential. Umbrella insurance does NOT cover:
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { type: 'Your own injuries', desc: 'Umbrella is liability-only; it does not cover your medical bills' },
                  { type: 'Damage to your own property', desc: 'It does not cover repairs to your home, car, or belongings' },
                  { type: 'Business losses', desc: 'Business liability requires commercial umbrella coverage' },
                  { type: 'Intentional acts', desc: 'Damage you cause deliberately or criminally' },
                  { type: 'Contractual liability', desc: 'Obligations you assume under contract (unless specifically covered)' },
                  { type: 'Nuclear/radioactive incidents', desc: 'Excluded under virtually all policies' }
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

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Real-World Examples: When Umbrella Insurance Saves the Day</h2>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Example 1: The Serious Car Accident</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4">
                  You are found at fault in a multi-vehicle accident that seriously injures three people. Medical bills, 
                  lost wages, and pain and suffering claims total $800,000. Your auto insurance liability limit is $300,000.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="font-semibold text-red-800 mb-2">Without Umbrella:</p>
                    <p className="text-sm text-slate-700">Auto insurance pays $300K. YOU owe $500K out-of-pocket from savings, investments, home equity, or future wage garnishment.</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <p className="font-semibold text-emerald-800 mb-2">With $1M Umbrella:</p>
                    <p className="text-sm text-slate-700">Auto insurance pays $300K. Umbrella pays $500K. YOU pay $0 beyond your deductible. Your assets are protected.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Example 2: The Pool Party Tragedy</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4">
                  A neighbors child is seriously injured in your swimming pool. The family sues for $1.2 million in medical 
                  expenses, ongoing care, and damages. Your home insurance liability limit is $500,000.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="font-semibold text-red-800 mb-2">Without Umbrella:</p>
                    <p className="text-sm text-slate-700">Home insurance pays $500K. YOU owe $700K, potentially forcing sale of your home or depleting retirement savings.</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <p className="font-semibold text-emerald-800 mb-2">With $1M Umbrella:</p>
                    <p className="text-sm text-slate-700">Home insurance pays $500K. Umbrella pays $700K. Your home, savings, and future income remain protected.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Example 3: The Social Media Defamation</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4">
                  You post a negative review about a local business on social media. The owner claims your statements are 
                  false and defamatory, suing you for $300,000 in damages to their reputation and lost business.
                </p>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="font-semibold text-emerald-800 mb-2">With Umbrella Coverage:</p>
                  <p className="text-sm text-slate-700">Most home insurance policies exclude defamation claims. Umbrella insurance covers the legal defense costs and any settlement, protecting your assets from this unexpected liability.</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Example 4: The Teen Driver Accident</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4">
                  Your teenage child causes a serious accident while texting and driving. The other driver suffers permanent 
                  injuries requiring lifelong care. The judgment is $1.5 million.
                </p>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="font-semibold text-emerald-800 mb-2">With $2M Umbrella:</p>
                  <p className="text-sm text-slate-700">Auto insurance pays $300K. Umbrella pays $1.2M. Your familys financial future remains secure despite the tragic mistake.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Does Umbrella Insurance Cost?</h2>
              <p className="text-slate-600 mb-6">
                Umbrella insurance is surprisingly affordable for the protection it provides. Here is what you can expect:
              </p>

              <div className="grid sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-cyan-50 rounded-xl p-4 text-center border border-cyan-200">
                  <div className="text-2xl font-bold text-cyan-700 mb-1">$1M</div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">~$150-300</div>
                  <div className="text-sm text-slate-600">per year</div>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4 text-center border border-cyan-200">
                  <div className="text-2xl font-bold text-cyan-700 mb-1">$2M</div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">~$250-500</div>
                  <div className="text-sm text-slate-600">per year</div>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4 text-center border border-cyan-200">
                  <div className="text-2xl font-bold text-cyan-700 mb-1">$3M</div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">~$350-700</div>
                  <div className="text-sm text-slate-600">per year</div>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4 text-center border border-cyan-200">
                  <div className="text-2xl font-bold text-cyan-700 mb-1">$5M</div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">~$500-1,000</div>
                  <div className="text-sm text-slate-600">per year</div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Why It is So Affordable
                </h3>
                <p className="text-slate-700 mb-3">
                  Umbrella insurance is relatively inexpensive because:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li>• It is secondary coverage, only kicks in after primary policies are exhausted</li>
                  <li>• Major claims exceeding $300K are statistically rare</li>
                  <li>• Insurance companies require you to carry high underlying limits, reducing their risk</li>
                  <li>• You are effectively self-insuring the first $300K-$500K of any claim</li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Factors Affecting Your Premium</h3>
              <div className="space-y-3 mb-8">
                {[
                  { factor: 'Number of properties/vehicles', desc: 'More assets to cover means higher premiums' },
                  { factor: 'Driving records', desc: 'Accidents and violations increase rates' },
                  { factor: 'Risk factors', desc: 'Pools, trampolines, teenage drivers affect pricing' },
                  { factor: 'Underlying coverage', desc: 'You must carry minimum liability limits (usually $300K home, $250K auto)' },
                  { factor: 'Location', desc: 'Litigious states may have higher rates' }
                ].map((item) => (
                  <div key={item.factor} className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                    <TrendingUp className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.factor}:</span>
                      <span className="text-slate-600"> {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Who Needs Umbrella Insurance?</h2>
              <p className="text-slate-600 mb-6">
                While everyone can benefit from umbrella insurance, it is especially important for:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-red-600" />
                    High Priority: Critical Need
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Anyone with significant assets (home equity, investments, savings) exceeding $300K</li>
                    <li>• Families with teenage drivers (higher accident risk)</li>
                    <li>• Homeowners with swimming pools, trampolines, or other attractive nuisances</li>
                    <li>• Landlords with rental properties</li>
                    <li>• High-income earners (future income at risk from wage garnishment)</li>
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Moderate Priority: Strongly Recommended
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Dog owners (especially certain breeds)</li>
                    <li>• People who frequently host guests or parties</li>
                    <li>• Coaches, volunteers, or board members</li>
                    <li>• Anyone with an active social media presence</li>
                    <li>• Families with young drivers</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    Standard Priority: Worth Considering
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Anyone with a home or vehicle</li>
                    <li>• Retirees living on fixed income (protecting nest egg)</li>
                    <li>• Anyone concerned about protecting their financial future</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Umbrella Coverage Do You Need?</h2>
              <p className="text-slate-600 mb-6">
                A common rule of thumb: Your umbrella coverage should equal or exceed your net worth. Here is how to calculate:
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">The Net Worth Formula</h3>
                <div className="space-y-2 text-slate-700">
                  <p><strong>Assets to protect:</strong></p>
                  <ul className="pl-6 space-y-1 text-sm">
                    <li>• Home equity</li>
                    <li>• Investment accounts (401k, IRA, brokerage)</li>
                    <li>• Savings and checking accounts</li>
                    <li>• Other real estate</li>
                    <li>• Valuable personal property</li>
                  </ul>
                  <p className="mt-4"><strong>Plus:</strong> Consider your future earning potential (wage garnishment risk)</p>
                  <p className="mt-2"><strong>Minus:</strong> Exempt assets (some retirement accounts have legal protections)</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Coverage Recommendations by Situation</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="text-left p-3 font-bold text-slate-900">Situation</th>
                      <th className="text-left p-3 font-bold text-slate-900">Recommended Coverage</th>
                      <th className="text-left p-3 font-bold text-slate-900">Why</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-slate-700">Young professional, renting</td>
                      <td className="p-3 text-slate-600">$1 million</td>
                      <td className="p-3 text-slate-600">Protects future earnings, affordable entry point</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Homeowner, $500K net worth</td>
                      <td className="p-3 text-slate-600">$1-2 million</td>
                      <td className="p-3 text-slate-600">Matches assets, protects home equity</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Family with teen drivers</td>
                      <td className="p-3 text-slate-600">$2-3 million</td>
                      <td className="p-3 text-slate-600">Higher risk requires more protection</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">High net worth ($2M+)</td>
                      <td className="p-3 text-slate-600">$3-5 million+</td>
                      <td className="p-3 text-slate-600">More assets = bigger lawsuit target</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Landlord with multiple properties</td>
                      <td className="p-3 text-slate-600">$3-5 million+</td>
                      <td className="p-3 text-slate-600">Multiple properties = multiple risk exposure</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Buy Umbrella Insurance</h2>
              <ol className="list-decimal pl-6 text-slate-600 mb-8 space-y-4">
                <li>
                  <strong>Check your underlying limits:</strong> Most insurers require $250K-$300K auto liability and $300K home liability.
                </li>
                <li>
                  <strong>Bundle with existing policies:</strong> Buying umbrella from the same company as your auto/home often provides discounts.
                </li>
                <li>
                  <strong>Compare standalone options:</strong> Sometimes a different carrier offers better umbrella rates even without bundling.
                </li>
                <li>
                  <strong>Review coverage details:</strong> Ensure the policy covers all your specific risks (personal injury, worldwide coverage, etc.).
                </li>
                <li>
                  <strong>Verify follow form language:</strong> This ensures umbrella covers what your underlying policies cover.
                </li>
              </ol>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Tips for Getting the Best Rate
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Bundle umbrella with your existing auto and home insurer</li>
                  <li>• Maintain clean driving records for all family members</li>
                  <li>• Install safety features (security systems, pool fences)</li>
                  <li>• Choose higher underlying liability limits (can actually lower total cost)</li>
                  <li>• Ask about discounts for mature drivers, good students, or claim-free history</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-600" />
                    Does umbrella insurance cover business activities?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    No, personal umbrella policies do not cover business activities. If you have a business, you need 
                    commercial umbrella coverage. However, some policies cover incidental business activities or 
                    home-based businesses below certain revenue thresholds. Check your specific policy.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-600" />
                    Can I get umbrella insurance without auto insurance?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Most insurers require you to have both auto and home/renters insurance with them or another carrier 
                    before selling you umbrella coverage. Some specialty insurers offer standalone umbrella policies, 
                    but they are less common and often more expensive.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-600" />
                    Does umbrella insurance cover me internationally?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Yes, one major advantage of umbrella insurance is worldwide coverage for personal liability. Unlike 
                    auto and home policies that are typically limited to the U.S., umbrella coverage follows you 
                    anywhere in the world.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Protect Your Assets with Umbrella Insurance</h3>
              <p className="text-cyan-100 mb-6">
                Get umbrella insurance quotes starting at just $150/year for $1 million in extra protection. 
                Safeguard your home, savings, and future income.
              </p>
              <Link 
                href="/get-quote?type=umbrella"
                className="inline-flex items-center gap-2 bg-white text-cyan-700 px-8 py-3 rounded-xl font-bold hover:bg-cyan-50 transition"
              >
                Get Free Umbrella Insurance Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Insurance Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/auto-insurance-basics"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <Car className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Auto Insurance Basics</span>
                </Link>
                <Link 
                  href="/guides/homeowners-insurance-types"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <Home className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Homeowners Insurance Types</span>
                </Link>
                <Link 
                  href="/guides/umbrella-coverage-amount"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <Scale className="w-5 h-5 text-cyan-600" />
                  <span className="font-medium text-slate-700">How Much Umbrella Coverage Do I Need?</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
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
