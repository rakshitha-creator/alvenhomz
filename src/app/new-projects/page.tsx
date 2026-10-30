import { Suspense } from "react";
import ListingExplorer, { ExplorerSkeleton } from "@/components/ListingExplorer";
import { PageHero } from "@/components/ui";
import { projectCards } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "New Projects – New Launch & Under-Construction Homes in Bangalore",
  description:
    "Browse new launch, under-construction and upcoming residential projects — apartments, villas and plots — with prices, configurations, possession dates and RERA details.",
  path: "/new-projects/",
  image: "tower-balconies",
});

export default function NewProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="New Projects"
        title="New Launch & Under-Construction Projects"
        description="Compare configurations, starting prices, possession timelines and amenities across premium projects."
        image={img("tower-balconies")}
      />
      <section className="container-x py-12">
        <Suspense fallback={<ExplorerSkeleton />}>
          <ListingExplorer kind="project" items={projectCards()} />
        </Suspense>
      </section>
    </>
  );
}
