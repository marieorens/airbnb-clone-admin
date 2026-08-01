import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { getSupabasePublicKey, getSupabaseUrl } from "./config";
import type { Database } from "@/types/supabase";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Middleware refreshes cookies for Server Components.
          }
        },
      },
    }
  );
}
