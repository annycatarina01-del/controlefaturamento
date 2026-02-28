/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://xlytnplsdzdqdsrdohof.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_o8SdhlmLjL1BF2YJy7rUmg_ZSQ2Cqsd";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
