"use client";

import { useCallback } from "react";
import AdminList from "@/components/admin/AdminList";

export default function AdminBlogsPage() {
  const mapRow = useCallback(
    (item: Record<string, unknown>) => ({
      slug: String(item.slug ?? ""),
      title: String(item.title ?? item.slug ?? ""),
      subtitle: String(item.author ?? ""),
      published: item.published !== false,
    }),
    [],
  );

  return (
    <AdminList
      collection="blogs"
      title="Blogs"
      description="Write and publish articles for the Blogs page."
      newHref="/admin/blogs/new/"
      editHref={(slug) => `/admin/blogs/edit/?slug=${encodeURIComponent(slug)}`}
      mapRow={mapRow}
    />
  );
}
