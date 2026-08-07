import { CircleDollarSign, Search } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/error-banner";
import { StatusBadge } from "@/components/status-badge";
import { getPayments } from "@/lib/admin-data";
import { formatDate, money } from "@/lib/format";

export const dynamic = "force-dynamic";

type PaymentsPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
  const query = searchParams?.q ?? "";
  const { payments, error } = await getPayments(query);

  return (
    <AdminShell title="Paiements" subtitle="Flux Stripe et paiements enregistres">
      <ErrorBanner message={error} />

      <section>
        <h2 className="mb-5 text-[22px] font-bold leading-tight tracking-normal text-[#101828]">
          Manage Payments
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
                  placeholder="Search payment..."
                />
              </div>
              <button className="flex w-12 items-center justify-center bg-[#625BFF] text-white" aria-label="Rechercher">
                <Search size={18} />
              </button>
            </form>
            <div className="rounded-full bg-[#F0EFFF] px-3 py-1.5 text-xs font-semibold text-[#625BFF]">
              {payments.length} paiements
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Aucun paiement." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E7EC] text-xs font-semibold text-[#667085]">
                    <th className="px-5 py-4">Paiement</th>
                    <th className="px-4 py-4">Montant</th>
                    <th className="px-4 py-4">Statut</th>
                    <th className="px-4 py-4">Booking</th>
                    <th className="px-4 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-[#EEF2F6] text-[#667085] last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#ECFDF3] text-[#079455]">
                            <CircleDollarSign size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-[340px] truncate font-semibold text-[#101828]">
                              {payment.stripe_checkout_session_id || payment.id}
                            </p>
                            <p className="max-w-[340px] truncate text-xs font-medium text-[#98A2B3]">
                              {payment.stripe_payment_intent_id ?? payment.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#101828]">
                        {money.format(payment.amount)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge value={payment.status} />
                      </td>
                      <td className="max-w-[220px] truncate px-4 py-4 font-medium">
                        {payment.booking_id ?? "-"}
                      </td>
                      <td className="px-4 py-4 font-medium">{formatDate(payment.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
