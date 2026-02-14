'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShieldCheck, MapPin, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user?.role !== 'admin') {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading || user?.role !== 'admin') {
        return <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500">Loading Admin Panel...</div>;
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
                        <span className="ml-auto bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <MapPin className="h-5 w-5" />
                        Places
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors">
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
