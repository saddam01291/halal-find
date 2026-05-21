'use client';

import { useState, useEffect } from 'react';
import { Share2, Heart, Check, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ClaimBusinessModal } from '@/components/place/ClaimBusinessModal';
import { useAuth } from '@/context/AuthContext';

interface PlaceActionsProps {
    placeId: string;
    placeName: string;
    placeCity?: string;
    placeAddress?: string;
    verificationStatus?: string;
    /** If true, auto-open claim modal on mount (triggered via ?claim=true URL param) */
    autoOpenClaim?: boolean;
}

export function PlaceActions({
    placeId,
    placeName,
    placeCity,
    placeAddress,
    verificationStatus,
    autoOpenClaim = false,
}: PlaceActionsProps) {
    const { user } = useAuth();
    const [isCopied, setIsCopied] = useState(false);
    const [isLoved, setIsLoved] = useState(false);
    const [isClaimOpen, setIsClaimOpen] = useState(autoOpenClaim);

    useEffect(() => {
        try {
            const savedPlaces = JSON.parse(localStorage.getItem('findhalal_saved_places') || '[]');
            if (savedPlaces.includes(placeId)) {
                setIsLoved(true);
            }
        } catch (e) {
            // ignore JSON parse errors
        }
    }, [placeId]);

    // If autoOpenClaim prop changes (e.g., URL param detected), open modal
    useEffect(() => {
        if (autoOpenClaim) setIsClaimOpen(true);
    }, [autoOpenClaim]);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${placeName} on FindHalal`,
                    text: `Check out ${placeName}!`,
                    url,
                });
            } catch {
                // user cancelled share
            }
        } else {
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleToggleLove = () => {
        try {
            const savedPlaces = JSON.parse(localStorage.getItem('findhalal_saved_places') || '[]');
            if (isLoved) {
                const newPlaces = savedPlaces.filter((p: string) => p !== placeId);
                localStorage.setItem('findhalal_saved_places', JSON.stringify(newPlaces));
                setIsLoved(false);
            } else {
                if (!savedPlaces.includes(placeId)) {
                    savedPlaces.push(placeId);
                    localStorage.setItem('findhalal_saved_places', JSON.stringify(savedPlaces));
                }
                setIsLoved(true);
            }
        } catch {
            // ignore storage errors
        }
    };

    // Only show Claim button if the place is NOT already owner-verified
    const canClaim = verificationStatus !== 'owner_verified';

    return (
        <>
            <div className="flex flex-col gap-2">
                {/* Share + Favourite row */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleShare}
                        className="rounded-full h-9 w-9 sm:h-11 sm:w-11 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        aria-label="Share"
                    >
                        {isCopied
                            ? <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                            : <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        }
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleToggleLove}
                        className={`rounded-full h-9 w-9 sm:h-11 sm:w-11 transition-all ${isLoved ? 'bg-red-50 text-red-500 border-red-200' : 'hover:bg-red-50 hover:text-red-500'}`}
                        aria-label="Favourite"
                    >
                        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLoved ? 'fill-current' : ''}`} />
                    </Button>
                </div>

                {/* Claim Business CTA */}
                {canClaim && (
                    <button
                        onClick={() => setIsClaimOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap"
                        aria-label="Claim this business"
                    >
                        <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                        Own this? Claim it
                    </button>
                )}
            </div>

            {/* Claim Modal */}
            <ClaimBusinessModal
                isOpen={isClaimOpen}
                onClose={() => setIsClaimOpen(false)}
                placeId={placeId}
                placeName={placeName}
                placeCity={placeCity}
                placeAddress={placeAddress}
                placeVerificationStatus={verificationStatus}
            />
        </>
    );
}
