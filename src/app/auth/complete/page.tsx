'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthCompleteInner() {
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/';

    useEffect(() => {
        // Hard browser navigation - bypasses Next.js Router Cache entirely
        // This ensures the destination page loads fresh with the new session cookies
        window.location.replace(next);
    }, [next]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: 'system-ui, sans-serif',
            color: '#374151'
        }}>
            <div style={{
                width: 40,
                height: 40,
                border: '3px solid #e5e7eb',
                borderTopColor: '#10b981',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ marginTop: 16, fontSize: 14 }}>Completing sign-in...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default function AuthComplete() {
    return (
        <Suspense>
            <AuthCompleteInner />
        </Suspense>
    );
}
