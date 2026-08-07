import { ShieldCheck, Search } from "lucide-react";

import { promoteUserToAdmin } from "@/app/actions";
import { ActionSubmitButton } from "@/components/action-submit-button";
import { AdminShell } from "@/components/admin-shell";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/error-banner";
import { StatusBadge } from "@/components/status-badge";
import { getUsers } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type UsersPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const query = searchParams?.q ?? "";
  const { users, error } = await getUsers(query);

  return (
    <AdminShell title="Utilisateurs" subtitle="Gestion des clients, hotes et admins">
      <ErrorBanner message={error} />

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-bold leading-tight tracking-normal text-[#101828]">
              Manage Team
            </h2>
            <p className="mt-1 text-xs font-medium text-[#667085]">
              {users.length} resultat{users.length > 1 ? "s" : ""}
            </p>
          </div>

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
                placeholder="Search by id, name, or email..."
              />
            </div>
            <button className="flex w-12 items-center justify-center bg-[#625BFF] text-white" aria-label="Rechercher">
              <Search size={18} />
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-[#E4E7EC] bg-white shadow-[0_10px_28px_rgba(16,24,40,0.04)]">
          {users.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Aucun utilisateur." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E7EC] text-xs font-semibold text-[#667085]">
                    <th className="px-5 py-4">Id</th>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Profil</th>
                    <th className="px-4 py-4">Intentions</th>
                    <th className="px-4 py-4">Residence</th>
                    <th className="px-4 py-4">Role</th>
                    <th className="px-4 py-4">Created</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-[#EEF2F6] text-[#667085] last:border-0">
                      <td className="max-w-[160px] truncate px-5 py-4 font-semibold">
                        {user.id.slice(0, 12)}...
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#101828]">
                          {user.full_name || "Utilisateur Skybnb"}
                        </p>
                      </td>
                      <td className="px-4 py-4 font-medium">{user.email}</td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          value={user.profile_completed_at ? "complete" : "incomplet"}
                        />
                      </td>
                      <td className="max-w-[220px] px-4 py-4 font-medium">
                        {(user.account_purpose ?? []).length > 0
                          ? user.account_purpose.join(", ")
                          : "-"}
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {[user.city_of_residence, user.country_of_residence]
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge value={user.role} />
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          {user.role === "admin" ? (
                            <span className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-[#ECFDF3] px-3 text-xs font-semibold text-[#15803D]">
                              <ShieldCheck size={14} /> Admin
                            </span>
                          ) : (
                            <form action={promoteUserToAdmin.bind(null, user.id)}>
                              <ActionSubmitButton
                                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#C7D2FE] px-3 text-xs font-semibold text-[#4F46E5] transition hover:bg-[#EEF2FF] disabled:cursor-wait disabled:opacity-70"
                                pendingLabel="Promotion..."
                              >
                                <ShieldCheck size={14} /> Promouvoir admin
                              </ActionSubmitButton>
                            </form>
                          )}
                        </div>
                      </td>
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
