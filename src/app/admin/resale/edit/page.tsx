"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResaleForm from "@/components/admin/ResaleForm";
import type { ResaleProperty } from "@/lib/types";
import { getAdminDoc } from "@/lib/firebase-data";

function EditInner() {
  const sp = useSearchParams();
  const slug = sp.get("slug") ?? "";
  const [item, setItem] = useState<ResaleProperty | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      setItem(null);
      return;
    }
    getAdminDoc<ResaleProperty>("resaleProperties", slug).then(setItem);
  }, [slug]);

  if (!slug) return <p className="text-sm text-red-600">Missing slug.</p>;
  if (item === undefined) return <p className="text-sm text-muted">Loading…</p>;
  if (!item) return <p className="text-sm text-red-600">Listing not found.</p>;
  return <ResaleForm initial={item} />;
}

export default function EditResaleAdminPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <EditInner />
    </Suspense>
  );
}
