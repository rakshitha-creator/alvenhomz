"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn, img } from "@/lib/utils";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;

  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go]);

  const alt = (i: number) => `${title} – photo ${i + 1} of ${count}`;

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
        <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-sand sm:col-span-3 sm:row-span-2 sm:aspect-auto sm:h-[460px]">
          <button type="button" onClick={() => setOpen(true)} className="block h-full w-full" aria-label="Open photo gallery">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(images[index])} alt={alt(index)} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]" fetchPriority="high" />
          </button>
          <span className="pointer-events-none absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-navy-950/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <Expand className="h-3.5 w-3.5" /> {index + 1} / {count}
          </span>
          {count > 1 && (
            <>
              <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
        {images.slice(1, 3).map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setIndex(i + 1);
              setOpen(true);
            }}
            className="relative hidden overflow-hidden rounded-2xl bg-sand sm:block"
            aria-label={`View photo ${i + 2}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(name, "sm")} alt={alt(i + 1)} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
            {i === 1 && count > 3 && (
              <span className="absolute inset-0 flex items-center justify-center bg-navy-950/55 text-sm font-semibold text-white">+{count - 3} photos</span>
            )}
          </button>
        ))}
      </div>

      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto sm:hidden">
        {images.map((name, i) => (
          <button key={name} type="button" onClick={() => setIndex(i)} aria-label={`Show photo ${i + 1}`} className={cn("h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2", i === index ? "border-gold-500" : "border-transparent")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(name, "sm")} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`${title} photos`} className="fixed inset-0 z-[70] flex flex-col bg-navy-950/95 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
            <p className="text-sm">
              <span className="font-display text-lg">{title}</span>
              <span className="ml-3 text-white/60">{index + 1} / {count}</span>
            </p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close gallery" autoFocus className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={images[index]} src={img(images[index])} alt={alt(index)} className="max-h-full max-w-full rounded-xl object-contain animate-fade-in" />
            {count > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
          <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 pb-5">
            {images.map((name, i) => (
              <button key={name} type="button" onClick={() => setIndex(i)} aria-label={`Show photo ${i + 1}`} className={cn("h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition", i === index ? "border-gold-400" : "border-transparent opacity-60 hover:opacity-100")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(name, "sm")} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
