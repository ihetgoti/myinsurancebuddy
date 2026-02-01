import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Home, ArrowRight, CheckCircle, Shield, AlertTriangle,
  DollarSign, FileText, Clock, Lock, Briefcase,
  Heart, Scale, HelpCircle, Sparkles, UserCheck
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Is Renters Insurance Worth It? | 2024 Complete Guide | MyInsuranceBuddy',
  description: 'Discover if renters insurance is worth it. Learn what it covers, average costs, why landlords require it, real scenarios, and how it protects your financial future.',
  keywords: 'is renters insurance worth it, renters insurance cost, what does renters insurance cover, why landlords require renters insurance, do I need renters insurance',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function RentersInsuranceWorthPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Home className="w-4 h-4" />
              Renters Insurance Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Is Renters Insurance Worth It?
            </h1>
            <p className="text-emerald-100 text-lg mb-6">
              The real value of renters insurance: what it covers, what it costs, and why millions 
              of renters consider it essential protection.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-emerald-200 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 8 min read</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Beginner</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Answer */}
      <section className="py-8 bg-emerald-50 border-b border-emerald-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-emerald-800 font-bold text-lg mb-2">
              <Sparkles className="w-5 h-5" />
              Quick Answer
            </div>
            <p className="text-emerald-900 text-xl font-medium">
              Yes—renters insurance is absolutely worth it. For about $15-20 per month, you get 
              $30,000+ in personal property coverage and $100,000+ in liability protection. 
              <span className="text-emerald-700"> One incident can cost you tens of thousands without it.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                If you're renting an apartment or house, you've probably asked yourself whether 
                renters insurance is really necessary. Your landlord has insurance, so why do you need it? 
                The short answer: your landlord's insurance doesn't cover your belongings or your liability. 
                Let's explore why renters insurance is one of the smartest financial decisions you can make.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Does Renters Insurance Cover?</h2>

              <p className="text-slate-600 mb-6">
                A standard renters insurance policy (HO-4) provides four main types of coverage. 
                Understanding each helps you see the true value you're getting:
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">Personal Property Coverage</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Protects your belongings from covered perils including theft, fire, vandalism, 
                    water damage (from plumbing), and more. Covers furniture, electronics, clothing, 
                    appliances, and personal items—whether they're in your home or temporarily elsewhere.
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm">
                    <span className="font-semibold text-slate-900">Typical Coverage:</span>
                    <p className="text-slate-600 mt-1">$20,000 - $50,000 (you choose based on your needs)</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">Personal Liability Protection</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Covers legal expenses if someone is injured in your rental or if you accidentally 
                    damage someone else's property. This includes medical bills, legal fees, and settlements.
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm">
                    <span className="font-semibold text-slate-900">Typical Coverage:</span>
                    <p className="text-slate-600 mt-1">$100,000 - $500,000</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">Loss of Use (Additional Living Expenses)</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Pays for temporary housing and additional living costs if your rental becomes 
                    uninhabitable due to a covered loss. Covers hotel stays, restaurant meals, 
                    laundry, and other expenses while your home is being repaired.
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm">
                    <span className="font-semibold text-slate-900">Typical Coverage:</span>
                    <p className="text-slate-600 mt-1">20-30% of your personal property limit</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-rose-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">Medical Payments to Others</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Covers minor medical expenses for guests injured in your home, regardless of fault. 
                    This "goodwill" coverage can prevent small injuries from becoming liability claims.
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm">
                    <span className="font-semibold text-slate-900">Typical Coverage:</span>
                    <p className="text-slate-600 mt-1">$1,000 - $5,000</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Does Renters Insurance Cost?</h2>

              <p className="text-slate-600 mb-6">
                Renters insurance is surprisingly affordable—often costing less than a streaming service subscription 
                or a few coffee shop visits per month.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-6 text-center border border-emerald-200">
                  <div className="text-3xl font-bold text-emerald-700 mb-1">$15-20</div>
                  <div className="text-sm text-slate-600 mb-2">per month</div>
                  <div className="text-xs text-slate-500">National Average</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                  <div className="text-3xl font-bold text-blue-700 mb-1">$180</div>
                  <div className="text-sm text-slate-600 mb-2">per year</div>
                  <div className="text-xs text-slate-500">Average Annual Premium</div>
                </div>
                <div className="bg-violet-50 rounded-xl p-6 text-center border border-violet-200">
                  <div className="text-3xl font-bold text-violet-700 mb-1">$30K+</div>
                  <div className="text-sm text-slate-600 mb-2">in coverage</div>
                  <div className="text-xs text-slate-500">Typical Property Protection</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">What Affects Your Premium?</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { factor: 'Location', impact: 'Crime rates and weather risks affect pricing' },
                  { factor: 'Coverage Amount', impact: 'Higher limits mean higher premiums' },
                  { factor: 'Deductible', impact: 'Higher deductible = lower premium' },
                  { factor: 'Credit Score', impact: 'Better credit often means lower rates' },
                  { factor: 'Claims History', impact: 'Previous claims may increase rates' },
                  { factor: 'Building Type', impact: 'Security features and construction type matter' },
                ].map((item) => (
                  <div key={item.factor} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 text-sm">{item.factor}</span>
                      <p className="text-slate-600 text-xs">{item.impact}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Average Costs by State</h3>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Most Affordable (Monthly)</h4>
                    <ul className="space-y-1 text-slate-600">
                      <li>Wyoming: ~$10</li>
                      <li>Iowa: ~$11</li>
                      <li>South Dakota: ~$11</li>
                      <li>North Dakota: ~$12</li>
                      <li>Nebraska: ~$12</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Highest Cost (Monthly)</h4>
                    <ul className="space-y-1 text-slate-600">
                      <li>Louisiana: ~$28</li>
                      <li>Michigan: ~$26</li>
                      <li>Mississippi: ~$25</li>
                      <li>Oklahoma: ~$24</li>
                      <li>Alabama: ~$23</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Real Scenarios: When Renters Insurance Saves the Day</h2>

              <p className="text-slate-600 mb-6">
                Still wondering if renters insurance is worth it? These real-world scenarios show how 
                quickly costs can add up—and how insurance protects you:
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Scenario 1: The Kitchen Fire</h3>
                      <p className="text-slate-600 text-sm mb-3">
                        A grease fire starts in your kitchen, causing smoke damage to your apartment and 
                        the unit above. Your belongings are damaged, and the landlord holds you responsible 
                        for repairs to both units.
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="bg-white rounded-lg px-4 py-2">
                          <span className="text-slate-500">Your Losses:</span>
                          <span className="font-semibold text-red-600 ml-2">$8,500</span>
                        </div>
                        <div className="bg-white rounded-lg px-4 py-2">
                          <span className="text-slate-500">Liability:</span>
                          <span className="font-semibold text-red-600 ml-2">$15,000</span>
                        </div>
                        <div className="bg-emerald-50 rounded-lg px-4 py-2 border border-emerald-200">
                          <span className="text-slate-500">With Insurance:</span>
                          <span className="font-semibold text-emerald-600 ml-2">$500 deductible</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Scenario 2: The Break-In</h3>
                      <p className="text-slate-600 text-sm mb-3">
                        Your apartment is burglarized while you're at work. Your laptop, TV, gaming console, 
                        jewelry, and some cash are stolen. You're left feeling violated and facing significant replacement costs.
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="bg-white rounded-lg px-4 py-2">
                          <span className="text-slate-500">Stolen Items:</span>
                          <span className="font-semibold text-amber-600 ml-2">$12,000</span>
                        </div>
                        <div className="bg-emerald-50 rounded-lg px-4 py-2 border border-emerald-200">
                          <span className="text-slate-500">With Insurance:</span>
                          <span className="font-semibold text-emerald-600 ml-2">$500 deductible</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Scenario 3: The Guest Injury</h3>
                      <p className="text-slate-600 text-sm mb-3">
                        A friend slips on your wet bathroom floor and fractures their wrist. They need 
                        surgery and physical therapy, and their health insurance comes after you for reimbursement.
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="bg-white rounded-lg px-4 py-2">
                          <span className="text-slate-500">Medical Bills:</span>
                          <span className="font-semibold text-blue-600 ml-2">$35,000</span>
                        </div>
                        <div className="bg-emerald-50 rounded-lg px-4 py-2 border border-emerald-200">
                          <span className="text-slate-500">With Insurance:</span>
                          <span className="font-semibold text-emerald-600 ml-2">$0 out of pocket</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-violet-50 rounded-xl p-6 border border-violet-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Home className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Scenario 4: The Water Damage</h3>
                      <p className="text-slate-600 text-sm mb-3">
                        A pipe bursts in the apartment above you, flooding your unit. Your furniture, 
                        electronics, and clothing are water-damaged, and the apartment is temporarily uninhabitable.
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="bg-white rounded-lg px-4 py-2">
                          <span className="text-slate-500">Property Damage:</span>
                          <span className="font-semibold text-violet-600 ml-2">$15,000</span>
                        </div>
                        <div className="bg-white rounded-lg px-4 py-2">
                          <span className="text-slate-500">Hotel Costs (2 weeks):</span>
                          <span className="font-semibold text-violet-600 ml-2">$2,800</span>
                        </div>
                        <div className="bg-emerald-50 rounded-lg px-4 py-2 border border-emerald-200">
                          <span className="text-slate-500">With Insurance:</span>
                          <span className="font-semibold text-emerald-600 ml-2">$500 deductible</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Why Do Landlords Require Renters Insurance?</h2>

              <p className="text-slate-600 mb-6">
                More and more landlords are making renters insurance mandatory in lease agreements. 
                Here's why this requirement benefits both parties:
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                    Benefits for Landlords
                  </h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Reduces liability exposure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Protects their own insurance premiums</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Filters out high-risk tenants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Speeds up recovery after losses</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Benefits for Tenants
                  </h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Protects your belongings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Covers liability claims</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Provides temporary housing funds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Peace of mind for minimal cost</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Important Note</h4>
                    <p className="text-slate-600 text-sm">
                      Even if your lease doesn't require renters insurance, you're still financially 
                      responsible for your belongings and liability. Going without coverage is a significant risk.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What's Not Covered by Renters Insurance?</h2>

              <p className="text-slate-600 mb-6">
                Understanding exclusions helps you identify any additional coverage you might need:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { item: 'Flood Damage', note: 'Requires separate flood insurance policy' },
                  { item: 'Earthquake Damage', note: 'Requires separate earthquake coverage' },
                  { item: 'Bed Bugs/Pests', note: 'Considered maintenance issues' },
                  { item: 'Roommate Belongings', note: 'Each person needs their own policy' },
                  { item: 'Car Theft/Damage', note: 'Covered by auto insurance' },
                  { item: 'High-Value Items (without rider)', note: 'Jewelry, art may need additional coverage' },
                ].map((item) => (
                  <div key={item.item} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 text-sm">{item.item}</span>
                      <p className="text-slate-600 text-xs">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Get the Best Value on Renters Insurance</h2>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Money-Saving Tips
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">1.</span>
                    <span><strong>Bundle with auto insurance</strong> – Save 10-15% by combining policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">2.</span>
                    <span><strong>Increase your deductible</strong> – Higher deductible = lower premium (if you can afford it)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">3.</span>
                    <span><strong>Install safety features</strong> – Deadbolts, smoke detectors, and security systems can reduce rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">4.</span>
                    <span><strong>Pay annually</strong> – Avoid monthly payment fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">5.</span>
                    <span><strong>Shop around</strong> – Compare quotes from multiple insurers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">6.</span>
                    <span><strong>Ask about discounts</strong> – Student, senior, claim-free, and profession-based discounts may apply</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Verdict: Is Renters Insurance Worth It?</h2>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-emerald-900 text-xl mb-4 text-center">Absolutely Yes—Here's Why</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <div className="text-3xl font-bold text-emerald-700 mb-1">$15-20</div>
                    <div className="text-sm text-slate-600">Monthly Cost</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-700 mb-1">$30K+</div>
                    <div className="text-sm text-slate-600">Property Protection</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-700 mb-1">$100K+</div>
                    <div className="text-sm text-slate-600">Liability Coverage</div>
                  </div>
                </div>
                <p className="text-center text-slate-700">
                  For the price of a pizza delivery each month, you get comprehensive protection that can 
                  save you from financial catastrophe. <strong>It's one of the best values in insurance.</strong>
                </p>
              </div>

              <p className="text-slate-600 mb-6">
                Consider this: You probably insure your phone, your car, and maybe even your pet. 
                Your apartment contains thousands of dollars worth of belongings and exposes you to 
                liability risks that could cost tens of thousands more. Renters insurance protects 
                all of this for less than you'd spend on a monthly streaming service.
              </p>

              <p className="text-slate-600 mb-6">
                The real question isn't whether you can afford renters insurance—it's whether you can 
                afford to be without it.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Ready to Protect Your Belongings?</h3>
              <p className="text-emerald-100 mb-6">
                Get renters insurance quotes in minutes. Coverage starts as low as $15/month.
              </p>
              <Link 
                href="/get-quote?type=renters"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
              >
                Get Free Renters Insurance Quotes
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
                  href="/guides/flood-insurance-guide"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Flood Insurance Guide</span>
                </Link>
                <Link 
                  href="/guides/home-insurance-claims"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <FileText className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Filing Home Insurance Claims</span>
                </Link>
                <Link 
                  href="/guides/lower-home-premium"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">Lower Your Insurance Premium</span>
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
