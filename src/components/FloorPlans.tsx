"use client";

import { useState } from "react";
import type { FloorPlan } from "@/lib/types";
import { cn, img } from "@/lib/utils";

export default function FloorPlans({ plans, onRequest }: { plans: FloorPlan[]; onRequest?: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const plan = plans[active];
  if (!plan) return null;

  return (
    <div>
      <div role="tablist" aria-label="Floor plans" className="no-scrollbar flex gap-2 overflow-x-auto">
        {plans.map((p, i) => (
          <button key={p.label} type="button" role="tab" aria-selected={i === active} onClick={() => setActive(i)} className={cn("chip shrink-0", i === active && "chip-active")}>
            {p.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-5 grid items-center gap-6 rounded-2xl border border-line bg-ivory p-5 sm:p-8 md:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-xl bg-white p-4">
          {plan.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img(plan.image)} alt={`${plan.label} floor plan`} loading="lazy" className="w-full" />
          ) : (
            <PlanSketch bhk={plan.bhk} label={plan.label} />
          )}
        </div>
        <div>
          <p className="eyebrow">Floor plan</p>
          <h3 className="mt-2 text-2xl font-semibold">{plan.label}</h3>
          <p className="mt-1 text-sm text-muted">Approx. {plan.area}</p>
          {!plan.image && (
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Indicative layout for illustration only. Request the official floor plan and brochure from our team for exact dimensions.
            </p>
          )}
          {onRequest && <div className="mt-6">{onRequest}</div>}
        </div>
      </div>
    </div>
  );
}

/** Schematic plan drawn from the BHK count — a placeholder until real plans are added. */
function PlanSketch({ bhk, label }: { bhk: number; label: string }) {
  const beds = Math.max(1, Math.min(bhk, 5));
  const W = 400;
  const H = 260;
  const bedW = W / beds;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Indicative ${label} layout`} className="w-full">
      <rect x="2" y="2" width={W - 4} height={H - 4} rx="6" className="fill-white stroke-navy-800" strokeWidth="3" />
      {Array.from({ length: beds }).map((_, i) => (
        <g key={i}>
          <rect x={2 + i * bedW} y="2" width={bedW - (i === beds - 1 ? 4 : 0)} height="110" className="fill-ivory stroke-navy-800" strokeWidth="2" />
          <text x={2 + i * bedW + bedW / 2} y="52" textAnchor="middle" className="fill-navy-800 text-[12px] font-semibold">
            {i === 0 ? "Master Bed" : `Bedroom ${i + 1}`}
          </text>
          <text x={2 + i * bedW + bedW / 2} y="70" textAnchor="middle" className="fill-muted text-[10px]">
            {i === 0 ? "+ Toilet" : ""}
          </text>
        </g>
      ))}
      <rect x="2" y="112" width={W * 0.62} height={H - 114} className="fill-white stroke-navy-800" strokeWidth="2" />
      <text x={W * 0.31} y="190" textAnchor="middle" className="fill-navy-800 text-[13px] font-semibold">Living & Dining</text>
      <rect x={W * 0.62 + 2} y="112" width={W * 0.38 - 4} height="80" className="fill-ivory stroke-navy-800" strokeWidth="2" />
      <text x={W * 0.81} y="157" textAnchor="middle" className="fill-navy-800 text-[12px] font-semibold">Kitchen</text>
      <rect x={W * 0.62 + 2} y="192" width={W * 0.38 - 4} height={H - 194} className="fill-gold-300/40 stroke-navy-800" strokeWidth="2" />
      <text x={W * 0.81} y="230" textAnchor="middle" className="fill-navy-800 text-[12px] font-semibold">Balcony</text>
    </svg>
  );
}
