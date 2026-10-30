"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, ChevronDown, KeyRound, Search, Sparkles, Wallet } from "lucide-react";
import LocationInput from "./LocationInput";
import { BUY_BUDGETS, PROPERTY_TYPES, RENT_BUDGETS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "new", label: "New Projects", icon: Sparkles, path: "/new-projects/" },
  { id: "buy", label: "Resale", icon: Building2, path: "/resale-properties/" },
  { id: "rent", label: "Rent", icon: KeyRound, path: "/rental-properties/" },
] as const;

const TYPES_BY_TAB: Record<string, string[]> = {
  buy: ["apartment", "villa", "independent-house", "penthouse", "commercial-office"],
  rent: ["apartment", "villa", "independent-house", "commercial-office", "commercial-shop"],
  new: ["apartment", "villa", "plot"],
};

function HeroSelect({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pt-2.5 focus-within:bg-ivory/60">
      <label htmlFor={id} className="block pl-10 text-[11px] font-semibold tracking-wide text-muted uppercase">
        {label}
      </label>
      <span className="pointer-events-none absolute top-1/2 left-4 mt-1.5 text-gold-600" aria-hidden="true">
        {icon}
      </span>
      {children}
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 mt-1.5 h-4 w-4 text-muted" aria-hidden="true" />
    </div>
  );
}

const SELECT_CLASS =
  "w-full cursor-pointer appearance-none bg-transparent pt-1 pb-3 pr-8 pl-10 text-base font-medium text-navy-900 outline-none";

export default function HeroSearch({ suggestions = [] }: { suggestions?: string[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("new");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const budgets = tab === "rent" ? RENT_BUDGETS : BUY_BUDGETS;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("q", location.trim());
    if (type) params.set("type", type);
    const b = budgets[Number(budget)];
    if (budget !== "" && b) {
      if (b.min) params.set("min", String(b.min));
      if (b.max) params.set("max", String(b.max));
    }
    const path = TABS.find((t) => t.id === tab)!.path;
    const qs = params.toString();
    router.push(qs ? `${path}?${qs}` : path);
  };

  return (
    <div className="w-full">
      <div role="tablist" aria-label="Search type" className="flex gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id);
              setType("");
              setBudget("");
            }}
            className={cn(
              "flex items-center gap-2 rounded-t-2xl px-4 py-3 text-sm font-semibold transition sm:px-6",
              tab === t.id ? "bg-white text-navy-900" : "bg-white/10 text-white/85 hover:bg-white/15",
            )}
          >
            <t.icon className={cn("h-4 w-4", tab === t.id ? "text-gold-600" : "text-gold-300")} />
            {t.label}
          </button>
        ))}
      </div>
      <form
        onSubmit={submit}
        role="search"
        className="relative rounded-2xl rounded-tl-none bg-white p-3 pb-10 shadow-[0_18px_50px_-18px_rgb(8_21_42/0.45)] sm:p-4 sm:pb-12"
      >
        <div className="grid divide-y divide-line rounded-xl border border-line md:grid-cols-[1.6fr_1fr_1fr] md:divide-x md:divide-y-0">
          <div className="relative pt-2.5">
            <span className="block pl-10 text-[11px] font-semibold tracking-wide text-muted uppercase" aria-hidden="true">
              Location
            </span>
            <LocationInput
              value={location}
              onChange={setLocation}
              suggestions={suggestions}
              placeholder="Search city or locality"
              inputClassName="-mt-1 border-transparent bg-transparent pt-1 pb-3 text-base font-medium focus:border-transparent focus:ring-0"
            />
          </div>
          <HeroSelect id="hero-type" label="Property type" icon={<Building2 className="h-4 w-4" />}>
            <select
              id="hero-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={SELECT_CLASS}
            >
              <option value="">All property types</option>
              {TYPES_BY_TAB[tab].map((t) => (
                <option key={t} value={t}>
                  {PROPERTY_TYPES[t]}
                </option>
              ))}
            </select>
          </HeroSelect>
          <HeroSelect
            id="hero-budget"
            label={tab === "rent" ? "Monthly rent" : "Budget"}
            icon={<Wallet className="h-4 w-4" />}
          >
            <select
              id="hero-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={SELECT_CLASS}
            >
              <option value="">{tab === "rent" ? "Any monthly rent" : "Any budget"}</option>
              {budgets.map((b, i) => (
                <option key={b.label} value={i}>
                  {b.label}
                </option>
              ))}
            </select>
          </HeroSelect>
        </div>
        <button
          type="submit"
          className="btn absolute bottom-0 left-1/2 w-[min(18rem,80%)] -translate-x-1/2 translate-y-1/2 bg-espresso-900 py-4 text-base text-white shadow-lift hover:bg-espresso-700"
        >
          <Search className="h-5 w-5 text-gold-400" /> Search
        </button>
      </form>
    </div>
  );
}
