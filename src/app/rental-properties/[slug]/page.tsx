import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LiveDetail from "@/components/live/LiveDetail";
import { getRental, rentalProperties } from "@/lib/data";
import { FURNISHING, PROPERTY_TYPES } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { bhkLabel, formatDate, formatINR } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...rentalProperties.map((p) => ({ slug: p.slug })), { slug: "_" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  if (slug === "_") return pageMetadata({ title: "Rental Properties", description: "Alven Homz rental properties.", path: "/rental-properties/" });
  const p = getRental(slug);
  if (!p) return {};
  const furnishingLabel = (FURNISHING[p.furnishing] ?? p.furnishing ?? "").toLowerCase();
  return pageMetadata({
    title: `${p.title} for Rent – ${formatINR(p.rent, { short: false })}/month | ${p.locality}, ${p.city}`,
    description: `${p.bhk ? `${bhkLabel(p.bhk)} ` : ""}${PROPERTY_TYPES[p.propertyType] ?? p.propertyType} for rent in ${p.locality}, ${p.city}. Rent ${formatINR(p.rent, { short: false })}/month, deposit ${formatINR(p.deposit)}, ${furnishingLabel}, available from ${formatDate(p.availableFrom)}.`,
    path: `/rental-properties/${p.slug}/`,
    image: p.images[0],
  });
}

export default async function RentalDetailPage({ params }: Props) {
  const slug = (await params).slug;
  // "_" is the shell for listings added in the admin after this build (the server rewrites unknown slugs to it).
  if (slug === "_") return <LiveDetail kind="rental" />;
  const p = getRental(slug);
  if (!p) notFound();
  return <LiveDetail kind="rental" initial={p} />;
}
