import {
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  Home,
  Users,
} from "lucide-react";
import Link from "next/link";

import { updateListingStatus } from "@/app/actions";
import { ActionSubmitButton } from "@/components/action-submit-button";
import { AdminShell } from "@/components/admin-shell";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/error-banner";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardData } from "@/lib/admin-data";
import { formatDate, money } from "@/lib/format";

export const dynamic = "force-dynamic";

const kpiLinks = {
  users: "/users",
  listings: "/listings",
  bookings: "/bookings",
  payments: "/payments",
};

export default async function DashboardPage() {
  const dashboard = await getDashboardData();
  const paidTotal = dashboard.payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingListings = dashboard.listings.filter(
    (listing) => listing.status === "pending_review"
  ).length;
  const activeBookings = dashboard.bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Vue generale des operations Skybnb"
    >
      <ErrorBanner message={dashboard.errors.join(" | ") || null} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          href={kpiLinks.users}
          label="Utilisateurs"
          value={dashboard.users.length}
          helper="Comptes inscrits"
          icon={Users}
        />
        <KpiCard
          href={kpiLinks.listings}
          label="Annonces"
          value={dashboard.listings.length}
          helper={`${pendingListings} en review`}
          icon={Home}
        />
        <KpiCard
          href={kpiLinks.bookings}
          label="Reservations"
          value={dashboard.bookings.length}
          helper={`${activeBookings} confirmees`}
          icon={CalendarCheck}
        />
        <KpiCard
          href={kpiLinks.payments}
          label="Revenus testes"
          value={money.format(paidTotal)}
          helper="Paiements payes"
          icon={CircleDollarSign}
        />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel
          title="Annonces recentes"
          actionHref="/listings"
          actionLabel="Voir toutes"
        >
          {dashboard.listings.length === 0 ? (
            <EmptyState title="Aucune annonce pour le moment." />
          ) : (
            <div className="divide-y divide-[#EEF2F6]">
              {dashboard.listings.slice(0, 4).map((listing) => {
                const photo = [...(listing.listing_photos ?? [])].sort(
                  (a, b) => a.position - b.position
                )[0];

                return (
                  <div key={listing.id} className="grid gap-3 py-4 lg:grid-cols-[64px_1fr_auto]">
                    <div className="h-16 w-16 overflow-hidden rounded-[10px] bg-[#F2F4F7]">
                      {photo?.public_url || photo?.storage_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo.public_url || photo.storage_path}
                          alt={listing.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-[#101828]">
                          {listing.title}
                        </p>
                        <StatusBadge value={listing.status} />
                        <StatusBadge value={listing.transaction_type} />
                      </div>
                      <p className="mt-1 text-xs font-medium text-[#667085]">
                        {listing.region}, {listing.country} / {listing.currency}{" "}
                        {listing.price_per_night.toLocaleString("en-US")}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-[#98A2B3]">
                        {listing.asset_type.replaceAll("_", " ")} · Hote:{" "}
                        {listing.profiles?.full_name || listing.profiles?.email || listing.host_id}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                      <form action={updateListingStatus.bind(null, listing.id, "published")}>
                        <ActionSubmitButton
                          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#86EFAC] px-3 text-xs font-semibold text-[#15803D] hover:bg-[#F0FDF4] disabled:cursor-wait disabled:opacity-70"
                          pendingLabel="Publication..."
                        >
                          <CheckCircle2 size={14} /> Publier
                        </ActionSubmitButton>
                      </form>
                      <form action={updateListingStatus.bind(null, listing.id, "suspended")}>
                        <ActionSubmitButton
                          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#FDBA74] px-3 text-xs font-semibold text-[#C2410C] hover:bg-[#FFF7ED] disabled:cursor-wait disabled:opacity-70"
                          pendingLabel="Suspension..."
                        >
                          Suspendre
                        </ActionSubmitButton>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel title="Utilisateurs recents" actionHref="/users" actionLabel="Gerer">
          {dashboard.users.length === 0 ? (
            <EmptyState title="Aucun utilisateur." />
          ) : (
            <div className="divide-y divide-[#EEF2F6]">
              {dashboard.users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#101828]">
                      {user.full_name || user.email}
                    </p>
                    <p className="truncate text-xs font-medium text-[#667085]">{user.email}</p>
                  </div>
                  <StatusBadge value={user.role} />
                  <StatusBadge value={user.profile_completed_at ? "complete" : "incomplet"} />
                </div>
              ))}
            </div>
          )}
        </Panel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel title="Reservations recentes" actionHref="/bookings" actionLabel="Voir toutes">
          {dashboard.bookings.length === 0 ? (
            <EmptyState title="Aucune reservation pour le moment." />
          ) : (
            <div className="divide-y divide-[#EEF2F6]">
              {dashboard.bookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="grid gap-3 py-4 lg:grid-cols-[1fr_auto]">
                  <div className="flex min-w-0 gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-[#F2F4F7]">
                      {booking.listings?.listing_photos?.[0]?.public_url ||
                      booking.listings?.listing_photos?.[0]?.storage_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            booking.listings.listing_photos[0].public_url ||
                            booking.listings.listing_photos[0].storage_path
                          }
                          alt={booking.listings?.title ?? "Reservation"}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-[#101828]">
                          {booking.listings?.title || booking.listing_id}
                        </p>
                        <StatusBadge value={booking.status} />
                      </div>
                      <p className="mt-1 text-xs font-medium text-[#667085]">
                        {booking.check_in} - {booking.check_out} / {money.format(booking.total_price)}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-[#98A2B3]">
                        Cree le {formatDate(booking.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Link
                      href={`/bookings/${booking.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#E4E7EC] text-[#667085] transition hover:bg-[#F8FAFC] hover:text-[#625BFF]"
                      aria-label="Voir les details de la reservation"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Paiements et audit" actionHref="/payments" actionLabel="Paiements">
          {dashboard.payments.length === 0 ? (
            <EmptyState title="Aucun paiement." />
          ) : (
            <div className="grid gap-3">
              {dashboard.payments.slice(0, 4).map((payment) => (
                <Link
                  key={payment.id}
                  href={`/payments?q=${encodeURIComponent(payment.id)}`}
                  className="flex items-center justify-between gap-3 rounded-[10px] bg-[#F8FAFC] px-4 py-3 transition hover:bg-[#F0EFFF]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#101828]">{money.format(payment.amount)}</p>
                    <p className="truncate text-xs font-medium text-[#667085]">{payment.id}</p>
                  </div>
                  <StatusBadge value={payment.status} />
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </section>
    </AdminShell>
  );
}

function KpiCard({
  href,
  label,
  value,
  helper,
  icon: Icon,
}: {
  href: string;
  label: string;
  value: string | number;
  helper: string;
  icon: typeof Users;
}) {
  return (
    <Link
      href={href}
      className="rounded-[12px] border border-[#E4E7EC] bg-white p-4 shadow-[0_10px_28px_rgba(16,24,40,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(16,24,40,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#667085]">{label}</p>
          <p className="mt-3 text-[26px] font-bold leading-none tracking-normal text-[#101828]">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#F0EFFF] text-[#625BFF]">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-[#98A2B3]">{helper}</p>
    </Link>
  );
}

function Panel({
  title,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  actionHref: string;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-[#E4E7EC] bg-white shadow-[0_10px_28px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4">
        <h2 className="text-base font-bold tracking-normal text-[#101828]">{title}</h2>
        <Link href={actionHref} className="text-xs font-semibold text-[#625BFF] hover:underline">
          {actionLabel}
        </Link>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );
}
