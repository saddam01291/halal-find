'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';

export const GoogleMap = ({
    apiKey,
    className,
    children,
    ...props
}: {
    apiKey: string;
    className?: string;
    children?: React.ReactNode;
} & React.ComponentProps<typeof Map>) => {
    return (
        <APIProvider apiKey={apiKey}>
            <Map
                mapId="bf51a910020fa25a" // Demo Map ID for development
                defaultCenter={{ lat: 40.7128, lng: -74.0060 }}
                defaultZoom={13}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                className={className}
                {...props}
            >
                {children}
            </Map>
        </APIProvider>
    );
};
