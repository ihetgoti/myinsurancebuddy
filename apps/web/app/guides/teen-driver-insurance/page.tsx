import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  GraduationCap, ArrowRight, CheckCircle, AlertTriangle, Car,
  DollarSign, Users, Star, Shield, Clock, BookOpen,
  Award, Info, TrendingUp, Heart
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Teen Driver Insurance Guide: Costs, Discounts & Tips for Parents | MyInsuranceBuddy',
  description: 'Complete guide for parents insuring teen drivers. Learn about costs, available discounts (good student, driver\'s ed), and whether to add to your policy or get separate coverage.',
  keywords: 'teen driver insurance, adding teen to car insurance, young driver insurance cost, good student discount, drivers ed discount, parent teen insurance',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function TeenDriverInsurancePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Parent's Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Teen Driver Insurance Guide: Costs, Discounts & Tips for Parents
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">For Parents</span>
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
                Adding a teen driver to your insurance policy is a significant milestone—and often a significant expense. 
                Teen drivers are among the riskiest to insure, which means premiums can double or even triple. 
                This comprehensive guide will help you understand the costs, available discounts, and strategies 
                to keep insurance affordable while keeping your teen safe.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Why is Teen Insurance So Expensive?</h2>
              <p className="text-slate-600 mb-6">
                Insurance premiums for teen drivers reflect the statistical reality: drivers aged 16-19 have 
                the highest accident rates of any age group. According to the CDC, teen drivers are three times 
                more likely to be in a fatal crash than drivers 20 and older.
              </p>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Factors for Teen Drivers
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Inexperience:</strong> Lack of developed hazard recognition and response skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Distracted driving:</strong> Higher rates of phone use while driving</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Speeding:</strong> Teens are more likely to speed and follow too closely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Impaired driving:</strong> Higher risk of driving under the influence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Seat belt use:</strong> Lower rates of consistent seat belt usage</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Does Teen Driver Insurance Cost?</h2>
              <p className="text-slate-600 mb-6">
                Adding a teen driver to your policy will significantly increase your premium. Here's what you can expect:
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-1">$2,000+</div>
                  <div className="text-sm text-slate-600 font-medium">Annual Increase</div>
                  <div className="text-xs text-slate-500 mt-1">Average when adding a 16-year-old</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-center">
                  <div className="text-3xl font-bold text-amber-700 mb-1">100-150%</div>
                  <div className="text-sm text-slate-600 font-medium">Premium Increase</div>
                  <div className="text-xs text-slate-500 mt-1">Typical policy cost increase</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 text-center">
                  <div className="text-3xl font-bold text-emerald-700 mb-1">$4,000+</div>
                  <div className="text-sm text-slate-600 font-medium">Own Policy Cost</div>
                  <div className="text-xs text-slate-500 mt-1">If teen gets separate insurance</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-4">Average Annual Cost by Age (Full Coverage)</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Age 16</span>
                    <span className="font-bold text-slate-900">$6,000 - $8,000+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Age 17</span>
                    <span className="font-bold text-slate-900">$5,000 - $7,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Age 18</span>
                    <span className="font-bold text-slate-900">$4,500 - $6,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Age 19</span>
                    <span className="font-bold text-slate-900">$3,500 - $5,000</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Add to Your Policy vs. Separate Policy</h2>
              <p className="text-slate-600 mb-6">
                One of the first decisions parents face is whether to add their teen to the family policy 
                or have them get their own insurance.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Add to Family Policy
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span className="text-slate-700"><strong>Significantly cheaper</strong> (50-75% less)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span className="text-slate-700">Access to multi-car discounts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span className="text-slate-700">Teen benefits from parent's driving history</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span className="text-slate-700">Simpler management with one policy</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-200">
                    <span className="text-xs font-medium text-emerald-700">✓ RECOMMENDED for most families</span>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Separate Policy
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span className="text-slate-700"><strong>Much more expensive</strong> ($4,000+/year)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span className="text-slate-700">Protects parent's rates from teen's accidents</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span className="text-slate-700">Teen builds their own insurance history</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span className="text-slate-700">Teaches financial responsibility</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-200">
                    <span className="text-xs font-medium text-amber-700">Consider for: teens with own cars, families with expensive vehicles</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  When Separate Policy Makes Sense
                </h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li>• Teen has their own vehicle and lives independently</li>
                  <li>• Family has luxury vehicles that would be extremely expensive to insure with a teen</li>
                  <li>• Teen has multiple violations or accidents that would dramatically increase family rates</li>
                  <li>• Parents want teen to learn full financial responsibility</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Teen Driver Discounts Available</h2>
              <p className="text-slate-600 mb-6">
                Despite high base rates, numerous discounts are available specifically for teen drivers. 
                Make sure you ask about every discount your teen qualifies for.
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Good Student Discount (10-25% off)</h4>
                      <p className="text-slate-600 text-sm mt-1">
                        Most insurers offer discounts for students maintaining a B average (3.0 GPA) or higher. 
                        Some require dean's list or honor roll status. Typically available for full-time students 
                        under age 25.
                      </p>
                      <div className="mt-2 text-xs text-slate-500">
                        <strong>Required:</strong> Report card or transcript showing GPA
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Driver's Education Discount (5-15% off)</h4>
                      <p className="text-slate-600 text-sm mt-1">
                        Completing a state-approved driver's education course can lead to significant savings. 
                        Some insurers also offer discounts for defensive driving courses taken after licensure.
                      </p>
                      <div className="mt-2 text-xs text-slate-500">
                        <strong>Look for:</strong> State-approved courses, online or in-person options
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Student Away at School Discount (10-30% off)</h4>
                      <p className="text-slate-600 text-sm mt-1">
                        If your teen attends college more than 100 miles from home and doesn't have a car on campus, 
                        you may qualify for this substantial discount while maintaining coverage for when they're home.
                      </p>
                      <div className="mt-2 text-xs text-slate-500">
                        <strong>Requirements:</strong> Proof of enrollment, vehicle remains at parent's address
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Safe Driving Programs (10-40% off)</h4>
                      <p className="text-slate-600 text-sm mt-1">
                        Many insurers offer telematics programs that track driving behavior through an app or device. 
                        Safe driving habits (no hard braking, speeding, or late-night driving) can lead to substantial discounts.
                      </p>
                      <div className="mt-2 text-xs text-slate-500">
                        <strong>Examples:</strong> Progressive Snapshot, State Farm Drive Safe & Save, Allstate Drivewise
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Choosing the Right Vehicle for Your Teen</h2>
              <p className="text-slate-600 mb-6">
                The car your teen drives significantly impacts insurance costs. Avoid sports cars, luxury vehicles, 
                and models with high theft rates.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-emerald-800 mb-3">Best Vehicle Types for Teens</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>Mid-size sedans (Honda Accord, Toyota Camry)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>Small SUVs with high safety ratings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>Cars with anti-lock brakes and stability control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>Used vehicles (3-5 years old) to skip collision/comprehensive</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-bold text-red-800 mb-3">Vehicles to Avoid</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      <span>Sports cars and high-performance vehicles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      <span>Luxury or exotic cars</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      <span>Large SUVs and trucks (rollover risk)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      <span>Cars with high theft rates</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Setting Rules and Expectations</h2>
              <p className="text-slate-600 mb-6">
                Establishing clear rules can help keep your teen safe and potentially avoid accidents that 
                would increase your rates.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-4">Recommended Teen Driving Rules</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>No phone use while driving (hands-free only if necessary)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>No more than one passenger for first 6 months</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>No driving after 10 PM (or as state law requires)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Always wear seatbelts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>No eating or grooming while driving</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Never drive under the influence</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Obey all speed limits and traffic laws</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Report any accidents or incidents immediately</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Additional Strategies to Save Money</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Choose Higher Deductibles', desc: 'Increase deductibles on collision/comprehensive coverage' },
                  { title: 'Drop Unnecessary Coverage', desc: 'Skip rental car reimbursement and roadside assistance' },
                  { title: 'Shop Around Annually', desc: 'Rates vary significantly between insurers for teen drivers' },
                  { title: 'Consider Liability Only', desc: 'For older cars worth less than $4,000' },
                  { title: 'Maintain Good Credit', desc: 'In most states, credit affects rates' },
                  { title: 'Bundle All Policies', desc: 'Combine auto, home, and umbrella for maximum savings' },
                ].map((strategy, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h5 className="font-semibold text-slate-900 text-sm">{strategy.title}</h5>
                    <p className="text-xs text-slate-600 mt-1">{strategy.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When Rates Start to Drop</h2>
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h4 className="font-bold text-emerald-900 mb-3">Age-Based Rate Improvements</h4>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li><strong>Age 18:</strong> Slight decrease if clean driving record maintained</li>
                  <li><strong>Age 19:</strong> Additional decrease, especially with good grades</li>
                  <li><strong>Age 21:</strong> Significant rate reduction (20-30%)</li>
                  <li><strong>Age 25:</strong> Major milestone—rates drop dramatically (40-50%)</li>
                  <li><strong>3+ years clean record:</strong> Eligible for safe driver discounts</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Find the Best Rates for Your Teen Driver</h3>
              <p className="text-blue-100 mb-6">
                Compare quotes from multiple insurers to find the most affordable coverage for your family.
              </p>
              <Link 
                href="/get-quote?type=auto"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
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
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Car className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Auto Insurance Basics</span>
                </Link>
                <Link 
                  href="/guides/cheapest-car-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">How to Get Cheap Insurance</span>
                </Link>
                <Link 
                  href="/guides/discounts"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Award className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">All Insurance Discounts</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Heart className="w-5 h-5 text-rose-600" />
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
