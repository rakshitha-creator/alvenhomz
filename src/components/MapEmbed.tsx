import { ExternalLink } from "lucide-react";

/** Keyless Google Maps embed (no API key or billing required). Lazy-loaded. */
export default function MapEmbed({ lat, lng, query, title }: { lat?: number; lng?: number; query?: string; title: string }) {
  const q = lat && lng ? `${lat},${lng}` : (query ?? "");
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`;
  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-sand">
      <iframe title={`Map: ${title}`} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[340px] w-full border-0" />
      <a href={link} target="_blank" rel="noopener" className="flex items-center justify-between bg-white px-4 py-3 text-sm font-semibold text-navy-900 hover:bg-ivory">
        Open in Google Maps <ExternalLink className="h-4 w-4 text-gold-600" />
      </a>
    </div>
  );
}
