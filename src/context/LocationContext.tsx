'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LocationStatus = 'prompt' | 'granted' | 'denied' | 'loading';

interface LocationContextType {
    userCoords: { lat: number; lng: number } | null;
    locationStatus: LocationStatus;
    cityName: string | null;
    requestLocation: () => void;
    setManualCity: (city: string) => void;
    clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('prompt');
    const [cityName, setCityName] = useState<string | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCoords = localStorage.getItem('last_user_coords');
        if (savedCoords) {
            try {
                setUserCoords(JSON.parse(savedCoords));
                setLocationStatus('granted');
            } catch (e) {
                console.error('Error parsing saved coords:', e);
            }
        }
    }, []);

    const requestLocation = () => {
        if (typeof window === 'undefined' || !('geolocation' in navigator)) {
            setLocationStatus('denied');
            return;
        }

        setLocationStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserCoords(coords);
                setLocationStatus('granted');
                localStorage.setItem('last_user_coords', JSON.stringify(coords));
                // Optional: Reverse geocode here to get city name
            },
            () => {
                setLocationStatus('denied');
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
    };

    const setManualCity = (city: string) => {
        setCityName(city);
        // We could also geocode the city to get coords here
    };

    // Do NOT auto-request on mount.
    // We show our own modal first so the user consciously chooses to allow or search manually.
    // requestLocation() is called only when the user clicks "Use My Location".

    const clearLocation = () => {
        setUserCoords(null);
        setLocationStatus('prompt');
        localStorage.removeItem('last_user_coords');
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
