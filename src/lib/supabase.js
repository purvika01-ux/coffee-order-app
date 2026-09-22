import { createClient } from "@supabase/supabase-js";

// Vite reads `.env.local` and exposes anything starting with VITE_ on import.meta.env.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// A friendly reminder in the console if the .env.local file is missing or empty.
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Check that .env.local exists, has " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY filled in, " +
      "and that you restarted `npm run dev` afterwards."
  );
}

// One shared client for the whole app. Import it wherever you need to talk to Supabase.
export const supabase = createClient(supabaseUrl, supabaseKey);
