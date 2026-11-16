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
 * A listing detail page. `initial` is the listing as baked into the HTML at build time (admin data from Firestore,
 * else the built-in JSON), so the page renders fully with no loading state. After load, any newer admin save is
 * fetched and swapped in, so edits show without a rebuild. Without `initial` (the "_" shell used for listings added
 * after the build), the listing is loaded from the admin.
 */
export default function LiveDetail({ kind, initial, all }: { kind: Kind; initial?: Item; all?: Item[] }) {
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
  if (kind === "project") return <ProjectDetailView p={item as Project} all={all as Project[] | undefined} />;
  if (kind === "resale") return <ResaleDetailView p={item as ResaleProperty} all={all as ResaleProperty[] | undefined} />;
  return <RentalDetailView p={item as RentalProperty} all={all as RentalProperty[] | undefined} />;
}
