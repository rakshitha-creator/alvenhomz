"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  Building2,
  FileText,
  Home,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  BarChart3,
  ImageIcon,
  UserRound,
} from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads/", label: "Leads", icon: Inbox },
  { href: "/admin/projects/", label: "Projects", icon: Building2 },
  { href: "/admin/resale/", label: "Resale", icon: RefreshCw },
  { href: "/admin/rentals/", label: "Rentals", icon: KeyRound },
  { href: "/admin/blogs/", label: "Blogs", icon: FileText },
  { href: "/admin/banners/", label: "Banners", icon: ImageIcon },
  { href: "/admin/reports/", label: "Reports", icon: BarChart3 },
  { href: "/admin/profile/", label: "Profile", icon: UserRound },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const isLogin = pathname.startsWith("/admin/login");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), setUser);
  }, []);

  if (isLogin) return <>{children}</>;

  const logout = async () => {
    await signOut(getFirebaseAuth());
    router.replace("/admin/login/");
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Admin";
  const email = user?.email || "Signed in";

  return (
    <div className="flex min-h-screen bg-[#f3f1ec]">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-navy-950 text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-300 uppercase">Alven Homz CMS</p>
          <p className="mt-1 font-display text-lg font-semibold text-white">Admin</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href || pathname === "/admin"
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                      active
                        ? "bg-white text-navy-950"
                        : "text-white/75 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <Link
            href="/admin/profile/"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white/10"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-white">{displayName}</span>
              <span className="block truncate text-[11px] text-white/55">{email}</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <Home className="h-4 w-4 shrink-0" />
            View site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 overflow-x-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
