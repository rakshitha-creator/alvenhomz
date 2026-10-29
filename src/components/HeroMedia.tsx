"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const VIDEO = "/videos/home-banner.mp4";
const STILLS = [
  { src: "/images/brand/hero-1.webp", alt: "Luxury living room with city views" },
  { src: "/images/brand/hero-2.webp", alt: "Family signing for their new home with an Alven Homz advisor" },
  { src: "/images/brand/hero-3.webp", alt: "Family enjoying their spacious new home" },
];

/**
 * Homepage banner: plays the brand video, muted and looping.
 * Visitors with reduced motion or data saver on (or if the video fails) get the stills instead —
 * a slow crossfade for data saver, a single still for reduced motion.
 */
export default function HeroMedia() {
  const [mode, setMode] = useState<"video" | "slides" | "still">("video");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce) setMode("still");
    else if (saveData) setMode("slides");
  }, []);

  useEffect(() => {
    if (mode !== "slides") return;
    const t = setInterval(() => setIndex((i) => (i + 1) % STILLS.length), 6000);
    return () => clearInterval(t);
  }, [mode]);

  if (mode === "video") {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={STILLS[0].src}
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      >
        <source src={VIDEO} type="video/mp4" onError={() => setMode("slides")} />
      </video>
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      {STILLS.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s.src}
          src={s.src}
          alt={i === index ? s.alt : ""}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms]", i === index ? "opacity-100" : "opacity-0")}
          fetchPriority={i === 0 ? "high" : "low"}
        />
      ))}
    </div>
  );
}
