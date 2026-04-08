import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_i-F8QRck8hdj9RAH7-m2ew_zDRCwOtY";

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
