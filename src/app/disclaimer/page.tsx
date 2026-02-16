import { ShieldAlert, Info, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';
import Link from 'next/link';

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Scale className="h-8 w-8 text-emerald-400" />
                        <h1 className="text-3xl font-bold">Legal Disclaimer</h1>
                    </div>
                    <p className="text-slate-400 italic">Please read this carefully before using Find Halal.</p>
                </div>

                <div className="p-8 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg border-b border-slate-100 pb-2">
                            <ShieldAlert className="h-5 w-5 text-indigo-600" />
                            <h2>Community Information Policy</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            <strong>Find Halal</strong> is a community-supported discovery tool. While we work hard to maintain accurate information, please note that the final verification of Halal status always remains with the consumer.
                        </p>
                        <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 font-medium text-slate-700 italic">
                            "We encourage all users to perform their own due diligence. Find Halal provides community-sourced insights to assist you, but we recommend double-checking with restaurant staff to ensure their current practices meet your personal requirements."
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                            <Users className="h-5 w-5 text-emerald-600" />
                            <h2>How We Work</h2>
                        </div>
                        <div className="grid gap-4">
                            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <Scale className="h-6 w-6 text-slate-400 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-slate-900">Community Driven</h3>
                                    <p className="text-sm text-slate-500">Most data is provided and verified by users like you. Establishments may change their meat suppliers or cooking methods at any time without notice.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-slate-900">Tiered Verification</h3>
                                    <p className="text-sm text-slate-500">We distinguish between "Owner Verified" (official certificate provided) and "Community Verified" (confirmed by 5+ users). However, even official certificates can expire.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                            <Info className="h-5 w-5" />
                            <h2>User Action Required</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            We strongly recommend all users to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Personally verify the Halal status with the restaurant staff or manager.</li>
                            <li>Ask to see a current, valid physical Halal certificate in the restaurant.</li>
                            <li>Use the <strong>"Report"</strong> feature in our app immediately if you find an establishment is no longer serving Halal meat.</li>
                        </ul>
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

// Custom Users icon if needed or import from lucide
function Users({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    )
}
