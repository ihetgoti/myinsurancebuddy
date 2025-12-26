'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Shield,
    Globe,
    Map,
    Building2,
    FileText,
    LayoutTemplate,
    Database,
    Image as ImageIcon,
    Users,
    ClipboardList,
    Menu,
    X,
    LogOut,
    ChevronDown,
    ChevronRight,
    Search,
    Settings,
    Zap
} from 'lucide-react';

interface AdminLayoutProps {
    children: ReactNode;
}

interface NavItem {
    href: string;
    label: string;
    icon: ReactNode;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const navSections: NavSection[] = [
        {
            title: 'Overview',
            items: [
                { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            ],
        },
        {
            title: 'Insurance',
            items: [
                { href: '/dashboard/insurance-types', label: 'Insurance Types', icon: <Shield size={18} /> },
            ],
        },
        {
            title: 'Geography',
            items: [
                { href: '/dashboard/countries', label: 'Countries', icon: <Globe size={18} /> },
                { href: '/dashboard/states', label: 'States', icon: <Map size={18} /> },
                { href: '/dashboard/cities', label: 'Cities', icon: <Building2 size={18} /> },
            ],
        },
        {
            title: 'Content',
            items: [
                { href: '/dashboard/pages', label: 'Pages', icon: <FileText size={18} /> },
                { href: '/dashboard/templates', label: 'Templates', icon: <LayoutTemplate size={18} /> },
                { href: '/dashboard/quick-generate', label: '⚡ Quick Generate', icon: <Zap size={18} /> },
                { href: '/dashboard/bulk-generate', label: 'Bulk Generate', icon: <Database size={18} /> },
                { href: '/dashboard/media', label: 'Media Library', icon: <ImageIcon size={18} /> },
            ],
        },
        {
            title: 'SEO',
            items: [
                { href: '/dashboard/seo', label: 'SEO Dashboard', icon: <Search size={18} /> },
            ],
        },
        {
            title: 'Site',
            items: [
                { href: '/dashboard/settings', label: 'Settings', icon: <Settings size={18} /> },
            ],
        },
    ];

    if (session.user.role === 'SUPER_ADMIN') {
        navSections.push({
            title: 'System',
            items: [
                { href: '/dashboard/users', label: 'Users', icon: <Users size={18} /> },
                { href: '/dashboard/audit', label: 'Audit Logs', icon: <ClipboardList size={18} /> },
            ],
        });
    }

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    const toggleSection = (title: string) => {
        setCollapsedSections(prev => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg">Admin</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm">{session.user.name?.[0] || 'U'}</span>
                </div>
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-slate-300 z-50 transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Shield size={18} fill="currentColor" />
                        </div>
                        <span className="font-bold text-white tracking-tight">HelpAdmin</span>
                        <button
                            className="ml-auto lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                        {navSections.map((section) => (
                            <div key={section.title}>
                                <div
                                    className="flex items-center justify-between px-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-400"
                                    onClick={() => toggleSection(section.title)}
                                >
                                    {section.title}
                                    {collapsedSections[section.title] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                                </div>

                                {!collapsedSections[section.title] && (
                                    <div className="space-y-1">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`
                                                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                                    ${isActive(item.href)
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'hover:bg-slate-800 hover:text-white'}
                                                `}
                                            >
                                                {item.icon}
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                        <div className="flex items-center gap-3 mb-3 px-2">
                            <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                                {session.user.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
