import { createClient } from '@supabase/supabase-js';
import { DbPlace } from './supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a standard server/node client for data fetching in Server Components
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

export const PLACE_LIST_COLUMNS = 'id, created_at, name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, halal_status, halal_source, serves_alcohol';

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
