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
    title: 'Car Insurance Rates by Make and Model | InsuranceBuddies',
    description: 'Understand your car\'s average insurance rates, what affects them, and which insurers are cheapest for your vehicle.',
};

const vehicleCategories = [
    {
        category: 'Cheapest to Insure',
        vehicles: [
            { name: 'Subaru Crosstrek', avgRate: '$1,245/yr' },
            { name: 'Honda CR-V', avgRate: '$1,289/yr' },
            { name: 'Nissan Kicks', avgRate: '$1,312/yr' },
            { name: 'Mazda CX-5', avgRate: '$1,356/yr' },
            { name: 'Toyota RAV4', avgRate: '$1,378/yr' },
        ],
    },
    {
        category: 'Most Expensive to Insure',
        vehicles: [
            { name: 'Tesla Model S', avgRate: '$3,456/yr' },
            { name: 'BMW M4', avgRate: '$3,234/yr' },
            { name: 'Mercedes-AMG GT', avgRate: '$3,156/yr' },
            { name: 'Porsche 911', avgRate: '$2,987/yr' },
            { name: 'Dodge Charger Hellcat', avgRate: '$2,876/yr' },
        ],
    },
    {
        category: 'Popular Sedans',
        vehicles: [
            { name: 'Honda Civic', avgRate: '$1,456/yr' },
            { name: 'Toyota Camry', avgRate: '$1,423/yr' },
            { name: 'Honda Accord', avgRate: '$1,512/yr' },
            { name: 'Nissan Altima', avgRate: '$1,534/yr' },
            { name: 'Hyundai Sonata', avgRate: '$1,489/yr' },
        ],
    },
    {
        category: 'Popular Trucks',
        vehicles: [
            { name: 'Ford F-150', avgRate: '$1,678/yr' },
            { name: 'Chevrolet Silverado', avgRate: '$1,723/yr' },
            { name: 'RAM 1500', avgRate: '$1,756/yr' },
            { name: 'Toyota Tacoma', avgRate: '$1,534/yr' },
            { name: 'GMC Sierra', avgRate: '$1,789/yr' },
        ],
    },
];

export default async function ByVehiclePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-teal-400 font-medium mb-4">INSURANCE BY VEHICLE</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Car Insurance Rates by Make and Model
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Understand your car's average rates, what affects them, and which insurers are cheapest.
                    </p>
                </div>
            </section>

            {/* Factors */}
            <section className="py-12 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">What Affects Vehicle Insurance Rates</h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { title: 'Safety Ratings', desc: 'Safer cars cost less to insure' },
                                { title: 'Repair Costs', desc: 'Expensive parts = higher rates' },
                                { title: 'Theft Rates', desc: 'Commonly stolen cars cost more' },
                                { title: 'Vehicle Age', desc: 'Newer cars typically cost more' },
                            ].map((factor, i) => (
                                <div key={i} className="bg-white rounded-lg p-4 border border-slate-200 text-center">
                                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{factor.title}</h3>
                                    <p className="text-xs text-slate-500">{factor.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Vehicle Tables */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            {vehicleCategories.map((category, i) => (
                                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                        <h3 className="font-bold text-slate-900">{category.category}</h3>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {category.vehicles.map((vehicle, j) => (
                                            <div key={j} className="flex items-center justify-between px-6 py-3">
                                                <span className="text-slate-700">{vehicle.name}</span>
                                                <span className="font-semibold text-slate-900">{vehicle.avgRate}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-slate-500 text-center mt-6">
                            *Rates are national averages for full coverage. Your rate may vary based on location and driving history.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Tips for Insuring Your Vehicle</h2>
                        <div className="space-y-4">
                            {[
                                'Compare quotes from multiple insurers—rates vary significantly by vehicle.',
                                'Consider the insurance cost before buying a new car.',
                                'Ask about safety feature discounts for anti-theft devices and advanced safety systems.',
                                'Older vehicles may not need comprehensive and collision coverage.',
                            ].map((tip, i) => (
                                <div key={i} className="bg-white rounded-lg p-4 border border-slate-200 flex items-start gap-3">
                                    <span className="text-teal-500 font-bold">{i + 1}.</span>
                                    <p className="text-slate-600">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Get Rates for Your Vehicle</h2>
                    <p className="text-teal-100 mb-8">Compare personalized quotes based on your specific car.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

