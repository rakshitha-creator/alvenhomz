"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import type { BlogPost } from "@/lib/types";
import { getAdminDoc } from "@/lib/firebase-data";

function EditInner() {
  const sp = useSearchParams();
  const slug = sp.get("slug") ?? "";
  const [item, setItem] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      setItem(null);
      return;
    }
    getAdminDoc<BlogPost>("blogs", slug).then(setItem);
  }, [slug]);

  if (!slug) return <p className="text-sm text-red-600">Missing slug.</p>;
  if (item === undefined) return <p className="text-sm text-muted">Loading…</p>;
  if (!item) return <p className="text-sm text-red-600">Post not found.</p>;
  return <BlogForm initial={item} />;
}

export default function EditBlogAdminPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <EditInner />
    </Suspense>
  );
}
