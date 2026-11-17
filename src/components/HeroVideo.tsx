"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Homepage hero background. The poster photo renders immediately (it is the page's Largest Contentful Paint);
 * the video loads only after the page has finished loading — a 720p (~1 MB) file on phones, full HD on large
 * screens — and is skipped entirely for visitors with Data Saver, a slow connection or reduced motion.
 */
export default function HeroVideo({
  poster,
  mobilePoster,
  video,
  mobileVideo,
}: {
  poster: string;
  /** Portrait poster for phones/tablets (below 1024px); falls back to `poster`. */
  mobilePoster?: string;
  video: string;
  mobileVideo: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /(^|-)2g$|^3g$/.test(conn?.effectiveType ?? "")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pick = () => setSrc(window.matchMedia("(min-width: 1024px)").matches ? video : mobileVideo);
    if (document.readyState === "complete") {
      const t = setTimeout(pick, 300);
      return () => clearTimeout(t);
    }
    window.addEventListener("load", pick, { once: true });
    return () => window.removeEventListener("load", pick);
  }, [video, mobileVideo]);

  useEffect(() => {
    if (src) ref.current?.play().catch(() => {});
  }, [src]);

  return (
    <>
      <picture>
        {mobilePoster && <source media="(max-width: 1023px)" srcSet={mobilePoster} />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt="" aria-hidden fetchPriority="high" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      </picture>
      {src && (
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </>
  );
}
