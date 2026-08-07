import { Activity, Search } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/error-banner";
import { getAuditLogs } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type AuditPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function AuditPage({ searchParams }: AuditPageProps) {
  const query = searchParams?.q ?? "";
  const { logs, error } = await getAuditLogs(query);

  return (
    <AdminShell title="Audit" subtitle="Journal des actions administrateur">
      <ErrorBanner message={error} />

      <section>
        <h2 className="mb-5 text-[22px] font-bold leading-tight tracking-normal text-[#101828]">
          Activity Logs
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
                  placeholder="Search audit event..."
                />
              </div>
              <button className="flex w-12 items-center justify-center bg-[#625BFF] text-white" aria-label="Rechercher">
                <Search size={18} />
              </button>
            </form>
            <div className="rounded-full bg-[#F0EFFF] px-3 py-1.5 text-xs font-semibold text-[#625BFF]">
              {logs.length} events
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Aucun log admin." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E7EC] text-xs font-semibold text-[#667085]">
                    <th className="px-5 py-4">Action</th>
                    <th className="px-4 py-4">Cible</th>
                    <th className="px-4 py-4">Admin</th>
                    <th className="px-4 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-[#EEF2F6] text-[#667085] last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#F0EFFF] text-[#625BFF]">
                            <Activity size={18} />
                          </div>
                          <span className="font-semibold text-[#101828]">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {log.target_table ?? "-"} / {log.target_id ?? "-"}
                      </td>
                      <td className="max-w-[240px] truncate px-4 py-4 font-medium">
                        {log.admin_id ?? "-"}
                      </td>
                      <td className="px-4 py-4 font-medium">{formatDate(log.created_at)}</td>
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
