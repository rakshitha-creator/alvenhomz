"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RentalForm from "@/components/admin/RentalForm";
import type { RentalProperty } from "@/lib/types";
import { getAdminDoc } from "@/lib/firebase-data";

function EditInner() {
  const sp = useSearchParams();
  const slug = sp.get("slug") ?? "";
  const [item, setItem] = useState<RentalProperty | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      setItem(null);
      return;
    }
    getAdminDoc<RentalProperty>("rentalProperties", slug).then(setItem);
  }, [slug]);

  if (!slug) return <p className="text-sm text-red-600">Missing slug.</p>;
  if (item === undefined) return <p className="text-sm text-muted">Loading…</p>;
  if (!item) return <p className="text-sm text-red-600">Listing not found.</p>;
  return <RentalForm initial={item} />;
}

export default function EditRentalAdminPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <EditInner />
    </Suspense>
  );
}
