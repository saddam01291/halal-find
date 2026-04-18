'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';

export const GoogleMap = ({
    apiKey,
    className,
    children,
    center,
    ...props
}: {
    apiKey: string;
    className?: string;
    children?: React.ReactNode;
} & React.ComponentProps<typeof Map>) => {
    // Total Stability Guard: Validate coordinates
    const isValidCoord = (val: any) => typeof val === 'number' && isFinite(val);
    
    // If explicit center is provided, validate it. 
    // If invalid, we fallback to a safe default or prevent rendering the crashing Map.
    const safeCenter = center && isValidCoord(center.lat) && isValidCoord(center.lng) 
        ? center 
        : undefined;

    const safeDefaultCenter = props.defaultCenter && isValidCoord(props.defaultCenter.lat) && isValidCoord(props.defaultCenter.lng)
        ? props.defaultCenter
        : { lat: 40.7128, lng: -74.0060 }; // NYC Default

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                mapId="bf51a910020fa25a"
                {...props}
                center={safeCenter}
                defaultCenter={safeDefaultCenter}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                className={className}
            >
                {children}
            </Map>
        </APIProvider>
    );
};
