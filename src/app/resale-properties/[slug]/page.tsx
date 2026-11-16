import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LiveDetail from "@/components/live/LiveDetail";
import { getResaleList } from "@/lib/server-data";
import { FURNISHING, PROPERTY_TYPES } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { bhkLabel, formatArea, formatINR } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return [...(await getResaleList()).map((p) => ({ slug: p.slug })), { slug: "_" }];
}

const find = async (slug: string) => (await getResaleList()).find((p) => p.slug === slug);

function unitLabel(slug: string, floor?: string) {
  const m = slug.match(/tower-([a-z])-(\d+)-series/);
  if (m) return `, Tower ${m[1].toUpperCase()} ${m[2]}`;
  const f = (floor ?? "").replace(/\*/g, "").match(/^(\d+\w*)/);
  return f ? `, ${f[1]} floor` : "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  if (slug === "_") return pageMetadata({ title: "Resale Properties", description: "Alven Homz resale properties.", path: "/resale-properties/" });
  const p = await find(slug);
  if (!p) return {};
  const community = p.title.split(/ in /)[1] ?? p.locality;
  const bhk = p.bhk ? `${bhkLabel(p.bhk)} ` : "";
  return pageMetadata({
    // Several units share a heading, so the page title adds the unit (tower/series or floor) to keep it unique.
    title: `${bhk}Resale at ${community}${unitLabel(p.slug, p.floor)}`,
    description: `Explore this ${bhk}resale home at ${community} in ${p.locality}, Bengaluru. See area, furnishing and possession details, and enquire about a viewing.`,
    path: `/resale-properties/${p.slug}/`,
    image: p.images[0],
  });
}

export default async function ResaleDetailPage({ params }: Props) {
  const slug = (await params).slug;
  // "_" is the shell for listings added in the admin after this build (the server rewrites unknown slugs to it).
  if (slug === "_") return <LiveDetail kind="resale" />;
  const all = await getResaleList();
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();
  return <LiveDetail kind="resale" initial={p} all={all} />;
}
