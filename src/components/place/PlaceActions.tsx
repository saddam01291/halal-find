'use client';

import { useState, useEffect } from 'react';
import { Share2, Heart, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PlaceActionsProps {
    placeId: string;
    placeName: string;
}

export function PlaceActions({ placeId, placeName }: PlaceActionsProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isLoved, setIsLoved] = useState(false);

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

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${placeName} on FindHalal`,
                    text: `Check out ${placeName}!`,
                    url: url
                });
            } catch (err) {
                // fallback if user cancels
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
        } catch(e) {
            // handle
        }
    };

    return (
        <div className="flex gap-2 relative">
            <Button 
                variant="outline" 
                size="icon" 
                onClick={handleShare}
                className="rounded-full h-9 w-9 sm:h-11 sm:w-11 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                aria-label="Share"
            >
                {isCopied ? <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" /> : <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                onClick={handleToggleLove}
                className={`rounded-full h-9 w-9 sm:h-11 sm:w-11 transition-all ${isLoved ? 'bg-red-50 text-red-500 border-red-200' : 'hover:bg-red-50 hover:text-red-500'}`}
                aria-label="Favorite"
            >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLoved ? 'fill-current' : ''}`} />
            </Button>
        </div>
    );
}
