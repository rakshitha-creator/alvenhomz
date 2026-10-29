"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const isLogin = pathname.startsWith("/admin/login");
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setUser(null);
      return;
    }
    return onAuthStateChanged(getFirebaseAuth(), setUser);
  }, []);

  useEffect(() => {
    if (user === undefined) return;
    if (!isLogin && !user) router.replace("/admin/login/");
    if (isLogin && user) router.replace("/admin/");
  }, [user, isLogin, router]);

  if (!isFirebaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900">Firebase not configured</h1>
        <p className="mt-3 text-sm text-muted">
          Copy <code className="rounded bg-ivory px-1.5 py-0.5">.env.example</code> to{" "}
          <code className="rounded bg-ivory px-1.5 py-0.5">.env.local</code>, add your Firebase web config, then restart{" "}
          <code className="rounded bg-ivory px-1.5 py-0.5">npm run dev</code>.
        </p>
      </div>
    );
  }

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted" aria-busy="true">
        Checking session…
      </div>
    );
  }

  if (!isLogin && !user) return null;
  if (isLogin) return <>{children}</>;
  return <>{children}</>;
}
