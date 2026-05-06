import { Metadata } from 'next';
import { ShieldCheck, Users, CheckCircle2, AlertTriangle, Search, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'How We Verify Halal | FindHalal Transparency',
    description: 'Learn about our rigorous community-driven and owner-certified halal verification process.',
};

export default function VerificationProcessPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 sm:py-24">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6">
                        How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Verify</span> Halal
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Transparency is at the heart of everything we do. We use a multi-layered approach to ensure you can dine with peace of mind.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Method 1: Owner Certified */}
                    <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-emerald-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck className="h-32 w-32 text-emerald-600" />
                        </div>
                        <div className="h-14 w-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-600/20">
                            <ShieldCheck className="h-7 w-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Level 1: Owner Certified</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Establishments that have directly provided their active Halal certification documents to our team. We manually verify the expiration dates and the issuing body.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Document Verification
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Direct Contact with Owners
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Priority in Search Results
                            </li>
                        </ul>
                    </div>

                    {/* Method 2: Community Verified */}
                    <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-amber-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users className="h-32 w-32 text-amber-600" />
                        </div>
                        <div className="h-14 w-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-500/20">
                            <Users className="h-7 w-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Level 2: Community Vouched</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            When formal certification isn't available, we rely on the power of the community. A listing is marked as "Verified" only after 5+ trusted members confirm its status.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                <CheckCircle2 className="h-5 w-5 text-amber-500" /> 5+ Independent Confirmations
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                <CheckCircle2 className="h-5 w-5 text-amber-500" /> Photo Proof Required
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                <CheckCircle2 className="h-5 w-5 text-amber-500" /> Real-time status reporting
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Warning / Reporting Section */}
                <div className="bg-slate-900 text-white p-8 sm:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                                <AlertTriangle className="h-4 w-4" /> Reporting System
                            </div>
                            <h2 className="text-3xl font-black mb-6 leading-tight">Spot an Issue? <br/>Let the Community Know.</h2>
                            <p className="text-slate-400 leading-relaxed mb-8">
                                If a restaurant changes its halal status or is displaying incorrect information, our "Report Non-Halal" button allows instant alerting. We investigate every report within 24 hours.
                            </p>
                            <Link href="/search">
                                <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-8 h-12 font-bold">
                                    Browse Directory
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-emerald-400">
                                <Search className="h-5 w-5" /> What we look for:
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex gap-4">
                                    <div className="h-6 w-6 bg-emerald-500/20 text-emerald-400 rounded flex items-center justify-center flex-shrink-0 font-bold">1</div>
                                    <p className="text-slate-300">Active Halal certification from recognized local or international bodies.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-6 w-6 bg-emerald-500/20 text-emerald-400 rounded flex items-center justify-center flex-shrink-0 font-bold">2</div>
                                    <p className="text-slate-300">Confirmation of separate kitchens or equipment for halal-only preparation.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-6 w-6 bg-emerald-500/20 text-emerald-400 rounded flex items-center justify-center flex-shrink-0 font-bold">3</div>
                                    <p className="text-slate-300">No cross-contamination with non-halal items or alcohol service on the same premises.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                        <Info className="h-4 w-4" /> Always verify with the owner at the time of your visit.
                    </p>
                </div>
            </div>
        </div>
    );
}
