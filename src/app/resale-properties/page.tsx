import Link from "next/link";
import Faq, { type FaqItem } from "@/components/Faq";
import HubResults from "@/components/HubResults";
import { ContentBlock } from "@/components/InfoCards";
import { PageHero } from "@/components/ui";
import { locationSuggestions, resaleCard } from "@/lib/data";
import { getResaleList } from "@/lib/server-data";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Resale Properties in Bengaluru",
  description:
    "Explore owner-listed resale apartments and villas in Bengaluru. Compare ready and under-construction homes by locality, layout and possession status.",
  path: "/resale-properties/",
  image: "living-white",
});

const FAQS: FaqItem[] = [
  {
    q: "What size 3 BHK resale apartment can I consider in Gunjur with a ₹2 crore budget?",
    a: "As a budgeting example, ₹2 crore covers around 1,667 sq. ft. at ₹12,000 per sq. ft., or 1,600 sq. ft. at ₹12,500 per sq. ft., before additional purchase costs. If ₹2 crore is your total spending limit, reserve room for registration, applicable fees and any refurbishment before setting your offer price.",
  },
  {
    q: "Can I move into a ready-to-move resale flat on Sarjapur Road immediately?",
    a: "You can move in once the purchase is complete and the seller can give you vacant possession. A finished flat may still be owner-occupied or tenanted. If you have a fixed moving date, confirm who occupies the home, when they will vacate and the key-handover date before making an offer.",
  },
  {
    q: "Why do two resale flats in the same Bengaluru society have different prices?",
    a: "The difference often comes down to usable area, floor, outlook, parking and what stays in the home. An apartment with fitted wardrobes, appliances and immediate vacant possession may suit a different budget from an unfurnished, occupied home. Ask for the inclusions in writing before comparing the two asking prices.",
  },
  {
    q: "Should I compare resale flat prices using carpet area or built-up area?",
    a: "Use the same area measurement for both homes. For example, a ₹1.80 crore apartment quoted at 1,500 sq. ft. built-up works out to ₹12,000 per sq. ft. If its carpet area is 1,200 sq. ft., the same apartment costs ₹15,000 per carpet sq. ft. That difference matters when comparing two offers.",
  },
  {
    q: "How should I price my Bengaluru apartment before putting it up for resale?",
    a: "Start with comparable homes in your own society or phase. Match the configuration and area, then account for parking, condition, furnishing and handover timing. Recent completed sales, where available, help establish what buyers have paid. Current asking prices show what your home will compete against.",
  },
];

export default async function ResalePage() {
  const items = (await getResaleList()).map(resaleCard);
  return (
    <>
      <PageHero
        bannerId="resale"
        eyebrow="Resale Properties"
        title="Resale homes in Bengaluru"
        caption="Find a home with a story already underway."
        description="Explore resale apartments, villas and independent homes across Bengaluru. Whether ready to move in or under construction, evaluate the property's layout, condition, furnishing, possession status and overall cost. We help you understand the details and make informed choices before scheduling a visit."
        image={img("living-white")}
      />
      <HubResults
        kind="resale"
        items={items}
        suggestions={locationSuggestions()}
        title="Refine your search"
        caption="Compare the homes that fit your plans."
        body="Filter by locality, property type and configuration. For a completed home, check the floor, condition, furnishing and availability for handover. For a construction-stage unit, ask about the current build stage, which payments are outstanding and how a transfer would be arranged."
        emptyMessage="No resale homes match these filters. Change your criteria or share your preferred community with us."
      />
      <ContentBlock
        tone="sand"
        align="center"
        title="Experience the home before you decide"
        caption="See beyond the walls. Understand the lifestyle."
        body="Visit the property at a convenient time to assess natural light, ventilation and the surrounding environment. Explore the layout, check room dimensions and consider your furniture requirements. For under-construction homes, verify that the plans and visuals accurately reflect the specific unit."
      />
      <ContentBlock
        tone="dark"
        title="For owners considering a sale"
        caption="Present your home with the details buyers value."
        body="Share your Bengaluru community, configuration, occupancy status and intended sale timeline. We can discuss the listing brief, which details buyers will need upfront, and how to arrange viewings around the home's current use."
        actions={
          <>
            <a href="#results" className="btn-ghost-light">
              Explore Resale Homes
            </a>
            <Link href="/contact-us/?topic=owner#enquiry" className="btn-gold">
              Discuss Selling Your Property
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
