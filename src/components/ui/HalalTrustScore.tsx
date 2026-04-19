import React from 'react';
import { ShieldCheck, Info, Users, CheckCircle2, AlertTriangle, TrendingUp, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerificationStatus } from '@/lib/supabase';

interface HalalTrustScoreProps {
    status: VerificationStatus;
    halalVotes: number;
    reportCount: number;
    isDisputed?: boolean;
    className?: string;
}

export function HalalTrustScore({ status, halalVotes, reportCount, isDisputed, className }: HalalTrustScoreProps) {
    // Determine trust level based on hierarchy: 
    // 1. Non-Halal Report (Orange)
    // 2. Owner Verified (Green - Elite)
    // 3. Community Verified (Green - Caution)
    // 4. Unverified (Slate)

    const getTrustDetails = () => {
        if (reportCount > 0 && !isDisputed) {
            return {
                label: 'Non-Halal Reported',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                icon: AlertTriangle,
                description: 'Warning: Users have reported this place may not be Halal. Please check before eating.',
                level: 'warning'
            };
        }

        if (status === 'owner_verified') {
            return {
                label: 'Owner Certified',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                icon: ShieldCheck,
                description: 'Most Trusted: Owner has provided official certification. Still, best to ask for the latest certificate.',
                level: 'expert'
            };
        }

        if (status === 'community_verified' || halalVotes > 0) {
            return {
                label: 'Community Verified',
                color: 'text-emerald-700',
                bg: 'bg-emerald-50/50',
                border: 'border-emerald-100',
                icon: CheckCircle2,
                description: 'Trusted with Caution: Verified by our community members. Halal status may change; always ask the owner to be sure.',
                level: 'community'
            };
        }

        return {
            label: 'Unverified',
            color: 'text-slate-500',
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            icon: HelpCircle,
            description: 'This place has not been verified yet. Use your own discretion and ask the owner.',
            level: 'none'
        };
    };

    const config = getTrustDetails();
    const Icon = config.icon;

    return (
        <div className={cn(
            "relative overflow-hidden rounded-3xl p-6 border transition-all duration-500 shadow-sm",
            config.bg, config.border, className
        )}>
            {/* Background Decorative Element */}
            <div className="absolute -right-8 -bottom-8 opacity-5">
                <Icon size={160} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-3", config.color, config.border, "bg-white/80")}>
                            <Icon className="h-3 w-3" />
                            {config.label}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Halal Trust</h3>
                    </div>
                    <div className="text-right">
                        <div className={cn("text-3xl font-black tabular-nums tracking-tighter", config.color)}>
                            {halalVotes}<span className="text-sm opacity-50 ml-1">Votes</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Community Trust</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Users className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Halal Confirmations</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{halalVotes}</p>
                    </div>
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <AlertTriangle className={cn("h-3.5 w-3.5", reportCount > 0 ? "text-amber-500" : "")} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Reports</span>
                        </div>
                        <p className={cn("text-lg font-bold", reportCount > 0 ? "text-amber-600" : "text-slate-900")}>{reportCount}</p>
                    </div>
                </div>

                <div className={cn("p-4 rounded-2xl border text-xs leading-relaxed font-medium", 
                    config.level === 'warning' ? "bg-amber-100/50 border-amber-200 text-amber-900" : 
                    config.level === 'expert' ? "bg-emerald-100/50 border-emerald-200 text-emerald-900" :
                    "bg-slate-100/50 border-slate-200 text-slate-700"
                )}>
                    {config.description}
                </div>

                <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1">
                    <Info className="h-3 w-3" />
                    Always confirm with the owner before eating
                </p>
            </div>
        </div>
    );
}
