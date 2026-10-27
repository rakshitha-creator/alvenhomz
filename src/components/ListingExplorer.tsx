"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, SearchX, SlidersHorizontal, X } from "lucide-react";
import ListingCard from "./ListingCard";
import LocationInput from "./LocationInput";
import type { ListingCardData } from "@/lib/data";
import type { ListingKind } from "@/lib/types";
import { FURNISHING, PROJECT_STATUS, PROPERTY_TYPES, TENANT_PREFERENCE } from "@/lib/constants";
import { cn, formatINR } from "@/lib/utils";

const PAGE_SIZE = 9;

const BUY_STEPS = [2500000, 5000000, 7500000, 10000000, 15000000, 20000000, 30000000, 50000000, 75000000];
const RENT_STEPS = [10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000];

const SORTS = [
  { value: "", label: "Recommended" },
  { value: "latest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

type Filters = {
  q: string;
  city: string;
  type: string[];
  bhk: string[];
  status: string[];
  furnishing: string[];
  tenant: string[];
  min: string;
  max: string;
  sort: string;
  page: number;
};

function readFilters(sp: URLSearchParams): Filters {
  const list = (k: string) => (sp.get(k) ?? "").split(",").filter(Boolean);
  return {
    q: sp.get("q") ?? "",
    city: sp.get("city") ?? "",
    type: list("type"),
    bhk: list("bhk"),
    status: list("status"),
    furnishing: list("furnishing"),
    tenant: list("tenant"),
    min: sp.get("min") ?? "",
    max: sp.get("max") ?? "",
    sort: sp.get("sort") ?? "",
    page: Math.max(1, Number(sp.get("page")) || 1),
  };
}

function toQuery(f: Filters) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.city) p.set("city", f.city);
  for (const k of ["type", "bhk", "status", "furnishing", "tenant"] as const) if (f[k].length) p.set(k, f[k].join(","));
  if (f.min) p.set("min", f.min);
  if (f.max) p.set("max", f.max);
  if (f.sort) p.set("sort", f.sort);
  if (f.page > 1) p.set("page", String(f.page));
  return p.toString();
}

function applyFilters(items: ListingCardData[], f: Filters) {
  const tokens = f.q
    .toLowerCase()
    .split(/[,\s]+/)
    .filter((t) => t.length > 1);
  const min = Number(f.min) || 0;
  const max = Number(f.max) || 0;

  const out = items.filter((it) => {
    if (tokens.length) {
      const hay = `${it.title} ${it.subtitle} ${it.locality} ${it.city} ${it.typeLabel}`.toLowerCase();
      if (!tokens.every((t) => hay.includes(t))) return false;
    }
    if (f.city && it.city !== f.city) return false;
    if (f.type.length && !f.type.includes(it.propertyType)) return false;
    if (f.bhk.length && !it.bhks.some((b) => f.bhk.includes(b >= 5 ? "5" : String(b)))) return false;
    if (f.status.length && !f.status.includes(it.status ?? "")) return false;
    if (f.furnishing.length && !f.furnishing.includes(it.furnishing ?? "")) return false;
    if (f.tenant.length && !(it.tenantPreference ?? []).some((t) => f.tenant.includes(t))) return false;
    if (min && it.price < min) return false;
    if (max && it.price > max) return false;
    return true;
  });

  switch (f.sort) {
    case "latest":
      return out.sort((a, b) => b.date.localeCompare(a.date));
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    default:
      return out.sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date));
  }
}

