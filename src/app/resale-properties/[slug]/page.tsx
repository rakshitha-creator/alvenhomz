import type { Metadata } from "next";
import ResaleDetailClient from "@/components/ResaleDetailClient";
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
  if (slug === "_") {
    return pageMetadata({ title: "Resale Property", description: "View resale property details.", path: "/resale-properties/" });
  }
  const p = getResale(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title} – ${formatINR(p.price)} | ${p.locality}, ${p.city}`,
    description: `${p.bhk ? `${bhkLabel(p.bhk)} ` : ""}${PROPERTY_TYPES[p.propertyType]} for sale in ${p.locality}, ${p.city}. ${formatArea(p.builtUpArea)} built-up, ${FURNISHING[p.furnishing].toLowerCase()}, ${p.parking.toLowerCase()} parking. Price ${formatINR(p.price)}.`,
    path: `/resale-properties/${p.slug}/`,
    image: p.images[0],
  });
}

export default function ResaleDetailPage() {
  return <ResaleDetailClient />;
}
