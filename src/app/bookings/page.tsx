import { Eye, Home, Search } from "lucide-react";
import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/error-banner";
import { StatusBadge } from "@/components/status-badge";
import { getBookings } from "@/lib/admin-data";
import { formatDate, money } from "@/lib/format";

export const dynamic = "force-dynamic";

type BookingsPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const query = searchParams?.q ?? "";
  const { bookings, error } = await getBookings(query);

  return (
    <AdminShell title="Reservations" subtitle="Suivi operationnel des sejours">
      <ErrorBanner message={error} />

      <section>
        <h2 className="mb-5 text-[22px] font-bold leading-tight tracking-normal text-[#101828]">
          Manage Bookings
        </h2>

        <div className="overflow-hidden rounded-[12px] border border-[#E4E7EC] bg-white shadow-[0_10px_28px_rgba(16,24,40,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E7EC] px-5 py-4">
            <form method="get" className="flex w-full max-w-[440px] overflow-hidden rounded-[8px] border border-[#E4E7EC] bg-white">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                  size={18}
                />
                <input
                  name="q"
                  defaultValue={query}
                  className="h-11 w-full pl-11 pr-3 text-sm font-medium text-[#101828] outline-none placeholder:text-[#C2C8D0]"
                  placeholder="Search booking..."
                />
              </div>
              <button className="flex w-12 items-center justify-center bg-[#625BFF] text-white" aria-label="Rechercher">
                <Search size={18} />
              </button>
            </form>
            <div className="rounded-full bg-[#F0EFFF] px-3 py-1.5 text-xs font-semibold text-[#625BFF]">
              {bookings.length} reservations
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Aucune reservation." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E7EC] text-xs font-semibold text-[#667085]">
                    <th className="px-5 py-4">Annonce</th>
                    <th className="px-4 py-4">Dates</th>
                    <th className="px-4 py-4">Montant</th>
                    <th className="px-4 py-4">Statut</th>
                    <th className="px-4 py-4">Cree le</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const photo = [...(booking.listings?.listing_photos ?? [])].sort(
                      (a, b) => a.position - b.position
                    )[0];

                    return (
                    <tr key={booking.id} className="border-b border-[#EEF2F6] text-[#667085] last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-[10px] bg-[#F2F4F7]">
                            {photo?.public_url || photo?.storage_path ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={photo.public_url || photo.storage_path}
                                alt={booking.listings?.title ?? "Reservation"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#98A2B3]">
                                <Home size={18} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#101828]">
                              {booking.listings?.title || booking.listing_id}
                            </p>
                            <p className="text-xs font-medium text-[#98A2B3]">
                              {booking.listings?.region}, {booking.listings?.country}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {booking.check_in} - {booking.check_out}
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#101828]">
                        {money.format(booking.total_price)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge value={booking.status} />
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {formatDate(booking.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/bookings/${booking.id}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#E4E7EC] text-[#667085] transition hover:bg-[#F8FAFC] hover:text-[#625BFF]"
                            aria-label="Voir les details de la reservation"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
