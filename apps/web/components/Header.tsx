import Link from 'next/link';

export default function Header() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        MyInsuranceBuddies
                    </span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition">Blog</Link>
                    <Link href="/#states" className="text-gray-600 hover:text-blue-600 transition">States</Link>
                    <Link href="/#insurance-types" className="text-gray-600 hover:text-blue-600 transition">Coverage</Link>
                </div>
                {/* Mobile menu button */}
                <button className="md:hidden p-2 text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
