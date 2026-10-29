import { Suspense } from "react";
import ListingExplorerLive from "@/components/ListingExplorerLive";
import { ExplorerSkeleton } from "@/components/ListingExplorer";
import { PageHero } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Rental Properties – Flats, Villas & Commercial Spaces for Rent",
  description:
    "Rent furnished and unfurnished apartments, villas, offices and shops. Monthly rent, security deposit and maintenance shown upfront.",
  path: "/rental-properties/",
  image: "living-blue",
});

export default function RentalPage() {
  return (
    <>
      <PageHero
        bannerId="rentals"
        eyebrow="Rental Properties"
        title="Homes & Workspaces for Rent"
        description="Monthly rent, security deposit and maintenance — shown clearly for every listing."
        image={img("living-blue")}
      />
      <section className="container-x py-12">
        <Suspense fallback={<ExplorerSkeleton />}>
          <ListingExplorerLive kind="rental" />
        </Suspense>
      </section>
    </>
  );
}
