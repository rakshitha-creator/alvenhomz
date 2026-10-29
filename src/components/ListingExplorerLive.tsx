"use client";

import { useEffect, useState } from "react";
import ListingExplorer, { ExplorerSkeleton } from "./ListingExplorer";
import {
  projectCard,
  projectCards,
  resaleCard,
  resaleCards,
  rentalCard,
  rentalCards,
  type ListingCardData,
} from "@/lib/data";
import type { ListingKind } from "@/lib/types";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  listPublishedProjects,
  listPublishedRentals,
  listPublishedResale,
} from "@/lib/firebase-data";

const FALLBACK: Record<ListingKind, () => ListingCardData[]> = {
  project: projectCards,
  resale: resaleCards,
  rental: rentalCards,
};

export default function ListingExplorerLive({ kind }: { kind: ListingKind }) {
  const [items, setItems] = useState<ListingCardData[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isFirebaseConfigured()) {
        if (!cancelled) setItems(FALLBACK[kind]());
        return;
      }
      try {
        if (kind === "project") {
          const rows = await listPublishedProjects();
          if (!cancelled) setItems(rows.length ? rows.map(projectCard) : FALLBACK.project());
        } else if (kind === "resale") {
          const rows = await listPublishedResale();
          if (!cancelled) setItems(rows.length ? rows.map(resaleCard) : FALLBACK.resale());
        } else {
          const rows = await listPublishedRentals();
          if (!cancelled) setItems(rows.length ? rows.map(rentalCard) : FALLBACK.rental());
        }
      } catch {
        if (!cancelled) setItems(FALLBACK[kind]());
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [kind]);

  if (!items) return <ExplorerSkeleton />;
  return <ListingExplorer kind={kind} items={items} />;
}
