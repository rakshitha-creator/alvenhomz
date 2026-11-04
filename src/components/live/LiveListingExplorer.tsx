"use client";

import { useEffect, useState } from "react";
import ListingExplorer from "@/components/ListingExplorer";
import { projectCard, projects, rentalCard, rentalProperties, resaleCard, resaleProperties, type ListingCardData } from "@/lib/data";
import { mergeLive } from "@/lib/live-merge";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Project, RentalProperty, ResaleProperty } from "@/lib/types";

type Kind = "project" | "resale" | "rental";

/**
 * The listing grid, starting from the site data in the build and then updated live from the admin (Firebase):
 * listings saved in the admin replace their built-in version (same slug), and new admin listings are added.
 */
export default function LiveListingExplorer({
  kind,
  items,
  suggestions,
}: {
  kind: Kind;
  items: ListingCardData[];
  suggestions: string[];
}) {
  const [cards, setCards] = useState(items);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let unsub: (() => void) | null = null;
    let cancelled = false;
    (async () => {
      const data = await import("@/lib/firebase-data");
      if (cancelled) return;
      const apply = (live: ListingCardData[]) => setCards(mergeBySlug(items, live));
      unsub =
        kind === "project"
          ? data.listenPublishedProjects((l: Project[]) => apply(merged(l, projects).map(projectCard)))
          : kind === "resale"
            ? data.listenPublishedResale((l: ResaleProperty[]) => apply(merged(l, resaleProperties).map(resaleCard)))
            : data.listenPublishedRentals((l: RentalProperty[]) => apply(merged(l, rentalProperties).map(rentalCard)));
    })().catch(() => {});
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [kind, items]);

  return <ListingExplorer kind={kind} items={cards} suggestions={suggestions} />;
}

/** Admin-saved live listings, each combined with its built-in version (newest wins). */
function merged<T extends Project | ResaleProperty | RentalProperty>(live: T[], built: T[]): T[] {
  return live.map((x) => mergeLive(built.find((b) => b.slug === x.slug), x)).filter((x): x is T => !!x);
}

function mergeBySlug(base: ListingCardData[], live: ListingCardData[]) {
  const bySlug = new Map(live.map((c) => [c.slug, c]));
  const merged = base.map((c) => bySlug.get(c.slug) ?? c);
  const extra = live.filter((c) => !base.some((b) => b.slug === c.slug));
  return [...extra, ...merged];
}
