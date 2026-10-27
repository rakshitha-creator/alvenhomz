"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, KeyRound, Search, Sparkles } from "lucide-react";
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

export default function HeroSearch({ suggestions }: { suggestions: string[] }) {
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
    <div className="w-full max-w-4xl">
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
              tab === t.id ? "bg-white text-navy-900" : "bg-navy-950/50 text-white/85 backdrop-blur hover:bg-navy-950/70",
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
        className="grid gap-3 rounded-2xl rounded-tl-none bg-white p-3 shadow-lift sm:p-4 md:grid-cols-[1.6fr_1fr_1fr_auto]"
      >
        <LocationInput value={location} onChange={setLocation} suggestions={suggestions} placeholder="Search city or locality" inputClassName="border-transparent bg-ivory" />
        <div>
          <label htmlFor="hero-type" className="sr-only">Property type</label>
          <select id="hero-type" value={type} onChange={(e) => setType(e.target.value)} className="input border-transparent bg-ivory">
            <option value="">All property types</option>
            {TYPES_BY_TAB[tab].map((t) => (
              <option key={t} value={t}>{PROPERTY_TYPES[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="hero-budget" className="sr-only">Budget</label>
          <select id="hero-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="input border-transparent bg-ivory">
            <option value="">{tab === "rent" ? "Any monthly rent" : "Any budget"}</option>
            {budgets.map((b, i) => (
              <option key={b.label} value={i}>{b.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary px-7">
          <Search className="h-4 w-4" /> Search
        </button>
      </form>
    </div>
  );
}
