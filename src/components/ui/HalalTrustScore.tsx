import React from 'react';
import { ShieldCheck, Info, Users, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HalalTrustScoreProps {
    score: number;
    confirmations: number;
    isVerified: boolean;
    isDisputed?: boolean;
    className?: string;
}

export function HalalTrustScore({ score, confirmations, isVerified, isDisputed, className }: HalalTrustScoreProps) {
    // Determine trust level label and color
    const getLevel = (s: number) => {
        if (isDisputed) return { label: 'Disputed', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', icon: AlertTriangle };
        if (s >= 90) return { label: 'Elite Trust', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: ShieldCheck };
        if (s >= 70) return { label: 'High Trust', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: CheckCircle2 };
        if (s >= 50) return { label: 'Verified', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Info };
        return { label: 'Community Sourced', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: Users };
    };

    const level = getLevel(score);
    const Icon = level.icon;

    return (
        <div className={cn(
            "relative overflow-hidden rounded-3xl p-6 border transition-all duration-500",
            level.bg, level.border, className
        )}>
            {/* Background Decorative Element */}
            <div className="absolute -right-8 -bottom-8 opacity-10">
                <Icon size={160} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-3", level.color, level.border, "bg-white/50")}>
                            <Icon className="h-3 w-3" />
                            {level.label}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Halal Assurance</h3>
                    </div>
                    <div className="text-center">
                        <div className={cn("text-4xl font-black tabular-nums tracking-tighter", level.color)}>
                            {score}<span className="text-sm opacity-50 ml-0.5">%</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Trust Score</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-200/50 rounded-full overflow-hidden mb-6 border border-white/50 shadow-inner">
                    <div 
                        className={cn("h-full transition-all duration-1000 ease-out rounded-full", level.color.replace('text', 'bg'))}
                        style={{ width: `${score}%` }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Users className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Confirmations</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{confirmations}</p>
                    </div>
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{isVerified ? 'Official' : 'Community'}</p>
                    </div>
                </div>

                <p className="mt-6 text-xs text-slate-500 leading-relaxed font-medium">
                    {isDisputed 
                        ? "This listing has active community disputes. Please exercise caution and verify on-site."
                        : score >= 90 
                            ? "Highest level of trust. This restaurant has official certification and strong community backing."
                            : "Regularly verified by the community. Halal status is reported as consistent."
                    }
                </p>
            </div>
        </div>
    );
}
