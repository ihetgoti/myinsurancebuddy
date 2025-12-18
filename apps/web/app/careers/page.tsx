import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'Careers | MyInsuranceBuddies',
    description: 'Join our team and help make insurance information accessible to everyone.',
};

const openPositions = [
    { title: 'Senior Content Writer', department: 'Content', location: 'Remote', type: 'Full-time' },
    { title: 'Full Stack Developer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
    { title: 'Insurance Industry Expert', department: 'Editorial', location: 'Remote', type: 'Contract' },
    { title: 'Marketing Manager', department: 'Marketing', location: 'Remote', type: 'Full-time' },
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={[]} states={[]} />

            <section className="bg-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Join Our Team</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Help us make insurance information accessible to everyone.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Work With Us?</h2>
                        <div className="grid md:grid-cols-3 gap-8 mt-10">
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <div className="text-3xl mb-4">🌍</div>
                                <h3 className="font-bold text-slate-900 mb-2">Remote First</h3>
                                <p className="text-slate-600 text-sm">Work from anywhere in the world.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <div className="text-3xl mb-4">📈</div>
                                <h3 className="font-bold text-slate-900 mb-2">Growth</h3>
                                <p className="text-slate-600 text-sm">Continuous learning and development opportunities.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <div className="text-3xl mb-4">💚</div>
                                <h3 className="font-bold text-slate-900 mb-2">Impact</h3>
                                <p className="text-slate-600 text-sm">Help millions make better insurance decisions.</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions</h2>
                    <div className="space-y-4">
                        {openPositions.map((position, index) => (
                            <div key={index} className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-lg hover:border-slate-400 transition">
                                <div>
                                    <h3 className="font-bold text-slate-900">{position.title}</h3>
                                    <p className="text-slate-500 text-sm">{position.department} • {position.location} • {position.type}</p>
                                </div>
                                <Link href="/contact" className="text-blue-600 font-semibold hover:underline">
                                    Apply →
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center bg-slate-50 p-8 rounded-lg">
                        <h3 className="font-bold text-slate-900 mb-3">Don't see a fit?</h3>
                        <p className="text-slate-600 mb-4">We're always looking for talented people.</p>
                        <Link href="/contact" className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition">
                            Send Your Resume
                        </Link>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}
