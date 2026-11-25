"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A swipeable card slider on phones and small tablets that turns into a normal grid from `md` up.
 * Children should be `<li>` items. Below the track it shows prev/next buttons, dots and a "1 / 6" count,
 * so it's obvious there are more cards to swipe to.
 */
export default function MobileSlider({
  children,
  label,
  dark = false,
  className,
}: {
  children: React.ReactNode;
  label: string;
  dark?: boolean;
  className?: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  const step = useCallback(() => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 1;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return first.offsetWidth + gap;
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        setActive(atEnd ? count - 1 : Math.round(el.scrollLeft / step()));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [count, step]);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(count - 1, i));
    el.scrollTo({ left: target * step(), behavior: "smooth" });
  };

  const btn = cn(
    "flex h-10 w-10 items-center justify-center rounded-full border transition disabled:opacity-30",
    dark ? "border-white/25 text-white hover:bg-white/10" : "border-line bg-white text-navy-900 shadow-card hover:border-gold-500",
  );

  return (
    <div className={className}>
      <ul
        ref={track}
        aria-label={label}
        className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
      >
        {children}
      </ul>

      {count > 1 && (
        // Arrows sit on the left so the floating WhatsApp button (bottom-right) never covers them.
        <div className="mt-6 flex items-center gap-4 md:hidden">
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous" onClick={() => go(active - 1)} disabled={active === 0} className={btn}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Next" onClick={() => go(active + 1)} disabled={active === count - 1} className={btn}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5" role="tablist" aria-label={`${label} slides`}>
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show card ${i + 1} of ${count}`}
                onClick={() => go(i)}
                className="flex h-6 items-center"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    i === active ? "w-6 bg-gold-500" : cn("w-1.5", dark ? "bg-white/30" : "bg-navy-900/20"),
                  )}
                />
              </button>
            ))}
          </div>
          <span className={cn("text-sm tabular-nums", dark ? "text-white/70" : "text-muted")}>
            {active + 1} / {count}
          </span>
        </div>
      )}
    </div>
  );
}
