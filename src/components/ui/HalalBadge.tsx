import { ShieldCheck, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
import { VerificationStatus } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface HalalBadgeProps {
    status?: VerificationStatus;
    hasActiveReports?: boolean;
    className?: string;
    showText?: boolean;
}

export function HalalBadge({ status = 'unverified', hasActiveReports, className, showText = true }: HalalBadgeProps) {
    const configs = {
        owner_verified: {
            icon: ShieldCheck,
            text: 'Owner Verified',
            color: 'text-white bg-emerald-600 border-emerald-500 shadow-emerald-100',
            description: 'The owner has provided a Halal certificate for this establishment.'
        },
        community_verified: {
            icon: CheckCircle2,
            text: 'Community Verified',
            color: 'text-white bg-blue-600 border-blue-500 shadow-blue-100',
            description: 'Multiple community members have confirmed the Halal status.'
        },
        unverified: {
            icon: HelpCircle,
            text: 'Unverified',
            color: 'text-slate-500 bg-slate-100 border-slate-200',
            description: 'New or unchecked listing. Please verify status with the owner.'
        },
        reported: {
            icon: AlertTriangle,
            text: 'Non-Halal Warning',
            color: 'text-white bg-orange-600 border-orange-500 shadow-orange-100',
            description: 'Warning: This place has reports of not serving Halal food.'
        }
    };

    const currentStatus = hasActiveReports ? 'reported' : status;
    const config = configs[currentStatus] || configs.unverified;
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border shadow-xl transition-all hover:scale-105 cursor-help",
                config.color,
                className
            )}
            title={config.description}
        >
            <div className="bg-white/20 p-1 rounded-lg">
                <Icon size={14} className="stroke-[3]" />
            </div>
            {showText && <span>{config.text}</span>}
        </div>
    );
}
