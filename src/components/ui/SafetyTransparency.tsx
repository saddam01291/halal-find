import React from 'react';
import { Beer, Drumstick, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { DbPlace } from '@/lib/supabase';

interface SafetyTransparencyProps {
    place: DbPlace;
}

export function SafetyTransparency({ place }: SafetyTransparencyProps) {
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

    if (!place.is_mixed_neighborhood && !place.serves_alcohol && !place.halal_source) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Halal Transparency
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Alcohol Status */}
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

                {/* Sourcing */}
                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                        <Drumstick className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Meat Sourcing</p>
                        <p className="text-sm font-bold text-slate-900">
                            {place.halal_source || 'Standard Halal Supply'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contamination Risk (Highlight for Mixed Neighborhoods) */}
            {place.is_mixed_neighborhood && (
                <div className={`p-4 rounded-xl border ${riskColors[place.contamination_risk || 'low']} flex items-start gap-3`}>
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-sm">Mixed Area Safety: {riskLabels[place.contamination_risk || 'low']}</h4>
                        <p className="text-xs mt-1 leading-relaxed opacity-90">
                            In mixed neighborhoods, we verify kitchen protocols.
                            {place.contamination_risk === 'none' ? ' This kitchen is 100% Halal dedicated.' :
                                place.contamination_risk === 'low' ? ' Separate prep areas and utensils are used for Halal items.' :
                                    ' Proceed with caution and verify with staff.'}
                        </p>
                    </div>
                </div>
            )}

            <div className="flex justify-center pt-2">
                <button className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Learn about our safety standards
                </button>
            </div>
        </div>
    );
}
