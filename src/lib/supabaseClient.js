import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjdhpagvtbrcdwfvhoyc.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqZGhwYWd2dGJyY2R3ZnZob3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODI1NjksImV4cCI6MjA2NTU1ODU2OX0.OFylOtQvkNXGdblGjmUlmenX_tonZbaqwxO2Kjjf7HQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
