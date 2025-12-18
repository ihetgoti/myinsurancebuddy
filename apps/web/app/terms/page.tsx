import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Terms of Service | MyInsuranceBuddies',
    description: 'Terms and conditions governing your use of MyInsuranceBuddies services.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={[]} states={[]} />

            <section className="bg-slate-900 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-slate-300">Last updated: December 2024</p>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Acceptance of Terms</h2>
                        <p className="text-slate-600 mb-6">
                            By accessing and using MyInsuranceBuddies, you accept and agree to be bound by these
                            Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Use of Services</h2>
                        <p className="text-slate-600 mb-6">
                            Our services provide insurance information and comparison tools. The information is
                            for educational purposes only and should not be considered as professional insurance advice.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">User Responsibilities</h2>
                        <p className="text-slate-600 mb-6">
                            You agree to provide accurate information when using our services and to use the
                            platform only for lawful purposes. You are responsible for maintaining the
                            confidentiality of any account information.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Disclaimer</h2>
                        <p className="text-slate-600 mb-6">
                            We strive to provide accurate information, but we make no warranties about the
                            completeness, reliability, or accuracy of the information. Insurance quotes are
                            estimates and actual rates may vary.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
                        <p className="text-slate-600 mb-6">
                            MyInsuranceBuddies shall not be liable for any indirect, incidental, special,
                            consequential, or punitive damages resulting from your use of our services.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Terms</h2>
                        <p className="text-slate-600">
                            We reserve the right to modify these terms at any time. Continued use of the
                            service after changes constitutes acceptance of the new terms.
                        </p>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}
