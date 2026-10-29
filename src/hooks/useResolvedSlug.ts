"use client";

import { useParams, usePathname } from "next/navigation";

/** Prefer route params; for `/…/_/` fallback shells, read the real slug from the URL path. */
export function useResolvedSlug(kindSegment: string) {
  const params = useParams();
  const pathname = usePathname() || "";
  const fromParams = typeof params?.slug === "string" ? params.slug : "";
  if (fromParams && fromParams !== "_") return fromParams;
  const parts = pathname.split("/").filter(Boolean);
  const idx = parts.indexOf(kindSegment);
  if (idx >= 0 && parts[idx + 1] && parts[idx + 1] !== "_") return parts[idx + 1];
  return fromParams === "_" ? "" : fromParams;
}
