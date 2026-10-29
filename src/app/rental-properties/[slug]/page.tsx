import type { Metadata } from "next";
import RentalDetailClient from "@/components/RentalDetailClient";
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
  if (slug === "_") {
    return pageMetadata({ title: "Rental Property", description: "View rental property details.", path: "/rental-properties/" });
  }
  const p = getRental(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title} for Rent – ${formatINR(p.rent, { short: false })}/month | ${p.locality}, ${p.city}`,
    description: `${p.bhk ? `${bhkLabel(p.bhk)} ` : ""}${PROPERTY_TYPES[p.propertyType]} for rent in ${p.locality}, ${p.city}. Rent ${formatINR(p.rent, { short: false })}/month, deposit ${formatINR(p.deposit)}, ${FURNISHING[p.furnishing].toLowerCase()}, available from ${formatDate(p.availableFrom)}.`,
    path: `/rental-properties/${p.slug}/`,
    image: p.images[0],
  });
}

export default function RentalDetailPage() {
  return <RentalDetailClient />;
}
