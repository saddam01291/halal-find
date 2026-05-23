'use client';

import { supabase } from './supabase';
import { DbPlace, DbProfile, DbVerificationRequest, DbReview } from './supabase';

export const PLACE_LIST_COLUMNS = 'id, created_at, name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, halal_status, halal_source, serves_alcohol, phone, email';

// ─── Places ───────────────────────────────────────────────────────────────────

export async function getPlaces(coords?: {lat: number, lng: number}): Promise<DbPlace[]> {
    let query = supabase
        .from('places')
        .select(PLACE_LIST_COLUMNS)
        .not('address', 'is', null)
        .neq('address', '')
        .neq('address', 'Address not listed');

    // We fetch quality/recent places regardless of location.
    // The frontend (HomeClient) automatically calculates exact distance and sorts them so the nearest are on top.
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    query = query.or(`rating.gt.0,verified.eq.true,created_at.gte.${thirtyDaysAgo}`);

    let { data, error } = await query
        .order('verified', { ascending: false })
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false })
        .order('name', { ascending: true })
        .limit(200);

    if (error) {
        console.error('Error fetching places:', error);
        return [];
    }

    return data || [];
}

// Admin-only: fetch ALL places without quality filters
// Uses pagination to bypass Supabase's 1000-row default limit
export async function getAllPlacesAdmin(): Promise<DbPlace[]> {
    const PAGE_SIZE = 1000;
    let allData: DbPlace[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabase
            .from('places')
            .select(PLACE_LIST_COLUMNS)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error(`Error fetching admin places (page ${page}):`, error);
            break;
        }

        if (data && data.length > 0) {
            allData = allData.concat(data);
        }

        hasMore = (data?.length || 0) === PAGE_SIZE;
        page++;
    }

    return allData;
}


