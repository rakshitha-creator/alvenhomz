import Link from "next/link";
import Faq, { type FaqItem } from "@/components/Faq";
import HubResults from "@/components/HubResults";
import { ContentBlock } from "@/components/InfoCards";
import { PageHero } from "@/components/ui";
import { locationSuggestions, rentalCard } from "@/lib/data";
import { getRentalList } from "@/lib/server-data";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Premium Homes for Rent in Bengaluru",
  description:
    "Search for rental apartments, villas and furnished homes in Bengaluru. Compare monthly rent, deposit, furnishing and move-in dates where available.",
  path: "/rental-properties/",
  image: "living-blue",
});

const FAQS: FaqItem[] = [
  {
    q: "What is usually payable before moving in?",
    a: "The amount payable before moving in depends on the agreed lease. Ask for a written breakdown covering the security deposit, initial rent, maintenance and any applicable service charges, together with the due dates.",
  },
  {
    q: "What is included in a furnished rental?",
    a: "Furniture and appliances vary by home. Ask for an itemised inventory, check which items stay with the property and note their condition during handover.",
  },
  {
    q: "Can I enquire about leasing my home while living abroad?",
    a: "Yes. Tell us whether the Bengaluru home is vacant, furnished or occupied, and when it can be shown. Share your time zone and the support you'd like so we can discuss the tasks that could be included.",
  },
  {
    q: "How do I compare two Bengaluru rentals with similar rent?",
    a: "Compare the monthly cost including maintenance, then look at the deposit, furnishing, parking and move-in dates. Ask which charges are due upfront and whether each home has the inclusions you'll use.",
  },
];

export default async function RentalPage() {
  const items = (await getRentalList()).map(rentalCard);
  return (
    <>
      <PageHero
        bannerId="rentals"
        eyebrow="Rental Properties"
        title="Premium homes for rent in Bengaluru"
        caption="Feel at home before move-in day."
        description="Find premium homes for rent in Bengaluru that suit your daily routine, from a furnished apartment near work to a larger residence with room for family or a home office. Compare monthly rent, maintenance, deposit and furnishing alongside the earliest move-in date. Then arrange a viewing to see how the space and neighbourhood feel in person."
        image={img("living-blue")}
      />
      <HubResults
        kind="rental"
        items={items}
        suggestions={locationSuggestions()}
        title="Refine your rental search"
        caption="Start with the routines that shape your day."
        body="Search by neighbourhood, monthly rent, configuration, property type and furnishing. Open the listing to check the move-in date, parking and confirmed inclusions. If a longer lease or specific appliance matters to you, raise it before arranging a visit."
        emptyMessage="No rental homes match these filters. Change your search or tell us where and when you would like to move."
      />
      <ContentBlock
        tone="sand"
        title="Understand the cost of moving in"
        caption="A clear view of the cost of moving in."
        body="Ask for monthly rent, maintenance, the security deposit and any applicable service charges as separate amounts. Confirm what the lease includes, such as furniture, appliances or a designated parking space, and check when the first payments are due."
        cards={[
          { title: "Monthly rent and maintenance", text: "Ask for the monthly rent and the maintenance as separate amounts, and whether either is included in the other." },
          { title: "Security deposit", text: "Confirm the deposit amount and when it is due before you move in." },
          { title: "Service charges", text: "Ask for any applicable service charges as a separate amount, with the date each is due." },
        ]}
      />
      <ContentBlock
        tone="dark"
        title="For homeowners looking to lease"
        caption="Give your property the right introduction."
        body="Tell us where the property is, how it's furnished and when it can be occupied. We can discuss how to present the residence, what to include in the listing and how to arrange viewings around the property's availability."
        actions={
          <>
            <a href="#results" className="btn-ghost-light">
              Find a Rental
            </a>
            <Link href="/contact-us/?topic=owner#enquiry" className="btn-gold">
              Discuss Leasing Your Home
            </Link>
            <Link href="/property-management/" className="btn-ghost-light">
              Property management for owners
            </Link>
          </>
        }
      />
      <Faq items={FAQS} />
    </>
  );
}
