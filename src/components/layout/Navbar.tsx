'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, LogOut, PlusCircle, LayoutDashboard, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { AddPlaceModal } from '@/components/places/AddPlaceModal';

export function Navbar() {
    const { user, signOut } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl transform-gpu">
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
                    <div className="flex items-center gap-2">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex sm:hidden items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <div className="w-6 h-5 relative flex flex-col justify-between">
                                <span className={`w-full h-0.5 bg-current rounded-full transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                                <span className={`w-full h-0.5 bg-current rounded-full transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`w-full h-0.5 bg-current rounded-full transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                            </div>
                        </button>

                        <div className="hidden sm:flex items-center gap-3">
                            <Link
                                href="/search"
                                className="inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            >
                                Explore
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Button
                                        size="sm"
                                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                                        onClick={() => setIsAddPlaceOpen(true)}
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        <span>Add Place</span>
                                    </Button>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsProfileOpen(!isProfileOpen);
                                            }}
                                            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 active:scale-95 cursor-pointer relative z-30"
                                        >
                                            <img
                                                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                                                alt={user.full_name || 'User'}
                                                className="h-8 w-8 rounded-full border border-slate-200 shadow-sm pointer-events-none"
                                            />
                                        </button>

                                        {isProfileOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                                                <div className="absolute right-0 top-full pt-2 w-56 z-20">
                                                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                        <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                                                            <p className="text-sm font-bold text-slate-900">{user.full_name || 'User'}</p>
                                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">{user.role}</p>
                                                        </div>

                                                        {user.role === 'admin' && (
                                                            <Link
                                                                href="/admin"
                                                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                                                            >
                                                                <LayoutDashboard className="h-4 w-4 text-emerald-600" /> Admin Dashboard
                                                            </Link>
                                                        )}

                                                        <button
                                                            onClick={async () => {
                                                                setIsLoggingOut(true);
                                                                await signOut();
                                                            }}
                                                            disabled={isLoggingOut}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors disabled:opacity-50"
                                                        >
                                                            <LogOut className={`h-4 w-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                                                            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
                                    onClick={() => setIsLoginOpen(true)}
                                >
                                    Sign In / Partner
                                </Button>
                            )}
                        </div>

                        {/* Mobile Direct Actions */}
                        {!user && (
                            <Button
                                size="sm"
                                className="sm:hidden rounded-full bg-slate-900 text-white shadow-sm h-8 px-3 text-xs"
                                onClick={() => setIsLoginOpen(true)}
                            >
                                Sign In
                            </Button>
                        )}
                        {user && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMobileMenuOpen(!isMobileMenuOpen);
                                }}
                                className="sm:hidden block p-0.5 rounded-full border-2 border-emerald-500/20 active:scale-90 transition-transform cursor-pointer"
                            >
                                <img
                                    src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                                    alt="User"
                                    className="h-8 w-8 rounded-full pointer-events-none"
                                />
                            </button>
                        )}
                    </div>
                </div>

            </nav>

            {/* 📱 Mobile Menu Overlay (Full Screen) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] sm:hidden flex justify-end">
                    {/* Semi-transparent Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Menu Content Tray */}
                    <div className="relative h-full w-[280px] bg-white shadow-2xl flex flex-col border-l border-slate-100">
                        {/* Header in Menu */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
                                    <MapPin className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-bold text-slate-900">Menu</span>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 active:scale-95 transition-transform"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            {/* Primary Actions */}
                            <div className="space-y-3">
                                <Link
                                    href="/search"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 active:bg-slate-100 transition-colors"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <span className="font-bold text-sm">Explore Restaurants</span>
                                </Link>

                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsAddPlaceOpen(true);
                                    }}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50 text-emerald-900 active:bg-emerald-100 transition-colors w-full text-left"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                                        <PlusCircle className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <span className="font-bold text-sm">Add New Place</span>
                                </button>
                            </div>

                            {/* User Section */}
                            <div className="pt-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Account</p>
                                {user ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                                            <img
                                                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                                                alt="User"
                                                className="h-10 w-10 rounded-full border border-white shadow-sm"
                                            />
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-slate-900 truncate">{user.full_name || 'User'}</p>
                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{user.role}</p>
                                            </div>
                                        </div>

                                        {user.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 font-bold text-sm text-slate-700"
                                            >
                                                <LayoutDashboard className="h-4 w-4 text-emerald-600" /> Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            disabled={isLoggingOut}
                                            onClick={async () => {
                                                setIsLoggingOut(true);
                                                await signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 font-bold text-sm text-red-600 w-full text-left disabled:opacity-50"
                                        >
                                            <LogOut className={`h-4 w-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                                            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                                        </button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsLoginOpen(true);
                                        }}
                                        className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold"
                                    >
                                        Sign In / Partner
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Footer in Menu */}
                        <div className="p-6 text-center border-t border-slate-50">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">FindHalal GOURMET</span>
                        </div>
                    </div>
                </div>
            )}

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <AddPlaceModal isOpen={isAddPlaceOpen} onClose={() => setIsAddPlaceOpen(false)} />
        </>
    );
}
