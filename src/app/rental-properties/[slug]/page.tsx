import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LiveDetail from "@/components/live/LiveDetail";
import { getRentalList } from "@/lib/server-data";
import { FURNISHING, PROPERTY_TYPES } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { bhkLabel, formatDate, formatINR } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return [...(await getRentalList()).map((p) => ({ slug: p.slug })), { slug: "_" }];
}

const find = async (slug: string) => (await getRentalList()).find((p) => p.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  if (slug === "_") return pageMetadata({ title: "Rental Properties", description: "Alven Homz rental properties.", path: "/rental-properties/" });
  const p = await find(slug);
  if (!p) return {};
  const furnishingLabel = (FURNISHING[p.furnishing] ?? p.furnishing ?? "").toLowerCase();
  const furnishing = FURNISHING[p.furnishing] ?? p.furnishing;
  return pageMetadata({
    title: `${p.bhk ? `${bhkLabel(p.bhk)} ` : ""}${furnishing} Rental in ${p.locality}`,
    description: `View this ${p.bhk ? `${bhkLabel(p.bhk)} ` : ""}rental in ${p.locality}, Bengaluru. Check monthly rent, deposit, furnishing, parking and move-in availability before requesting a viewing.`,
    path: `/rental-properties/${p.slug}/`,
    image: p.images[0],
  });
}

export default async function RentalDetailPage({ params }: Props) {
  const slug = (await params).slug;
  // "_" is the shell for listings added in the admin after this build (the server rewrites unknown slugs to it).
  if (slug === "_") return <LiveDetail kind="rental" />;
  const all = await getRentalList();
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();
  return <LiveDetail kind="rental" initial={p} all={all} />;
}
