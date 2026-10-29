"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4 p-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Manage projects, resale, rentals and blogs.</p>
        </div>
        <label className="block">
          <span className="label mb-1.5 block">Email</span>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </label>
        <label className="block">
          <span className="label mb-1.5 block">Password</span>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