export default function ListingExplorer({
  kind,
  items,
  suggestions,
}: {
  kind: ListingKind;
  items: ListingCardData[];
  suggestions: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => readFilters(new URLSearchParams(searchParams.toString())), [searchParams]);
  const [drawer, setDrawer] = useState(false);
  const [q, setQ] = useState(filters.q);

  useEffect(() => setQ(filters.q), [filters.q]);
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  const update = (patch: Partial<Filters>, keepPage = false) => {
    const next = { ...filters, ...patch, page: keepPage ? (patch.page ?? filters.page) : 1 };
    const qs = toQuery(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Debounce free-text location search.
  useEffect(() => {
    if (q === filters.q) return;
    const t = setTimeout(() => update({ q }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const toggle = (key: "type" | "bhk" | "status" | "furnishing" | "tenant", value: string) => {
    const cur = filters[key];
    update({ [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] });
  };

  const results = useMemo(() => applyFilters([...items], filters), [items, filters]);
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cities = useMemo(() => [...new Set(items.map((i) => i.city))].sort(), [items]);
  const types = useMemo(() => [...new Set(items.map((i) => i.propertyType))], [items]);
  const steps = kind === "rental" ? RENT_STEPS : BUY_STEPS;
  const priceLabel = kind === "rental" ? "Monthly rent" : "Budget";

  const activeCount =
    (filters.q ? 1 : 0) +
    (filters.city ? 1 : 0) +
    filters.type.length +
    filters.bhk.length +
    filters.status.length +
    filters.furnishing.length +
    filters.tenant.length +
    (filters.min ? 1 : 0) +
    (filters.max ? 1 : 0);

  const clearAll = () => {
    setQ("");
    router.replace(filters.sort ? `${pathname}?sort=${filters.sort}` : pathname, { scroll: false });
  };

  const panel = (
    <div className="space-y-7">
      <FilterGroup title="Location">
        <LocationInput value={q} onChange={setQ} suggestions={suggestions} placeholder="Locality, city or project" />
        <label htmlFor={`${kind}-city`} className="sr-only">City</label>
        <select id={`${kind}-city`} value={filters.city} onChange={(e) => update({ city: e.target.value })} className="input mt-3">
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title={priceLabel}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${kind}-min`} className="sr-only">Minimum</label>
            <select id={`${kind}-min`} value={filters.min} onChange={(e) => update({ min: e.target.value })} className="input px-3">
              <option value="">No min</option>
              {steps.map((s) => (
                <option key={s} value={s} disabled={!!filters.max && s >= Number(filters.max)}>{formatINR(s)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${kind}-max`} className="sr-only">Maximum</label>
            <select id={`${kind}-max`} value={filters.max} onChange={(e) => update({ max: e.target.value })} className="input px-3">
              <option value="">No max</option>
              {steps.map((s) => (
                <option key={s} value={s} disabled={!!filters.min && s <= Number(filters.min)}>{formatINR(s)}</option>
              ))}
            </select>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="BHK">
        <Chips
          options={["1", "2", "3", "4", "5"].map((v) => ({ value: v, label: v === "5" ? "5+ BHK" : `${v} BHK` }))}
          selected={filters.bhk}
          onToggle={(v) => toggle("bhk", v)}
        />
      </FilterGroup>

      <FilterGroup title="Property type">
        <Chips options={types.map((t) => ({ value: t, label: PROPERTY_TYPES[t] ?? t }))} selected={filters.type} onToggle={(v) => toggle("type", v)} />
      </FilterGroup>

      {kind === "project" && (
        <FilterGroup title="Project status">
          <Chips options={Object.entries(PROJECT_STATUS).map(([value, label]) => ({ value, label }))} selected={filters.status} onToggle={(v) => toggle("status", v)} />
        </FilterGroup>
      )}

      {kind !== "project" && (
        <FilterGroup title="Furnishing">
          <Chips options={Object.entries(FURNISHING).map(([value, label]) => ({ value, label }))} selected={filters.furnishing} onToggle={(v) => toggle("furnishing", v)} />
        </FilterGroup>
      )}

      {kind === "rental" && (
        <FilterGroup title="Preferred tenants">
          <Chips options={Object.entries(TENANT_PREFERENCE).map(([value, label]) => ({ value, label }))} selected={filters.tenant} onToggle={(v) => toggle("tenant", v)} />
        </FilterGroup>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <aside className="hidden lg:block">
        <div className="card sticky top-24 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-sans text-base font-bold">Filters</h2>
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className="text-xs font-semibold text-gold-600 hover:text-navy-900">
                Clear all
              </button>
            )}
          </div>
          {panel}
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            <span className="font-semibold text-navy-900">{results.length}</span> {results.length === 1 ? "property" : "properties"} found
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setDrawer(true)} className="btn-outline py-2.5 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {activeCount > 0 && <span className="rounded-full bg-gold-500 px-1.5 text-[11px] text-navy-950">{activeCount}</span>}
            </button>
            <label htmlFor={`${kind}-sort`} className="sr-only">Sort by</label>
            <select id={`${kind}-sort`} value={filters.sort} onChange={(e) => update({ sort: e.target.value })} className="input w-auto rounded-full py-2.5 pr-9">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {visible.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item, i) => (
              <li key={item.slug} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <ListingCard item={item} priority={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory text-gold-600">
              <SearchX className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-semibold">No properties match these filters</h3>
            <p className="mt-2 max-w-sm text-sm text-muted">Try widening your budget or removing a filter. Our advisors can also share off-market options on WhatsApp.</p>
            <button type="button" onClick={clearAll} className="btn-primary mt-6">Clear filters</button>
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
            <PageButton disabled={page <= 1} onClick={() => update({ page: page - 1 }, true)} label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </PageButton>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <PageButton key={n} active={n === page} onClick={() => update({ page: n }, true)} label={`Page ${n}`}>
                {n}
              </PageButton>
            ))}
            <PageButton disabled={page >= pages} onClick={() => update({ page: page + 1 }, true)} label="Next page">
              <ChevronRight className="h-4 w-4" />
            </PageButton>
          </nav>
        )}
      </div>

      {/* Mobile filter drawer */}
      <div className={cn("fixed inset-0 z-[60] lg:hidden", drawer ? "visible" : "invisible")} role="dialog" aria-modal="true" aria-label="Filters">
        <button type="button" aria-label="Close filters" onClick={() => setDrawer(false)} className={cn("absolute inset-0 bg-navy-950/50 transition-opacity", drawer ? "opacity-100" : "opacity-0")} />
        <div className={cn("absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-white transition-transform duration-300", drawer ? "translate-y-0" : "translate-y-full")}>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-sans text-base font-bold">Filters</h2>
            <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters" className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-6">{panel}</div>
          <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
            <button type="button" onClick={clearAll} className="btn-outline">Clear all</button>
            <button type="button" onClick={() => setDrawer(false)} className="btn-primary">Show {results.length} results</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="label mb-3">{title}</legend>
      {children}
    </fieldset>
  );
}

function Chips({ options, selected, onToggle }: { options: { value: string; label: string }[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button key={o.value} type="button" aria-pressed={on} onClick={() => onToggle(o.value)} className={cn("chip py-1.5 text-xs", on && "chip-active")}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold transition disabled:opacity-40",
        active ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white text-navy-900 hover:border-navy-700/40",
      )}
    >
      {children}
    </button>
  );
}

export function ExplorerSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]" aria-busy="true" aria-label="Loading properties">
      <div className="card hidden h-[560px] animate-pulse bg-ivory lg:block" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-[4/3] animate-pulse bg-sand" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-sand" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-sand" />
              <div className="h-10 animate-pulse rounded-full bg-sand" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
