import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
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
    added_by: 'owner' | 'community';
    owner_id?: string;
    certificate_url?: string;
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
    created_at: string;
}

export interface DbVerificationRequest {
    id: string;
    owner_name: string;
    restaurant_name: string;
    certificate_url: string;
    status: 'pending' | 'approved' | 'rejected';
    user_id: string;
    created_at: string;
}
