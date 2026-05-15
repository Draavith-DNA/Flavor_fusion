import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are still placeholders or missing
const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key';

if (!isConfigured) {
  console.warn("Supabase is not yet configured. Please update your .env file with valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

// Only attempt to create the client if we have a potentially valid URL
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Fallback to null (with type cast) to avoid crashing the whole app bundle

