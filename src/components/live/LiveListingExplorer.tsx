"use client";

import { useEffect, useState } from "react";
import ListingExplorer, { ExplorerSkeleton } from "@/components/ListingExplorer";
import { projectCard, projects, rentalCard, rentalProperties, resaleCard, resaleProperties, type ListingCardData } from "@/lib/data";
import { mergeLive } from "@/lib/live-merge";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Project, RentalProperty, ResaleProperty } from "@/lib/types";

type Kind = "project" | "resale" | "rental";

/**
 * The listing grid, starting from the site data in the build and then updated live from the admin (Firebase):
 * listings saved in the admin replace their built-in version (same slug), and new admin listings are added.
 * With `firebaseOnly`, the grid waits for Firebase and shows only the admin's published listings and photos — the
 * built-in data is used only if Firebase isn't configured or can't be reached.
 */
export default function LiveListingExplorer({
  kind,
  items,
  suggestions,
  firebaseOnly = false,
}: {
  kind: Kind;
  items: ListingCardData[];
  suggestions: string[];
  firebaseOnly?: boolean;
}) {
  const [cards, setCards] = useState<ListingCardData[] | null>(firebaseOnly ? null : items);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setCards(items);
      return;
    }
    let unsub: (() => void) | null = null;
    let cancelled = false;
    // If Firebase hasn't answered in 10 s (offline, blocked), fall back to the built-in listings.
    const fallback = setTimeout(() => setCards((c) => c ?? items), 10000);
    (async () => {
      const data = await import("@/lib/firebase-data");
      if (cancelled) return;
      const apply = (live: ListingCardData[]) => setCards(firebaseOnly ? inSiteOrder(items, live) : mergeBySlug(items, live));
      const pick = <T extends Project | ResaleProperty | RentalProperty>(l: T[], built: T[]) => (firebaseOnly ? l : merged(l, built));
      unsub =
        kind === "project"
          ? data.listenPublishedProjects((l: Project[]) => apply(pick(l, projects).map(projectCard)))
          : kind === "resale"
            ? data.listenPublishedResale((l: ResaleProperty[]) => apply(pick(l, resaleProperties).map(resaleCard)))
            : data.listenPublishedRentals((l: RentalProperty[]) => apply(pick(l, rentalProperties).map(rentalCard)));
    })().catch(() => setCards((c) => c ?? items));
    return () => {
      cancelled = true;
      clearTimeout(fallback);
      unsub?.();
    };
  }, [kind, items]);

  if (!cards) return <ExplorerSkeleton />;
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

/** Firebase listings only, in the site's usual order (known slugs first, new admin listings at the front). */
function inSiteOrder(base: ListingCardData[], live: ListingCardData[]) {
  const rank = new Map(base.map((c, i) => [c.slug, i]));
  return [...live].sort((a, b) => (rank.get(a.slug) ?? -1) - (rank.get(b.slug) ?? -1));
}
