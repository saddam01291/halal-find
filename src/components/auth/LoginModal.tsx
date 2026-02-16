'use client';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { X, User } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    redirectTo?: string;
}

export function LoginModal({ isOpen, onClose, redirectTo }: LoginModalProps) {
    const { signInWithGoogle, isLoading } = useAuth();

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle(redirectTo);
            // We don't call onClose() here because the page will redirect.
            // Closing the modal might make the screen flicker or look like it failed
            // if the redirect takes a second.
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">
                        Welcome Back
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2">
                                <User className="h-6 w-6" />
                            </div>
                            <p className="text-slate-600">Sign in to report places, write reviews, and manage your contributions.</p>
                        </div>

                        <Button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 h-12 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            {isLoading ? 'Signing in...' : 'Sign in with Google'}
                        </Button>

                        <div className="text-center text-xs text-slate-400">
                            By signing in, you agree to our Terms and Privacy Policy.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
