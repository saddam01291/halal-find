import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true,
    },
});

// Database types
export type VerificationStatus = 'unverified' | 'community_verified' | 'owner_verified';

export type HalalStatus = 'Full Halal' | 'Halal Menu' | 'Pork Free' | 'Not Halal';

export interface DbPlace {
    id: string;
    name: string;
    cuisine: string;
    address: string;
    city: string;
    rating: number;
    review_count: number;
    image: string;
    lat: number;
    lng: number;
    tags: string[];
    verified: boolean;
    verification_status: VerificationStatus;
    owner_id?: string;
    certificate_url?: string;
    halal_status?: HalalStatus;
    serves_alcohol?: boolean;
    halal_source?: string;
    contamination_risk?: 'none' | 'low' | 'moderate' | 'high';
    is_mixed_neighborhood?: boolean;
    created_at: string;
}

export interface DbReview {
    id: string;
    place_id: string;
    user_id: string;
    user_name: string;
    user_avatar?: string;
    rating: number;
    comment: string;
    is_halal_confirmed: boolean;
    is_non_halal_report: boolean;
    is_dispute_resolved: boolean;
    resolution_note?: string;
    created_at: string;
}

export interface DbVerificationRequest {
    id: string;
    owner_name: string;
    restaurant_name: string;
    certificate_url: string;
    status: 'pending' | 'approved' | 'rejected';
    user_id: string;
    place_id?: string;
    type: 'new_place' | 'claim' | 'community_addition';
    created_at: string;
}

export interface DbProfile {
    id: string;
    full_name: string;
    avatar_url: string;
    role: 'user' | 'admin';
    created_at: string;
}
