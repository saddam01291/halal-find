'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);

                if (session?.user) {
                    // Fetch profile
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    setUser({
                        id: session.user.id,
                        email: session.user.email,
                        role: (profile?.role as UserRole) || 'user',
                        full_name: profile?.full_name || session.user.user_metadata?.full_name,
                        avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
                    });
                } else {
                    setUser(null);
                }
                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async (next?: string) => {
        console.log('--- Sign In Attempt Started ---');

        // Prevent duplicate calls
        if (isLoading) {
            console.log('Sign-in ignored: isLoading is true');
            return;
        }

        setIsLoading(true);

        try {
            let redirectUrl = `${window.location.origin}/auth/callback`;
            if (next) {
                redirectUrl += `?next=${encodeURIComponent(next)}`;
            }
            console.log('Current Origin:', window.location.origin);
            console.log('Target Redirect URL:', redirectUrl);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    queryParams: {
                        prompt: 'select_account',
                        access_type: 'offline',
                    }
                },
            });

            if (error) {
                console.error('Supabase OAuth Error:', error);
                alert(`Login Error: ${error.message}\n\nPlease ensure ${window.location.origin} is added to Supabase "Redirect URLs".`);
                setIsLoading(false);
            } else {
                console.log('OAuth URL generated successfully, redirecting...');
                // If it doesn't redirect automatically for some reason:
                if (data?.url) {
                    window.location.href = data.url;
                }
            }
        } catch (err) {
            console.error('Unexpected Sign-in Exception:', err);
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
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
