import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabasePublicKey, getSupabaseUrl } from "@/lib/supabase/config";
import type { Database } from "@/types/supabase";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const code = requestUrl.searchParams.get("code");
  const cookiesToSet: CookieToSet[] = [];

  if (!code) {
    return NextResponse.redirect(new URL("/", requestUrl.origin));
  }

  const supabase = createServerClient<Database>(
    getSupabaseUrl(),
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(nextCookiesToSet) {
          cookiesToSet.push(...nextCookiesToSet);
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  const response = NextResponse.redirect(new URL("/", requestUrl.origin));

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  if (error) {
    return NextResponse.redirect(new URL("/", requestUrl.origin));
  }

  return response;
}
