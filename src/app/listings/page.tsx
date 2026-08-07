import { Ban, CheckCircle2, Home, Search } from "lucide-react";

import { updateListingStatus } from "@/app/actions";
import { ActionSubmitButton } from "@/components/action-submit-button";
import { AdminShell } from "@/components/admin-shell";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/error-banner";
import { StatusBadge } from "@/components/status-badge";
import { getListings } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type ListingsPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const query = searchParams?.q ?? "";
  const { listings, error } = await getListings(query);

  return (
    <AdminShell title="Annonces" subtitle="Moderation et controle des biens Skybnb">
      <ErrorBanner message={error} />

      <section>
        <h2 className="mb-5 text-[22px] font-bold leading-tight tracking-normal text-[#101828]">
          Manage Listings
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
                  placeholder="Search listing..."
                />
              </div>
              <button className="flex w-12 items-center justify-center bg-[#625BFF] text-white" aria-label="Rechercher">
                <Search size={18} />
              </button>
            </form>
            <div className="rounded-full bg-[#F0EFFF] px-3 py-1.5 text-xs font-semibold text-[#625BFF]">
              {listings.length} annonces
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Aucune annonce." />
            </div>
          ) : (
            <div className="divide-y divide-[#EEF2F6]">
              {listings.map((listing) => {
                const photo = [...(listing.listing_photos ?? [])].sort(
                  (a, b) => a.position - b.position
                )[0];

                return (
                  <div
                    key={listing.id}
                    className="grid items-center gap-4 px-5 py-4 xl:grid-cols-[76px_1fr_auto]"
                  >
                    <div className="h-[76px] w-[76px] overflow-hidden rounded-[10px] bg-[#F2F4F7]">
                      {photo?.public_url || photo?.storage_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo.public_url || photo.storage_path}
                          alt={listing.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#98A2B3]">
                          <Home size={22} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold tracking-normal text-[#101828]">
                          {listing.title}
                        </h3>
                        <StatusBadge value={listing.status} />
                        <StatusBadge value={listing.transaction_type} />
                      </div>
                      <p className="mt-1.5 text-sm font-medium text-[#667085]">
                        {listing.region}, {listing.country} / {listing.currency}{" "}
                        {listing.price_per_night.toLocaleString("en-US")}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#98A2B3]">
                        {listing.asset_type.replaceAll("_", " ")} · Hote:{" "}
                        {listing.profiles?.full_name || listing.profiles?.email || listing.host_id}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#98A2B3]">
                        Cree le {formatDate(listing.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                      <form action={updateListingStatus.bind(null, listing.id, "published")}>
                        <ActionSubmitButton
                          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#86EFAC] px-3 text-xs font-semibold text-[#15803D] transition hover:bg-[#F0FDF4] disabled:cursor-wait disabled:opacity-70"
                          pendingLabel="Publication..."
                        >
                          <CheckCircle2 size={14} /> Publier
                        </ActionSubmitButton>
                      </form>
                      <form action={updateListingStatus.bind(null, listing.id, "pending_review")}>
                        <ActionSubmitButton
                          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#FDE68A] px-3 text-xs font-semibold text-[#92400E] transition hover:bg-[#FFFBEB] disabled:cursor-wait disabled:opacity-70"
                          pendingLabel="Review..."
                        >
                          Review
                        </ActionSubmitButton>
                      </form>
                      <form action={updateListingStatus.bind(null, listing.id, "suspended")}>
                        <ActionSubmitButton
                          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#FDBA74] px-3 text-xs font-semibold text-[#C2410C] transition hover:bg-[#FFF7ED] disabled:cursor-wait disabled:opacity-70"
                          pendingLabel="Suspension..."
                        >
                          <Ban size={14} /> Suspendre
                        </ActionSubmitButton>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
