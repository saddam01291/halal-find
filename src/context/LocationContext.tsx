'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LocationStatus = 'prompt' | 'granted' | 'denied' | 'loading';

interface LocationContextType {
    userCoords: { lat: number; lng: number } | null;
    locationStatus: LocationStatus;
    cityName: string | null;
    requestLocation: () => void;
    setManualCity: (city: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('prompt');
    const [cityName, setCityName] = useState<string | null>(null);

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
                // Optional: Reverse geocode here to get city name
            },
            () => {
                setLocationStatus('denied');
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    };

    const setManualCity = (city: string) => {
        setCityName(city);
        // We could also geocode the city to get coords here
    };

    // Auto-request on mount if previously granted
    useEffect(() => {
        const checkPermissionAndRequest = async () => {
            if (typeof window !== 'undefined' && 'geolocation' in navigator) {
                try {
                    // Check if we already have permission to avoid surprising people with prompts
                    const status = await navigator.permissions.query({ name: 'geolocation' });
                    if (status.state === 'granted') {
                        requestLocation();
                    }
                } catch (e) {
                    // Fallback for browsers that don't support permissions.query
                    console.log('Permission check not supported, waiting for user click');
                }
            }
        };
        checkPermissionAndRequest();
    }, []);

    return (
        <LocationContext.Provider value={{
            userCoords,
            locationStatus,
            cityName,
            requestLocation,
            setManualCity
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
