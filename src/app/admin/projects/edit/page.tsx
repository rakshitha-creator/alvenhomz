"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project } from "@/lib/types";
import { getAdminDoc } from "@/lib/firebase-data";
import { getProject } from "@/lib/data";
import { adminStartingPoint } from "@/lib/live-merge";

function EditInner() {
  const sp = useSearchParams();
  const slug = sp.get("slug") ?? "";
  const [item, setItem] = useState<Project | null | undefined>(undefined);
  const [fromSite, setFromSite] = useState(false);

  useEffect(() => {
    if (!slug) {
      setItem(null);
      return;
    }
    getAdminDoc<Project>("projects", slug).then((doc) => {
      const start = adminStartingPoint(getProject(slug), doc);
      setFromSite(start.fromSite);
      setItem(start.item);
    });
  }, [slug]);

  if (!slug) return <p className="text-sm text-red-600">Missing slug.</p>;
  if (item === undefined) return <p className="text-sm text-muted">Loading…</p>;
  if (!item) return <p className="text-sm text-red-600">Project not found.</p>;
  return (
    <>
      {fromSite && (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Loaded the latest content and photos from the website. Review them, then click <strong>Save</strong> to store them in the admin.
        </p>
      )}
      <ProjectForm initial={item} />
    </>
  );
}

export default function EditProjectAdminPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <EditInner />
    </Suspense>
  );
}
