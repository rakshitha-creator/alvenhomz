"use client";

import { useEffect, useState } from "react";
import { getBanner } from "@/lib/firebase-data";
import type { BannerPageId, PageBanner } from "@/lib/types";
import { img } from "@/lib/utils";
import { cn } from "@/lib/utils";

function resolveFallback(fallback: string) {
  return img(fallback);
}

export default function BannerMedia({
  pageId,
  fallback,
  alt = "",
  className,
  opacity,
  priority = false,
}: {
  pageId: BannerPageId;
  fallback: string;
  alt?: string;
  className?: string;
  /** Extra opacity for dimmed PageHero backgrounds (e.g. 0.35). */
  opacity?: number;
  priority?: boolean;
}) {
  const [banner, setBanner] = useState<PageBanner | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getBanner(pageId)
      .then((b) => {
        if (!cancelled) setBanner(b);
      })
      .catch(() => {
        if (!cancelled) setBanner(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pageId]);

  const mediaUrl = banner?.mediaUrl || resolveFallback(fallback);
  const isVideo = banner?.mediaType === "video" && Boolean(banner.mediaUrl);
  const style = opacity !== undefined ? { opacity } : undefined;

  // Keep layout stable: show fallback immediately, swap when CMS media loads
  if (!ready && !banner) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={resolveFallback(fallback)}
        alt={alt}
        className={cn("absolute inset-0 -z-10 h-full w-full object-cover", className)}
        style={style}
        fetchPriority={priority ? "high" : undefined}
      />
    );
  }

  if (isVideo) {
    return (
      <video
        key={mediaUrl}
        src={mediaUrl}
        className={cn("absolute inset-0 -z-10 h-full w-full object-cover", className)}
        style={style}
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt || undefined}
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      key={mediaUrl}
      src={mediaUrl}
      alt={alt}
      className={cn("absolute inset-0 -z-10 h-full w-full object-cover", className)}
      style={style}
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
