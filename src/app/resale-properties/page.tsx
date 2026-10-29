import { Suspense } from "react";
import ListingExplorerLive from "@/components/ListingExplorerLive";
import { ExplorerSkeleton } from "@/components/ListingExplorer";
import { PageHero } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Resale Properties – Ready-to-Move Flats, Villas & Houses for Sale",
  description:
    "Find resale apartments, villas, independent houses and office spaces for sale. Filter by budget, BHK, furnishing and property type.",
  path: "/resale-properties/",
  image: "living-white",
});

export default function ResalePage() {
  return (
    <>
      <PageHero
        eyebrow="Resale Properties"
        title="Ready Homes in Established Neighbourhoods"
        description="Explore resale apartments, villas and independent houses — with clear pricing, area and furnishing details."
        image={img("living-white")}
      />
      <section className="container-x py-12">
        <Suspense fallback={<ExplorerSkeleton />}>
          <ListingExplorerLive kind="resale" />
        </Suspense>
      </section>
    </>
  );
}
