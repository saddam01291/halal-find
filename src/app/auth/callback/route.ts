import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const error_description = requestUrl.searchParams.get('error_description');

    // Better origin detection for Cloudflare Tunnels
    const host = request.headers.get('host');
    const forwardedProto = request.headers.get('x-forwarded-proto');
    // If we're on a tunnel, forwardedProto is usually https
    const origin = forwardedProto ? `${forwardedProto}://${host}` : requestUrl.origin;

    console.log('Auth callback received:', { code: !!code, error, error_description, detectedOrigin: origin });

    // if "next" is in param, use it as the redirect URL
    const next = requestUrl.searchParams.get('next') ?? '/';

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options });
                    },
                },
            }
        );
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (!exchangeError) {
            console.log('Auth successful, redirecting to:', next);
            return NextResponse.redirect(`${origin}${next}`);
        }

        console.error('Error exchanging code for session:', exchangeError);
    }

    // return the user to an error page with instructions
    console.log('Auth failed, redirecting to error page');
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
