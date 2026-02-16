import { ShieldCheck, Lock, Eye, Database, Cookie } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-emerald-600 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="h-8 w-8" />
                        <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    </div>
                    <p className="text-emerald-100 italic">Effective Date: February 15, 2026</p>
                </div>

                <div className="p-8 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                            <Eye className="h-5 w-5" />
                            <h2>Information We Collect</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            To provide you with a high-quality community experience, we collect minimal information:
                        </p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li>
                                <strong>Account Information:</strong> When you sign in with Google, we receive your name, email address, and profile picture. This is used to identify your reviews and contributions.
                            </li>
                            <li>
                                <strong>User Content:</strong> Any reviews, reports, or data you submit to the platform are stored on our servers.
                            </li>
                            <li>
                                <strong>Service Providers:</strong> We use <strong>Supabase</strong> for database and authentication security, and <strong>Google Cloud</strong> for OAuth services.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                            <Database className="h-5 w-5" />
                            <h2>How We Use Data</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            Your data is used strictly for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Displaying your name next to verified reports to maintain community trust.</li>
                            <li>Preventing spam and malicious non-Halal reporting.</li>
                            <li>Personalizing your experience within the app.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                            <Cookie className="h-5 w-5" />
                            <h2>Cookies</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            We use essential cookies to keep you signed in. These cookies are required for the security of your account and do not track you across other websites.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                            <Lock className="h-5 w-5" />
                            <h2>Data Security</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            We take security seriously. All authentication is handled by enterprise-grade providers (Supabase Auth), and we never store your passwords on our local servers.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-slate-100 text-center">
                        <Link href="/">
                            <button className="text-emerald-600 font-bold hover:underline">Return to Home</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
