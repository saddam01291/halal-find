'use client';

import { supabase } from './supabase';
import { DbPlace, DbProfile, DbVerificationRequest, DbReview } from './supabase';

export const PLACE_LIST_COLUMNS = 'id, created_at, name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, halal_status, halal_source, serves_alcohol';

// --- Places ---

export async function getPlaces(coords?: {lat: number, lng: number}): Promise<DbPlace[]> {
    let query = supabase
        .from('places')
        .select(PLACE_LIST_COLUMNS);

    if (coords && coords.lat && coords.lng) {
        // 1. Smart Radar: Look within a 50km bounding box first to prioritize local spots
        const radiusKm = 50; 
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos(coords.lat * (Math.PI / 180)));

        query = query
            .gte('lat', coords.lat - latDelta)
            .lte('lat', coords.lat + latDelta)
            .gte('lng', coords.lng - lngDelta)
            .lte('lng', coords.lng + lngDelta);
    } else {
        // No location: only show quality places (rated OR verified).
        // This prevents thousands of zero-rated OSM imports from polluting the no-location view.
        query = query.or('rating.gt.0,verified.eq.true');
    }

    let { data, error } = await query
        .order('verified', { ascending: false })
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false })
        .order('name', { ascending: true })
        .limit(200);

    // 2. Global Fallback: If nearby search returned 0 (e.g. user is in a new city), 
    // fetch the absolute best of the platform globally (quality filter applied).
    if (coords && data && data.length === 0) {
        const { data: fallbackData } = await supabase
            .from('places')
            .select(PLACE_LIST_COLUMNS)
            .or('rating.gt.0,verified.eq.true')
            .order('verified', { ascending: false })
            .order('rating', { ascending: false })
            .order('review_count', { ascending: false })
            .order('name', { ascending: true })
            .limit(100);
        return fallbackData || [];
    }

    if (error) {
        console.error('Error fetching places:', error);
        return [];
    }

    return data || [];
}

export async function searchPlaces(query: string, coords?: {lat: number, lng: number}): Promise<DbPlace[]> {
    let supabaseQuery = supabase
        .from('places')
        .select(PLACE_LIST_COLUMNS)
        .or(`name.ilike.%${query}%,cuisine.ilike.%${query}%,city.ilike.%${query}%`);

    if (coords && coords.lat && coords.lng) {
        // Apply 50km bounding box to search results as well to prioritize local matches
        const radiusKm = 50; 
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos(coords.lat * (Math.PI / 180)));

        supabaseQuery = supabaseQuery
            .gte('lat', coords.lat - latDelta)
            .lte('lat', coords.lat + latDelta)
            .gte('lng', coords.lng - lngDelta)
            .lte('lng', coords.lng + lngDelta);
    }

    let { data, error } = await supabaseQuery
        .order('verified', { ascending: false })
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false })
        .order('name', { ascending: true })
        .limit(1000);

    // 2. Global Fallback: If nearby search returned 0 (e.g. user is searching for a distant city), 
    // fetch the matches globally without the bounding box.
    if (coords && data && data.length === 0) {
        const { data: globalData } = await supabase
            .from('places')
            .select(PLACE_LIST_COLUMNS)
            .or(`name.ilike.%${query}%,cuisine.ilike.%${query}%,city.ilike.%${query}%`)
            .order('verified', { ascending: false })
            .order('rating', { ascending: false })
            .order('review_count', { ascending: false })
            .order('name', { ascending: true })
            .limit(100);
        return globalData || [];
    }

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

export async function updatePlace(id: string, updates: Partial<Omit<DbPlace, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
        .from('places')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deletePlace(id: string) {
    // Also delete associated verification requests first
    await supabase
        .from('verification_requests')
        .delete()
        .eq('place_id', id);

    const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

export async function addPlaceAsAdmin(place: Omit<DbPlace, 'id' | 'created_at' | 'review_count' | 'rating'>) {
    const { data, error } = await supabase
        .from('places')
        .insert({
            ...place,
            verified: true,
            verification_status: 'owner_verified',
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

    // 3. If approved, update the corresponding place OR create it
    if (status === 'approved') {
        // Build update payload based on request fields (now with more data!)
        const placeUpdate: Record<string, any> = {
            name: request.restaurant_name,
            cuisine: request.cuisine,
            address: request.address,
            city: request.city,
            lat: request.lat,
            lng: request.lng,
            tags: request.tags,
            halal_status: request.halal_status,
            serves_alcohol: request.serves_alcohol,
            halal_source: request.halal_source,
            verified: true,
            image: request.certificate_url // Use certificate as image by default for community additions
        };

        if (request.type === 'claim' && request.place_id) {
            placeUpdate.verification_status = 'owner_verified';
            placeUpdate.owner_id = request.user_id;
            
            const { error: placeError } = await supabase
                .from('places')
                .update(placeUpdate)
                .eq('id', request.place_id);

            if (placeError) console.error('Error updating place on claim approval:', placeError);
        } else if (request.type === 'community_addition' || request.type === 'new_place') {
            placeUpdate.verification_status = 'community_verified';
            
            if (request.place_id) {
                // Update existing place if it was somehow linked
                const { error: placeError } = await supabase
                    .from('places')
                    .update(placeUpdate)
                    .eq('id', request.place_id);
                if (placeError) console.error('Error updating existing place on community approval:', placeError);
            } else {
                // Create NEW place
                const { data: newPlace, error: placeError } = await supabase
                    .from('places')
                    .insert({
                        ...placeUpdate,
                        review_count: 0,
                        rating: 0
                    })
                    .select()
                    .single();
                
                if (placeError) {
                    console.error('Error creating new place on approval:', placeError);
                } else if (newPlace) {
                    // Link the request to the new place id
                    await supabase
                        .from('verification_requests')
                        .update({ place_id: newPlace.id })
                        .eq('id', id);
                }
            }
        }
    }

    return data;
}

export async function updateVerificationRequest(id: string, updates: Partial<DbVerificationRequest>) {
    const { data, error } = await supabase
        .from('verification_requests')
        .update(updates)
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

export async function updateUserRole(id: string, role: 'admin' | 'user') {
    const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// --- Reviews (Admin) ---

export async function deleteReview(id: string) {
    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
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
    console.log('--- STORAGE UPLOAD DEBUG ---');
    console.log('File Name:', file.name);
    console.log('File Size:', (file.size / 1024).toFixed(2), 'KB');
    console.log('File Type:', file.type);

    let fileExt = file.name.split('.').pop()?.toLowerCase();
    // Normalize .wbp to .webp if needed
    if (fileExt === 'wbp') fileExt = 'webp';
    if (!fileExt) fileExt = 'jpg';

    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `rest-${Date.now()}-${fileName}`;

    console.log('Target Bucket: restaurant-images');
    console.log('Target Path:', filePath);
    console.log('Detected MIME:', file.type || 'image/webp');

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('restaurant-images')
        .upload(filePath, file, {
            contentType: file.type || 'image/webp',
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        console.error('SUPABASE STORAGE ERROR:', JSON.stringify(uploadError, null, 2));
        throw new Error(`STORAGE_FAIL: ${uploadError.message} (Bucket: restaurant-images, Path: ${filePath}, Hint: Check if bucket exists and RLS is applied)`);
    }

    console.log('UPLOAD SUCCESS:', uploadData);

    const { data } = supabase.storage
        .from('restaurant-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
}
