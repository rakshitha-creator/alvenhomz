import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import type { ListingCardData } from "@/lib/data";
import { listingMessage, whatsappHref } from "@/lib/contact";
import { absoluteUrl } from "@/lib/seo";
import { cn, img } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  ready: "bg-emerald-50 text-emerald-800",
  "under-construction": "bg-amber-50 text-amber-800",
  upcoming: "bg-sky-50 text-sky-800",
};

export default function ListingCard({ item, priority = false }: { item: ListingCardData; priority?: boolean }) {
  const location = `${item.locality}, ${item.city}`;
  const waText = listingMessage({ title: item.title, location, price: `${item.priceLabel} ${item.priceNote}`, url: absoluteUrl(item.href) });

  return (
    <article className="group card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={item.href} className="relative block aspect-[4/3] overflow-hidden bg-sand" tabIndex={-1} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img(item.image, "sm")}
          alt=""
          width={720}
          height={540}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/60 to-transparent" />
        {/* Badge row: status+type on left, Featured on right — using justify-between so they never overlap */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {item.statusLabel && (
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", STATUS_STYLES[item.status ?? ""] ?? "bg-white text-navy-900")}>
                {item.statusLabel}
              </span>
            )}
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-navy-900">{item.typeLabel}</span>
          </div>
          {item.featured && (
            <span className="shrink-0 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-bold tracking-wide text-navy-950 uppercase">
              Featured
            </span>
          )}
        </div>
        <p className="absolute bottom-3 left-4 text-white">
          <span className="font-sans text-2xl font-semibold">{item.priceLabel}</span>
          <span className="ml-1.5 text-xs text-white/80">{item.priceNote}</span>
        </p>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug font-semibold">
          <Link href={item.href} className="hover:text-navy-700">
            {item.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{item.subtitle}</p>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-navy-800">
          <MapPin className="h-4 w-4 shrink-0 text-gold-600" />
          {location}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {item.specs.filter(Boolean).map((s) => (
            <li key={s} className="rounded-lg bg-ivory px-2.5 py-1 text-xs font-medium text-navy-800">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link href={item.href} className="btn-primary flex-1 py-2.5">
            View Details <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a
            href={whatsappHref(waText)}
            target="_blank"
            rel="noopener"
            aria-label={`Enquire about ${item.title} on WhatsApp`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-[#1faa53] transition hover:border-[#1faa53] hover:bg-[#1faa53]/5"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </article>
  );
}
