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
    q: "How much does a fully furnished 2 BHK on Sarjapur Road cost, including maintenance?",
    a: "An indicative November 2026 asking-rent band is ₹35,000–₹70,000 per month across selected furnished homes on Sarjapur Road. The sector, building type, parking and appliance inventory can change the quote. Ask for maintenance separately so you know the full monthly cost before viewing.",
  },
  {
    q: "Can I rent a furnished 2 BHK in Electronic City Phase 1 for under ₹40,000 a month?",
    a: "Yes, a furnished 2 BHK can fall within a ₹40,000 monthly budget, depending on availability and maintenance. If ₹40,000 is your ceiling, give Alven Homz that figure as your rent-plus-maintenance limit. Share your workplace gate and move-in date so the shortlist also fits your commute and timing.",
  },
  {
    q: "How much money should I set aside before moving into a rental home in Bengaluru?",
    a: "Budget for the security deposit, first month’s rent, maintenance due at move-in and any agreed brokerage. For example, at ₹50,000 monthly rent, a minimum three-month deposit plus the first month’s rent comes to ₹2 lakh before other charges. The deposit amount and payment schedule depend on the rental agreement.",
  },
  {
    q: "How can I find a 3 BHK for rent on Sarjapur Road within my total monthly budget?",
    a: "Start with your monthly ceiling and work backwards. If your limit is ₹65,000 and society maintenance is ₹6,000, your base-rent limit is ₹59,000. Tell us which junction or workplace you need to reach, your furnishing preference and your move-in date so we can narrow the search.",
  },
  {
    q: "How do I find a rental home near Kudlu Gate with a practical office commute?",
    a: "Use your office entrance and usual arrival time as the starting point. For each home, check the route from the apartment gate, including the side of the main road you need to reach. If two homes have similar rents, try the journey during your normal commute before deciding which to rent.",
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
        body="Search by neighbourhood, monthly rent, configuration, property type and furnishing. Open the listing to check the move-in date, parking and confirmed inclusions. If a longer rental period or specific appliance matters to you, raise it before arranging a visit."
        emptyMessage="No rental homes match these filters. Change your search or tell us where and when you would like to move."
      />
      <ContentBlock
        tone="sand"
        title="Understand the cost of moving in"
        caption="A clear view of the cost of moving in."
        body="Understand the total rental commitment before finalising your home. Review the rent, maintenance, security deposit and any additional charges, along with what is included in the rental agreement and the payment schedule."
        cards={[
          { title: "Monthly rent and maintenance", text: "Confirm the monthly rent and maintenance charges separately, including what each covers." },
          { title: "Security deposit", text: "Understand the deposit amount, payment terms and refund conditions before moving in." },
          { title: "Service charges", text: "Identify any additional charges, their purpose and applicable payment timelines." },
        ]}
      />
      <ContentBlock
        tone="dark"
        title="For homeowners looking to rent out"
        caption="Give your property the right introduction."
        body="Tell us where the property is, how it's furnished and when it can be occupied. We can discuss how to present the residence, what to include in the listing and how to arrange viewings around the property's availability."
        actions={
          <>
            <a href="#results" className="btn-ghost-light">
              Find a Rental
            </a>
            <Link href="/contact-us/?topic=owner#enquiry" className="btn-gold">
              Discuss Renting Out Your Home
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
