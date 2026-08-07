import { createAdminClient } from "@/lib/supabase/admin";
import type { Tables } from "@/types/supabase";

export type ListingRow = Tables<"listings"> & {
  profiles?: Pick<Tables<"profiles">, "full_name" | "email"> | null;
  listing_photos?: Pick<Tables<"listing_photos">, "public_url" | "storage_path" | "position">[];
};

export type BookingRow = Tables<"bookings"> & {
  listings?:
    | (Pick<
        Tables<"listings">,
        | "id"
        | "title"
        | "region"
        | "country"
        | "price_per_night"
        | "asset_type"
        | "transaction_type"
        | "currency"
      > & {
        listing_photos?:
          | Pick<Tables<"listing_photos">, "public_url" | "storage_path" | "position">[]
          | null;
      })
    | null;
};

function matches(value: string | null | undefined, query: string) {
  return (value ?? "").toLowerCase().includes(query);
}

function normalizeQuery(query?: string | string[]) {
  if (Array.isArray(query)) return query[0]?.trim().toLowerCase() ?? "";
  return query?.trim().toLowerCase() ?? "";
}

export async function getDashboardData() {
  const admin = createAdminClient();

  const [profiles, listings, bookings, payments, logs] = await Promise.all([
    admin
      .from("profiles")
      .select("id,email,full_name,role,is_host,phone,country_of_residence,account_purpose,profile_completed_at,created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("listings")
      .select("*,profiles(full_name,email),listing_photos(public_url,storage_path,position)")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("bookings")
      .select("*,listings(id,title,region,country,price_per_night,asset_type,transaction_type,currency,listing_photos(public_url,storage_path,position))")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("payments")
      .select("id,amount,currency,status,user_id,booking_id,created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("admin_audit_logs")
      .select("id,action,target_table,target_id,created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return {
    users: profiles.data ?? [],
    listings: (listings.data ?? []) as unknown as ListingRow[],
    bookings: (bookings.data ?? []) as unknown as BookingRow[],
    payments: payments.data ?? [],
    logs: logs.data ?? [],
    errors: [
      profiles.error?.message,
      listings.error?.message,
      bookings.error?.message,
      payments.error?.message,
      logs.error?.message,
    ].filter(Boolean),
  };
}

export async function getUsers(query?: string | string[]) {
  const q = normalizeQuery(query);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const users = data ?? [];

  return {
    users: q
      ? users.filter((user) =>
          [user.id, user.email, user.full_name, user.role].some((value) =>
            matches(value, q)
          )
        )
      : users,
    error: error?.message ?? null,
  };
}

export async function getListings(query?: string | string[]) {
  const q = normalizeQuery(query);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("listings")
    .select("*,profiles(full_name,email),listing_photos(public_url,storage_path,position)")
    .order("created_at", { ascending: false });

  const listings = (data ?? []) as unknown as ListingRow[];

  return {
    listings: q
      ? listings.filter((listing) =>
          [
            listing.id,
            listing.title,
            listing.country,
            listing.region,
            listing.status,
            listing.asset_type,
            listing.transaction_type,
            listing.profiles?.full_name,
            listing.profiles?.email,
          ].some((value) => matches(value, q))
        )
      : listings,
    error: error?.message ?? null,
  };
}

export async function getBookings(query?: string | string[]) {
  const q = normalizeQuery(query);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("bookings")
    .select("*,listings(id,title,region,country,price_per_night,asset_type,transaction_type,currency,listing_photos(public_url,storage_path,position))")
    .order("created_at", { ascending: false });

  const bookings = (data ?? []) as unknown as BookingRow[];

  return {
    bookings: q
      ? bookings.filter((booking) =>
          [
            booking.id,
            booking.status,
            booking.check_in,
            booking.check_out,
            booking.listings?.title,
            booking.listings?.region,
            booking.listings?.country,
          ].some((value) => matches(value, q))
        )
      : bookings,
    error: error?.message ?? null,
  };
}

export async function getBookingDetails(bookingId: string) {
  const admin = createAdminClient();

  const { data: booking, error } = await admin
    .from("bookings")
    .select("*,listings(id,title,region,country,price_per_night,asset_type,transaction_type,currency,listing_photos(public_url,storage_path,position))")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    return {
      booking: null,
      guest: null,
      host: null,
      payments: [],
      error: error?.message ?? "Reservation introuvable",
    };
  }

  const row = booking as unknown as BookingRow;
  const [guest, host, payments] = await Promise.all([
    admin
      .from("profiles")
      .select("id,email,full_name,role,is_host,phone,country_of_residence,account_purpose,profile_completed_at,created_at")
      .eq("id", row.guest_id)
      .single(),
    admin
      .from("profiles")
      .select("id,email,full_name,role,is_host,phone,country_of_residence,account_purpose,profile_completed_at,created_at")
      .eq("id", row.host_id)
      .single(),
    admin
      .from("payments")
      .select("*")
      .eq("booking_id", row.id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    booking: row,
    guest: guest.data ?? null,
    host: host.data ?? null,
    payments: payments.data ?? [],
    error:
      guest.error?.message || host.error?.message || payments.error?.message || null,
  };
}

export async function getPayments(query?: string | string[]) {
  const q = normalizeQuery(query);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  const payments = data ?? [];

  return {
    payments: q
      ? payments.filter((payment) =>
          [
            payment.id,
            payment.status,
            payment.booking_id,
            payment.user_id,
            payment.stripe_checkout_session_id,
            payment.stripe_payment_intent_id,
          ].some((value) => matches(value, q))
        )
      : payments,
    error: error?.message ?? null,
  };
}

export async function getAuditLogs(query?: string | string[]) {
  const q = normalizeQuery(query);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("admin_audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const logs = data ?? [];

  return {
    logs: q
      ? logs.filter((log) =>
          [log.id, log.action, log.target_table, log.target_id, log.admin_id].some(
            (value) => matches(value, q)
          )
        )
      : logs,
    error: error?.message ?? null,
  };
}
