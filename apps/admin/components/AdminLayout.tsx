'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/dashboard/posts', label: 'Blog Posts', icon: '📝' },
        { href: '/dashboard/templates', label: 'Templates', icon: '📄' },
        { href: '/dashboard/media', label: 'Media', icon: '🖼️' },
        { href: '/dashboard/regions', label: 'Regions', icon: '🗺️' },
    ];

    if (session.user.role === 'SUPER_ADMIN') {
        navItems.push(
            { href: '/dashboard/users', label: 'Users', icon: '👥' },
            { href: '/dashboard/audit', label: 'Audit Logs', icon: '📋' }
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                                MyInsuranceBuddies Admin
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm">
                                <p className="font-medium text-gray-900">{session.user.name || session.user.email}</p>
                                <p className="text-xs text-gray-500">{session.user.role}</p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)]">
                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition ${isActive
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
