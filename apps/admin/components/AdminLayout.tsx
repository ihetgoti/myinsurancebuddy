'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState, useCallback } from 'react';
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
    Zap,
    Handshake,
    Bell,
    Command,
    CheckCircle,
    AlertCircle,
    Info,
    ArrowRight,
    AlertTriangle,
    RefreshCw,
    MessageSquare,
    Sparkles,
    Key
} from 'lucide-react';
import JobProgressBar from './JobProgressBar';

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

interface Notification {
    id: string;
    type: 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR';
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    // Fetch notifications from API
    const fetchNotifications = useCallback(async () => {
        try {
            setLoadingNotifications(true);
            const res = await fetch('/api/notifications?limit=10');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoadingNotifications(false);
        }
    }, []);

    // Fetch on mount and periodically
    useEffect(() => {
        if (session) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Every 60 seconds
            return () => clearInterval(interval);
        }
    }, [session, fetchNotifications]);

    // Mark all as read
    const markAllRead = async () => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllRead: true }),
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setNotificationsOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-notifications]')) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 text-sm font-medium">Loading...</p>
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
                { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
            ],
        },
        {
            title: 'Insurance',
            items: [
                { href: '/dashboard/insurance-types', label: 'Insurance Types', icon: <Shield size={18} strokeWidth={1.5} /> },
            ],
        },
        {
            title: 'Geography',
            items: [
                { href: '/dashboard/countries', label: 'Countries', icon: <Globe size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/states', label: 'States', icon: <Map size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/cities', label: 'Cities', icon: <Building2 size={18} strokeWidth={1.5} /> },
            ],
        },
        {
            title: 'Content',
            items: [
                { href: '/dashboard/all-pages', label: 'All Site Pages', icon: <Globe size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/pages', label: 'Dynamic Pages', icon: <FileText size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/page-data', label: 'Page Data', icon: <Database size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/blog', label: 'Blog Posts', icon: <FileText size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/templates', label: 'Templates', icon: <LayoutTemplate size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/bulk-generate', label: 'Bulk Generate', icon: <Database size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/bulk-edit', label: 'Bulk Edit (CSV)', icon: <RefreshCw size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/bulk-editor', label: 'Bulk Templates', icon: <Zap size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/media', label: 'Media Library', icon: <ImageIcon size={18} strokeWidth={1.5} /> },
            ],
        },
        {
            title: 'SEO',
            items: [
                { href: '/dashboard/seo', label: 'SEO Dashboard', icon: <Search size={18} strokeWidth={1.5} /> },
            ],
        },
        {
            title: 'AI Content',
            items: [
                { href: '/dashboard/auto-generate', label: 'Auto Generate', icon: <Zap size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/ai-content', label: 'AI Generation', icon: <Sparkles size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/ai-providers', label: 'AI Providers', icon: <Key size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/ai-templates', label: 'AI Templates', icon: <FileText size={18} strokeWidth={1.5} /> },
            ],
        },
        {
            title: 'Marketing',
            items: [
                { href: '/dashboard/call-offers', label: 'Call Offers', icon: <Zap size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/popups', label: 'Popups', icon: <MessageSquare size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/affiliates', label: 'Affiliate Partners', icon: <Handshake size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/ads', label: 'Manage Ads', icon: <LayoutTemplate size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/settings/ads', label: 'Ad Settings', icon: <Settings size={18} strokeWidth={1.5} /> },
            ],
        },
        {
            title: 'Settings',
            items: [
                { href: '/dashboard/settings', label: 'Configuration', icon: <Settings size={18} strokeWidth={1.5} /> },
            ],
        },
    ];

    if (session.user.role === 'SUPER_ADMIN') {
        navSections.push({
            title: 'Administration',
            items: [
                { href: '/dashboard/users', label: 'Users', icon: <Users size={18} strokeWidth={1.5} /> },
                { href: '/dashboard/audit', label: 'Audit Logs', icon: <ClipboardList size={18} strokeWidth={1.5} /> },
            ],
        });
    }

    // Flatten nav items for search
    const allNavItems = navSections.flatMap(s => s.items);
    const filteredItems = searchQuery
        ? allNavItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : allNavItems;

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    const toggleSection = (title: string) => {
        setCollapsedSections(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const handleSearchSelect = (href: string) => {
        router.push(href);
        setSearchOpen(false);
        setSearchQuery('');
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'ERROR': return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Command Palette / Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search pages, settings, tools..."
                                className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                            />
                            <kbd className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-mono rounded">ESC</kbd>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {filteredItems.length > 0 ? (
                                <div className="p-2">
                                    {filteredItems.map((item) => (
                                        <button
                                            key={item.href}
                                            onClick={() => handleSearchSelect(item.href)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors group"
                                        >
                                            <span className="text-slate-400 group-hover:text-blue-600">{item.icon}</span>
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                                            <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-blue-600" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No results found for &quot;{searchQuery}&quot;
                                </div>
                            )}
                        </div>
                        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Command className="w-3 h-3" />K to open</span>
                            <span>↑↓ to navigate</span>
                            <span>↵ to select</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Header */}
            <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-slate-800 rounded">
                        <Menu size={22} strokeWidth={1.5} />
                    </button>
                    <span className="font-semibold text-sm tracking-wide">Administration</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold shadow-sm">
                        <span className="text-xs">{session.user.name?.[0] || 'U'}</span>
                    </div>
                </div>
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-slate-300 z-50 transition-transform duration-200 ease-out shadow-2xl flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Brand Header */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/50 bg-slate-950/30 flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                        <Shield size={18} fill="currentColor" />
                    </div>
                    <div>
                        <span className="block font-bold text-white tracking-tight leading-none">MyInsurance</span>
                        <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Enterprise Admin</span>
                    </div>
                    <button
                        className="lg:hidden p-1 hover:bg-slate-800 rounded ml-auto text-slate-400"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    {navSections.map((section) => (
                        <div key={section.title} className="mb-6">
                            <button
                                className="w-full flex items-center justify-between px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
                                onClick={() => toggleSection(section.title)}
                            >
                                {section.title}
                                {collapsedSections[section.title]
                                    ? <ChevronRight size={14} />
                                    : <ChevronDown size={14} />
                                }
                            </button>

                            {!collapsedSections[section.title] && (
                                <div className="space-y-0.5">
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`
                                                group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all border-l-2
                                                ${isActive(item.href)
                                                    ? 'bg-blue-600/10 text-white border-blue-500'
                                                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200 hover:border-slate-600'
                                                }
                                            `}
                                        >
                                            <span className={`${isActive(item.href) ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Job Progress */}
                <div className="px-3 pb-2 flex-shrink-0">
                    <JobProgressBar />
                </div>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-slate-800/50 bg-slate-950/30 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full ring-2 ring-slate-800 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {session.user.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{session.user.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{session.user.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-red-900/20 text-slate-400 hover:text-red-400 rounded-md text-xs font-semibold transition-all border border-transparent hover:border-red-900/30"
                    >
                        <LogOut size={14} strokeWidth={1.5} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:ml-64 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            {pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard'}
                        </h1>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                            {session.user.role} View
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Trigger */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden sm:inline">Search...</span>
                            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-white text-slate-400 text-[10px] font-mono rounded border border-slate-200">⌘K</kbd>
                        </button>

                        <div className="h-6 w-px bg-slate-200 mx-2"></div>

                        {/* Notifications */}
                        <div className="relative" data-notifications>
                            <button
                                onClick={(e) => { e.stopPropagation(); setNotificationsOpen(!notificationsOpen); }}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {notificationsOpen && (
                                <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900">Notifications</h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={fetchNotifications}
                                                className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                                                title="Refresh"
                                            >
                                                <RefreshCw className={`w-4 h-4 ${loadingNotifications ? 'animate-spin' : ''}`} />
                                            </button>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllRead}
                                                    className="text-xs text-blue-600 hover:underline font-medium"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                                                    onClick={() => {
                                                        if (notif.link) {
                                                            router.push(notif.link);
                                                            setNotificationsOpen(false);
                                                        }
                                                    }}
                                                >
                                                    <div className="flex gap-3">
                                                        {getNotificationIcon(notif.type)}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-slate-900">{notif.title}</p>
                                                            <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                                                            <p className="text-[10px] text-slate-400 mt-1">{formatTime(notif.createdAt)}</p>
                                                        </div>
                                                        {!notif.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center text-slate-400">
                                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No notifications yet</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-center">
                                        <span className="text-xs text-slate-400">
                                            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 p-8 overflow-x-hidden">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
