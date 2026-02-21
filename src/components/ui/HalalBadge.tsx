import { ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { VerificationStatus } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface HalalBadgeProps {
    status?: VerificationStatus;
    className?: string;
    showText?: boolean;
}

export function HalalBadge({ status = 'unverified', className, showText = true }: HalalBadgeProps) {
    const configs = {
        owner_verified: {
            icon: ShieldCheck,
            text: 'Owner Verified',
            color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
            description: 'Owner has uploaded a valid Halal certificate'
        },
        community_verified: {
            icon: CheckCircle2,
            text: 'Community Verified',
            color: 'text-blue-600 bg-blue-50 border-blue-200',
            description: 'Multiple users have confirmed Halal status'
        },
        unverified: {
            icon: HelpCircle,
            text: 'Unverified',
            color: 'text-slate-500 bg-slate-50 border-slate-200',
            description: 'Halal status inferred from name or reviews'
        }
    };

    const config = configs[status] || configs.unverified;
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-all hover:shadow-sm cursor-help",
                config.color,
                className
            )}
            title={config.description}
        >
            <Icon size={14} />
            {showText && <span>{config.text}</span>}
        </div>
    );
}
