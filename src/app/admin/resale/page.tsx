"use client";

import { useCallback } from "react";
import AdminList from "@/components/admin/AdminList";

export default function AdminResalePage() {
  const mapRow = useCallback(
    (item: Record<string, unknown>) => ({
      slug: String(item.slug ?? ""),
      title: String(item.title ?? item.slug ?? ""),
      subtitle: String(item.locality ?? "") + (item.city ? `, ${item.city}` : ""),
      published: item.published !== false,
    }),
    [],
  );

  return (
    <AdminList
      collection="resaleProperties"
      title="Resale Properties"
      description="Manage resale listings shown on the Resale page."
      newHref="/admin/resale/new/"
      editHref={(slug) => `/admin/resale/edit/?slug=${encodeURIComponent(slug)}`}
      mapRow={mapRow}
    />
  );
}
