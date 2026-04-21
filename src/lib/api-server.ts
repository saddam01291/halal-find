import { createClient } from '@supabase/supabase-js';
import { DbPlace } from './supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a standard server/node client for data fetching in Server Components
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

export const PLACE_LIST_COLUMNS = 'id, created_at, name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, halal_status, halal_source, serves_alcohol, phone, email';

export async function getPlacesServer(): Promise<DbPlace[]> {
    const { data, error } = await supabaseServer
        .from('places')
        .select(PLACE_LIST_COLUMNS)
        .order('verified', { ascending: false })
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false });

    if (error) {
        console.error('Error fetching places on server:', error);
        return [];
    }
    return data || [];
}

export async function getPlaceByIdServer(id: string): Promise<DbPlace | null> {
    const { data, error } = await supabaseServer
        .from('places')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching place on server:', error);
        return null;
    }
    return data || null;
}

export async function getAllPlaceIdsForSitemap(): Promise<{ id: string, created_at: string | null }[]> {
    const { data, error } = await supabaseServer
        .from('places')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(50000);

    if (error) {
        console.error('Error fetching place IDs for sitemap:', error);
        return [];
    }
    return data || [];
}

// ─── City SEO Pages ──────────────────────

export interface SeoCityPage {
    id: string;
    city_slug: string;
    city_name: string;
    state: string | null;
    country: string | null;
    restaurant_count: number;
    top_cuisines: string[];
    top_restaurants: any[];
    ai_intro: string | null;
    ai_faq: { q: string; a: string }[];
    meta_title: string | null;
    meta_description: string | null;
    nearby_cities: { name: string; slug: string; count: number }[];
    avg_rating: number;
    generated_at: string;
}

export async function getCityPageBySlug(slug: string): Promise<SeoCityPage | null> {
    const { data, error } = await supabaseServer
        .from('seo_city_pages')
        .select('*')
        .eq('city_slug', slug)
        .single();

    if (error) {
        console.error('Error fetching city page:', error);
        return null;
    }
    return data || null;
}

export async function getPlacesByCity(cityName: string): Promise<DbPlace[]> {
    const { data, error } = await supabaseServer
        .from('places')
        .select(PLACE_LIST_COLUMNS)
        .eq('city', cityName)
        .order('verified', { ascending: false })
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching places by city:', error);
        return [];
    }
    return data || [];
}

export async function getAllCitySlugsForSitemap(): Promise<{ city_slug: string; generated_at: string | null }[]> {
    const { data, error } = await supabaseServer
        .from('seo_city_pages')
        .select('city_slug, generated_at')
        .order('restaurant_count', { ascending: false })
        .limit(10000);

    if (error) {
        console.error('Error fetching city slugs for sitemap:', error);
        return [];
    }
    return data || [];
}
