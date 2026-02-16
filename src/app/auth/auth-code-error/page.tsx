'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AuthCodeError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 mb-6">
                    <AlertCircle className="h-8 w-8" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-3">
                    Authentication Error
                </h1>

                <p className="text-slate-600 mb-8">
                    We couldn't complete your sign-in. This might be because you denied access or there was a problem with the authentication process.
                </p>

                <div className="space-y-3">
                    <Link href="/">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                            Return to Home
                        </Button>
                    </Link>

                    <p className="text-sm text-slate-500">
                        Need help? Contact support
                    </p>
                </div>
            </div>
        </div>
    );
}
