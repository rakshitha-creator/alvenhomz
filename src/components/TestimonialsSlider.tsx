"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import { initials } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  const move = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current;
      if (!track || !testimonials.length) return;

      const maxStart = Math.max(0, testimonials.length - itemsPerView);
      const nextIndex = Math.min(maxStart, Math.max(0, activeIndex + direction * itemsPerView));
      const card = track.children[nextIndex] as HTMLElement | undefined;
      if (!card) return;

      const left = track.scrollLeft + card.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      track.scrollTo({ left, behavior });
    },
    [activeIndex, itemsPerView, testimonials.length],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const updatePosition = () => {
      const trackLeft = track.getBoundingClientRect().left;
      const cards = Array.from(track.children) as HTMLElement[];
      const firstVisible = cards.findIndex((card) => card.getBoundingClientRect().right > trackLeft + 1);
      if (firstVisible >= 0) setActiveIndex(firstVisible);
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updatePosition);
    };
    const updateLayout = () => {
      const card = track.children[0] as HTMLElement | undefined;
      if (!card) return;
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      const visibleCount = Math.max(1, Math.round((track.clientWidth + gap) / (card.getBoundingClientRect().width + gap)));
      setItemsPerView(visibleCount);
      updatePosition();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(track);
    updateLayout();

    return () => {
      track.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const total = testimonials.length;
  const start = total ? Math.min(activeIndex + 1, total) : 0;
  const end = Math.min(activeIndex + itemsPerView, total);

  return (
    <div role="region" aria-label="Homeowner testimonials" aria-roledescription="carousel">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted" aria-live="polite" aria-atomic="true">
          Showing {start}–{end} of {total} testimonials
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous testimonials"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-navy-900 transition-colors hover:border-gold-500 hover:bg-gold-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={activeIndex >= Math.max(0, total - itemsPerView)}
            aria-label="Next testimonials"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-navy-900 transition-colors hover:border-gold-500 hover:bg-gold-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-transparent"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Testimonial slides. Use the left and right arrow keys to browse."
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
        }}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-4"
      >
        {testimonials.map((testimonial, index) => (
          <Reveal
            as="li"
            key={testimonial.name}
            delay={index * 60}
            className="card flex h-full w-full shrink-0 snap-start flex-col p-7 md:basis-[calc((100%_-_1.25rem)/2)] lg:basis-[calc((100%_-_2.5rem)/3)]"
          >
            <Quote className="h-7 w-7 text-gold-500" aria-hidden="true" />
            <p className="mt-4 flex-1 leading-relaxed text-navy-800">&ldquo;{testimonial.quote}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-gold-300">
                {initials(testimonial.name)}
              </span>
              <div>
                <p className="text-sm font-semibold text-navy-900">{testimonial.name}</p>
                <p className="text-xs text-muted">{testimonial.context}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
