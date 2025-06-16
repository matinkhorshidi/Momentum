import { createClient } from '@supabase/supabase-js';

// Replace the hardcoded strings...
// const supabaseUrl = 'https://tjdhpagvtbrcdwfvhoyc.supabase.co';
// const supabaseAnonKey = '...';

// ...with these lines that read from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add a check to ensure the variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
