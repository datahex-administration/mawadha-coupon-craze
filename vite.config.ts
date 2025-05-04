
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Define environment variable defaults to use for development (can be overridden in .env files)
  define: {
    // This ensures environment variables are properly handled
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://idibtxvvijdnzprtybju.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaWJ0eHZ2aWpkbnpwcnR5Ymp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjk3MTYsImV4cCI6MjA2MTk0NTcxNn0.nY-Gz8P70lNbjOhqJfD_YUEXLDUxNMWK56A8JLtOdlg'),
  },
}));
