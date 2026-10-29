"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { listAllAdmin, type ListingCollection } from "@/lib/firebase-data";
import { AdminPageHeader } from "./form";

type Row = { slug: string; title: string; published?: boolean; subtitle?: string };

export default function AdminList({
  collection,
  title,
  description,
  newHref,
  editHref,
  mapRow,
}: {
  collection: ListingCollection | "blogs";
  title: string;
  description: string;
  newHref: string;
  editHref: (slug: string) => string;
  mapRow: (item: Record<string, unknown>) => Row;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    listAllAdmin<Record<string, unknown>>(collection)
      .then((items) => {
        if (cancelled) return;
        setRows(items.map(mapRow).sort((a, b) => a.title.localeCompare(b.title)));
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, [collection, mapRow]);

  return (
    <div>
      <AdminPageHeader
        title={title}
        description={description}
        action={
          <Link href={newHref} className="btn-primary py-2 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add new
          </Link>
        }
      />
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {!rows && !error && <p className="text-sm text-muted">Loading…</p>}
      {rows && rows.length === 0 && (
        <div className="card p-8 text-center text-sm text-muted">
          No items yet.{" "}
          <Link href={newHref} className="font-semibold text-gold-600">
            Add the first one
          </Link>
          .
        </div>
      )}
      {rows && rows.length > 0 && (
        <div className="card overflow-hidden">
          <div className="hidden grid-cols-[1fr_120px_100px] gap-3 border-b border-line bg-ivory/80 px-5 py-3 text-xs font-semibold tracking-wide text-muted uppercase sm:grid">
            <span>Item</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
          <ul className="divide-y divide-line">
            {rows.map((row) => (
              <li key={row.slug} className="grid items-center gap-3 px-4 py-3.5 sm:grid-cols-[1fr_120px_100px] sm:px-5">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-navy-900">{row.title}</p>
                  <p className="truncate text-xs text-muted">{row.subtitle || row.slug}</p>
                </div>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    row.published !== false ? "bg-emerald-50 text-emerald-800" : "bg-sand text-muted"
                  }`}
                >
                  {row.published !== false ? "Published" : "Draft"}
                </span>
                <div className="sm:text-right">
                  <Link href={editHref(row.slug)} className="btn-outline inline-flex py-2 text-xs">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
