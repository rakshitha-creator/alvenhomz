"use client";

import { useEffect, useState } from "react";
import ProjectDetailView from "./ProjectDetailView";
import RentalDetailView from "./RentalDetailView";
import ResaleDetailView from "./ResaleDetailView";
import { isFirebaseConfigured } from "@/lib/firebase";
import { mergeLive } from "@/lib/live-merge";
import { useResolvedSlug } from "@/hooks/useResolvedSlug";
import type { Project, RentalProperty, ResaleProperty } from "@/lib/types";

type Kind = "project" | "resale" | "rental";
type Item = Project | ResaleProperty | RentalProperty;

const SEGMENT: Record<Kind, string> = { project: "new-projects", resale: "resale-properties", rental: "rental-properties" };

/**
 * Renders a listing detail page from the site data baked into the build, then swaps in the live copy from the admin
 * (Firebase) so edits made there — photos, order, prices, text — show without a rebuild. Fields missing from the live
 * copy fall back to the built-in ones. Only copies saved through the admin are used. Without `initial` (the "_" shell), the listing is loaded from the admin only.
 */
export default function LiveDetail({ kind, initial }: { kind: Kind; initial?: Item }) {
  const slug = useResolvedSlug(SEGMENT[kind]) || initial?.slug || "";
  const [item, setItem] = useState<Item | null | undefined>(initial);

  useEffect(() => {
    if (!slug || !isFirebaseConfigured()) {
      if (!initial) setItem(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { getProjectBySlug, getRentalBySlug, getResaleBySlug } = await import("@/lib/firebase-data");
        const get = kind === "project" ? getProjectBySlug : kind === "resale" ? getResaleBySlug : getRentalBySlug;
        const live = (await get(slug)) as Item | null;
        if (cancelled) return;
        // Untouched seed copies in Firebase are older than the site data, so only admin-saved copies win.
        const merged = mergeLive(initial, live);
        if (merged) setItem(merged);
        else if (!initial) setItem(null);
      } catch {
        if (!cancelled && !initial) setItem(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind, slug, initial]);

  useEffect(() => {
    if (!initial && item) document.title = `${"title" in item ? item.title : item.name} | Alven Homz`;
  }, [initial, item]);

  if (item === undefined) return <div className="container-x py-24 text-sm text-muted">Loading…</div>;
  if (!item) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-semibold">Listing not found</h1>
        <p className="mt-2 text-muted">It may have been sold, rented out or removed.</p>
      </div>
    );
  }
  if (kind === "project") return <ProjectDetailView p={item as Project} />;
  if (kind === "resale") return <ResaleDetailView p={item as ResaleProperty} />;
  return <RentalDetailView p={item as RentalProperty} />;
}
