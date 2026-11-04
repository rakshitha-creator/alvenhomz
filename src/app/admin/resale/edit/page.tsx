"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResaleForm from "@/components/admin/ResaleForm";
import type { ResaleProperty } from "@/lib/types";
import { getAdminDoc } from "@/lib/firebase-data";
import { getResale } from "@/lib/data";
import { adminStartingPoint } from "@/lib/live-merge";

function EditInner() {
  const sp = useSearchParams();
  const slug = sp.get("slug") ?? "";
  const [item, setItem] = useState<ResaleProperty | null | undefined>(undefined);
  const [fromSite, setFromSite] = useState(false);

  useEffect(() => {
    if (!slug) {
      setItem(null);
      return;
    }
    getAdminDoc<ResaleProperty>("resaleProperties", slug).then((doc) => {
      const start = adminStartingPoint(getResale(slug), doc);
      setFromSite(start.fromSite);
      setItem(start.item);
    });
  }, [slug]);

  if (!slug) return <p className="text-sm text-red-600">Missing slug.</p>;
  if (item === undefined) return <p className="text-sm text-muted">Loading…</p>;
  if (!item) return <p className="text-sm text-red-600">Listing not found.</p>;
  return (
    <>
      {fromSite && (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Loaded the latest content and photos from the website. Review them, then click <strong>Save</strong> to store them in the admin.
        </p>
      )}
      <ResaleForm initial={item} />
    </>
  );
}

export default function EditResaleAdminPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <EditInner />
    </Suspense>
  );
}