export async function searchPlaces(query: string, coords?: {lat: number, lng: number}): Promise<DbPlace[]> {
    const { data, error } = await supabase.rpc('search_places_v2', {
        search_query: query,
        user_lat: coords?.lat || null,
        user_lng: coords?.lng || null,
        radius_km: 50.0
    });

    if (error || !data || data.length === 0) {
        if (error) console.error('Error searching places via RPC:', error);
        
        // Guaranteed Universal Fallback for typos and errors
        const { data: allData } = await supabase
            .from('places')
            .select(PLACE_LIST_COLUMNS)
            .not('address', 'is', null)
            .neq('address', '')
            .neq('address', 'Address not listed')
            .limit(1000);

        if (!allData) return [];

        const cleansedSearch = query.replace(/\s+/g, '').toLowerCase();

        // Subsequence matcher (handles missing letters like "drgapur" for "durgapur")
        const isFuzzyMatch = (str: string, search: string) => {
            if (!str) return false;
            let i = 0, j = 0;
            while (i < str.length && j < search.length) {
                if (str[i] === search[j]) j++;
                i++;
            }
            return j === search.length;
        };

        const fuzzyFiltered = allData.filter(p => {
            const nameStr = (p.name || '').replace(/\s+/g, '').toLowerCase();
            const cityStr = (p.city || '').replace(/\s+/g, '').toLowerCase();
            const addrStr = (p.address || '').replace(/\s+/g, '').toLowerCase();
            const cuisineStr = (p.cuisine || '').replace(/\s+/g, '').toLowerCase();

            return isFuzzyMatch(nameStr, cleansedSearch) ||
                   isFuzzyMatch(cityStr, cleansedSearch) ||
                   isFuzzyMatch(addrStr, cleansedSearch) ||
                   isFuzzyMatch(cuisineStr, cleansedSearch);
        });

        return fuzzyFiltered.slice(0, 50);
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
    // Delete associated verification requests first
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

// ─── Deduplication ────────────────────────────────────────────────────────────

/**
 * Checks if a place with the same name + similar address/city already exists.
 * Returns the matched place record (with id, name, city, address) or null.
 * Used by both the frontend modal (real-time) and the API submission guard.
 */
export async function checkDuplicatePlace(name: string, city: string, address?: string): Promise<any | null> {
    const trimmedName = name.trim();
    const trimmedCity = city.trim();
    const trimmedAddress = (address || '').trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 3) return null;

    // Fetch all places with a case-insensitive exact name match
    const { data: places, error } = await supabase
        .from('places')
        .select('id, name, city, address, verification_status')
        .ilike('name', trimmedName);

    if (error || !places || places.length === 0) return null;

    for (const place of places) {
        if (trimmedAddress && trimmedAddress.length > 5 && place.address) {
            const existingAddress = place.address.trim().toLowerCase();

            // 1. Exact or Substring Address Match
            if (
                trimmedAddress === existingAddress ||
                trimmedAddress.includes(existingAddress) ||
                existingAddress.includes(trimmedAddress)
            ) {
                return place;
            }

            // 2. Word overlap match — same city AND share significant address words
            if (place.city && place.city.trim().toLowerCase() === trimmedCity.toLowerCase()) {
                const newWords = trimmedAddress.split(/\W+/).filter((w: string) => w.length > 3);
                const existWords = existingAddress.split(/\W+/).filter((w: string) => w.length > 3);

                let sharedWords = 0;
                for (const word of newWords) {
                    if (existWords.includes(word)) sharedWords++;
                }

                // 3+ shared significant words (street name, landmark, building) = same location
                if (sharedWords >= 3) {
                    return place;
                }
            }
        } else if (!trimmedAddress || trimmedAddress.length <= 5) {
            // No address provided — fall back to city-level name match
            if (place.city && place.city.trim().toLowerCase() === trimmedCity.toLowerCase()) {
                return place;
            }
        }
    }

    return null;
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

// ─── Reviews ──────────────────────────────────────────────────────────────────

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

// ─── Verification Requests ────────────────────────────────────────────────────

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

/**
 * Submit a community addition (a new place suggested by a user).
 * 
 * GATE: Enforces server-side duplicate check before inserting.
 * If a duplicate is found, throws a structured DuplicatePlaceError
 * so the frontend can redirect the user to claim the existing listing.
 */
export async function submitVerificationRequest(
    request: Omit<DbVerificationRequest, 'id' | 'created_at' | 'status' | 'user_id'>
) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // ── SYSTEMATIC DEDUPLICATION GATE ──────────────────────────────────────
    // Always enforce before any INSERT, regardless of frontend state.
    // This catches race conditions, direct API calls, and edge cases.
    if (request.restaurant_name && request.type !== 'claim') {
        const duplicate = await checkDuplicatePlace(
            request.restaurant_name,
            request.city || '',
            request.address || ''
        );

        if (duplicate) {
            // Throw a structured error the frontend can parse to show the claim CTA
            const err = new Error('DUPLICATE_PLACE_FOUND') as any;
            err.code = 'DUPLICATE_PLACE_FOUND';
            err.existingPlace = duplicate;
            throw err;
        }
    }
    // ── END DEDUPLICATION GATE ──────────────────────────────────────────────

    // Build insertion payload — only include defined fields
    const coreRequest: Record<string, any> = {
        restaurant_name: request.restaurant_name,
        owner_name: request.owner_name,
        certificate_url: request.certificate_url,
        place_id: request.place_id,
        type: request.type,
        cuisine: request.cuisine,
        address: request.address,
        city: request.city,
        lat: request.lat,
        lng: request.lng,
        tags: request.tags,
        halal_status: request.halal_status,
        serves_alcohol: request.serves_alcohol,
        halal_source: request.halal_source,
        phone: request.phone,
        email: request.email,
        user_id: user.id,
        status: 'pending' as const
    };

    const { data, error } = await supabase
        .from('verification_requests')
        .insert(coreRequest)
        .select()
        .single();

    if (error) throw error;

    // Store review fields (safe fallback if columns don't exist yet)
    if (data && (request.initial_review || request.initial_rating)) {
        const { error: reviewUpdateError } = await supabase
            .from('verification_requests')
            .update({
                initial_review: request.initial_review || '',
                initial_rating: request.initial_rating || 5
            })
            .eq('id', data.id);

        if (reviewUpdateError) {
            console.warn('Review fields not saved (run SQL migration):', reviewUpdateError.message);
        }
    }

    return data;
}

/**
 * Submit a business claim request.
 * Called when an owner wants to claim an existing community-added listing.
 * 
 * Validates:
 *  1. User is authenticated
 *  2. No pending claim already exists for this place by this user
 *  3. Place is not already owner-verified (can't reclaim)
 */
export async function claimBusiness(params: {
    placeId: string;
    placeName: string;
    ownerName: string;
    phone?: string;
    email?: string;
    halalStatus?: string;
    halalSource?: string;
    certificateUrl?: string;
    initialReview?: string;
    initialRating?: number;
}): Promise<{ success: boolean; message: string; data?: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Please sign in to claim your business.' };

    // Check: is this place already owner-verified?
    const { data: place, error: placeError } = await supabase
        .from('places')
        .select('id, name, verification_status, owner_id')
        .eq('id', params.placeId)
        .single();

    if (placeError || !place) {
        return { success: false, message: 'Business listing not found.' };
    }

    if (place.verification_status === 'owner_verified') {
        return {
            success: false,
            message: 'This business has already been claimed by its owner. If you believe this is an error, please contact our support team.'
        };
    }

    // Check: does this user already have a pending claim for this place?
    const { data: existingClaim } = await supabase
        .from('verification_requests')
        .select('id, status')
        .eq('place_id', params.placeId)
        .eq('user_id', user.id)
        .eq('type', 'claim')
        .eq('status', 'pending')
        .maybeSingle();

    if (existingClaim) {
        return {
            success: false,
            message: 'You already have a pending claim request for this business. Our team will review it shortly.'
        };
    }

    // Insert the claim request
    const { data, error } = await supabase
        .from('verification_requests')
        .insert({
            user_id: user.id,
            restaurant_name: params.placeName,
            owner_name: params.ownerName,
            place_id: params.placeId,
            type: 'claim',
            status: 'pending',
            phone: params.phone || null,
            email: params.email || null,
            halal_status: params.halalStatus || null,
            halal_source: params.halalSource || null,
            certificate_url: params.certificateUrl || null,
            initial_review: params.initialReview || null,
            initial_rating: params.initialRating || null
        })
        .select()
        .single();

    if (error) {
        console.error('Error submitting claim:', error);
        // Handle unique constraint violation (duplicate pending claim)
        if (error.code === '23505') {
            return {
                success: false,
                message: 'A pending claim for this business already exists from your account.'
            };
        }
        return { success: false, message: `Claim submission failed: ${error.message}` };
    }

    return {
        success: true,
        message: 'Your claim has been submitted and is under review. We will notify you within 2–3 business days.',
        data
    };
}

export async function updateVerificationStatus(
    id: string,
    status: 'approved' | 'rejected',
    adminNote?: string
) {
    // 1. Fetch the request
    const { data: request, error: fetchError } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) throw fetchError;

    // 2. Update verification request status (triggers DB-level automation)
    const updatePayload: Record<string, any> = { status };
    if (adminNote) updatePayload.admin_note = adminNote;

    const { data, error } = await supabase
        .from('verification_requests')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    // 3. If approved, ensure the linked place is updated
    //    DB trigger handles verification_status + owner_id binding.
    //    JS layer handles: creating the place if missing, and review migration.
    if (status === 'approved') {
        let targetPlaceId = request.place_id;

        // Build place update payload
        const placeUpdate: Record<string, any> = { verified: true };
        if (request.restaurant_name) placeUpdate.name = request.restaurant_name;
        if (request.cuisine)         placeUpdate.cuisine = request.cuisine;
        if (request.address)         placeUpdate.address = request.address;
        if (request.city)            placeUpdate.city = request.city;
        if (request.lat)             placeUpdate.lat = request.lat;
        if (request.lng)             placeUpdate.lng = request.lng;
        if (request.tags)            placeUpdate.tags = request.tags;
        if (request.halal_status)    placeUpdate.halal_status = request.halal_status;
        if (request.serves_alcohol !== undefined) placeUpdate.serves_alcohol = request.serves_alcohol;
        if (request.halal_source)    placeUpdate.halal_source = request.halal_source;
        if (request.phone)           placeUpdate.phone = request.phone;
        if (request.email)           placeUpdate.email = request.email;
        if (request.certificate_url) placeUpdate.image = request.certificate_url;

        if (request.type === 'claim' && targetPlaceId) {
            placeUpdate.verification_status = 'owner_verified';
            placeUpdate.owner_id = request.user_id;

            const { error: placeError } = await supabase
                .from('places')
                .update(placeUpdate)
                .eq('id', targetPlaceId);
            if (placeError) console.error('Error updating place on claim approval:', placeError);

        } else if (request.type === 'community_addition' || request.type === 'new_place') {
            placeUpdate.verification_status = 'community_verified';

            if (targetPlaceId) {
                const { error: placeError } = await supabase
                    .from('places')
                    .update(placeUpdate)
                    .eq('id', targetPlaceId);
                if (placeError) console.error('Error updating existing place on community approval:', placeError);
            } else {
                // Fallback: Create new place if it didn't exist
                const { data: newPlace, error: placeError } = await supabase
                    .from('places')
                    .insert({ ...placeUpdate, review_count: 0, rating: 0 })
                    .select()
                    .single();

                if (placeError) {
                    console.error('Error creating new place on approval:', placeError);
                } else if (newPlace) {
                    targetPlaceId = newPlace.id;
                    await supabase
                        .from('verification_requests')
                        .update({ place_id: targetPlaceId })
                        .eq('id', id);
                }
            }
        }

        // Automatic Review Migration: move the initial review to the reviews table
        if (targetPlaceId && (request.initial_review || request.initial_rating)) {
            try {
                const { data: existingReview } = await supabase
                    .from('reviews')
                    .select('id')
                    .eq('place_id', targetPlaceId)
                    .eq('user_id', request.user_id)
                    .limit(1);

                if (!existingReview || existingReview.length === 0) {
                    const { error: reviewError } = await supabase.from('reviews').insert({
                        place_id: targetPlaceId,
                        user_id: request.user_id,
                        user_name: request.owner_name || 'Community Contributor',
                        rating: request.initial_rating || 5,
                        comment: request.initial_review || 'Verified Halal Restaurant.',
                        is_halal_confirmed: true,
                        is_non_halal_report: false,
                        is_dispute_resolved: false
                    });

                    if (reviewError) {
                        console.error('Error creating automatic review:', reviewError);
                    }
                    // Note: rating/review_count is now handled by the DB trigger on_review_changed
                }
            } catch (reviewErr) {
                console.error('Critical failure in review migration:', reviewErr);
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

// ─── Safety & Disputes ────────────────────────────────────────────────────────

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

// ─── Reviews (User Edit + Admin Delete) ───────────────────────────────────────

export async function updateReview(
    id: string,
    updates: {
        rating?: number;
        comment?: string;
        is_halal_confirmed?: boolean;
        is_non_halal_report?: boolean;
    }
) {
    const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteReview(id: string) {
    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

// ─── Profiles ─────────────────────────────────────────────────────────────────

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

// ─── Admin Settings ───────────────────────────────────────────────────────────

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

// ─── Storage ──────────────────────────────────────────────────────────────────

export async function uploadImage(file: File) {
    console.log('--- STORAGE UPLOAD DEBUG ---');
    console.log('File Name:', file.name);
    console.log('File Size:', (file.size / 1024).toFixed(2), 'KB');
    console.log('File Type:', file.type);

    let fileExt = file.name.split('.').pop()?.toLowerCase();
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

export async function getPopularCities(): Promise<{city_name: string, city_slug: string, restaurant_count: number}[]> {
    const { data, error } = await supabase
        .from('seo_city_pages')
        .select('city_name, city_slug, restaurant_count')
        .order('restaurant_count', { ascending: false })
        .limit(12);

    if (error) {
        console.error('Error fetching popular cities:', error);
        return [];
    }
    return data || [];
}