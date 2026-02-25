'use client';

import { supabase } from './supabase';
import { DbPlace, DbProfile, DbVerificationRequest, DbReview } from './supabase';

export const PLACE_LIST_COLUMNS = 'id, created_at, name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, halal_status, halal_source';

// --- Places ---

export async function getPlaces(): Promise<DbPlace[]> {
    const { data, error } = await supabase
        .from('places')
        .select(PLACE_LIST_COLUMNS)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching places:', error);
        return [];
    }
    return data || [];
}

export async function searchPlaces(query: string): Promise<DbPlace[]> {
    const { data, error } = await supabase
        .from('places')
        .select(PLACE_LIST_COLUMNS)
        .or(`name.ilike.%${query}%,cuisine.ilike.%${query}%,city.ilike.%${query}%`)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error searching places:', error);
        return [];
    }
    return data || [];
}

export async function getPlaceById(id: string): Promise<DbPlace | null> {
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching place:', error);
        return null;
    }
    return data;
}

export async function addPlace(place: Omit<DbPlace, 'id' | 'created_at' | 'review_count' | 'rating' | 'verified' | 'verification_status'>) {
    const { data, error } = await supabase
        .from('places')
        .insert({
            ...place,
            verified: false,
            verification_status: 'unverified',
            review_count: 0,
            rating: 0
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// --- Reviews ---

export async function getReviewsForPlace(placeId: string): Promise<DbReview[]> {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('place_id', placeId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
    return data || [];
}

export async function createReview(review: Omit<DbReview, 'id' | 'created_at' | 'user_id' | 'user_name' | 'user_avatar'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fetch user profile for name/avatar
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

export async function submitVerificationRequest(request: Omit<DbVerificationRequest, 'id' | 'created_at' | 'status' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('verification_requests')
        .insert({
            ...request,
            user_id: user.id,
            status: 'pending'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateVerificationStatus(id: string, status: 'approved' | 'rejected') {
    // 1. Fetch the request to know which place to update
    const { data: request, error: fetchError } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) throw fetchError;

    // 2. Update the verification request status
    const { data, error } = await supabase
        .from('verification_requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    // 3. If approved, update the corresponding place
    if (status === 'approved' && request.place_id) {
        const { error: placeError } = await supabase
            .from('places')
            .update({
                verified: true,
                verification_status: 'owner_verified',
                owner_id: request.user_id,
                certificate_url: request.certificate_url
            })
            .eq('id', request.place_id);

        if (placeError) {
            console.error('Error updating place status during verification approval:', placeError);
        }
    }

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
        traffic: 'Real-time'
    };
}

// --- Admin Settings (Admin) ---

export async function getAdminSettings(): Promise<Record<string, any>> {
    const { data, error } = await supabase
        .from('admin_settings')
        .select('*');

    if (error) {
        console.error('Error fetching admin settings:', error);
        return {};
    }

    return (data || []).reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
}

export async function updateAdminSettings(settings: Record<string, any>) {
    const { data: { user } } = await supabase.auth.getUser();

    const promises = Object.entries(settings).map(([key, value]) =>
        supabase
            .from('admin_settings')
            .upsert({
                key,
                value,
                updated_at: new Date().toISOString(),
                updated_by: user?.id
            })
    );

    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error).map(r => r.error);

    if (errors.length > 0) {
        console.error('Errors updating admin settings:', errors);
        throw new Error('Failed to update some settings');
    }

    return true;
}

// --- Storage ---

export async function uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `rest-${Date.now()}-${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('restaurant-images')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('restaurant-images')
        .getPublicUrl(filePath);

    return publicUrl;
}
