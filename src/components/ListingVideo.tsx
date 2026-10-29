"use client";

export default function ListingVideo({ url, title }: { url?: string; title: string }) {
  if (!url) return null;
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-navy-950">
      <video src={url} controls playsInline className="aspect-video w-full" aria-label={`Video for ${title}`}>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
