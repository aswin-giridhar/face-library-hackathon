import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sojhcgzpwgmlcqapqexo.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvamhjZ3pwd2dtbGNxYXBxZXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTA5OTIsImV4cCI6MjA4ODMyNjk5Mn0.UYwgAE1FqZ6C6LRa4u4UTyrPXilqQCXVJspc2-tI0as";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
