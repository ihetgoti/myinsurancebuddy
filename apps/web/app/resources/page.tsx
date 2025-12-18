import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Resources | MyInsuranceBuddies',
    description: 'Insurance guides, tools, and educational resources to help you make informed decisions.',
};

const resources = [
    { title: 'Insurance Buying Guides', description: 'Step-by-step guides for purchasing different types of insurance.', href: '/guides', icon: '📚' },
    { title: 'Coverage Calculator', description: 'Estimate how much coverage you actually need.', href: '/get-quote', icon: '🧮' },
    { title: 'Glossary', description: 'Understand common insurance terms and jargon.', href: '/glossary', icon: '📖' },
    { title: 'FAQ & Help Center', description: 'Answers to frequently asked questions.', href: '/faq', icon: '❓' },
    { title: 'State Requirements', description: 'Minimum coverage requirements by state.', href: '/states', icon: '🗺️' },
    { title: 'Provider Reviews', description: 'Honest reviews of top insurance companies.', href: '/compare', icon: '⭐' },
];

export default async function ResourcesPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Resources</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Tools and guides to help you navigate the insurance landscape.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {resources.map((resource) => (
                            <Link
                                key={resource.title}
                                href={resource.href}
                                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100"
                            >
                                <div className="text-3xl mb-4">{resource.icon}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{resource.title}</h3>
                                <p className="text-slate-500 text-sm">{resource.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
