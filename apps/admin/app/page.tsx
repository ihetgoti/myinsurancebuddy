'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Shield, LayoutDashboard, Users, FileText, Settings } from 'lucide-react';

export default function AdminHome() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-slate-600 font-medium">Loading...</div>
                </div>
            </div>
        );
    }

    if (status === 'authenticated') {
        return null;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <header className="w-full py-4 px-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-semibold text-lg">MyInsuranceBuddies</span>
                        </div>
                        <Link
                            href="/"
                            className="text-slate-400 hover:text-white transition-colors text-sm"
                        >
                            Back to Site
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md">
                        {/* Login Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <LayoutDashboard className="w-8 h-8 text-blue-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
                                <p className="text-slate-500 mt-2">Sign in to access the admin dashboard</p>
                            </div>

                            <Link
                                href="/auth/signin"
                                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold text-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
                            >
                                Sign In
                            </Link>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-center text-sm text-slate-500">
                                    Authorized personnel only.
                                </p>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                </div>
                                <span className="text-xs text-slate-400">Content</span>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Users className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="text-xs text-slate-400">Users</span>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Settings className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-xs text-slate-400">Settings</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full py-4 px-6 border-t border-white/10">
                    <div className="max-w-6xl mx-auto text-center">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} MyInsuranceBuddies. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </main>
    );
}
