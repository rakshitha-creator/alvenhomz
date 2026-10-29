"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  Building2,
  FileText,
  Home,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  RefreshCw,
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
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const isLogin = pathname.startsWith("/admin/login");

  if (isLogin) return <>{children}</>;

  const logout = async () => {
    await signOut(getFirebaseAuth());
    router.replace("/admin/login/");
  };

  return (
    <div className="min-h-screen bg-[#f3f1ec]">
      <div className="border-b border-navy-900/10 bg-navy-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-300 uppercase">Alven Homz CMS</p>
            <h1 className="font-display text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10">
              <Home className="h-3.5 w-3.5" /> View site
            </Link>
            <button type="button" onClick={logout} className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-2 text-xs font-semibold text-navy-950 hover:bg-gold-400">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl overflow-x-auto px-4 pb-3 sm:px-6" aria-label="Admin">
          <ul className="flex gap-1">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href || pathname === "/admin"
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap transition",
                      active ? "bg-white text-navy-950" : "text-white/75 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
