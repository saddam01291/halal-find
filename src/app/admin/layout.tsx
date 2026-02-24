'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LayoutDashboard, ShieldCheck, MapPin, Settings, LogOut, AlertTriangle, Lock, UserX, X } from 'lucide-react';
import { LoginModal } from '@/components/auth/LoginModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const confirmedAdmin = useRef(false);
    if (user?.role === 'admin') confirmedAdmin.current = true;

    const stillChecking = isLoading || (!user && confirmedAdmin.current);

    if (stillChecking) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-emerald-500 font-bold uppercase tracking-widest gap-4">
                <div className="h-12 w-12 border-4 border-emerald-900 border-t-emerald-500 rounded-full animate-spin" />
                Updating Session...
            </div>
        );
    }

    if (!user && !confirmedAdmin.current) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full text-center">
                    <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h2>
                    <p className="text-slate-500 mb-8">Please sign in with an administrator account to access this panel.</p>
                    <div className="space-y-3">
                        <Button onClick={() => setIsLoginOpen(true)} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20">
                            Sign In to Admin
                        </Button>
                        <Link href="/" className="block">
                            <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900">
                                Return to Homepage
                            </Button>
                        </Link>
                    </div>
                </div>
                <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} redirectTo="/admin" />
            </div>
        );
    }

    if (user.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full text-center text-red-500">
                    Access Denied. Admin role required.
                </div>
            </div>
        );
    }

    const NavLink = ({ tab, icon: Icon, label }: { tab: string, icon: any, label: string }) => {
        const isActive = activeTab === tab;
        return (
            <Link
                href={`/admin?tab=${tab}`}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
            >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                {label}
            </Link>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Mobile Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-30">
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-slate-900 text-white fixed h-full shadow-xl z-20 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-slate-800 bg-slate-950/20">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" />
                        <span className="text-emerald-500">Find</span>Halal
                    </h1>
                </div>

                <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
                    <p className="px-4 pt-2 pb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Management</p>
                    <NavLink tab="overview" icon={LayoutDashboard} label="Dashboard" />
                    <NavLink tab="verifications" icon={ShieldCheck} label="Verifications" />
                    <NavLink tab="disputes" icon={AlertTriangle} label="Disputes" />
                    <NavLink tab="restaurants" icon={MapPin} label="Places" />
                    <NavLink tab="users" icon={UserX} label="Users" />

                    <p className="px-4 pt-6 pb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Settings</p>
                    <NavLink tab="settings" icon={Settings} label="Settings" />

                    <div className="pt-8 mt-4 border-t border-slate-800">
                        <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-900/20 hover:text-red-400 transition-colors font-bold text-sm">
                            <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">{user.full_name?.charAt(0) || 'A'}</div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-white truncate">{user.full_name || 'Admin'}</p>
                        <p className="text-[8px] text-slate-500 truncate">{user.email}</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8 min-h-screen">
                {children}
            </main>
        </div>
    );
}
