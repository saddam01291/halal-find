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

export function getValidImageUrl(url?: string | null, seed?: string, name?: string, cuisine?: string): string {
    // Categorized diverse pool of unique food photography
    const IMAGE_POOL = {
        FAST_FOOD: [
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', // Gourmet Burger
            'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80', // Burger
            'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80', // Fried Chicken
            'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?w=800&q=80', // Rolls
            'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80', // Shawarma
        ],
        INDIAN: [
            'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', // Biryani
            'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80', // Curry
            'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=800&q=80', // Indian Food
            'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', // Indian Curry
            'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', // Samosa
            'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80', // Biryani 2
        ],
        MEAT: [
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', // BBQ Kebab
            'https://images.unsplash.com/photo-1625398407796-82650a8c14ab?w=800&q=80', // Kebab Wrap
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', // Grilled Steak
            'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80', // Steak
        ],
        VEG: [
            'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=800&q=80', // Salad
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', // Veg Bowl
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80', // Fresh Salad
        ],
        GENERAL: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', // Platter
            'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', // Gourmet
            'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80', // Street Food
        ]
    };

    const ALL_IMAGES = [...IMAGE_POOL.FAST_FOOD, ...IMAGE_POOL.INDIAN, ...IMAGE_POOL.MEAT, ...IMAGE_POOL.VEG, ...IMAGE_POOL.GENERAL];

    function hashStr(s: string): number {
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            const char = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return Math.abs(hash);
    }

    const selectByKeyword = () => {
        const text = ((name || '') + ' ' + (cuisine || '')).toLowerCase();
        
        if (text.includes('biryani') || text.includes('indian') || text.includes('mughlai') || text.includes('rice')) {
            return IMAGE_POOL.INDIAN[hashStr(seed || '1') % IMAGE_POOL.INDIAN.length];
        }
        if (text.includes('fast food') || text.includes('burger') || text.includes('chicken') || text.includes('roll') || text.includes('pizza') || text.includes('shawarma')) {
            return IMAGE_POOL.FAST_FOOD[hashStr(seed || '1') % IMAGE_POOL.FAST_FOOD.length];
        }
        if (text.includes('kebab') || text.includes('steak') || text.includes('meat') || text.includes('grill')) {
            return IMAGE_POOL.MEAT[hashStr(seed || '1') % IMAGE_POOL.MEAT.length];
        }
        if (text.includes('veg') || text.includes('salad')) {
            return IMAGE_POOL.VEG[hashStr(seed || '1') % IMAGE_POOL.VEG.length];
        }
        if (text.includes('momo') || text.includes('chinese') || text.includes('asian') || text.includes('chow') || text.includes('darjeeling')) {
            // General appetizing food for Asian/Himalayan places
            return IMAGE_POOL.GENERAL[hashStr(seed || '1') % IMAGE_POOL.GENERAL.length];
        }
        
        // Default to safe, appetizing GENERAL food instead of picking randomly from ALL images (which might be raw veggies)
        return IMAGE_POOL.GENERAL[hashStr(seed || '1') % IMAGE_POOL.GENERAL.length];
    };

    if (!url || url === '' || url.includes('unsplash.com') || url.includes('maps.googleapis.com')) {
        return selectByKeyword();
    }

    if (url.startsWith('/')) return url;
    return url;
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
 * Heavily weights Quality (Verified/Rated) to ensure trusted results stay at the top.
 */
export function calculateRelevance(
    place: { lat?: number | null; lng?: number | null; rating: number; verified: boolean; review_count: number },
    userCoords?: { lat: number; lng: number } | null
): { score: number; distance: number | null } {
    // Quality Boosts (MASSIVE override for mere proximity)
    const verificationBoost = place.verified ? 5000 : 0;
    const ratingBoost = (place.rating > 0) ? 1000 : 0;

    if (!userCoords || place.lat === undefined || place.lat === null || place.lng === undefined || place.lng === null) {
        // Fallback for search or no location
        const score = verificationBoost + ratingBoost + (place.rating * 50) + (place.review_count / 10);
        return { score, distance: null };
    }

    const distance = getDistance(userCoords.lat, userCoords.lng, place.lat, place.lng);
    
    // Proximity Score (1000 ceiling, same as before)
    // Decreases as we move away from user
    const distanceScore = distance <= 50 
        ? Math.max(0, 1000 - (distance * 20)) 
        : -10000; 

    // Final Score: Quality is the primary sort, Proximity is the secondary (tie-breaker)
    // A verified place at 40km (5000 pts) will now beat an unverified place at 1km (980 pts)
    const ratingScore = (place.rating || 0) * 20;
    const reviewBonus = Math.min(50, (place.review_count || 0) / 10);
    
    return { 
        score: verificationBoost + ratingBoost + distanceScore + ratingScore + reviewBonus,
        distance
    };
}
