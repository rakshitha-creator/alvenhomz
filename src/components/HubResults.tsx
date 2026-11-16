import LiveListingExplorer from "@/components/live/LiveListingExplorer";
import type { ListingCardData } from "@/lib/data";

/** Heading, caption and guidance above a listing grid, with the grid at #results. */
export default function HubResults({
  kind,
  items,
  suggestions,
  title,
  caption,
  body,
  emptyMessage,
  actions,
}: {
  kind: "project" | "resale" | "rental";
  items: ListingCardData[];
  suggestions: string[];
  title: string;
  caption: string;
  body: string;
  emptyMessage: string;
  actions?: React.ReactNode;
}) {
  return (
    <section id="results" className="container-x scroll-mt-28 py-12 sm:py-16">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
          <p className="mt-2 font-display text-lg text-gold-700 italic">{caption}</p>
          <p className="mt-3 leading-relaxed text-navy-800">{body}</p>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
      </div>
      <LiveListingExplorer kind={kind} items={items} suggestions={suggestions} emptyMessage={emptyMessage} />
    </section>
  );
}
