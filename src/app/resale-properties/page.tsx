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
    q: "Is every resale property ready to move into?",
    a: "Resale includes completed properties and units offered for transfer during construction. Check whether the unit is ready to occupy, when handover is expected and which steps apply to the sale or transfer.",
  },
  {
    q: "What changes when I compare a new project with a resale in the same community?",
    a: "The seller, quoted cost, payment schedule, transfer steps and handover status may differ. Compare the specific units on the same area basis and ask who can confirm the latest information for each.",
  },
  {
    q: "What should I ask about before making an offer?",
    a: "Ask for the current ownership or allotment documents, outstanding dues, applicable transfer steps and expected handover date. Have your legal adviser review the documents relevant to that unit before you commit.",
  },
  {
    q: "Can Alven Homz help me sell my apartment?",
    a: "Yes. Share the community, configuration, occupancy or construction status and your proposed timeline. We can discuss how to present the home, prepare listing information and schedule viewings.",
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
