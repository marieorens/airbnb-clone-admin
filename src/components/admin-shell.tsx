import { headers } from "next/headers";

import { AdminFrame } from "./admin-frame";
import { ForbiddenScreen, LoginScreen } from "./auth-screens";
import { getSessionProfile } from "@/lib/admin-auth";

export async function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const { user, profile } = await getSessionProfile();
  const headersList = headers();
  const search = headersList.get("x-search") ?? "";
  const authError = new URLSearchParams(search).get("auth_error");

  if (!user) return <LoginScreen authError={authError} />;
  if (profile?.role !== "admin") return <ForbiddenScreen email={user.email} />;

  return (
    <AdminFrame
      title={title}
      subtitle={subtitle}
      adminName={profile.full_name || user.email || "Admin"}
      adminEmail={user.email}
      role={profile.role}
    >
      {children}
    </AdminFrame>
  );
}
