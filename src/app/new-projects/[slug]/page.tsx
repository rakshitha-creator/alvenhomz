import type { Metadata } from "next";
import ProjectDetailClient from "@/components/ProjectDetailClient";
import { getProject, projects } from "@/lib/data";
import { PROJECT_STATUS } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { formatINR } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...projects.map((p) => ({ slug: p.slug })), { slug: "_" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  if (slug === "_") {
    return pageMetadata({
      title: "New Project",
      description: "View project details, pricing, amenities and location.",
      path: "/new-projects/",
    });
  }
  const p = getProject(slug);
  if (!p) return {};
  const configs = p.propertyType === "plot" ? "Plots" : p.configurations.map((c) => c.label).join(", ");
  return pageMetadata({
    title: `${p.name} by ${p.developer} – ${configs} in ${p.locality}, ${p.city}`,
    description: `${p.name} in ${p.locality}, ${p.city}: ${configs} from ${formatINR(p.priceFrom)}. ${PROJECT_STATUS[p.status]}, possession ${p.possession}. View photos, amenities, floor plans and location.`,
    path: `/new-projects/${p.slug}/`,
    image: p.images[0],
  });
}

export default function ProjectPage() {
  return <ProjectDetailClient />;
}
