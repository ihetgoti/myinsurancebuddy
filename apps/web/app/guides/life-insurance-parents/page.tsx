import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, ArrowRight, CheckCircle, Users, Heart,
  Baby, Clock, Star, AlertCircle, Home, GraduationCap,
  DollarSign, FileText, PiggyBank, UserPlus
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Life Insurance for Parents: A Complete Guide | MyInsuranceBuddy',
  description: 'Learn why both working and stay-at-home parents need life insurance. Discover coverage amounts, term vs whole life options, and beneficiary planning strategies.',
  keywords: 'life insurance for parents, stay at home parent life insurance, life insurance for children, term vs whole life for parents, life insurance beneficiary planning',
  openGraph: {
    title: 'Life Insurance for Parents: A Complete Guide',
    description: 'Everything parents need to know about protecting their family with the right life insurance coverage.',
  },
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function LifeInsuranceParentsPage() {
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
              Family Protection Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Life Insurance for Parents: A Complete Guide
            </h1>
            <p className="text-lg text-violet-200 mb-6">
              Why both working and stay-at-home parents need coverage, how much to buy, and how to plan for your family's future.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
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
                Becoming a parent changes everything—including your financial priorities. Life insurance becomes essential 
                when someone depends on you financially, and for most parents, that means securing coverage that will protect 
                their children and spouse if the unthinkable happens.
              </p>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-violet-600" />
                  The Bottom Line for Parents
                </h3>
                <p className="text-slate-700">
                  <strong>Both parents need life insurance</strong>—regardless of who earns income. The economic value 
                  of a stay-at-home parent is estimated at $35,000-$75,000+ annually in replacement services. 
                  Most experts recommend parents carry <strong>10-15 times their annual income</strong> (or equivalent value) in coverage.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Why Stay-at-Home Parents Need Life Insurance</h2>
              <p className="text-slate-600 mb-6">
                One of the biggest misconceptions about life insurance is that only breadwinners need coverage. 
                In reality, stay-at-home parents provide invaluable services that would cost tens of thousands of dollars to replace.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">The Economic Value of a Stay-at-Home Parent</h3>
              <p className="text-slate-600 mb-4">
                If something happened to a stay-at-home parent, the surviving parent would need to pay for services including:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Baby className="w-5 h-5 text-violet-600" />
                    <h4 className="font-semibold text-slate-900">Childcare</h4>
                  </div>
                  <p className="text-sm text-slate-600">Full-time daycare or nanny services</p>
                  <p className="text-sm font-semibold text-violet-700 mt-1">$10,000 - $25,000/year</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-5 h-5 text-violet-600" />
                    <h4 className="font-semibold text-slate-900">Housekeeping</h4>
                  </div>
                  <p className="text-sm text-slate-600">Cleaning, laundry, organization</p>
                  <p className="text-sm font-semibold text-violet-700 mt-1">$5,000 - $10,000/year</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-violet-600" />
                    <h4 className="font-semibold text-slate-900">Transportation</h4>
                  </div>
                  <p className="text-sm text-slate-600">School pickup, activities, errands</p>
                  <p className="text-sm font-semibold text-violet-700 mt-1">$3,000 - $6,000/year</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-violet-600" />
                    <h4 className="font-semibold text-slate-900">Meal Preparation</h4>
                  </div>
                  <p className="text-sm text-slate-600">Cooking, meal planning, groceries</p>
                  <p className="text-sm font-semibold text-violet-700 mt-1">$3,000 - $5,000/year</p>
                </div>
              </div>

              <div className="bg-violet-50 rounded-xl p-6 border border-violet-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3">Total Estimated Annual Value</h3>
                <p className="text-3xl font-bold text-violet-700 mb-2">$35,000 - $75,000+</p>
                <p className="text-slate-600 text-sm">
                  This is why most financial experts recommend stay-at-home parents carry $250,000 to $500,000 
                  in life insurance coverage—or more depending on the number of children and their ages.
                </p>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Additional Considerations</h3>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li><strong>Reduced work hours:</strong> The working parent may need to cut back on work to handle childcare</li>
                <li><strong>Career impact:</strong> Lost promotions, missed opportunities, or the need to change jobs</li>
                <li><strong>Emotional support:</strong> Children will need extra attention and counseling during grief</li>
                <li><strong>Household management:</strong> Bills, scheduling, home maintenance, and countless other tasks</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Coverage Do Parents Need?</h2>
              <p className="text-slate-600 mb-6">
                Determining the right amount of life insurance requires considering multiple factors specific to your family situation.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">For the Working Parent</h3>
              <p className="text-slate-600 mb-4">
                The working parent's coverage should account for:
              </p>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Income replacement:</strong> 10-15 times annual income
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Outstanding debts:</strong> Mortgage, car loans, credit cards, student loans
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Children's education:</strong> $100,000-$200,000+ per child for college
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Final expenses:</strong> $10,000-$15,000 for funeral and burial
                    </div>
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">For the Stay-at-Home Parent</h3>
              <p className="text-slate-600 mb-4">
                Recommended coverage based on number and age of children:
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Family Situation</th>
                      <th className="px-4 py-3">Recommended Coverage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3">1 child, school age</td>
                      <td className="px-4 py-3 font-semibold text-violet-700">$250,000 - $350,000</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">2-3 children, mixed ages</td>
                      <td className="px-4 py-3 font-semibold text-violet-700">$400,000 - $500,000</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Multiple young children</td>
                      <td className="px-4 py-3 font-semibold text-violet-700">$500,000 - $750,000</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 rounded-bl-lg">Special needs children</td>
                      <td className="px-4 py-3 font-semibold text-violet-700">$750,000+</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Term vs Whole Life Insurance for Parents</h2>
              <p className="text-slate-600 mb-6">
                When shopping for life insurance, parents typically choose between term and whole life policies. 
                Here's how to decide which is right for your family:
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    Term Life Insurance
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">Coverage for a specific period (10, 15, 20, or 30 years)</p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Much more affordable premiums</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Can buy larger coverage amounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Perfect for temporary needs (until kids are grown)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Simple and straightforward</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <p className="text-xs text-slate-500">Best for: Most families seeking affordable protection during child-rearing years</p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    Whole Life Insurance
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">Permanent coverage that lasts your entire lifetime</p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Coverage never expires</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Builds cash value over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Premiums stay level forever</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Can be used for estate planning</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <p className="text-xs text-slate-500">Best for: Families with special needs children, estate planning, or permanent needs</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Recommendation for Most Parents
                </h3>
                <p className="text-slate-700">
                  <strong>Term life insurance is the best choice for most parents.</strong> It provides the most coverage 
                  per dollar at a time when your family needs maximum protection. Buy a 20-30 year term to cover the years 
                  until your children are financially independent. You can always convert to permanent insurance later if needed.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Life Insurance for Children: Should You Buy It?</h2>
              <p className="text-slate-600 mb-6">
                Child life insurance is a controversial topic in personal finance. Here's what you need to know to make an informed decision:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Arguments For Child Life Insurance</h3>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li><strong>Guaranteed future insurability:</strong> Locks in low rates and coverage regardless of future health conditions</li>
                <li><strong>Cash value accumulation:</strong> Whole life policies build savings that can be borrowed against later</li>
                <li><strong>Final expense coverage:</strong> Helps cover funeral costs in the tragic event of a child's death</li>
                <li><strong>Peace of mind:</strong> Some parents simply want the security of knowing coverage exists</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Arguments Against Child Life Insurance</h3>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li><strong>Low probability of need:</strong> Child mortality rates are extremely low</li>
                <li><strong>Opportunity cost:</strong> Premiums could be better invested in 529 plans or other savings</li>
                <li><strong>No income to replace:</strong> Unlike adults, children don't provide financial support to the family</li>
                <li><strong>Parents should be the priority:</strong> Limited budget should first cover the breadwinners</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Alternatives to Child Life Insurance</h3>
              <p className="text-slate-600 mb-4">
                Most families are better served by:
              </p>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Emergency fund:</strong> 6-12 months of expenses to cover any unexpected costs
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>529 college savings plan:</strong> Tax-advantaged education savings
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Child rider on parent policy:</strong> Add $10,000-$25,000 coverage for just $5-10/month
                    </div>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Beneficiary Planning for Parents</h2>
              <p className="text-slate-600 mb-6">
                Choosing beneficiaries requires careful consideration when children are involved. Here are best practices:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Who Should Be the Beneficiary?</h3>
              <div className="space-y-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Primary Beneficiary: Your Spouse</h4>
                  <p className="text-sm text-slate-600">
                    In most cases, name your spouse as the primary beneficiary. This gives them immediate access to funds 
                    for raising your children and managing household expenses.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Contingent Beneficiary: Your Children (With a Trust)</h4>
                  <p className="text-sm text-slate-600">
                    If your spouse predeceases you or dies simultaneously, proceeds should go to your children. 
                    However, minors cannot directly receive life insurance proceeds.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Setting Up a Trust for Minor Children</h3>
              <p className="text-slate-600 mb-4">
                If you want your children to be beneficiaries, consider these options:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li><strong>Revocable living trust:</strong> Allows you to control how and when children receive the money</li>
                <li><strong>Testamentary trust:</strong> Created through your will and activated upon death</li>
                <li><strong>Uniform Transfers to Minors Act (UTMA):</strong> Simpler option, but children receive full access at age 18-21</li>
              </ul>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Important Warning
                </h3>
                <p className="text-slate-700">
                  <strong>Never name minor children directly as beneficiaries</strong> without a trust or custodian. 
                  If you do, the life insurance company will hold the money until the court appoints a guardian—a process 
                  that can take months and significantly reduce the available funds due to legal fees.
                </p>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Review and Update Beneficiaries Regularly</h3>
              <p className="text-slate-600 mb-4">
                Review your beneficiaries after these life events:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-8 space-y-2">
                <li>Marriage or divorce</li>
                <li>Birth or adoption of a child</li>
                <li>Death of a beneficiary</li>
                <li>Children reaching adulthood</li>
                <li>Major changes in financial circumstances</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When Should Parents Buy Life Insurance?</h2>
              <p className="text-slate-600 mb-6">
                The best time to buy life insurance is when you're young and healthy—ideally before having children. 
                Here's the timeline most parents should follow:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-violet-700">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Planning Stage (Pre-Pregnancy or During Pregnancy)</h4>
                    <p className="text-slate-600 text-sm">Start shopping for policies. Both parents should be covered before the baby arrives.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-violet-700">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">New Parents (First Year)</h4>
                    <p className="text-slate-600 text-sm">If you don't have coverage yet, buy it now. This is when your family is most vulnerable.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-violet-700">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Growing Family (Additional Children)</h4>
                    <p className="text-slate-600 text-sm">Review and potentially increase coverage with each new child.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-violet-700">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Empty Nest (Kids Independent)</h4>
                    <p className="text-slate-600 text-sm">Consider reducing coverage or converting term policies as needs decrease.</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-600" />
                  Key Takeaways for Parents
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Both parents need life insurance—working and stay-at-home</li>
                  <li>• Buy term life insurance for the best value during child-rearing years</li>
                  <li>• Get 10-15 times your income (or equivalent value) in coverage</li>
                  <li>• Choose a 20-30 year term to cover children until they're independent</li>
                  <li>• Name beneficiaries carefully and consider a trust for minor children</li>
                  <li>• Buy coverage as early as possible for the best rates</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Protect Your Family's Future Today</h3>
              <p className="text-violet-100 mb-6">
                Compare life insurance quotes tailored for parents. Find affordable coverage that keeps your family secure.
              </p>
              <Link 
                href="/get-quote?type=life"
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
              >
                Get Free Quotes for Parents
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
                  href="/guides/life-insurance-riders"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Shield className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Understanding Life Insurance Riders</span>
                </Link>
                <Link 
                  href="/guides/no-exam-life-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-violet-50 transition"
                >
                  <Heart className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">No-Exam Life Insurance Options</span>
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
