"use client";

import {
  Activity,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ActionSubmitButton } from "./action-submit-button";

type AdminFrameProps = {
  title: string;
  subtitle: string;
  adminName: string;
  adminEmail?: string | null;
  role: string;
  children: React.ReactNode;
};

const mainItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Utilisateurs", icon: Users },
  { href: "/listings", label: "Annonces", icon: Home },
  { href: "/bookings", label: "Reservations", icon: CalendarCheck },
  { href: "/payments", label: "Paiements", icon: CircleDollarSign },
  { href: "/audit", label: "Audit", icon: Activity },
];

export function AdminFrame({
  title,
  subtitle,
  adminName,
  adminEmail,
  role,
  children,
}: AdminFrameProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [routeLoading, setRouteLoading] = useState(false);

  const initials = useMemo(() => {
    const source = adminName || adminEmail || "Admin";
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [adminEmail, adminName]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("skybnb-admin-theme");
    const nextTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.adminTheme = nextTheme;
  }, []);

  useEffect(() => {
    setRouteLoading(false);
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.adminTheme = nextTheme;
    window.localStorage.setItem("skybnb-admin-theme", nextTheme);
  }

  function startRouteLoading(href: string) {
    if (href !== pathname) setRouteLoading(true);
  }

  return (
    <main className="admin-theme-scope min-h-screen bg-[#F5F7FB] text-[#101828]">
      {routeLoading ? (
        <div className="fixed inset-x-0 top-0 z-[80]">
          <div className="h-1 w-full overflow-hidden bg-[#E4E7EC]">
            <div className="h-full w-1/3 animate-[route-progress_0.9s_ease-in-out_infinite] rounded-full bg-[#625BFF]" />
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[#101828]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Fermer le menu"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex-col border-r border-[#E4E7EC] bg-white transition-[width] duration-300 ${
          mobileOpen ? "flex w-[252px]" : "hidden"
        } lg:flex ${collapsed ? "lg:w-[82px]" : "lg:w-[252px]"}`}
      >
        <div className="flex h-[78px] items-center justify-between px-5">
          <Link
            href="/"
            onClick={() => startRouteLoading("/")}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-[#F1F0FF] p-1">
              <div className="h-full w-full rounded-full border-[6px] border-[#625BFF]" />
            </div>
            {!collapsed ? (
              <span className="truncate text-[22px] font-bold tracking-normal text-[#111827]">
                SkyAdmin
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden rounded-full border border-[#E4E7EC] p-1.5 text-[#667085] transition hover:bg-[#F4F6FA] lg:inline-flex"
            aria-label={collapsed ? "Ouvrir la sidebar" : "Replier la sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-full border border-[#E4E7EC] p-1.5 text-[#667085] transition hover:bg-[#F4F6FA] lg:hidden"
            aria-label="Fermer la sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <nav className="grid gap-1.5">
            {mainItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => startRouteLoading(item.href)}
                  className={`flex h-10 items-center rounded-[8px] text-[14px] font-medium transition ${
                    collapsed ? "justify-center px-0" : "gap-3 px-3"
                  } ${
                    active
                      ? "bg-[#F0EFFF] text-[#625BFF]"
                      : "text-[#667085] hover:bg-[#F8FAFC] hover:text-[#111827]"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={19} strokeWidth={1.9} />
                  {!collapsed ? <span>{item.label}</span> : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#EEF2F6] p-4">
          <div
            className={`flex items-center rounded-[10px] bg-[#F8FAFC] p-2.5 ${
              collapsed ? "justify-center" : "gap-2.5"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#625BFF] shadow-sm">
              {initials || "A"}
            </div>
            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#101828]">{adminName}</p>
                <p className="truncate text-[11px] text-[#667085]">
                  {role} / {adminEmail}
                </p>
              </div>
            ) : null}
          </div>

          <form action="/auth/logout" method="post">
            <ActionSubmitButton
              className={`mt-2.5 flex h-10 w-full items-center rounded-[8px] border border-[#E4E7EC] bg-white text-xs font-semibold text-[#667085] transition hover:bg-[#F8FAFC] ${
                collapsed ? "justify-center px-0" : "justify-center gap-2 px-3"
              }`}
              pendingLabel={collapsed ? "" : "Deconnexion..."}
            >
              <LogOut size={16} />
              {!collapsed ? "Se deconnecter" : null}
            </ActionSubmitButton>
          </form>
        </div>
      </aside>

      <section
        className={`min-h-screen transition-[padding] duration-300 ${
          collapsed ? "lg:pl-[82px]" : "lg:pl-[252px]"
        }`}
      >
        <header className="sticky top-0 z-30 border-b border-[#E4E7EC] bg-white">
          <div className="flex min-h-[78px] items-center justify-between gap-4 px-5 xl:px-7">
            <div className="min-w-0">
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="rounded-[8px] border border-[#E4E7EC] p-2 text-[#667085]"
                  aria-label="Ouvrir le menu"
                >
                  <Menu size={20} />
                </button>
                <span className="text-lg font-bold">SkyAdmin</span>
              </div>
              <h1 className="hidden text-[24px] font-bold leading-tight tracking-normal text-[#101828] lg:block">
                {title}
              </h1>
              <p className="mt-1 hidden text-[13px] font-medium text-[#667085] lg:block">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              <form action="/users" method="get" className="relative hidden w-full max-w-[300px] xl:block">
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]"
                  aria-label="Rechercher"
                >
                  <Search size={18} />
                </button>
                <input
                  name="q"
                  className="h-11 w-full rounded-[22px] border border-[#E4E7EC] bg-[#F2F4F7] pl-11 pr-4 text-[13px] font-medium text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#625BFF]"
                  placeholder="Rechercher un utilisateur..."
                />
              </form>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-11 items-center gap-1 rounded-full border border-[#E4E7EC] bg-[#F2F4F7] p-1 text-[#667085]"
                aria-label={theme === "light" ? "Activer le theme sombre" : "Activer le theme clair"}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                    theme === "light" ? "bg-white text-[#F59E0B] shadow-sm" : "text-[#98A2B3]"
                  }`}
                >
                  <Sun size={17} />
                </span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                    theme === "dark" ? "bg-[#111827] text-[#A5B4FC] shadow-sm" : "text-[#667085]"
                  }`}
                >
                  <Moon size={17} />
                </span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E7EC] bg-[#F2F4F7] text-xs font-bold text-[#667085]">
                    {initials || <User size={18} />}
                  </div>
                  <span className="hidden text-sm font-semibold text-[#111827] 2xl:block">
                    {adminName}
                  </span>
                  <ChevronDown size={16} className="hidden text-[#111827] 2xl:block" />
                </button>

                {profileOpen ? (
                  <div className="absolute right-0 top-[54px] w-[270px] overflow-hidden rounded-[8px] border border-[#E4E7EC] bg-white shadow-[0_18px_50px_rgba(16,24,40,0.16)]">
                    <div className="flex items-center gap-3 border-b border-[#EEF2F6] p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F4F7] text-xs font-bold text-[#667085]">
                        {initials || "A"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#101828]">{adminName}</p>
                        <p className="truncate text-xs text-[#667085]">{adminEmail}</p>
                        <p className="mt-1 text-[11px] font-bold uppercase text-[#625BFF]">{role}</p>
                      </div>
                    </div>
                    <div className="grid border-b border-[#EEF2F6] py-1.5">
                      <Link
                        href="/users"
                        onClick={() => startRouteLoading("/users")}
                        className="flex items-center gap-3 px-5 py-2.5 text-left text-sm font-medium text-[#667085] hover:bg-[#F8FAFC]"
                      >
                        <Users size={17} /> Gerer les utilisateurs
                      </Link>
                      <Link
                        href="/audit"
                        onClick={() => startRouteLoading("/audit")}
                        className="flex items-center gap-3 px-5 py-2.5 text-left text-sm font-medium text-[#667085] hover:bg-[#F8FAFC]"
                      >
                        <Activity size={17} /> Voir audit
                      </Link>
                    </div>
                    <form action="/auth/logout" method="post">
                      <ActionSubmitButton
                        className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm font-medium text-[#667085] hover:bg-[#F8FAFC]"
                        pendingLabel="Deconnexion..."
                      >
                        <LogOut size={17} /> Log out
                      </ActionSubmitButton>
                    </form>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div className="px-5 py-6 sm:px-6 xl:px-7">{children}</div>
      </section>
    </main>
  );
}
