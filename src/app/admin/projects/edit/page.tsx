"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project } from "@/lib/types";
import { getAdminDoc } from "@/lib/firebase-data";

function EditInner() {
  const sp = useSearchParams();
  const slug = sp.get("slug") ?? "";
  const [item, setItem] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      setItem(null);
      return;
    }
    getAdminDoc<Project>("projects", slug).then(setItem);
  }, [slug]);

  if (!slug) return <p className="text-sm text-red-600">Missing slug.</p>;
  if (item === undefined) return <p className="text-sm text-muted">Loading…</p>;
  if (!item) return <p className="text-sm text-red-600">Project not found.</p>;
  return <ProjectForm initial={item} />;
}

export default function EditProjectAdminPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <EditInner />
    </Suspense>
  );
}
