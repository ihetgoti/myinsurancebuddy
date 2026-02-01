import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  DollarSign, ArrowRight, CheckCircle, Star, Car,
  Percent, Gift, Shield, Zap, TrendingDown, Clock,
  Award, Search, Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'How to Get Cheap Car Insurance: 15 Proven Ways to Save | MyInsuranceBuddy',
  description: 'Discover proven strategies to find cheap car insurance. Learn about top low-cost insurers, available discounts, and coverage trade-offs to lower your premium.',
  keywords: 'cheap car insurance, low cost auto insurance, affordable car insurance, car insurance discounts, save on car insurance, cheapest insurance companies',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function CheapestCarInsurancePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <DollarSign className="w-4 h-4" />
              Money Saving Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              How to Get Cheap Car Insurance: 15 Proven Ways to Save
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Money Saver</span>
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
                Car insurance doesn't have to break the bank. With the right strategies, you can significantly 
                reduce your premium without sacrificing the coverage you need. This guide reveals 15 proven ways 
                to get cheap car insurance, from choosing the right company to maximizing discounts.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Insurance Companies Known for Low Rates</h2>
              <p className="text-slate-600 mb-6">
                Not all insurance companies charge the same rates. Here are insurers consistently ranked among 
                the most affordable:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { name: 'GEICO', highlight: 'Best for: Most drivers', savings: 'Save up to 15%' },
                  { name: 'State Farm', highlight: 'Best for: Young drivers', savings: 'Student discounts' },
                  { name: 'Progressive', highlight: 'Best for: High-risk drivers', savings: 'Name Your Price tool' },
                  { name: 'USAA', highlight: 'Best for: Military families', savings: 'Lowest rates overall' },
                  { name: 'Erie Insurance', highlight: 'Best for: Customer service', savings: 'Rate lock feature' },
                  { name: 'Auto-Owners', highlight: 'Best for: Bundling', savings: 'Multi-policy discounts' },
                ].map((company, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900">{company.name}</h4>
                      <Award className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{company.highlight}</p>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{company.savings}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Important Note
                </h3>
                <p className="text-slate-700 text-sm">
                  The cheapest company varies by individual. Factors like your location, driving record, 
                  vehicle, and credit score all affect which insurer offers you the lowest rate. Always 
                  compare quotes from at least 3-5 companies.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. Shop Around and Compare Quotes</h2>
              <p className="text-slate-600 mb-6">
                Insurance rates can vary by hundreds or even thousands of dollars between companies for the 
                exact same coverage. Don't settle for the first quote you receive.
              </p>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-600" />
                  Pro Shopping Tips
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span>Get quotes from at least 5 different insurers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span>Use comparison websites to save time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span>Shop around every 6-12 months before renewal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span>Ensure you're comparing identical coverage levels</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. Bundle Your Policies</h2>
              <p className="text-slate-600 mb-6">
                One of the easiest ways to save is by bundling multiple insurance policies with the same company. 
                Most insurers offer significant multi-policy discounts.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-center">
                  <div className="text-3xl font-bold text-amber-700 mb-1">10-25%</div>
                  <div className="text-sm text-slate-600">Auto + Home Bundle</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-center">
                  <div className="text-3xl font-bold text-amber-700 mb-1">5-15%</div>
                  <div className="text-sm text-slate-600">Auto + Renters Bundle</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-center">
                  <div className="text-3xl font-bold text-amber-700 mb-1">10-20%</div>
                  <div className="text-sm text-slate-600">Multi-Car Discount</div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. Raise Your Deductible</h2>
              <p className="text-slate-600 mb-6">
                Increasing your deductible—the amount you pay out of pocket before insurance kicks in—can 
                significantly lower your premium. Just make sure you can afford the deductible if you need to file a claim.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-4">Typical Savings by Deductible Amount</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">$250 Deductible</span>
                    <span className="font-medium text-slate-900">Base Rate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">$500 Deductible</span>
                    <span className="font-medium text-emerald-600">Save 5-10%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">$1,000 Deductible</span>
                    <span className="font-medium text-emerald-600">Save 15-20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">$2,000 Deductible</span>
                    <span className="font-medium text-emerald-600">Save 25-30%</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Take Advantage of All Discounts</h2>
              <p className="text-slate-600 mb-6">
                Insurance companies offer dozens of discounts. Make sure you're getting every discount you qualify for:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { name: 'Safe Driver', desc: 'No accidents or tickets for 3-5 years', icon: Shield },
                  { name: 'Good Student', desc: 'B average or higher (up to 25% off)', icon: Star },
                  { name: 'Low Mileage', desc: 'Drive less than 7,500 miles/year', icon: Car },
                  { name: 'Defensive Driving', desc: 'Complete approved course', icon: Award },
                  { name: 'Safety Features', desc: 'Anti-lock brakes, airbags, anti-theft', icon: Zap },
                  { name: 'Pay in Full', desc: 'Pay annual premium upfront', icon: DollarSign },
                  { name: 'Auto-Pay', desc: 'Set up automatic payments', icon: Clock },
                  { name: 'Paperless', desc: 'Go digital for billing and documents', icon: TrendingDown },
                  { name: 'Early Signing', desc: 'Switch before current policy expires', icon: CheckCircle },
                  { name: 'Affinity Groups', desc: 'Employer, alumni, or professional groups', icon: Gift },
                ].map((discount, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <discount.icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm">{discount.name}</h5>
                      <p className="text-xs text-slate-600">{discount.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">5. Improve Your Credit Score</h2>
              <p className="text-slate-600 mb-6">
                In most states, insurance companies use credit-based insurance scores to set rates. 
                Better credit typically means lower premiums.
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3">Average Annual Premium by Credit Tier</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Excellent (750+)</span>
                    <span className="font-bold text-violet-700">~$1,200/year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Good (670-749)</span>
                    <span className="font-bold text-violet-700">~$1,500/year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Fair (580-669)</span>
                    <span className="font-bold text-violet-700">~$2,100/year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Poor (Below 580)</span>
                    <span className="font-bold text-violet-700">~$3,000+/year</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">6. Consider Usage-Based Insurance</h2>
              <p className="text-slate-600 mb-6">
                Usage-based insurance (UBI) programs track your driving habits through a mobile app or device 
                and reward safe driving with discounts up to 30-40%.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { company: 'Progressive', program: 'Snapshot', discount: 'Up to $156/year' },
                  { company: 'State Farm', program: 'Drive Safe & Save', discount: 'Up to 30% off' },
                  { company: 'Allstate', program: 'Drivewise', discount: 'Cash back rewards' },
                  { company: 'GEICO', program: 'DriveEasy', discount: 'Up to 25% off' },
                ].map((ubi, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h5 className="font-bold text-slate-900">{ubi.company}</h5>
                    <p className="text-sm text-slate-600">{ubi.program}</p>
                    <span className="text-xs font-medium text-emerald-600">{ubi.discount}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">7. Choose Your Vehicle Wisely</h2>
              <p className="text-slate-600 mb-6">
                The car you drive significantly impacts your insurance costs. Sports cars, luxury vehicles, 
                and models with high theft rates cost more to insure.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-4">Cars with Lowest Insurance Costs</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Honda CR-V</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Subaru Outback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Toyota Camry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Mazda CX-5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Ford Escape</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Volvo XC60</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Coverage Trade-Offs to Consider</h2>
              <p className="text-slate-600 mb-6">
                Sometimes reducing coverage makes sense, but be careful not to leave yourself underprotected:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Drop Collision/Comprehensive on Old Cars
                  </h4>
                  <p className="text-slate-700 text-sm">
                    If your car is worth less than $3,000-$4,000, consider dropping collision and comprehensive 
                    coverage. The premiums may exceed the potential payout.
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Reduce Coverage Limits (Carefully)
                  </h4>
                  <p className="text-slate-700 text-sm">
                    Lowering liability limits can save money but puts your assets at risk. Never go below 
                    100/300/100 if you have significant assets to protect.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Never Drop Uninsured Motorist Coverage
                  </h4>
                  <p className="text-slate-700 text-sm">
                    With 1 in 8 drivers uninsured, this relatively inexpensive coverage protects you from 
                    others who lack adequate insurance.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Additional Money-Saving Tips</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Pay Annually', desc: 'Monthly payment fees can add 3-5% to your premium' },
                  { title: 'Group Insurance', desc: 'Some employers and associations offer group rates' },
                  { title: 'Garage Your Car', desc: 'Parking in a garage can lower comprehensive rates' },
                  { title: 'Review Coverage Annually', desc: 'Adjust coverage as your car depreciates' },
                  { title: 'Avoid Small Claims', desc: 'Pay small repairs out-of-pocket to keep rates low' },
                  { title: 'Ask for Re-Rate', desc: 'Request a re-evaluation after life changes or birthdays' },
                ].map((tip, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h5 className="font-semibold text-slate-900 text-sm">{tip.title}</h5>
                    <p className="text-xs text-slate-600 mt-1">{tip.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Quick Savings Summary</h2>
              <div className="bg-slate-900 rounded-xl p-6 text-white mb-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-emerald-400 mb-2">Immediate Actions</h4>
                    <ul className="space-y-1 text-sm text-slate-300">
                      <li>• Shop around and compare quotes</li>
                      <li>• Ask about all available discounts</li>
                      <li>• Bundle your policies</li>
                      <li>• Raise your deductible</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 mb-2">Long-Term Strategies</h4>
                    <ul className="space-y-1 text-sm text-slate-300">
                      <li>• Improve your credit score</li>
                      <li>• Maintain a clean driving record</li>
                      <li>• Consider usage-based insurance</li>
                      <li>• Review coverage annually</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Start Saving on Car Insurance Today</h3>
              <p className="text-emerald-100 mb-6">
                Compare quotes from 100+ insurers and find the cheapest rate for your situation.
              </p>
              <Link 
                href="/get-quote?type=auto"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
              >
                Get Free Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/auto-insurance-basics"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Car className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Auto Insurance Basics</span>
                </Link>
                <Link 
                  href="/guides/liability-vs-full-coverage"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Liability vs Full Coverage</span>
                </Link>
                <Link 
                  href="/guides/discounts"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Percent className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">All Car Insurance Discounts</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Info className="w-5 h-5 text-amber-600" />
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
