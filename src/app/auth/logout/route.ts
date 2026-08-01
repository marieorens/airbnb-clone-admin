import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", requestUrl.origin), {
    status: 303,
  });
}
