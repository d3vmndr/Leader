const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
        supabaseUrl = val;
      } else if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
        supabaseAnonKey = val;
      }
    }
  }
} catch (err) {
  console.error(err);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  // Try to inspect the columns of blogs, notices, and other tables by attempting a select
  const tables = ['blogs', 'notices', 'profiles', 'challenges', 'questions', 'options', 'responses', 'leaderboard_entries', 'badges', 'user_badges', 'district_stats'];
  
  for (const table of tables) {
    console.log(`\n--- Inspecting ${table} ---`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Error: ${error.message} (${error.code})`);
    } else {
      console.log(`Success! Data:`, data);
    }
  }
}

run();
