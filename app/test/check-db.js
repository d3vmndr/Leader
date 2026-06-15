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
  console.error('Failed to read .env.local', err);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const tables = ['profiles', 'challenges', 'questions', 'options', 'responses', 'leaderboard_entries', 'badges', 'user_badges', 'district_stats', 'blogs', 'notices', 'challenge_results'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .limit(1);
      
      if (error) {
        console.log(`Table "${table}": Error - ${error.message} (${error.code})`);
      } else {
        console.log(`Table "${table}": Success! Count: ${count}`);
      }
    } catch (err) {
      console.log(`Table "${table}": Failed - ${err.message}`);
    }
  }
}

run();
