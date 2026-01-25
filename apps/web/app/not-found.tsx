import Link from "next/link";
import { Home, Search, FileQuestion, ArrowRight } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
            <div className="text-center max-w-2xl mx-auto">
                {/* 404 Icon */}
                <div className="w-24 h-24 mx-auto mb-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <FileQuestion className="w-12 h-12 text-blue-600" />
                </div>

                {/* Heading */}
                <h1 className="text-7xl font-bold text-slate-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
                <p className="text-slate-600 mb-8 text-lg">
                    Sorry, we couldn't find the page you're looking for.
                    It may have been moved or doesn't exist.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                    <Link
                        href="/car-insurance"
                        className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-200 transition font-semibold"
                    >
                        <Search className="w-5 h-5" />
                        Browse Insurance
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="border-t border-slate-200 pt-8">
                    <p className="text-sm text-slate-500 mb-4">Popular pages you might be looking for:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { label: "Car Insurance", href: "/car-insurance" },
                            { label: "Home Insurance", href: "/home-insurance" },
                            { label: "Health Insurance", href: "/health-insurance" },
                            { label: "All States", href: "/states" },
                            { label: "Contact Us", href: "/contact" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                {link.label}
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
