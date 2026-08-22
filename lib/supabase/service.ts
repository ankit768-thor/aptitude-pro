import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * Service-role client. Server-only (uses SUPABASE_SERVICE_ROLE_KEY) — never
 * import this from a Client Component. Used by seed scripts and any trusted
 * server-side writes to public reference tables (companies, questions, ...).
 */
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
