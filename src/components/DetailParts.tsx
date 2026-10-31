import { MapPin } from "lucide-react";
import LeadForm from "./LeadForm";
import ListingCard from "./ListingCard";
import ShareButton from "./ShareButton";
import { ContactActions } from "./ContactActions";
import { Breadcrumbs, SampleNotice, SectionHeading } from "./ui";
import type { ListingCardData } from "@/lib/data";
import type { ListingRef } from "@/lib/contact";
import { cn } from "@/lib/utils";

export function DetailHeader({
  crumbs,
  title,
  location,
  badges,
  price,
  priceNote,
}: {
  crumbs: Array<{ name: string; path: string }>;
  title: string;
  location: string;
  badges: React.ReactNode;
  price: string;
  priceNote?: string;
}) {
  return (
    <div className="flex flex-col gap-6 py-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Breadcrumbs items={crumbs} />
        <div className="mt-4 flex flex-wrap gap-2">{badges}</div>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-muted">
          <MapPin className="h-4 w-4 text-gold-600" /> {location}
        </p>
      </div>
      <div className="flex items-end gap-4 lg:flex-col lg:items-end">
        <p>
          <span className="block font-display text-3xl font-semibold text-navy-900 sm:text-4xl">{price}</span>
          {priceNote && <span className="text-sm text-muted">{priceNote}</span>}
        </p>
        <ShareButton title={title} />
      </div>
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "gold" | "green" | "amber" | "sky" }) {
  const tones = {
    default: "bg-ivory text-navy-800",
    gold: "bg-gold-500 text-navy-950",
    green: "bg-emerald-50 text-emerald-800",
    amber: "bg-amber-50 text-amber-800",
    sky: "bg-sky-50 text-sky-800",
  };
  return <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export function DetailSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-line py-10 first:border-t-0 first:pt-0">
      <h2 id={`${id}-title`} className="mb-6 text-2xl font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Facts({ items }: { items: Array<{ label: string; value?: string | number; icon?: React.ReactNode }> }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items
        .filter((f) => f.value !== undefined && f.value !== "")
        .map((f) => (
          <div key={f.label} className="rounded-xl border border-line bg-white px-4 py-3.5">
            <dt className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
              {f.icon}
              {f.label}
            </dt>
            <dd className="mt-1 font-semibold text-navy-900">{f.value}</dd>
          </div>
        ))}
    </dl>
  );
}

export function SectionNav({ items }: { items: Array<{ id: string; label: string }> }) {
  return (
    <nav aria-label="On this page" className="no-scrollbar sticky top-[88px] z-30 -mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-line bg-white/95 px-4 backdrop-blur sm:mx-0 sm:px-0">
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} className="shrink-0 border-b-2 border-transparent px-3 py-3.5 text-sm font-medium text-muted transition hover:border-gold-500 hover:text-navy-900">
          {it.label}
        </a>
      ))}
    </nav>
  );
}

export function EnquirySidebar({
  listing,
  summary,
  isSample,
}: {
  listing: ListingRef;
  summary: React.ReactNode;
  isSample?: boolean;
}) {
  return (
    <aside id="enquire" className="scroll-mt-24">
      <div className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto lg:pb-2 no-scrollbar">
        <div className="card p-6">
          {summary}
          <h2 className="mt-5 font-sans text-base font-bold">Interested? Get in touch</h2>
          <p className="mt-1 mb-5 text-xs text-muted">Send your details on WhatsApp or email — we usually reply within a few working hours.</p>
          <LeadForm variant="listing" listing={listing} compact />
        </div>
        <div className="card p-4">
          <ContactActions listing={listing} />
        </div>
        {isSample && <SampleNotice />}
      </div>
    </aside>
  );
}

export function Similar({ title, items }: { title: string; items: ListingCardData[] }) {
  if (!items.length) return null;
  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading eyebrow="You may also like" title={title} />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li key={it.slug}>
              <ListingCard item={it} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
