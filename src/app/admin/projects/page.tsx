"use client";

import { useCallback } from "react";
import AdminList from "@/components/admin/AdminList";

export default function AdminProjectsPage() {
  const mapRow = useCallback(
    (item: Record<string, unknown>) => ({
      slug: String(item.slug ?? ""),
      title: String(item.name ?? item.slug ?? ""),
      subtitle: String(item.locality ?? "") + (item.city ? `, ${item.city}` : ""),
      published: item.published !== false,
    }),
    [],
  );

  return (
    <AdminList
      collection="projects"
      title="New Projects"
      description="Manage new-launch and under-construction projects."
      newHref="/admin/projects/new/"
      editHref={(slug) => `/admin/projects/edit/?slug=${encodeURIComponent(slug)}`}
      mapRow={mapRow}
    />
  );
}
