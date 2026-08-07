import { ArrowLeft, CalendarDays, Home, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { ErrorBanner } from "@/components/error-banner";
import { StatusBadge } from "@/components/status-badge";
import { getBookingDetails } from "@/lib/admin-data";
import { formatDate, money } from "@/lib/format";

export const dynamic = "force-dynamic";

type BookingDetailsPageProps = {
  params: {
    id: string;
  };
};

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { booking, guest, host, payments, error } = await getBookingDetails(params.id);

  if (!booking) notFound();

  const photo = [...(booking.listings?.listing_photos ?? [])].sort(
    (a, b) => a.position - b.position
  )[0];

  return (
    <AdminShell
      title="Détails de la réservation"
      subtitle=" "
    >
      <div className="mb-5">
        <Link
          href="/bookings"
          className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#E4E7EC] bg-white px-3 text-xs font-semibold text-[#667085] transition hover:bg-[#F8FAFC]"
        >
          <ArrowLeft size={15} />
          Retour aux reservations
        </Link>
      </div>

      <ErrorBanner message={error} />

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[12px] border border-[#E4E7EC] bg-white shadow-[0_10px_28px_rgba(16,24,40,0.04)]">
          <div className="h-[260px] bg-[#F2F4F7]">
            {photo?.public_url || photo?.storage_path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.public_url || photo.storage_path}
                alt={booking.listings?.title ?? "Reservation"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#98A2B3]">
                <Home size={34} />
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-normal text-[#101828]">
                  {booking.listings?.title || booking.listing_id}
                </h2>
                <p className="mt-1 text-sm font-medium text-[#667085]">
                  {booking.listings?.region}, {booking.listings?.country}
                </p>
              </div>
              <StatusBadge value={booking.status} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <InfoTile label="Check-in" value={booking.check_in} icon={CalendarDays} />
              <InfoTile label="Check-out" value={booking.check_out} icon={CalendarDays} />
              <InfoTile label="Nuits" value={booking.night_count} icon={CalendarDays} />
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[12px] border border-[#E4E7EC] bg-white p-5 shadow-[0_10px_28px_rgba(16,24,40,0.04)]">
            <h3 className="text-base font-bold tracking-normal text-[#101828]">
              Recapitulatif
            </h3>
            <div className="mt-4 grid gap-3 text-sm">
              <DetailLine label="ID reservation" value={booking.id} />
              <DetailLine label="Prix par nuit" value={money.format(booking.price_per_night)} />
              <DetailLine label="Total" value={money.format(booking.total_price)} />
              <DetailLine label="Cree le" value={formatDate(booking.created_at)} />
              <DetailLine label="Mis a jour" value={formatDate(booking.updated_at)} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
            <PersonCard title="Voyageur" profile={guest} fallbackId={booking.guest_id} />
            <PersonCard title="Hote" profile={host} fallbackId={booking.host_id} />
          </div>

          <div className="rounded-[12px] border border-[#E4E7EC] bg-white p-5 shadow-[0_10px_28px_rgba(16,24,40,0.04)]">
            <h3 className="text-base font-bold tracking-normal text-[#101828]">
              Paiement lié
            </h3>
            {payments.length === 0 ? (
              <p className="mt-3 text-sm font-medium text-[#667085]">
                Aucun paiement rattache a cette reservation.
              </p>
            ) : (
              <div className="mt-4 grid gap-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between gap-3 rounded-[10px] bg-[#F8FAFC] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#101828]">
                        {money.format(payment.amount)}
                      </p>
                      <p className="truncate text-xs font-medium text-[#667085]">
                        {payment.stripe_payment_intent_id ?? payment.id}
                      </p>
                    </div>
                    <StatusBadge value={payment.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}

function InfoTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="rounded-[10px] bg-[#F8FAFC] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#667085]">
        <Icon size={15} />
        {label}
      </div>
      <p className="mt-2 text-sm font-bold text-[#101828]">{value}</p>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#EEF2F6] pb-2 last:border-0 last:pb-0">
      <span className="font-medium text-[#667085]">{label}</span>
      <span className="max-w-[260px] truncate text-right font-semibold text-[#101828]">
        {value}
      </span>
    </div>
  );
}

function PersonCard({
  title,
  profile,
  fallbackId,
}: {
  title: string;
  profile: { full_name: string | null; email: string; role: string } | null;
  fallbackId: string;
}) {
  return (
    <div className="rounded-[12px] border border-[#E4E7EC] bg-white p-5 shadow-[0_10px_28px_rgba(16,24,40,0.04)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0EFFF] text-[#625BFF]">
          <User size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-[#667085]">{title}</p>
          <p className="truncate text-sm font-bold text-[#101828]">
            {profile?.full_name || profile?.email || fallbackId}
          </p>
          <p className="truncate text-xs font-medium text-[#667085]">
            {profile?.email ?? fallbackId}
          </p>
        </div>
      </div>
    </div>
  );
}
