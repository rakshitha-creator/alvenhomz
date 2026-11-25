"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ClipboardList, Hammer, KeyRound, MessagesSquare, Palette, PencilRuler, type LucideIcon } from "lucide-react";
import type { ProcessStep } from "@/lib/types";
import { cn } from "@/lib/utils";

/** One icon per design-process step, in order. */
const ICONS: LucideIcon[] = [MessagesSquare, ClipboardList, PencilRuler, Palette, Hammer, KeyRound];

/**
 * "Our design process" as a scroll story: the heading and a progress counter stay pinned on the left while the
 * steps scroll past on the right. The step nearest the middle of the screen lights up and the gold line fills
 * to it, so the process plays out one step at a time. Respects reduced motion (all steps simply show).
 */
export default function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLLIElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      // A thin band across the middle of the viewport decides the active step.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  const progress = steps.length > 1 ? active / (steps.length - 1) : 1;

  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      {/* Pinned intro + progress */}
      <div className="lg:sticky lg:top-32 lg:self-start">
        <p className="eyebrow">How we work</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">Our design process</h2>
        <p className="mt-3 font-display text-lg text-gold-700 italic sm:text-xl">From first sketch to the final finish.</p>

        <div className="mt-10 hidden lg:block">
          <p className="font-display text-7xl leading-none font-semibold text-navy-900 tabular-nums">
            {String(active + 1).padStart(2, "0")}
            <span className="ml-2 align-top text-2xl text-muted">/ {String(steps.length).padStart(2, "0")}</span>
          </p>
          <p key={active} className="mt-3 animate-fade-up text-base font-semibold text-gold-700">
            {steps[active]?.title}
          </p>
          <div className="mt-6 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-gold-500 transition-[width] duration-500 ease-out" style={{ width: `${((active + 1) / steps.length) * 100}%` }} />
          </div>
          <ul className="mt-6 flex max-w-sm gap-2" aria-hidden>
            {steps.map((s, i) => (
              <li key={s.title} className={cn("h-2 flex-1 rounded-full transition-colors duration-500", i <= active ? "bg-espresso-900" : "bg-line")} />
            ))}
          </ul>
        </div>

        <a href="#interior-consultation" className="btn-primary mt-10 hidden lg:inline-flex">
          Start with step one <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Steps */}
      <ol className="relative">
        {/* Track and gold fill that grows to the active step */}
        <span aria-hidden className="absolute top-7 bottom-7 left-7 w-px bg-line" />
        <span
          aria-hidden
          className="absolute top-7 left-7 w-px origin-top bg-gold-500 transition-[height] duration-500 ease-out motion-reduce:transition-none"
          style={{ height: `calc((100% - 3.5rem) * ${progress})` }}
        />
        {steps.map((step, i) => {
          const Icon = ICONS[i] ?? MessagesSquare;
          const on = i === active;
          const done = i < active;
          return (
            <li
              key={step.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className={cn(
                "relative flex gap-6 pb-14 transition-opacity duration-500 last:pb-0 motion-reduce:opacity-100 lg:pb-24",
                on || done ? "opacity-100" : "opacity-45",
              )}
            >
              <span
                className={cn(
                  "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500",
                  on
                    ? "scale-110 border-gold-500 bg-espresso-900 text-gold-300 shadow-lift"
                    : done
                      ? "border-gold-500 bg-gold-500 text-espresso-950"
                      : "border-line bg-white text-muted",
                )}
              >
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div
                className={cn(
                  "flex-1 rounded-2xl border p-6 transition-all duration-500 sm:p-7",
                  on ? "border-gold-400 bg-white shadow-lift" : "border-transparent bg-transparent",
                )}
              >
                <p className="text-xs font-semibold tracking-[0.2em] text-gold-700 uppercase">Step {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-navy-800">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <a href="#interior-consultation" className="btn-primary justify-self-start lg:hidden">
        Start with step one <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
