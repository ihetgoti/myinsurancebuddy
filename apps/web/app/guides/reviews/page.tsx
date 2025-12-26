import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';



async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Car Insurance Company Reviews 2024 | InsuranceBuddies',
    description: 'Honest reviews of top car insurance companies. Compare ratings, customer satisfaction, and coverage options.',
};

const companyReviews = [
    {
        name: 'State Farm',
        rating: 4.7,
        overview: 'The largest auto insurer in the U.S., known for its extensive agent network and strong customer service.',
        pros: ['Largest agent network', 'Strong financial stability', 'Good bundle discounts', 'Drive Safe & Save program'],
        cons: ['Rates vary significantly by location', 'Limited online tools compared to competitors'],
        bestFor: 'Those who prefer local agent support',
        jdPower: 835,
        amBest: 'A++',
    },
    {
        name: 'GEICO',
        rating: 4.6,
        overview: 'Known for competitive rates and a streamlined online experience. Great for tech-savvy drivers.',
        pros: ['Competitive rates', 'Excellent mobile app', 'Easy online quotes', 'Many discount options'],
        cons: ['No local agents', 'Claims process can be slow'],
        bestFor: 'Online shoppers and budget-conscious drivers',
        jdPower: 827,
        amBest: 'A++',
    },
    {
        name: 'Progressive',
        rating: 4.5,
        overview: 'Innovative insurer known for accepting high-risk drivers and offering unique tools like Name Your Price.',
        pros: ['Accepts high-risk drivers', 'Snapshot usage-based program', 'Name Your Price tool', 'Good bundling options'],
        cons: ['Higher average rates', 'Customer service inconsistent'],
        bestFor: 'High-risk drivers and those who want usage-based insurance',
        jdPower: 823,
        amBest: 'A+',
    },
    {
        name: 'USAA',
        rating: 4.9,
        overview: 'Consistently top-rated for customer satisfaction, but only available to military members and their families.',
        pros: ['Lowest rates in industry', 'Exceptional customer service', 'Strong claims handling', 'Military-specific benefits'],
        cons: ['Limited to military families', 'No local agents'],
        bestFor: 'Military members and their families',
        jdPower: 882,
        amBest: 'A++',
    },
    {
        name: 'Allstate',
        rating: 4.4,
        overview: 'Major insurer with strong rewards programs and accident forgiveness options.',
        pros: ['Drivewise rewards', 'Accident forgiveness', 'Deductible rewards', 'Large agent network'],
        cons: ['Higher than average rates', 'Some discounts require app usage'],
        bestFor: 'Safe drivers who want rewards',
        jdPower: 819,
        amBest: 'A+',
    },
];

export default async function ReviewsPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-teal-400 font-medium mb-4">UPDATED DECEMBER 2024</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Car Insurance Company Reviews
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Honest, unbiased reviews of the top car insurance companies to help you make an informed decision.
                    </p>
                </div>
            </section>

            {/* Reviews */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {companyReviews.map((company, index) => (
                            <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">{company.name}</h2>
                                            <p className="text-sm text-slate-500">Best for: {company.bestFor}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-xl font-bold">{company.rating}</span>
                                                </div>
                                                <span className="text-xs text-slate-500">Our Rating</span>
                                            </div>
                                            <Link
                                                href="/get-quote"
                                                className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
                                            >
                                                Get Quote
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <p className="text-slate-600 mb-6">{company.overview}</p>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <h4 className="text-sm font-semibold text-green-600 mb-3">✓ Pros</h4>
                                            <ul className="space-y-2">
                                                {company.pros.map((pro, i) => (
                                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                        <span className="text-green-500 mt-0.5">•</span>
                                                        {pro}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-red-600 mb-3">✗ Cons</h4>
                                            <ul className="space-y-2">
                                                {company.cons.map((con, i) => (
                                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                        <span className="text-red-500 mt-0.5">•</span>
                                                        {con}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-700 mb-3">Ratings</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">J.D. Power</span>
                                                    <span className="font-semibold text-slate-900">{company.jdPower}/1000</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">AM Best</span>
                                                    <span className="font-semibold text-slate-900">{company.amBest}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Find Your Best Match</h2>
                    <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
                        Compare personalized quotes from these companies and more.
                    </p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

