import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

// No accounts, no auth — this is a single shared anon-key client used
// everywhere (server components and client components alike) to read the
// public content tables (companies, topics, questions).
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
