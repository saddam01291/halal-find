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

    const refreshProfile = async (session: Session | null) => {
        if (!session?.user) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role, full_name, avatar_url')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    role: (profile.role as UserRole) || 'user',
                    full_name: profile.full_name || session.user.user_metadata?.full_name,
                    avatar_url: profile.avatar_url || session.user.user_metadata?.avatar_url,
                });
            } else {
                // Fallback for new accounts without profiles yet
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    role: 'user',
                    full_name: session.user.user_metadata?.full_name,
                    avatar_url: session.user.user_metadata?.avatar_url,
                });
            }
        } catch (err) {
            console.error('refreshProfile error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 1. Initial Load
        supabase.auth.getSession().then(({ data: { session: s } }) => {
            setSession(s);
            refreshProfile(s);
        });

        // 2. Listen to Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
            if (event === 'SIGNED_IN') {
                setSession(s);
                if (s) refreshProfile(s);
                return;
            }

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setSession(null);
                setIsLoading(false);
                return;
            }

            // For other events like token refresh or initial session recovery
            setSession(s);
            if (s) {
                refreshProfile(s);
            } else {
                setUser(null);
                setIsLoading(false);
            }
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
