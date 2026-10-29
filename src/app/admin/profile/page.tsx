"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { LogOut, Mail, Shield } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { AdminPageHeader } from "@/components/admin/form";
import { formatDate } from "@/lib/utils";

export default function AdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), setUser);
  }, []);

  const logout = async () => {
    await signOut(getFirebaseAuth());
    router.replace("/admin/login/");
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Admin";

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Profile" description="Your signed-in admin account details." />

      {!user ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <div className="card max-w-xl space-y-6 p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-xl font-bold text-gold-300">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-navy-900">{displayName}</p>
              <p className="text-sm text-muted">Administrator</p>
            </div>
          </div>

          <dl className="space-y-4 border-t border-line pt-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-gold-600" />
              <div>
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Email</dt>
                <dd className="mt-0.5 text-sm text-navy-900">{user.email || "—"}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-4 w-4 text-gold-600" />
              <div>
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">User ID</dt>
                <dd className="mt-0.5 break-all font-mono text-xs text-navy-800">{user.uid}</dd>
              </div>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Last sign-in</dt>
              <dd className="mt-0.5 text-sm text-navy-900">
                {user.metadata.lastSignInTime ? formatDate(user.metadata.lastSignInTime) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Account created</dt>
              <dd className="mt-0.5 text-sm text-navy-900">
                {user.metadata.creationTime ? formatDate(user.metadata.creationTime) : "—"}
              </dd>
            </div>
          </dl>

          <button type="button" onClick={logout} className="btn-outline w-full justify-center text-sm">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
