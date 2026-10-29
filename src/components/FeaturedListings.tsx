"use client";

import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import Reveal from "./Reveal";
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

function featured(list: ListingCardData[], n = 3) {
  return list.filter((x) => x.featured).slice(0, n);
}

const FALLBACK: Record<ListingKind, () => ListingCardData[]> = {
  project: projectCards,
  resale: resaleCards,
  rental: rentalCards,
};

export default function FeaturedListings({ kind }: { kind: ListingKind }) {
  const [items, setItems] = useState<ListingCardData[]>(() => featured(FALLBACK[kind]()));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isFirebaseConfigured()) return;
      try {
        let cards: ListingCardData[] = [];
        if (kind === "project") {
          const rows = await listPublishedProjects();
          cards = rows.map(projectCard);
        } else if (kind === "resale") {
          const rows = await listPublishedResale();
          cards = rows.map(resaleCard);
        } else {
          const rows = await listPublishedRentals();
          cards = rows.map(rentalCard);
        }
        if (!cancelled && cards.length) setItems(featured(cards));
      } catch {
        // keep seed fallback
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [kind]);

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => (
        <Reveal as="li" key={p.slug} delay={i * 80}>
          <ListingCard item={p} />
        </Reveal>
      ))}
    </ul>
  );
}
