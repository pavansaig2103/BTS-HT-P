const { supabase, isSupabaseConfigured } = require('../src/config/supabase');

async function testSupabase() {
  console.log('isSupabaseConfigured:', isSupabaseConfigured);
  if (!isSupabaseConfigured) {
    console.log('Supabase not configured, using inMemoryStore.');
    return;
  }

  const { data, error } = await supabase.from('users').select('*').limit(5);
  console.log('users query error:', error);
  console.log('users query data:', data);
}

testSupabase().catch(console.error);
