
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://idibtxvvijdnzprtybju.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaWJ0eHZ2aWpkbnpwcnR5Ymp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjk3MTYsImV4cCI6MjA2MTk0NTcxNn0.nY-Gz8P70lNbjOhqJfD_YUEXLDUxNMWK56A8JLtOdlg';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Add enhanced error logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event, session);
});
