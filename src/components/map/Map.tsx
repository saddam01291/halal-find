'use client';

import dynamic from 'next/dynamic';

// Dynamically import Leaflet with no SSR to avoid 'window is not defined' errors
const LeafletMap = dynamic(() => import('./LeafletMap'), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
            <div className="h-8 w-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
});

interface MapProps {
    apiKey?: string; // Kept for compatibility but not used by Leaflet
    className?: string;
    center?: { lat: number; lng: number };
    zoom?: number;
    children?: React.ReactNode;
    isStatic?: boolean;
    onLocationSelect?: (lat: number, lng: number) => void;
    markers?: { lat: number; lng: number; title?: string }[];
}

export const GoogleMap = ({
    className,
    center,
    zoom = 15,
    isStatic = false,
    onLocationSelect,
    markers,
}: MapProps) => {
    // Total Stability Guard: Validate coordinates
    const isValidCoord = (val: any) => typeof val === 'number' && isFinite(val);
    
    // Default to a safe center if invalid
    const safeCenter = center && isValidCoord(center.lat) && isValidCoord(center.lng) 
        ? center 
        : { lat: 23.8103, lng: 90.4125 }; // Default to region center

    return (
        <LeafletMap 
            center={safeCenter}
            zoom={zoom}
            className={className}
            isStatic={isStatic}
            onLocationSelect={onLocationSelect}
            markers={markers}
        />
    );
};
