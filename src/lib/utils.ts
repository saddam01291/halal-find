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
    // Large, diverse pool of unique food photography
    const FALLBACK_IMAGES = [
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', // Grilled Steak
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', // Pizza
        'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=800&q=80', // Salad
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', // Bowl
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', // Dessert
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80', // Sandwich
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', // Gourmet Plate
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', // Food Platter
        'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80', // Breakfast
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80', // Fresh Salad
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', // Veg Bowl
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', // City Restaurant
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', // Fine Dining
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', // BBQ Kebab
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', // Biryani
        'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80', // Curry
        'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80', // Noodles
        'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80', // Rice Dish
        'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=800&q=80', // Indian Food
        'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80', // Shawarma
        'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80', // Burger
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', // Gourmet Burger
        'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80', // Fried Chicken
        'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80', // Tacos
        'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80', // Pasta
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', // Restaurant Interior
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80', // Café
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // Restaurant
        'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?w=800&q=80', // Rolls
        'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80', // Soup
        'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80', // Street Food
        'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80', // Steak
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', // Indian Curry
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', // Samosa
        'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80', // Biryani 2
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80', // Halal Meat
        'https://images.unsplash.com/photo-1625398407796-82650a8c14ab?w=800&q=80', // Kebab Wrap
        'https://images.unsplash.com/photo-1504544750208-dc0358ad5f72?w=800&q=80', // Hummus
        'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=80', // Turkish Food
        'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=800&q=80', // Middle Eastern
    ];

    // Hash function: combines seed (place ID) with the url itself so that
    // restaurants sharing the same DB image URL get visually different fallbacks.
    function hashStr(s: string): number {
        let h = 0;
        for (let i = 0; i < s.length; i++) {
            h = s.charCodeAt(i) + ((h << 5) - h);
        }
        return Math.abs(h);
    }

    if (!url || url === '') {
        // No image at all — use place ID as seed
        const s = seed || 'default';
        return FALLBACK_IMAGES[hashStr(s) % FALLBACK_IMAGES.length];
    }

    if (url.startsWith('/')) return url;

    try {
        const parsed = new URL(url);
        // If it's a real custom URL (not a generic Unsplash photo), use it directly
        if (!url.includes('unsplash.com')) return url;

        // For Unsplash URLs: check if this exact URL is a "shared" one that many places use.
        // Use the URL path + place seed to pick a unique image from the pool instead.
        const combined = (seed || '') + parsed.pathname;
        return FALLBACK_IMAGES[hashStr(combined) % FALLBACK_IMAGES.length];
    } catch (e) {
        const s = seed || 'default';
        return FALLBACK_IMAGES[hashStr(s) % FALLBACK_IMAGES.length];
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

/**
 * Calculates a relevance score for a place based on proximity, rating, and verification.
 * Heavily weights proximity to ensure local results appear first.
 */
export function calculateRelevance(
    place: { lat?: number | null; lng?: number | null; rating: number; verified: boolean; review_count: number },
    userCoords?: { lat: number; lng: number } | null
): { score: number; distance: number | null } {
    if (!userCoords || place.lat === undefined || place.lat === null || place.lng === undefined || place.lng === null) {
        // Fallback for search or no location: High-weight on rating and verification
        const score = (place.rating * 20) + (place.verified ? 100 : 0) + (place.review_count / 10);
        return { score, distance: null };
    }

    const distance = getDistance(userCoords.lat, userCoords.lng, place.lat, place.lng);
    
    // EXTREMELY Aggressive Proximity Score (1000 ceiling)
    // 0km -> 1000 pts
    // 10km -> 800 pts
    // 50km -> 0 pts
    // Beyond 50km -> Huge penalty (-10000)
    const distanceScore = distance <= 50 
        ? Math.max(0, 1000 - (distance * 20)) 
        : -10000; 

    // Quality Score (Max 200 ceiling)
    const ratingScore = (place.rating || 0) * 20; // 5 star = 100
    const verificationBonus = place.verified ? 50 : 0;
    const reviewBonus = Math.min(50, (place.review_count || 0) / 10);
    
    return { 
        score: distanceScore + ratingScore + verificationBonus + reviewBonus,
        distance
    };
}
