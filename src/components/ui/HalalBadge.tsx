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
            color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
            description: 'The owner has provided a Halal certificate for this establishment.'
        },
        community_verified: {
            icon: CheckCircle2,
            text: 'Community Verified',
            color: 'text-emerald-700 bg-emerald-50/50 border-emerald-100',
            description: 'Multiple community members have confirmed the Halal status. Please verify on-site.'
        },
        unverified: {
            icon: HelpCircle,
            text: 'Not Verified',
            color: 'text-slate-500 bg-slate-50 border-slate-200',
            description: 'Halal status is based on name or reports only. Ask the owner for details.'
        },
        reported: {
            icon: AlertTriangle,
            text: 'Non-Halal Reported',
            color: 'text-amber-600 bg-amber-50 border-amber-200',
            description: 'Warning: This place has reports of not serving Halal food. Check with management.'
        }
    };

    const currentStatus = hasActiveReports ? 'reported' : status;
    const config = configs[currentStatus] || configs.unverified;
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all hover:shadow-sm cursor-help",
                config.color,
                className
            )}
            title={config.description}
        >
            <Icon size={12} className="stroke-[3]" />
            {showText && <span>{config.text}</span>}
        </div>
    );
}
