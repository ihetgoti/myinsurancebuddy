import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({
            where: { isActive: true },
            include: { country: true },
            orderBy: { name: 'asc' },
        }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'All States | MyInsuranceBuddies',
    description: 'Find insurance information for all 50 US states. State-specific requirements, rates, and regulations.',
};

export default async function StatesPage() {
    const { insuranceTypes, states } = await getData();

    // Group states by first letter
    const groupedStates = states.reduce((acc: Record<string, typeof states>, state) => {
        const letter = state.name[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(state);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states.slice(0, 12)} />

            <section className="bg-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Insurance by State</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Explore state-specific requirements, rates, and top providers.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {Object.entries(groupedStates).sort().map(([letter, stateList]) => (
                            <div key={letter} className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">{letter}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {stateList.map((state) => (
                                        <Link
                                            key={state.id}
                                            href={`/car-insurance/${state.country.code}/${state.slug}`}
                                            className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-slate-700 hover:text-slate-900 font-medium"
                                        >
                                            {state.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {states.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-slate-500">No states available yet. Check back soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
