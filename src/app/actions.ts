"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  return user;
}

async function logAdminAction({
  adminId,
  action,
  targetTable,
  targetId,
  metadata,
}: {
  adminId: string;
  action: string;
  targetTable: string;
  targetId: string;
  metadata?: Record<string, string>;
}) {
  const admin = createAdminClient();

  await admin.from("admin_audit_logs").insert({
    admin_id: adminId,
    action,
    target_table: targetTable,
    target_id: targetId,
    metadata: metadata ?? {},
  });
}

export async function updateListingStatus(
  listingId: string,
  status: Tables<"listings">["status"]
) {
  const user = await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("listings")
    .update({ status })
    .eq("id", listingId);

  if (error) throw new Error(error.message);

  await logAdminAction({
    adminId: user.id,
    action: "listing.status.update",
    targetTable: "listings",
    targetId: listingId,
    metadata: { status },
  });

  revalidatePath("/");
}

export async function updateBookingStatus(
  bookingId: string,
  status: Tables<"bookings">["status"]
) {
  const user = await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) throw new Error(error.message);

  await logAdminAction({
    adminId: user.id,
    action: "booking.status.update",
    targetTable: "bookings",
    targetId: bookingId,
    metadata: { status },
  });

  revalidatePath("/");
}
