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
  const [items, setItems] = useState<ListingCardData[]>(() =>
    isFirebaseConfigured() ? [] : featured(FALLBACK[kind]()),
  );
  const [loading, setLoading] = useState(() => isFirebaseConfigured());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isFirebaseConfigured()) {
        if (!cancelled) {
          setItems(featured(FALLBACK[kind]()));
          setLoading(false);
        }
        return;
      }
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
        // Prefer featured; if none marked featured, show first 3 published.
        const top = featured(cards);
        if (!cancelled) setItems(top.length ? top : cards.slice(0, 3));
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [kind]);

  if (loading) {
    return <p className="text-sm text-muted" aria-busy="true">Loading listings…</p>;
  }

  if (!items.length) {
    return <p className="text-sm text-muted">No featured listings published yet.</p>;
  }

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
