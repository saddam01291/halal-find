'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LocationStatus = 'prompt' | 'granted' | 'denied' | 'loading' | 'dismissed';

interface LocationContextType {
    userCoords: { lat: number; lng: number } | null;
    locationStatus: LocationStatus;
    cityName: string | null;
    requestLocation: () => void;
    setManualCity: (city: string) => void;
    clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return (
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.county ||
            null
        );
    } catch {
        return null;
    }
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('prompt');
    const [cityName, setCityName] = useState<string | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCoords = localStorage.getItem('last_user_coords');
        const savedCity = localStorage.getItem('last_user_city');
        const savedStatus = localStorage.getItem('location_status') as LocationStatus | null;

        if (savedCoords) {
            try {
                setUserCoords(JSON.parse(savedCoords));
                setLocationStatus('granted');
                if (savedCity) setCityName(savedCity);
            } catch (e) {
                console.error('Error parsing saved coords:', e);
            }
        } else if (savedStatus === 'dismissed') {
            // User previously dismissed the modal — don't show it again
            setLocationStatus('dismissed');
        }
    }, []);

    const requestLocation = () => {
        if (typeof window === 'undefined' || !('geolocation' in navigator)) {
            setLocationStatus('denied');
            return;
        }

        setLocationStatus('loading');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserCoords(coords);
                setLocationStatus('granted');
                localStorage.setItem('last_user_coords', JSON.stringify(coords));
                localStorage.removeItem('location_status');

                // Reverse geocode to get city name
                const city = await reverseGeocode(coords.lat, coords.lng);
                if (city) {
                    setCityName(city);
                    localStorage.setItem('last_user_city', city);
                }
            },
            () => {
                setLocationStatus('denied');
            },
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
        );
    };

    const setManualCity = (city: string) => {
        setCityName(city);
    };

    // clearLocation is called when user clicks "Search Manually"
    // We set status to 'dismissed' so the modal does NOT reappear
    const clearLocation = () => {
        setUserCoords(null);
        setCityName(null);
        setLocationStatus('dismissed');
        localStorage.removeItem('last_user_coords');
        localStorage.removeItem('last_user_city');
        localStorage.setItem('location_status', 'dismissed');
    };

    return (
        <LocationContext.Provider value={{
            userCoords,
            locationStatus,
            cityName,
            requestLocation,
            setManualCity,
            clearLocation
        }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}
