import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, ArrowRight, CheckCircle, Clock, Star, AlertCircle,
  Heart, Users, DollarSign, FileText, PiggyBank, Calendar,
  TrendingUp, Home, Cross, Check
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Life Insurance for Seniors: Options Over 50, 60, 70 | MyInsuranceBuddy',
  description: 'Find the best life insurance for seniors over 50, 60, and 70. Learn about guaranteed issue, final expense, and burial insurance options with no medical exam required.',
  keywords: 'life insurance for seniors, life insurance over 50, life insurance over 60, life insurance over 70, guaranteed issue life insurance, final expense insurance, burial insurance for seniors',
  openGraph: {
    title: 'Life Insurance for Seniors: Best Options Over 50, 60, 70',
    description: 'Complete guide to senior life insurance options including guaranteed issue, final expense, and burial coverage.',
  },
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function LifeInsuranceSeniorsPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Senior Coverage Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Life Insurance for Seniors: Best Options Over 50, 60 & 70
            </h1>
            <p className="text-lg text-violet-200 mb-6">
              Find affordable coverage at any age. Learn about guaranteed issue, final expense, and burial insurance options for seniors.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 11 min read</span>
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
                If you're over 50 and looking for life insurance, you might think it's too late or too expensive. 
                The good news? There are plenty of options available for seniors, including policies that don't require 
                a medical exam and offer guaranteed acceptance. Whether you need to cover final expenses, leave a legacy, 
                or protect your spouse, there's a policy that fits your needs and budget.
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-violet-600" />
                  Why Seniors Still Need Life Insurance
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Cover funeral and burial costs (average $8,000-$12,000)</li>
                  <li>• Pay off remaining debts so they don't burden family</li>
                  <li>• Provide income replacement for a surviving spouse</li>
                  <li>• Leave a financial legacy for children or grandchildren</li>
                  <li>• Cover estate taxes for high-net-worth individuals</li>
                  <li>• Fund charitable bequests</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Life Insurance Options by Age Group</h2>

              {/* Over 50 */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Ages 50-59</h3>
                    <p className="text-emerald-700 text-sm">Most Options Available</p>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  At this age, you still have access to most types of life insurance, though premiums will be higher 
                  than if you had purchased in your 30s or 40s.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">Available Options:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li><strong>Term Life:</strong> 10-20 year terms available, coverage up to $1 million+</li>
                  <li><strong>Whole Life:</strong> Permanent coverage with cash value accumulation</li>
                  <li><strong>Universal Life:</strong> Flexible premiums and death benefits</li>
                  <li><strong>Guaranteed Issue:</strong> Available but not necessary for most healthy applicants</li>
                </ul>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Sample Rate:</strong> A healthy 55-year-old male can expect to pay $70-120/month for a $250,000, 20-year term policy.
                  </p>
                </div>
              </div>

              {/* Over 60 */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Ages 60-69</h3>
                    <p className="text-blue-700 text-sm">Good Options Remain</p>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  Term life options become more limited, but you can still find 10-15 year terms. 
                  Permanent life insurance and final expense policies are popular choices at this age.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">Available Options:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li><strong>Term Life:</strong> 10-15 year terms, coverage up to $500,000</li>
                  <li><strong>Whole Life:</strong> Smaller policies ($25,000-$100,000) with guaranteed acceptance options</li>
                  <li><strong>Final Expense:</strong> Simplified issue up to $50,000</li>
                  <li><strong>Guaranteed Issue:</strong> Good option for those with health conditions</li>
                </ul>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Sample Rate:</strong> A 65-year-old female might pay $60-100/month for a $25,000 final expense policy.
                  </p>
                </div>
              </div>

              {/* Over 70 */}
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Ages 70-85</h3>
                    <p className="text-amber-700 text-sm">Final Expense & Guaranteed Issue Focus</p>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  At 70+, term life becomes expensive or unavailable. The focus shifts to final expense insurance, 
                  guaranteed issue whole life, and smaller permanent policies designed to cover burial costs and 
                  leave a modest legacy.
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">Available Options:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li><strong>Term Life:</strong> Very limited; 10-year terms up to age 75 with some carriers</li>
                  <li><strong>Final Expense:</strong> Up to $50,000 with simplified underwriting</li>
                  <li><strong>Guaranteed Issue:</strong> Up to $25,000, no health questions asked</li>
                  <li><strong>Single Premium Whole Life:</strong> Pay once, coverage lasts forever</li>
                </ul>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Sample Rate:</strong> A 75-year-old might pay $100-150/month for a $10,000 guaranteed issue policy.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Types of Senior Life Insurance Explained</h2>

              {/* Final Expense */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Cross className="w-6 h-6 text-violet-600" />
                  <h3 className="text-xl font-bold text-slate-900">Final Expense Insurance</h3>
                </div>
                
                <p className="text-slate-600 mb-4">
                  Also called burial insurance or funeral insurance, these are small whole life policies (typically $5,000-$50,000) 
                  designed specifically to cover end-of-life expenses.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Pros:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>No medical exam required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>Easy application process</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>Premiums never increase</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>Coverage never expires</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>Builds cash value</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Cons:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>Limited coverage amounts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>Higher cost per dollar of coverage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>Health questions may be required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>Graded benefits with some policies</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Best for:</strong> Seniors who want to ensure their funeral costs don't burden family members.
                </p>
              </div>

              {/* Guaranteed Issue */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-violet-600" />
                  <h3 className="text-xl font-bold text-slate-900">Guaranteed Issue Life Insurance</h3>
                </div>
                
                <p className="text-slate-600 mb-4">
                  You cannot be turned down for guaranteed issue life insurance, regardless of your health. 
                  No medical exam, no health questions—just guaranteed acceptance for applicants within the eligible age range (usually 50-85).
                </p>

                <div className="bg-amber-100 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-amber-900 mb-2">Important: Graded Death Benefit</h4>
                  <p className="text-sm text-amber-800">
                    Most guaranteed issue policies have a 2-3 year graded benefit period. If you die of natural causes during this time, 
                    your beneficiaries receive only premiums paid plus interest (usually 10%). Full coverage begins after the waiting period. 
                    Accidental death is covered immediately.
                  </p>
                </div>

                <h4 className="font-semibold text-slate-900 mb-2">Typical Features:</h4>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                  <li>Coverage amounts: $5,000-$25,000</li>
                  <li>Permanent whole life insurance</li>
                  <li>Premiums remain level for life</li>
                  <li>Builds cash value you can borrow against</li>
                  <li>Available ages: 50-85 (varies by carrier)</li>
                </ul>

                <p className="text-sm text-slate-600">
                  <strong>Best for:</strong> Seniors with serious health conditions who cannot qualify for underwritten policies.
                </p>
              </div>

              {/* Term for Seniors */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-violet-600" />
                  <h3 className="text-xl font-bold text-slate-900">Term Life for Seniors</h3>
                </div>
                
                <p className="text-slate-600 mb-4">
                  While less common for older applicants, term life can still be a cost-effective option for seniors 
                  who need larger coverage amounts for a specific period (such as until a mortgage is paid off).
                </p>

                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-3 py-2 rounded-tl-lg">Age</th>
                        <th className="px-3 py-2">Max Term</th>
                        <th className="px-3 py-2">Max Coverage</th>
                        <th className="px-3 py-2 rounded-tr-lg">Health Req</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-3 py-2">50-60</td>
                        <td className="px-3 py-2 text-slate-600">20 years</td>
                        <td className="px-3 py-2 text-slate-600">$1-2 million</td>
                        <td className="px-3 py-2"><span className="text-emerald-600">Moderate</span></td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">60-70</td>
                        <td className="px-3 py-2 text-slate-600">10-15 years</td>
                        <td className="px-3 py-2 text-slate-600">$500,000</td>
                        <td className="px-3 py-2"><span className="text-amber-600">Good</span></td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">70-80</td>
                        <td className="px-3 py-2 text-slate-600">10 years</td>
                        <td className="px-3 py-2 text-slate-600">$100,000</td>
                        <td className="px-3 py-2"><span className="text-rose-600">Excellent</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Best for:</strong> Healthy seniors who need temporary, higher coverage at the lowest cost.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cost Comparison: Sample Monthly Premiums</h2>
              <p className="text-slate-600 mb-6">
                Here's what seniors can expect to pay for different types of coverage. Rates vary by health status, 
                carrier, and specific policy features.
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Age</th>
                      <th className="px-4 py-3">Final Expense ($25K)</th>
                      <th className="px-4 py-3">Guaranteed Issue ($10K)</th>
                      <th className="px-4 py-3 rounded-tr-lg">Term ($100K, 10yr)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">55</td>
                      <td className="px-4 py-3 text-slate-600">$50-70</td>
                      <td className="px-4 py-3 text-slate-600">$40-55</td>
                      <td className="px-4 py-3 text-slate-600">$35-50</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">60</td>
                      <td className="px-4 py-3 text-slate-600">$65-90</td>
                      <td className="px-4 py-3 text-slate-600">$55-75</td>
                      <td className="px-4 py-3 text-slate-600">$55-80</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">65</td>
                      <td className="px-4 py-3 text-slate-600">$85-120</td>
                      <td className="px-4 py-3 text-slate-600">$70-95</td>
                      <td className="px-4 py-3 text-slate-600">$90-140</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">70</td>
                      <td className="px-4 py-3 text-slate-600">$110-160</td>
                      <td className="px-4 py-3 text-slate-600">$95-130</td>
                      <td className="px-4 py-3 text-slate-600">$150-250</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">75</td>
                      <td className="px-4 py-3 text-slate-600">$150-220</td>
                      <td className="px-4 py-3 text-slate-600">$130-180</td>
                      <td className="px-4 py-3 text-slate-600">Limited/N/A</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">80</td>
                      <td className="px-4 py-3 text-slate-600">$200-300</td>
                      <td className="px-4 py-3 text-slate-600">$180-250</td>
                      <td className="px-4 py-3 text-slate-600">N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mb-8">*Rates are estimates for illustrative purposes. Actual rates will vary. Sample rates shown are for non-smokers.</p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Best Life Insurance Companies for Seniors</h2>
              <p className="text-slate-600 mb-6">
                These companies consistently offer competitive rates and strong products for senior applicants:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-siolet-900 mb-2">Mutual of Omaha</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Final expense up to $50,000</li>
                    <li>• Guaranteed issue up to $25,000</li>
                    <li>• Ages 45-85 accepted</li>
                    <li>• A+ financial rating</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">AARP/New York Life</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Specializes in senior coverage</li>
                    <li>• Term and permanent options</li>
                    <li>• Guaranteed acceptance program</li>
                    <li>• A++ financial rating</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Colonial Penn</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Guaranteed acceptance for ages 50-85</li>
                    <li>• "Price lock" guarantee</li>
                    <li>• Easy application process</li>
                    <li>• A- financial rating</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">AIG</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Guaranteed issue ages 50-85</li>
                    <li>• Terminal illness rider included</li>
                    <li>• Flexible payment options</li>
                    <li>• A financial rating</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Tips for Buying Senior Life Insurance</h2>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">What to Do</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Shop around.</strong> Rates can vary significantly between companies for the same coverage.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Consider your needs carefully.</strong> Don't buy more coverage than necessary—focus on your actual obligations.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Look for living benefits.</strong> Many policies now include accelerated death benefits for chronic or terminal illness.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Check the waiting period.</strong> Understand any graded benefit periods before purchasing guaranteed issue policies.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Work with an independent agent.</strong> They can compare multiple companies to find your best rate.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4">What to Avoid</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Don't wait if you have health issues.</strong> If you're considering guaranteed issue due to health, every year you wait increases premiums.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Don't hide health information.</strong> Even on simplified issue applications, misrepresentation can void your policy.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Avoid buying more than you can afford long-term.</strong> A lapsed policy helps no one.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Don't buy from unsolicited callers.</strong> Work with reputable, licensed agents or companies.
                    </div>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Alternatives to Consider</h2>
              <p className="text-slate-600 mb-6">
                Before purchasing a policy, consider whether these alternatives might better serve your goals:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Pre-Paid Funeral Plans</h4>
                  <p className="text-slate-600 text-sm">
                    Pay for your funeral in advance through a funeral home. Locks in today's prices, but funds are tied to that specific provider.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Savings Accounts</h4>
                  <p className="text-slate-600 text-sm">
                    Set aside money specifically for final expenses. No premiums, no underwriting, but no growth or protection if you die before saving enough.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Existing Permanent Insurance</h4>
                  <p className="text-slate-600 text-sm">
                    If you have an old whole life policy, it may have sufficient cash value or death benefit to cover your current needs.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Find the Right Senior Life Insurance</h3>
              <p className="text-violet-100 mb-6">
                Compare quotes from top-rated companies specializing in senior coverage. No obligation, free quotes.
              </p>
              <Link 
                href="/get-quote?type=life"
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
              >
                Get Free Senior Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/no-exam-life-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Shield className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">No-Exam Life Insurance Guide</span>
                </Link>
                <Link 
                  href="/guides/life-insurance-coverage"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">How Much Life Insurance Do You Need?</span>
                </Link>
                <Link 
                  href="/guides/life-insurance-parents"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Users className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Life Insurance for Parents</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
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
