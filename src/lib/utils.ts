import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDistanceToNow(date: Date | string | number, options?: { addSuffix?: boolean }): string {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const suffix = options?.addSuffix ? ' ago' : '';

    if (years > 0) return `${years} year${years > 1 ? 's' : ''}${suffix}`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''}${suffix}`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}${suffix}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}${suffix}`;
    return 'just now';
}

export function getDistance(lat1: any, lon1: any, lat2: any, lon2: any): number {
    const R = 6371; // Radius of the earth in km
    const nLat1 = Number(lat1);
    const nLon1 = Number(lon1);
    const nLat2 = Number(lat2);
    const nLon2 = Number(lon2);

    if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) return 9999;

    const dLat = deg2rad(nLat2 - nLat1);
    const dLon = deg2rad(nLon2 - nLon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(nLat1)) * Math.cos(deg2rad(nLat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

export function getValidImageUrl(url?: string | null, seed?: string): string {
    const FALLBACK_IMAGES = [
        '/assets/placeholders/burger.png',
        '/assets/placeholders/biryani.png',
        '/assets/placeholders/cafe.png',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', // Steak/Meat
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', // Pizza/Italian
        'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=800&q=80', // Salad/Healthy
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', // Bowl
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', // Dessert
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80', // Sandwich
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', // Gourmet
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', // Cooking/Platter
        'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80'  // Breakfast
    ];

    if (!url || url === '') {
        if (!seed) return FALLBACK_IMAGES[0];
        // Simple hash to pick an image based on seed
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % FALLBACK_IMAGES.length;
        return FALLBACK_IMAGES[index];
    }

    if (url.startsWith('/')) return url;

    try {
        new URL(url);
        return url;
    } catch (e) {
        return FALLBACK_IMAGES[0];
    }
}

export function calculateTrustScore(place: any, confirmations: number = 0): number {
    let score = 30; // Base score for being listed

    // Verification Boost
    if (place.verified || place.verification_status === 'verified') score += 40;
    else if (place.verification_status === 'pending') score += 10;

    // Community Boost (max 20 points)
    score += Math.min(confirmations * 4, 20);

    // Safety Transparency Boost (max 10 points)
    if (!place.serves_alcohol) score += 5;
    if (place.contamination_risk === 'none') score += 5;

    // Penalty for disputes
    // (Note: activeDispute logic moved to component for simplicity, 
    // but we can pass it here if needed)

    return Math.min(score, 100);
}

export function getAreaFromAddress(address?: string | null, city?: string | null): string {
    if (!address) return city || 'Unknown Location';

    // Split by common delimiters
    const segments = address.split(/[,,|]/);
    
    // Clean segments
    const cleanedSegments = segments
        .map(s => s.trim())
        .filter(s => s.length > 0 && !/^\d+$/.test(s)); // Filter out standalone numbers (house numbers)

    if (cleanedSegments.length === 0) return city || address;

    // Return the first interesting segment if it's not just the city name again
    const firstSegment = cleanedSegments[0];
    if (city && firstSegment.toLowerCase() === city.toLowerCase() && cleanedSegments.length > 1) {
        return cleanedSegments[1];
    }

    return firstSegment;
}
