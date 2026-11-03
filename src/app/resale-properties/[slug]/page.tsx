import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LiveDetail from "@/components/live/LiveDetail";
import { getResale, resaleProperties } from "@/lib/data";
import { FURNISHING, PROPERTY_TYPES } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { bhkLabel, formatArea, formatINR } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...resaleProperties.map((p) => ({ slug: p.slug })), { slug: "_" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  if (slug === "_") return pageMetadata({ title: "Resale Properties", description: "Alven Homz resale properties.", path: "/resale-properties/" });
  const p = getResale(slug);
  if (!p) return {};
  const priceText = p.price > 0 ? ` – ${formatINR(p.price)}` : "";
  const furnishingLabel = (FURNISHING[p.furnishing] ?? p.furnishing ?? "").toLowerCase();
  const parkingLabel = (p.parking ?? "").toLowerCase();
  return pageMetadata({
    title: `${p.title}${priceText} | ${p.locality}, ${p.city}`,
    description: `${p.bhk ? `${bhkLabel(p.bhk)} ` : ""}${PROPERTY_TYPES[p.propertyType] ?? p.propertyType} for sale in ${p.locality}, ${p.city}. ${formatArea(p.builtUpArea)} built-up${furnishingLabel ? `, ${furnishingLabel}` : ""}${parkingLabel ? `, ${parkingLabel} parking` : ""}. Price ${formatINR(p.price)}.`,
    path: `/resale-properties/${p.slug}/`,
    image: p.images[0],
  });
}

export default async function ResaleDetailPage({ params }: Props) {
  const slug = (await params).slug;
  // "_" is the shell for listings added in the admin after this build (the server rewrites unknown slugs to it).
  if (slug === "_") return <LiveDetail kind="resale" />;
  const p = getResale(slug);
  if (!p) notFound();
  return <LiveDetail kind="resale" initial={p} />;
}
