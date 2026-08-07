import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function redirectWithError(requestUrl: URL, error: string) {
  const redirectUrl = new URL("/", requestUrl.origin);
  redirectUrl.searchParams.set("auth_error", error);

  return NextResponse.redirect(redirectUrl, {
    status: 303,
  });
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return redirectWithError(requestUrl, "missing_credentials");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirectWithError(requestUrl, "invalid_credentials");
  }

  return NextResponse.redirect(new URL("/", requestUrl.origin), {
    status: 303,
  });
}
