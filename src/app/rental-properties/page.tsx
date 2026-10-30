import { Suspense } from "react";
import ListingExplorer, { ExplorerSkeleton } from "@/components/ListingExplorer";
import { PageHero } from "@/components/ui";
import { rentalCards } from "@/lib/data";
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
        eyebrow="Rental Properties"
        title="Homes & Workspaces for Rent"
        description="Monthly rent, security deposit and maintenance — shown clearly for every listing."
        image={img("living-blue")}
      />
      <section className="container-x py-12">
        <Suspense fallback={<ExplorerSkeleton />}>
          <ListingExplorer kind="rental" items={rentalCards()} />
        </Suspense>
      </section>
    </>
  );
}
