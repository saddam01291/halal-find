import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runFixes() {
    console.log("1. Merging Dubai cities...");
    const { error: pError } = await supabase
        .from('places')
        .update({ city: 'Dubai' })
        .eq('city', 'دبي');
    
    if (pError) console.error("Error updating places:", pError);

    // Update seo_city_pages if they exist
    const { error: sError } = await supabase
        .from('seo_city_pages')
        .delete()
        .eq('city_name', 'دبي');
    
    if (sError) console.error("Error deleting old seo_city_page:", sError);

    console.log("2. Updating Verification Labels...");
    // Update all OSM imports
    const { error: osmError } = await supabase
        .from('places')
        .update({ verification_status: 'osm_import', verified: false })
        .like('halal_source', '%OpenStreetMap%');

    if (osmError) console.error("Error updating OSM imports:", osmError);

    console.log("3. Enforcing Community Verification 5+ Rule...");
    // Find all 'community_verified' places with < 5 review count and downgrade them
    const { error: commError } = await supabase
        .from('places')
        .update({ verification_status: 'unverified', verified: false })
        .eq('verification_status', 'community_verified')
        .lt('review_count', 5);
        
    if (commError) console.error("Error downgrading community verifications:", commError);

    console.log("Database fixes completed.");
}

runFixes();
