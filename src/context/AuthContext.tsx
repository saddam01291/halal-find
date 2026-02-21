'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type UserRole = 'guest' | 'user' | 'owner' | 'admin';

export interface User {
    id: string;
    email?: string;
    role: UserRole;
    full_name?: string;
    avatar_url?: string;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signInWithGoogle: (next?: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const applySession = (s: Session | null) => {
        setSession(s);
        if (s?.user) {
            setUser({
                id: s.user.id,
                email: s.user.email,
                role: 'user',
                full_name: s.user.user_metadata?.full_name,
                avatar_url: s.user.user_metadata?.avatar_url,
            });
        } else {
            setUser(null);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // 1. Sync immediately from cookies / storage
        supabase.auth.getSession().then(({ data: { session: s } }) => {
            applySession(s);

            // Fetch enriched profile in background if logged in
            if (s?.user) {
                supabase
                    .from('profiles')
                    .select('role, full_name, avatar_url')
                    .eq('id', s.user.id)
                    .single()
                    .then(({ data: profile }) => {
                        if (profile) {
                            setUser(prev => prev ? {
                                ...prev,
                                role: (profile.role as UserRole) || prev.role,
                                full_name: profile.full_name || prev.full_name,
                                avatar_url: profile.avatar_url || prev.avatar_url,
                            } : null);
                        }
                    });
            }
        });

        // 2. Listen to future changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {

            if (event === 'SIGNED_IN') {
                // Auto-reload the page so the fresh session is fully picked up.
                // SIGNED_IN fires only once after the OAuth redirect.
                // Subsequent page loads fire INITIAL_SESSION — so no infinite loop.
                window.location.reload();
                return;
            }

            applySession(s);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async (next?: string) => {
        setIsLoading(true);
        try {
            const redirectUrl = `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: redirectUrl },
            });
            if (error) {
                alert(`Login Error: ${error.message}`);
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        // Hard navigation to bypass Next.js Router Cache
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
