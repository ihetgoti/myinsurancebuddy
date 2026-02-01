import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  TrendingUp, ArrowRight, CheckCircle, AlertCircle, Car,
  MapPin, User, Star, DollarSign, Shield, Clock,
  Activity, FileText, Briefcase, Calendar, Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Factors That Affect Car Insurance Rates: Complete Guide | MyInsuranceBuddy',
  description: 'Learn what factors impact your car insurance premium. From driving record and credit score to location and vehicle type, understand how insurers calculate your rates.',
  keywords: 'factors affecting car insurance rates, insurance premium factors, what affects insurance rates, car insurance cost factors, why is my insurance so high',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function FactorsAffectingPremiumPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900 via-violet-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              Rate Factors Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Factors That Affect Car Insurance Rates: Complete Guide
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 15 min read</span>
              <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded text-xs font-medium">Comprehensive</span>
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
                Ever wondered why your car insurance premium is higher than your friend's, even though you drive 
                similar cars? Insurance companies use dozens of factors to calculate your rates. Understanding 
                these factors can help you make informed decisions and potentially lower your costs.
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-violet-600" />
                  How Insurance Pricing Works
                </h3>
                <p className="text-slate-700 text-sm mb-3">
                  Insurance companies use complex algorithms to predict how likely you are to file a claim. 
                  Each factor is weighted differently, and the combination determines your premium. 
                  Some factors you can control; others you cannot.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Factors You Control</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Factors You Influence</span>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">Factors You Can't Change</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. Your Driving Record</h2>
              <p className="text-slate-600 mb-6">
                Your driving history is one of the most significant factors affecting your premium. 
                Accidents, tickets, and violations signal higher risk to insurers.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Increases Your Premium
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>At-fault accidents (+30-50%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Speeding tickets (+15-25%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>DUI/DWI (+75-100%+)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Reckless driving (+70-90%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Lapse in coverage (+10-30%)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Decreases Your Premium
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <span>Clean record for 3+ years</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <span>Safe driver discounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <span>Defensive driving course</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <span>Accident forgiveness programs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <span>Low mileage driving</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-3">How Long Violations Affect Your Rates</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Minor Violations (Speeding)</span>
                    <span className="font-medium text-slate-900">3-5 years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">At-Fault Accidents</span>
                    <span className="font-medium text-slate-900">3-5 years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Major Violations (DUI)</span>
                    <span className="font-medium text-slate-900">5-10 years</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. Your Age and Experience</h2>
              <p className="text-slate-600 mb-6">
                Statistically, young and elderly drivers have more accidents. Insurance companies use 
                age as a primary factor in determining risk.
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-4">Average Annual Premium by Age</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">16-19 years old</span>
                    <span className="font-bold text-violet-700">$4,000 - $6,000+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">20-24 years old</span>
                    <span className="font-bold text-violet-700">$2,500 - $3,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">25-29 years old</span>
                    <span className="font-bold text-violet-700">$1,800 - $2,400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">30-39 years old</span>
                    <span className="font-bold text-emerald-600">$1,400 - $1,800</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">40-49 years old</span>
                    <span className="font-bold text-emerald-600">$1,200 - $1,600</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">50-59 years old</span>
                    <span className="font-bold text-emerald-600">$1,100 - $1,400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">60-69 years old</span>
                    <span className="font-bold text-emerald-600">$1,200 - $1,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">70+ years old</span>
                    <span className="font-bold text-amber-600">$1,400 - $1,800</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. Your Location</h2>
              <p className="text-slate-600 mb-6">
                Where you live significantly impacts your rates. Urban areas typically have higher premiums 
                due to more traffic, higher crime rates, and more accidents.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Higher Premium Areas
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Dense urban centers</li>
                    <li>• High crime/theft areas</li>
                    <li>• Areas with frequent severe weather</li>
                    <li>• High cost of living cities</li>
                    <li>• States with high litigation rates</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    Lower Premium Areas
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Suburban and rural areas</li>
                    <li>• Low crime communities</li>
                    <li>• Areas with mild weather</li>
                    <li>• States with lower cost of living</li>
                    <li>• Areas with good public transit</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-3">Average Premium by State (Full Coverage)</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-2">Most Expensive</h5>
                    <ul className="space-y-1 text-slate-700">
                      <li>Michigan: $2,600+</li>
                      <li>New York: $2,400+</li>
                      <li>Louisiana: $2,300+</li>
                      <li>Florida: $2,200+</li>
                      <li>California: $2,100+</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-2">Least Expensive</h5>
                    <ul className="space-y-1 text-slate-700">
                      <li>Maine: $900+</li>
                      <li>Vermont: $1,000+</li>
                      <li>Idaho: $1,000+</li>
                      <li>Iowa: $1,100+</li>
                      <li>Ohio: $1,100+</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Your Vehicle</h2>
              <p className="text-slate-600 mb-6">
                The car you drive matters. Insurers consider repair costs, safety ratings, theft rates, 
                and the vehicle's value.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Vehicle Value', desc: 'More expensive cars cost more to repair and replace', impact: 'High Impact' },
                  { title: 'Safety Ratings', desc: 'High safety ratings can lower premiums', impact: 'Medium Impact' },
                  { title: 'Repair Costs', desc: 'Luxury and imported cars have higher repair costs', impact: 'High Impact' },
                  { title: 'Theft Rates', desc: 'Popular theft targets cost more to insure', impact: 'Medium Impact' },
                  { title: 'Engine Size', desc: 'High-performance vehicles are riskier', impact: 'Medium Impact' },
                  { title: 'Safety Features', desc: 'Anti-theft, airbags, ABS can lower rates', impact: 'Low Impact' },
                ].map((factor, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-semibold text-slate-900">{factor.title}</h5>
                      <span className={`text-xs px-2 py-0.5 rounded ${factor.impact.includes('High') ? 'bg-red-100 text-red-700' : factor.impact.includes('Medium') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {factor.impact}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{factor.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">5. Your Credit Score</h2>
              <p className="text-slate-600 mb-6">
                In most states (except California, Hawaii, Massachusetts, and Michigan), insurers use 
                credit-based insurance scores. Studies show a correlation between credit history and claim frequency.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-4">How Credit Affects Your Premium</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-700">Excellent (750+)</span>
                      <span className="font-medium text-emerald-600">Best Rates</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-700">Good (670-749)</span>
                      <span className="font-medium text-blue-600">Average Rates</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-700">Fair (580-669)</span>
                      <span className="font-medium text-amber-600">+20-40% Higher</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-700">Poor (Below 580)</span>
                      <span className="font-medium text-red-600">+50-100%+ Higher</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">6. Your Coverage Choices</h2>
              <p className="text-slate-600 mb-6">
                The coverage options you select directly impact your premium. Higher limits and lower 
                deductibles mean higher premiums.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-bold text-slate-900 mb-1">Liability Limits</h5>
                  <p className="text-xs text-slate-600">Higher limits = Higher premium</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center">
                  <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h5 className="font-bold text-slate-900 mb-1">Deductibles</h5>
                  <p className="text-xs text-slate-600">Higher deductible = Lower premium</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center">
                  <FileText className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                  <h5 className="font-bold text-slate-900 mb-1">Optional Coverages</h5>
                  <p className="text-xs text-slate-600">Each adds to your total cost</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">7. Additional Factors That Affect Rates</h2>
              
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Occupation and Education</h4>
                      <p className="text-slate-600 text-sm mt-1">
                        Some insurers offer discounts for certain professions (teachers, engineers, medical professionals) 
                        and education levels. This practice is banned in some states.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Activity className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Annual Mileage</h4>
                      <p className="text-slate-600 text-sm mt-1">
                        The more you drive, the higher your risk. Low-mileage drivers (under 7,500 miles/year) 
                        often qualify for discounts.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Insurance History</h4>
                      <p className="text-slate-600 text-sm mt-1">
                        Gaps in coverage, frequent switching between insurers, or previous cancellations can 
                        increase your rates.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Marital Status</h4>
                      <p className="text-slate-600 text-sm mt-1">
                        Married drivers typically pay 5-15% less than single drivers. Insurers view marriage 
                        as a sign of stability and lower risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What You Can Do to Lower Your Rates</h2>
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h4 className="font-bold text-emerald-900 mb-4">Actionable Steps</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">Maintain a clean driving record</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">Improve your credit score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">Shop around regularly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">Bundle multiple policies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">Raise your deductibles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">Ask about all discounts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">Consider usage-based insurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">Drive a car with lower insurance costs</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Factors That DON'T Affect Your Rates</h2>
              <p className="text-slate-600 mb-6">
                Some factors are prohibited from being used in rate calculations:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {[
                  'Race or ethnicity',
                  'Religion',
                  'Gender (in some states)',
                  'Income level',
                  'National origin',
                  'Homeownership status (in most states)',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Find Your Best Rate Today</h3>
              <p className="text-violet-100 mb-6">
                Compare quotes from multiple insurers to find the best rate for your unique profile.
              </p>
              <Link 
                href="/get-quote?type=auto"
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
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
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Car className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Auto Insurance Basics</span>
                </Link>
                <Link 
                  href="/guides/cheapest-car-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">How to Get Cheap Insurance</span>
                </Link>
                <Link 
                  href="/guides/liability-vs-full-coverage"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Liability vs Full Coverage</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
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
