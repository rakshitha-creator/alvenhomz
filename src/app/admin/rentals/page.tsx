"use client";

import { useCallback } from "react";
import AdminList from "@/components/admin/AdminList";

export default function AdminRentalsPage() {
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
      collection="rentalProperties"
      title="Rental Properties"
      description="Manage rental listings shown on the Rentals page."
      newHref="/admin/rentals/new/"
      editHref={(slug) => `/admin/rentals/edit/?slug=${encodeURIComponent(slug)}`}
      mapRow={mapRow}
    />
  );
}
