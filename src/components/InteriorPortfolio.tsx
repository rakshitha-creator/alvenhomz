"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import type { InteriorProject } from "@/lib/types";
import { cn, img } from "@/lib/utils";

export default function InteriorPortfolio({ items }: { items: InteriorProject[] }) {
  const categories = useMemo(() => ["All", ...new Set(items.map((i) => i.category))], [items]);
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<InteriorProject | null>(null);
  const [photo, setPhoto] = useState(0);
  const shown = cat === "All" ? items : items.filter((i) => i.category === cat);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setPhoto((p) => (p + 1) % open.gallery.length);
      if (e.key === "ArrowLeft") setPhoto((p) => (p - 1 + open.gallery.length) % open.gallery.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div>
      <div role="tablist" aria-label="Filter portfolio" className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm transition",
              cat === c ? "border-gold-400 bg-gold-500 font-semibold text-navy-950" : "border-white/20 text-white/80 hover:border-white/50",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item, i) => (
          <li key={item.slug} className={cn("animate-fade-up", i % 5 === 0 && "lg:row-span-2")} style={{ animationDelay: `${i * 50}ms` }}>
            <button
              type="button"
              onClick={() => {
                setOpen(item);
                setPhoto(0);
              }}
              className="group relative block h-full min-h-72 w-full overflow-hidden rounded-2xl text-left"
              aria-label={`View ${item.title} project`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(item.image, i % 5 === 0 ? "lg" : "sm")} alt={`${item.title} – ${item.category}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent opacity-90 transition group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-300 uppercase">{item.category}</p>
                <p className="mt-1.5 font-display text-xl font-semibold text-white">{item.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
                  <MapPin className="h-3 w-3" /> {item.location}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={open.title} className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/95 p-4 animate-fade-in">
          <button type="button" className="absolute inset-0" aria-label="Close" onClick={() => setOpen(null)} />
          <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white lg:grid-cols-[1.6fr_1fr]">
            <div className="relative bg-navy-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={open.gallery[photo]} src={img(open.gallery[photo])} alt={`${open.title} – photo ${photo + 1}`} className="aspect-[4/3] w-full object-cover animate-fade-in" />
              {open.gallery.length > 1 && (
                <>
                  <button type="button" onClick={() => setPhoto((p) => (p - 1 + open.gallery.length) % open.gallery.length)} aria-label="Previous photo" className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => setPhoto((p) => (p + 1) % open.gallery.length)} aria-label="Next photo" className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <button type="button" onClick={() => setOpen(null)} aria-label="Close" autoFocus className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow lg:bg-ivory">
                <X className="h-4 w-4" />
              </button>
              <p className="eyebrow">{open.category}</p>
              <h3 className="mt-2 text-2xl font-semibold">{open.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" /> {open.location}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-navy-800">{open.description}</p>
              <div className="mt-6 flex gap-2">
                {open.gallery.map((g, i) => (
                  <button key={g} type="button" onClick={() => setPhoto(i)} aria-label={`Show photo ${i + 1}`} className={cn("h-14 w-16 overflow-hidden rounded-lg border-2", i === photo ? "border-gold-500" : "border-transparent")}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(g, "sm")} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
