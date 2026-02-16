'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LayoutDashboard, ShieldCheck, MapPin, Settings, LogOut, AlertTriangle, Lock, UserX } from 'lucide-react';
import { LoginModal } from '@/components/auth/LoginModal';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut, isLoading } = useAuth();
    const router = useRouter();
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500 font-medium animate-pulse">Checking Permissions...</div>;
    }

    if (!user) {
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
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full text-center">
                    <div className="h-16 w-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserX className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
                    <p className="text-slate-500 mb-2">You are currently logged in as:</p>
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium mb-2 text-sm break-all">
                        {user.email}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mb-6 break-all">
                        ID: {user.id}
                    </div>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        To gain access, run this command in your <span className="font-bold text-slate-900">Supabase SQL Editor</span>:
                    </p>
                    <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-left text-xs font-mono mb-8 overflow-x-auto relative group">
                        <pre>UPDATE profiles{"\n"}SET role = &apos;admin&apos;{"\n"}WHERE id = &apos;{user.id}&apos;;</pre>
                    </div>
                    <div className="space-y-3">
                        <Button onClick={signOut} className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl">
                            Sign Out & Switch Account
                        </Button>
                        <Link href="/" className="block">
                            <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900 font-medium">
                                Back to Site
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full shadow-xl z-20">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" />
                        <span className="text-emerald-100">Admin</span>Panel
                    </h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 transition-colors">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/verifications" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <ShieldCheck className="h-5 w-5" />
                        Verifications
                    </Link>
                    <Link href="/admin/disputes" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <AlertTriangle className="h-5 w-5" />
                        Disputes
                    </Link>
                    <Link href="/admin" onClick={() => (window as any)._setActiveTab?.('restaurants')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <MapPin className="h-5 w-5" />
                        Places
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
