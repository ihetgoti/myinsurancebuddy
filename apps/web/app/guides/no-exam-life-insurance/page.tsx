import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, ArrowRight, CheckCircle, Clock, Star, AlertCircle,
  Heart, Zap, FileText, DollarSign, PiggyBank, TrendingUp,
  UserCheck, Calendar, XCircle, Check
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'No-Exam Life Insurance: Complete Guide 2025 | MyInsuranceBuddy',
  description: 'Learn about no-medical-exam life insurance options, costs vs traditional policies, approval times, coverage limits, and the best companies offering simplified issue coverage.',
  keywords: 'no exam life insurance, no medical exam life insurance, simplified issue life insurance, instant approval life insurance, no exam term life, guaranteed issue life insurance',
  openGraph: {
    title: 'No-Exam Life Insurance: Complete Guide 2025',
    description: 'Everything you need to know about getting life insurance without a medical exam—types, costs, and best companies.',
  },
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function NoExamLifeInsurancePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Fast Approval Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              No-Exam Life Insurance: The Complete Guide
            </h1>
            <p className="text-lg text-violet-200 mb-6">
              Get life insurance coverage without the medical exam. Learn about your options, costs, approval times, and the best companies.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 9 min read</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Intermediate</span>
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
                Traditional life insurance often requires a medical exam—blood work, urine samples, height and weight measurements, 
                and health questions. But what if you need coverage quickly, have a fear of needles, or simply prefer to skip the hassle? 
                No-exam life insurance offers a solution.
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-violet-600" />
                  What Is No-Exam Life Insurance?
                </h3>
                <p className="text-slate-700">
                  No-exam life insurance allows you to get coverage without undergoing a medical examination. Instead of lab tests 
                  and physical measurements, insurers use alternative data sources like prescription history, driving records, 
                  and previous medical records to assess your risk. Policies can be approved in minutes to days rather than weeks.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Types of No-Exam Life Insurance</h2>
              <p className="text-slate-600 mb-6">
                There are three main types of life insurance that don't require a medical exam. Understanding the differences 
                helps you choose the right option for your situation.
              </p>

              {/* Simplified Issue */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Simplified Issue</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                      Most Popular Option
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  Answer health questions on the application, but skip the medical exam. The insurer may verify your answers 
                  through prescription databases and the Medical Information Bureau (MIB).
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Pros:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Approval in 24-48 hours
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Coverage up to $2-3 million
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Competitive rates for healthy applicants
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Both term and whole life available
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Cons:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Higher cost than fully underwritten
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Health questions required
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Can be denied based on health history
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Age limits (usually up to 60-65)
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Best for:</strong> Healthy individuals who want fast approval without the hassle of a medical exam.
                </p>
              </div>

              {/* Guaranteed Issue */}
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Guaranteed Issue</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      No Health Questions
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  No health questions, no medical exam—approval is guaranteed regardless of your health status. 
                  These policies typically have graded death benefits and lower coverage limits.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Pros:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Guaranteed acceptance
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        No health questions asked
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Available for ages 50-85
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Immediate coverage for accidents
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Cons:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Higher premiums
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Limited coverage ($5,000-$25,000)
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Graded benefits (2-3 year waiting period)
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Usually whole life only
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-100 rounded-lg p-3 mb-4">
                  <p className="text-sm text-slate-700">
                    <strong>Graded Death Benefit:</strong> If you die of natural causes within the first 2-3 years, 
                    your beneficiaries receive only premiums paid plus interest (typically 10%). Full coverage begins after the waiting period.
                  </p>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Best for:</strong> Seniors and those with serious health conditions who cannot qualify for other types of coverage.
                </p>
              </div>

              {/* Accelerated Underwriting */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Accelerated Underwriting</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Best Rates Without Exam
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">
                  Uses advanced algorithms and data analysis to evaluate your risk in real-time. If you qualify, 
                  you get preferred rates without a medical exam. If not, you may need to take an exam for the best pricing.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Pros:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Same rates as fully underwritten policies
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Approval in minutes to hours
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Coverage up to $3-5 million
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Available for term and permanent
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Cons:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Not everyone qualifies
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Age and coverage limits
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Limited availability
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        May require exam backup
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Best for:</strong> Healthy individuals ages 18-50 seeking the best rates without the inconvenience of an exam.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cost Comparison: No-Exam vs Traditional</h2>
              <p className="text-slate-600 mb-6">
                How much more will you pay for the convenience of skipping the medical exam? Here's a comparison 
                for a 20-year, $500,000 term policy for a healthy 35-year-old male:
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Policy Type</th>
                      <th className="px-4 py-3">Monthly Premium</th>
                      <th className="px-4 py-3">Annual Cost</th>
                      <th className="px-4 py-3">20-Year Total</th>
                      <th className="px-4 py-3 rounded-tr-lg">Approval Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">Traditional (Exam Required)</td>
                      <td className="px-4 py-3 text-slate-600">$25-30</td>
                      <td className="px-4 py-3 text-slate-600">$300-360</td>
                      <td className="px-4 py-3 text-slate-600">$6,000-7,200</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">2-6 weeks</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Accelerated Underwriting</td>
                      <td className="px-4 py-3 text-slate-600">$25-35</td>
                      <td className="px-4 py-3 text-slate-600">$300-420</td>
                      <td className="px-4 py-3 text-slate-600">$6,000-8,400</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Minutes-hours</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Simplified Issue</td>
                      <td className="px-4 py-3 text-slate-600">$40-55</td>
                      <td className="px-4 py-3 text-slate-600">$480-660</td>
                      <td className="px-4 py-3 text-slate-600">$9,600-13,200</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">24-48 hours</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Guaranteed Issue</td>
                      <td className="px-4 py-3 text-slate-600">$100-200+</td>
                      <td className="px-4 py-3 text-slate-600">$1,200-2,400+</td>
                      <td className="px-4 py-3 text-slate-600">N/A (Whole life)</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Immediate</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3">Key Takeaway on Costs</h3>
                <p className="text-slate-700">
                  For healthy applicants, accelerated underwriting offers the best of both worlds—exam-free approval with 
                  traditional rates. Simplified issue costs 30-50% more, while guaranteed issue can cost 3-5x more but 
                  provides coverage when nothing else will.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Coverage Limits by Type</h2>
              <p className="text-slate-600 mb-6">
                No-exam policies typically have lower coverage limits than fully underwritten policies. Here's what to expect:
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center">
                  <h3 className="font-bold text-slate-900 mb-2">Accelerated Underwriting</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-1">$3M-5M</p>
                  <p className="text-sm text-slate-600">Maximum coverage</p>
                  <p className="text-xs text-slate-500 mt-2">Ages 18-50 typically</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center">
                  <h3 className="font-bold text-slate-900 mb-2">Simplified Issue</h3>
                  <p className="text-2xl font-bold text-emerald-600 mb-1">$1M-2M</p>
                  <p className="text-sm text-slate-600">Maximum coverage</p>
                  <p className="text-xs text-slate-500 mt-2">Ages 18-60 typically</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center">
                  <h3 className="font-bold text-slate-900 mb-2">Guaranteed Issue</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-1">$25K</p>
                  <p className="text-sm text-slate-600">Maximum coverage</p>
                  <p className="text-xs text-slate-500 mt-2">Ages 50-85 typically</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Best No-Exam Life Insurance Companies</h2>
              <p className="text-slate-600 mb-6">
                Not all insurers offer no-exam options, and those that do vary in their coverage limits, approval speeds, and pricing. 
                Here are some of the top options:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">Haven Life</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Accelerated</span>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Coverage up to $3 million</li>
                    <li>• Ages 18-64</li>
                    <li>• Instant decision for qualified applicants</li>
                    <li>• Issued by MassMutual (A++ rated)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">Ethos</h3>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Simplified</span>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Coverage up to $2 million</li>
                    <li>• Ages 20-65</li>
                    <li>• Application takes 10 minutes</li>
                    <li>• Multiple carrier options</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">Mutual of Omaha</h3>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">Guaranteed</span>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Guaranteed issue up to $25,000</li>
                    <li>• Ages 45-85</li>
                    <li>• No health questions</li>
                    <li>• A+ rated company</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">Bestow</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Accelerated</span>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Coverage up to $1.5 million</li>
                    <li>• Ages 18-60</li>
                    <li>• 100% online, no agents</li>
                    <li>• Decision in minutes</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">AIG</h3>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">Guaranteed</span>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Guaranteed issue up to $25,000</li>
                    <li>• Ages 50-85</li>
                    <li>• Terminal illness rider included</li>
                    <li>• A rated company</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Who Should Consider No-Exam Life Insurance?</h2>
              <p className="text-slate-600 mb-6">
                No-exam life insurance isn't for everyone, but it's an excellent option in these situations:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Good Candidates
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Need coverage quickly (loan collateral, divorce decree, etc.)</li>
                    <li>• Have a fear of needles or medical procedures</li>
                    <li>• Young and healthy (for accelerated underwriting)</li>
                    <li>• Need coverage for final expenses (seniors)</li>
                    <li>• Have been declined for traditional coverage</li>
                    <li>• Want simple, hassle-free application process</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Better with Traditional Exam
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Need more than $2-3 million in coverage</li>
                    <li>• Very healthy and want lowest possible rates</li>
                    <li>• Have complex health history to explain</li>
                    <li>• Looking for permanent/cash value policies</li>
                    <li>• Want the most carrier options</li>
                    <li>• Not in a hurry and want to comparison shop</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Application Process</h2>
              <p className="text-slate-600 mb-6">
                Getting no-exam life insurance is straightforward. Here's what to expect:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-violet-700">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Complete Application</h4>
                    <p className="text-slate-600 text-sm">Answer questions about your health, lifestyle, and medical history. Be honest—inaccuracies can void your policy.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-violet-700">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Electronic Records Check</h4>
                    <p className="text-slate-600 text-sm">Insurers verify your information through databases like the Medical Information Bureau (MIB), prescription history, and motor vehicle records.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-violet-700">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Phone Interview (Sometimes)</h4>
                    <p className="text-slate-600 text-sm">Some insurers conduct a brief phone interview to clarify health history or application answers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-violet-700">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Decision and Approval</h4>
                    <p className="text-slate-600 text-sm">Receive approval (or request for more information) within minutes to 48 hours depending on the policy type.</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-600" />
                  Pro Tips for Approval
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Be completely honest on your application—misrepresentation can lead to claim denial</li>
                  <li>• Have your driver's license and medication list ready</li>
                  <li>• Know your family's health history</li>
                  <li>• Be prepared to answer questions about your occupation and hobbies</li>
                  <li>• Consider applying with multiple companies to compare offers</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Get No-Exam Life Insurance Today</h3>
              <p className="text-violet-100 mb-6">
                Compare instant-approval life insurance quotes from top-rated companies. No medical exam required.
              </p>
              <Link 
                href="/get-quote?type=life"
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
              >
                Get Instant Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
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
                  <UserCheck className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Life Insurance for Parents</span>
                </Link>
                <Link 
                  href="/guides/life-insurance-seniors"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Calendar className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Life Insurance for Seniors</span>
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
