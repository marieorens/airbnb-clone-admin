import {
  Ban,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  Home,
  ShieldCheck,
  Users,
} from "lucide-react";

import { updateBookingStatus, updateListingStatus } from "./actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

export const dynamic = "force-dynamic";

type ListingRow = Tables<"listings"> & {
  profiles?: Pick<Tables<"profiles">, "full_name" | "email"> | null;
  listing_photos?: Pick<Tables<"listing_photos">, "public_url" | "storage_path" | "position">[];
};

type BookingRow = Tables<"bookings"> & {
  listings?: Pick<Tables<"listings">, "title" | "region" | "country"> | null;
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

async function getSessionProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

async function getDashboardData() {
  const admin = createAdminClient();

  const [profiles, listings, bookings, payments, logs] = await Promise.all([
    admin
      .from("profiles")
      .select("id,email,full_name,role,is_host,created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("listings")
      .select("*,profiles(full_name,email),listing_photos(public_url,storage_path,position)")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("bookings")
      .select("*,listings(title,region,country)")
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

  const listingsData = (listings.data ?? []) as unknown as ListingRow[];
  const bookingsData = (bookings.data ?? []) as unknown as BookingRow[];
  const paymentsData = payments.data ?? [];
  const usersData = profiles.data ?? [];

  return {
    users: usersData,
    listings: listingsData,
    bookings: bookingsData,
    payments: paymentsData,
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

function LoginScreen() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#172033]">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="rounded-[8px] border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#0EA5E9] text-white">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-normal">Skybnb Admin</h1>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Connecte-toi avec le compte Google autorise pour gerer les annonces,
            reservations et paiements.
          </p>
          <a
            href="/auth/google"
            className="mt-6 inline-flex w-full items-center justify-center rounded-[8px] bg-[#0EA5E9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0284C7]"
          >
            Continuer avec Google
          </a>
        </div>
      </section>
    </main>
  );
}

function ForbiddenScreen({ email }: { email?: string | null }) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#172033]">
      <section className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
        <div className="rounded-[8px] border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#F97316] text-white">
            <Ban size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-normal">Acces admin requis</h1>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Le compte {email ?? "connecte"} existe, mais son profil Supabase ne
            possede pas encore le role <span className="font-semibold">admin</span>.
          </p>
          <form action="/auth/logout" method="post">
            <button className="mt-6 rounded-[8px] border border-[#CBD5E1] px-4 py-2 text-sm font-semibold">
              Se deconnecter
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-[8px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#64748B]">{label}</span>
        <Icon className="text-[#0EA5E9]" size={20} />
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-[#E0F2FE] px-2 py-1 text-xs font-semibold text-[#0369A1]">
      {value}
    </span>
  );
}

export default async function HomePage() {
  const { user, profile } = await getSessionProfile();

  if (!user) return <LoginScreen />;
  if (profile?.role !== "admin") return <ForbiddenScreen email={user.email} />;

  const dashboard = await getDashboardData();
  const paidTotal = dashboard.payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#172033]">
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0EA5E9]">
              Skybnb
            </p>
            <h1 className="text-xl font-bold">Backoffice</h1>
          </div>
          <form action="/auth/logout" method="post">
            <button className="rounded-[8px] border border-[#CBD5E1] px-4 py-2 text-sm font-semibold">
              Se deconnecter
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {dashboard.errors.length > 0 ? (
          <div className="mb-4 rounded-[8px] border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#991B1B]">
            {dashboard.errors.join(" | ")}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Utilisateurs" value={dashboard.users.length} icon={Users} />
          <StatCard label="Annonces" value={dashboard.listings.length} icon={Home} />
          <StatCard label="Reservations" value={dashboard.bookings.length} icon={CalendarCheck} />
          <StatCard label="Revenus testes" value={money.format(paidTotal)} icon={CircleDollarSign} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[8px] border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-4 py-3">
              <h2 className="font-bold">Annonces recentes</h2>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {dashboard.listings.map((listing) => {
                const photo = [...(listing.listing_photos ?? [])].sort(
                  (a, b) => a.position - b.position
                )[0];

                return (
                  <div key={listing.id} className="grid gap-4 px-4 py-4 md:grid-cols-[64px_1fr_auto]">
                    <div className="h-16 w-16 overflow-hidden rounded-[8px] bg-[#E2E8F0]">
                      {photo?.public_url || photo?.storage_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo.public_url || photo.storage_path}
                          alt={listing.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{listing.title}</h3>
                        <StatusBadge value={listing.status} />
                      </div>
                      <p className="mt-1 text-sm text-[#64748B]">
                        {listing.region}, {listing.country} · {money.format(listing.price_per_night)}
                      </p>
                      <p className="mt-1 text-xs text-[#94A3B8]">
                        Hote: {listing.profiles?.full_name || listing.profiles?.email || listing.host_id}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <form action={updateListingStatus.bind(null, listing.id, "published")}>
                        <button className="inline-flex items-center gap-1 rounded-[8px] border border-[#BBF7D0] px-3 py-2 text-xs font-semibold text-[#166534]">
                          <CheckCircle2 size={14} /> Publier
                        </button>
                      </form>
                      <form action={updateListingStatus.bind(null, listing.id, "suspended")}>
                        <button className="inline-flex items-center gap-1 rounded-[8px] border border-[#FED7AA] px-3 py-2 text-xs font-semibold text-[#9A3412]">
                          <Ban size={14} /> Suspendre
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[8px] border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-4 py-3">
              <h2 className="font-bold">Utilisateurs recents</h2>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {dashboard.users.map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.full_name || item.email}</p>
                      <p className="text-sm text-[#64748B]">{item.email}</p>
                    </div>
                    <StatusBadge value={item.role} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-[8px] border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-4 py-3">
              <h2 className="font-bold">Reservations recentes</h2>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {dashboard.bookings.map((booking) => (
                <div key={booking.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <BedDouble size={16} className="text-[#0EA5E9]" />
                      <p className="font-semibold">{booking.listings?.title || booking.listing_id}</p>
                      <StatusBadge value={booking.status} />
                    </div>
                    <p className="mt-1 text-sm text-[#64748B]">
                      {booking.check_in} - {booking.check_out} / {money.format(booking.total_price)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <form action={updateBookingStatus.bind(null, booking.id, "confirmed")}>
                      <button className="rounded-[8px] border border-[#BBF7D0] px-3 py-2 text-xs font-semibold text-[#166534]">
                        Confirmer
                      </button>
                    </form>
                    <form action={updateBookingStatus.bind(null, booking.id, "refunded")}>
                      <button className="rounded-[8px] border border-[#FED7AA] px-3 py-2 text-xs font-semibold text-[#9A3412]">
                        Marquer rembourse
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-4 py-3">
              <h2 className="font-bold">Paiements et audit</h2>
            </div>
            <div className="grid gap-4 p-4">
              {dashboard.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-[8px] bg-[#F8FAFC] p-3">
                  <div>
                    <p className="font-semibold">{money.format(payment.amount)}</p>
                    <p className="text-xs text-[#64748B]">{payment.id}</p>
                  </div>
                  <StatusBadge value={payment.status} />
                </div>
              ))}
              <div className="border-t border-[#E2E8F0] pt-4">
                {dashboard.logs.map((log) => (
                  <p key={log.id} className="py-1 text-sm text-[#64748B]">
                    {log.action} · {log.target_table}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
