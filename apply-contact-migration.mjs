import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://eqrnhujkvvuipymdtekk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcm5odWprdnZ1aXB5bWR0ZWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjI2MjUsImV4cCI6MjA4NjYzODYyNX0.LH0lmt_ua_2fhI0-e297h7S3P4J7a-47fl6p6gDs_Gs'
);

async function verify() {
    const { data: p, error: e1 } = await supabase.from('places').select('id, phone, email').limit(1);
    const { data: v, error: e2 } = await supabase.from('verification_requests').select('id, phone, email').limit(1);

    console.log('places:', e1 ? '❌ ' + e1.message : '✅ phone/email columns exist');
    console.log('verification_requests:', e2 ? '❌ ' + e2.message : '✅ phone/email columns exist');
}
verify();
