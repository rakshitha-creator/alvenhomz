import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LiveDetail from "@/components/live/LiveDetail";
import { getProjects } from "@/lib/server-data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return [...(await getProjects()).map((p) => ({ slug: p.slug })), { slug: "_" }];
}

const find = async (slug: string) => (await getProjects()).find((p) => p.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  if (slug === "_") return pageMetadata({ title: "New Projects", description: "Alven Homz new projects.", path: "/new-projects/" });
  const p = await find(slug);
  if (!p) return {};
  const configs = p.propertyType === "plot" ? "Plots" : p.configurations.map((c) => c.label).join(", ");
  return pageMetadata({
    title: `${p.name} in ${p.locality}, Bengaluru`,
    description: `Explore ${p.name} in ${p.locality}, Bengaluru. Review ${configs}, floor plans, amenities and possession details. Request current availability.`,
    path: `/new-projects/${p.slug}/`,
    image: p.images[0],
  });
}

export default async function ProjectPage({ params }: Props) {
  const slug = (await params).slug;
  // "_" is the shell for listings added in the admin after this build (the server rewrites unknown slugs to it).
  if (slug === "_") return <LiveDetail kind="project" />;
  const all = await getProjects();
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();
  return <LiveDetail kind="project" initial={p} all={all} />;
}
