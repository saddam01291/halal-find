'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface LeafletMapProps {
    center: { lat: number; lng: number };
    zoom?: number;
    className?: string;
    isStatic?: boolean; // If true, disables all interactions to LOOK like a still image
    markers?: { lat: number; lng: number; title?: string }[];
    onLocationSelect?: (lat: number, lng: number) => void;
}

// Extend global window type for Leaflet
declare global {
    interface Window {
        L: any;
    }
}

export default function LeafletMap({ center, zoom = 13, className, isStatic = false, markers = [] }: LeafletMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const [isLibLoaded, setIsLibLoaded] = useState(false);

    useEffect(() => {
        // If Leaflet is already in window, we are ready
        if (window.L) {
            setIsLibLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isLibLoaded || !mapRef.current) return;

        const L = window.L;

        // Initialize map
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                center: [center.lat, center.lng],
                zoom: zoom,
                dragging: !isStatic,
                touchZoom: !isStatic,
                scrollWheelZoom: !isStatic,
                doubleClickZoom: !isStatic,
                boxZoom: !isStatic,
                zoomControl: !isStatic,
                attributionControl: !isStatic
            });

            // "Gourmet" Tile Layer (Voyager / CartoDB) - Very clean and premium
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapInstance.current);
        } else {
            // Update center if it changes
            mapInstance.current.setView([center.lat, center.lng], zoom);
        }

        // Clear existing markers (if any)
        mapInstance.current.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
                mapInstance.current.removeLayer(layer);
            }
        });

        // Add Markers
        markers.forEach(m => {
            L.marker([m.lat, m.lng]).addTo(mapInstance.current)
                .bindPopup(m.title || 'Location');
        });

        // If no explicit markers but we have a center, add a default marker for the place
        if (markers.length === 0 && center) {
            const marker = L.marker([center.lat, center.lng], { draggable: !isStatic }).addTo(mapInstance.current);
            if (onLocationSelect) {
                marker.on('dragend', (e: any) => {
                    const { lat, lng } = e.target.getLatLng();
                    onLocationSelect(lat, lng);
                });
            }
        }

        // Add Click Listener for coordinate selection (if interactive)
        if (!isStatic && onLocationSelect) {
            mapInstance.current.off('click');
            mapInstance.current.on('click', (e: any) => {
                const { lat, lng } = e.latlng;
                onLocationSelect(lat, lng);
            });
        }

        return () => {
            // Cleanup on unmount handled by ref but Leaflet needs manual distroy if switching fast
        };
    }, [isLibLoaded, center, zoom, isStatic, markers]);

    return (
        <div className="relative w-full h-full">
            <Script 
                src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                onLoad={() => setIsLibLoaded(true)}
                strategy="afterInteractive"
            />
            <div 
                ref={mapRef} 
                className={className}
                style={{ height: '100%', width: '100%', cursor: isStatic ? 'default' : 'grab' }} 
            />
            
            {/* "Still Image" Overlay (Optional subtle glass effect to make it look non-interactive) */}
            {isStatic && (
                <div className="absolute inset-0 z-[400] bg-transparent pointer-events-none border-2 border-slate-100/10 rounded-inherit" />
            )}

            {!isLibLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 animate-pulse">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Generating still map...
                    </div>
                </div>
            )}
        </div>
    );
}
