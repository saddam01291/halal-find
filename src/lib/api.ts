import { supabase, DbPlace, DbReview, DbVerificationRequest, DbProfile } from './supabase';


// --- Places ---

export async function getPlaces(): Promise<DbPlace[]> {
    console.log('API: Fetching all places...');
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('API Error fetching places:', error);
        return [];
    }

    console.log(`API: Fetched ${data?.length || 0} places`);
    return data || [];
}

export async function getPlaceById(id: string): Promise<DbPlace | null> {
    console.log(`API: Fetching place by ID: ${id}`);
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`API Error fetching place ${id}:`, error);
        return null;
    }

    console.log(`API: Fetched place: ${data?.name}`);
    return data;
}

export async function searchPlaces(query: string): Promise<DbPlace[]> {
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .or(`name.ilike.%${query}%,cuisine.ilike.%${query}%,city.ilike.%${query}%,address.ilike.%${query}%`)
        .order('rating', { ascending: false });

    if (error) {
        console.error('Error searching places:', error);
        return [];
    }

    return data || [];
}

// --- Reviews ---

export async function getReviewsForPlace(placeId: string): Promise<DbReview[]> {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('place_id', placeId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(`Error fetching reviews for place ${placeId}:`, error);
        return [];
    }

    return data || [];
}

export async function createReview(review: Omit<DbReview, 'id' | 'created_at' | 'user_name' | 'user_avatar'>) {
    // We need to fetch user details to store denormalized if needed, 
    // or rely on a join. The schema stores user_name/avatar directly.
    // Ideally, we get this from the current auth user profile.

    // For now, let's assume the caller passes necessary info or we fetch it here.
    // But typically RLS handles auth.uid().
    // The schema requires user_name, user_avatar.

    // Let's fetch the profile of the current user first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

    const { data, error } = await supabase
        .from('reviews')
        .insert({
            ...review,
            user_id: user.id,
            user_name: profile?.full_name || 'Anonymous',
            user_avatar: profile?.avatar_url,
            is_halal_confirmed: review.is_halal_confirmed ?? false,
            is_non_halal_report: review.is_non_halal_report ?? false
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// --- Verification Requests (Admin) ---

export async function getPendingVerifications(): Promise<DbVerificationRequest[]> {
    const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching pending verifications:', error);
        return [];
    }

    return data || [];
}

export async function updateVerificationStatus(id: string, status: 'approved' | 'rejected') {
    const { data, error } = await supabase
        .from('verification_requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// --- Safety & Disputes (Admin) ---

export async function getDisputedReviews(): Promise<DbReview[]> {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_non_halal_report', true)
        .eq('is_dispute_resolved', false)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching disputed reviews:', error);
        return [];
    }

    return data || [];
}

export async function resolveDispute(id: string, note: string) {
    const { data, error } = await supabase
        .from('reviews')
        .update({
            is_dispute_resolved: true,
            resolution_note: note
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// --- Profiles (Admin) ---

export async function getProfiles(): Promise<DbProfile[]> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }

    return data || [];
}

export async function getSystemStats() {
    const [
        { count: placesCount },
        { count: usersCount },
        { count: verificationsCount }
    ] = await Promise.all([
        supabase.from('places').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('verification_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    return {
        places: placesCount || 0,
        users: usersCount || 0,
        verifications: verificationsCount || 0,
        traffic: '45k' // Mock or from analytics if available
    };
}
