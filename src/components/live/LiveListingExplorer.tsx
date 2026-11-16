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
 * `items` come from the build (admin data baked in), so the grid is in the static HTML; live updates follow.
 */
export default function LiveListingExplorer({
  kind,
  items,
  suggestions,
  emptyMessage,
}: {
  kind: Kind;
  items: ListingCardData[];
  suggestions: string[];
  emptyMessage?: string;
}) {
  const [cards, setCards] = useState<ListingCardData[]>(items);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let unsub: (() => void) | null = null;
    let cancelled = false;
    (async () => {
      const data = await import("@/lib/firebase-data");
      if (cancelled) return;
      const apply = (live: ListingCardData[]) => setCards(mergeBySlug(items, live));
      const pick = <T extends Project | ResaleProperty | RentalProperty>(l: T[], built: T[]) => merged(l, built);
      unsub =
        kind === "project"
          ? data.listenPublishedProjects((l: Project[]) => apply(pick(l, projects).map(projectCard)))
          : kind === "resale"
            ? data.listenPublishedResale((l: ResaleProperty[]) => apply(pick(l, resaleProperties).map(resaleCard)))
            : data.listenPublishedRentals((l: RentalProperty[]) => apply(pick(l, rentalProperties).map(rentalCard)));
    })().catch(() => {});
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [kind, items]);

  return <ListingExplorer kind={kind} items={cards} suggestions={suggestions} emptyMessage={emptyMessage} />;
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
