import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Privacy Policy | MyInsuranceBuddies',
    description: 'Our privacy policy explains how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={[]} states={[]} />

            <section className="bg-slate-900 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-300">Last updated: December 2024</p>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
                        <p className="text-slate-600 mb-6">
                            We collect information you provide directly to us, such as when you request a quote,
                            contact us, or sign up for our newsletter. This may include your name, email address,
                            phone number, and insurance-related information.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
                        <p className="text-slate-600 mb-6">
                            We use the information we collect to provide, maintain, and improve our services,
                            send you quotes and recommendations, respond to your inquiries, and send promotional
                            communications (with your consent).
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Information Sharing</h2>
                        <p className="text-slate-600 mb-6">
                            We may share your information with insurance providers when you request quotes,
                            service providers who assist us in operating our website, and as required by law.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
                        <p className="text-slate-600 mb-6">
                            We implement appropriate security measures to protect your personal information
                            against unauthorized access, alteration, disclosure, or destruction.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
                        <p className="text-slate-600 mb-6">
                            You have the right to access, correct, or delete your personal information.
                            You may also opt out of marketing communications at any time.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
                        <p className="text-slate-600">
                            If you have questions about this Privacy Policy, please contact us at
                            privacy@myinsurancebuddies.com or by mail at our corporate address.
                        </p>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}
