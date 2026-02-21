import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const error_description = requestUrl.searchParams.get('error_description');

    const host = request.headers.get('host');
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const origin = forwardedProto ? `${forwardedProto}://${host}` : requestUrl.origin;

    const next = requestUrl.searchParams.get('next') ?? '/';

    console.log('Auth callback:', { code: !!code, error, origin, next });

    if (error) {
        console.error('OAuth error:', error, error_description);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // setAll called from a Server Component — cookies() is read-only there
                            // but this is a Route Handler, so it should always work
                        }
                    },
                },
            }
        );

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (!exchangeError) {
            console.log('Auth: Session exchanged successfully, redirecting to:', next);
            // Redirect to /auth/complete which does window.location.replace for a fresh full load
            const completeUrl = `${origin}/auth/complete?next=${encodeURIComponent(next)}`;
            return NextResponse.redirect(completeUrl);
        }

        console.error('Auth: exchangeCodeForSession failed:', exchangeError);
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
