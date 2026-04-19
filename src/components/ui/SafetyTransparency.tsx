import React, { useState } from 'react';
import { Beer, Drumstick, AlertCircle, CheckCircle2, Info, X, ShieldCheck } from 'lucide-react';
import { DbPlace } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface SafetyTransparencyProps {
    place: DbPlace;
}

export function SafetyTransparency({ place }: SafetyTransparencyProps) {
    const [showStandards, setShowStandards] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const [selectedStandard, setSelectedStandard] = useState<number | null>(null);

    const riskColors = {
        none: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        low: 'bg-blue-50 text-blue-700 border-blue-200',
        moderate: 'bg-amber-50 text-amber-700 border-amber-200',
        high: 'bg-red-50 text-red-700 border-red-200'
    };

    const riskLabels = {
        none: 'Pure Halal Kitchen',
        low: 'Strict Shared Kitchen',
        moderate: 'Standard Mixed Kitchen',
        high: 'High Contamination Risk'
    };

    const hasSpecificInfo = place.is_mixed_neighborhood || place.serves_alcohol || place.halal_source;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Halal Transparency
            </h3>

            {hasSpecificInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Specific Info Sections (Alcohol, Sourcing, etc) */}
                    {place.serves_alcohol !== undefined && (
                        <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                            <div className={`p-2 rounded-lg ${place.serves_alcohol ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                <Beer className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alcohol Status</p>
                                <p className="text-sm font-bold text-slate-900">
                                    {place.serves_alcohol ? 'Alcohol Served' : 'Dry Establishment (No Alcohol)'}
                                </p>
                            </div>
                        </div>
                    )}
                    {place.halal_source && (
                        <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                <Drumstick className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Meat Sourcing</p>
                                <p className="text-sm font-bold text-slate-900">
                                    {place.halal_source}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {place.is_mixed_neighborhood && (
                <div className={`p-4 rounded-xl border ${riskColors[place.contamination_risk || 'low']} flex items-start gap-3`}>
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-sm">Mixed Area Safety: {riskLabels[place.contamination_risk || 'low']}</h4>
                        <p className="text-xs mt-1 leading-relaxed opacity-90">
                            In mixed neighborhoods, we verify kitchen protocols.
                            {place.contamination_risk === 'none' ? ' This kitchen is dedicated to serving Halal food only.' :
                                place.contamination_risk === 'low' ? ' Separate prep areas and utensils are used for Halal items.' :
                                    ' Proceed with caution and verify with staff.'}
                        </p>
                    </div>
                </div>
            )}

            {showStandards && (
                <div className="pt-4 border-t border-slate-50 mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4 border border-slate-100">
                        <button 
                            onClick={() => { setSelectedStandard(1); setShowPolicy(true); }}
                            className="flex gap-4 w-full text-left hover:bg-white p-3 rounded-2xl transition-all group"
                        >
                            <div className="h-8 w-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">1</div>
                            <div>
                                <strong className="text-slate-900 block text-xs uppercase tracking-tight font-black mb-1 group-hover:text-emerald-600">Owner Verification (Green)</strong>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                                    Official certificates uploaded by owners. Click for details.
                                </p>
                            </div>
                        </button>
                        
                        <button 
                            onClick={() => { setSelectedStandard(2); setShowPolicy(true); }}
                            className="flex gap-4 w-full text-left hover:bg-white p-3 rounded-2xl transition-all group"
                        >
                            <div className="h-8 w-8 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">2</div>
                            <div>
                                <strong className="text-slate-900 block text-xs uppercase tracking-tight font-black mb-1 group-hover:text-blue-600">Community Consensus (Blue)</strong>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                                    Trusted through collective community votes. Click for details.
                                </p>
                            </div>
                        </button>

                        <button 
                            onClick={() => { setSelectedStandard(3); setShowPolicy(true); }}
                            className="flex gap-4 w-full text-left hover:bg-white p-3 rounded-2xl transition-all group"
                        >
                            <div className="h-8 w-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-amber-100 group-hover:scale-110 transition-transform">3</div>
                            <div>
                                <strong className="text-slate-900 block text-xs uppercase tracking-tight font-black mb-1 group-hover:text-amber-600">Non-Halal Reports (Orange)</strong>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                                    Safety alerts raised by users. Click to learn how to report.
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-center pt-2">
                <button 
                    onClick={() => setShowStandards(!showStandards)}
                    className="text-xs text-emerald-600 font-black uppercase tracking-widest hover:underline flex items-center gap-2"
                >
                    <Info className="h-3.5 w-3.5" />
                    {showStandards ? 'Hide policy' : 'Learn about our safety standards'}
                </button>
            </div>

            {/* Safety Policy Modal */}
            {showPolicy && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Security & Transparency</h2>
                            <button onClick={() => setShowPolicy(false)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all">
                                <X className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-10 space-y-8">
                            <section className="space-y-4">
                                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 uppercase">Our Commitment to You</h3>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                    Find Halal is built on community trust and transparency. We categorise restaurants based on physical evidence and collective verification.
                                </p>
                            </section>

                            <div className="space-y-6">
                                <div className={cn("p-6 rounded-3xl border-2 transition-all", selectedStandard === 1 ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-50")}>
                                    <h4 className="font-black text-xs text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" /> Owner Verified (Green)
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed font-bold">
                                        Owners upload Halal certificates or official affidavits. Our team manually audits these documents before issuing the Green Badge.
                                    </p>
                                </div>

                                <div className={cn("p-6 rounded-3xl border-2 transition-all", selectedStandard === 2 ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-50")}>
                                    <h4 className="font-black text-xs text-blue-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" /> Community Consensus (Blue)
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed font-bold">
                                        When at least 5 community members independently confirm the Halal status without any "Orange" reports, the establishment earns the Blue Badge.
                                    </p>
                                </div>

                                <div className={cn("p-6 rounded-3xl border-2 transition-all", selectedStandard === 3 ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-50")}>
                                    <h4 className="font-black text-xs text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-amber-500" /> Incident Reports (Orange)
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed font-bold">
                                        If a user reports that non-Halal items are served, the listing turns Orange. This alert stays active until the owner provides new proof of rectification.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-slate-100 italic text-[11px] text-slate-400 font-bold text-center">
                                * Information is community-driven. Always ask owners to verify.
                            </div>
                        </div>
                        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                            <Button onClick={() => setShowPolicy(false)} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg">Got it, thanks</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
