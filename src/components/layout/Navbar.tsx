'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, LogOut, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { AddPlaceModal } from '@/components/places/AddPlaceModal';

export function Navbar() {
    const { user, signOut } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 shadow-lg shadow-emerald-500/10 group-hover:shadow-amber-500/20 transition-all">
                            <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="block text-xl font-bold tracking-tight text-slate-900 leading-none">Find<span className="text-emerald-600">Halal</span></span>
                            <span className="block text-[10px] font-medium text-amber-600 tracking-wider leading-none">GOURMET</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/search"
                            className="hidden sm:inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                            Explore
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Button
                                    size="sm"
                                    className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                                    onClick={() => setIsAddPlaceOpen(true)}
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Add Place</span>
                                </Button>

                                <div className="relative group">
                                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors">
                                        <img
                                            src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                                            alt={user.full_name || 'User'}
                                            className="h-8 w-8 rounded-full border border-slate-200"
                                        />
                                    </button>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-2 border-b border-slate-50">
                                            <p className="text-sm font-semibold text-slate-900">{user.full_name || 'User'}</p>
                                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                        </div>
                                        <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                            <LogOut className="h-4 w-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md"
                                onClick={() => setIsLoginOpen(true)}
                            >
                                Sign In / Partner
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <AddPlaceModal isOpen={isAddPlaceOpen} onClose={() => setIsAddPlaceOpen(false)} />
        </>
    );
}
