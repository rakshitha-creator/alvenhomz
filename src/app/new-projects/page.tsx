import Link from "next/link";
import Faq, { type FaqItem } from "@/components/Faq";
import HubResults from "@/components/HubResults";
import { ContentBlock } from "@/components/InfoCards";
import { PageHero } from "@/components/ui";
import { locationSuggestions, projectCard } from "@/lib/data";
import { getProjects } from "@/lib/server-data";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "New Residential Projects in Bengaluru",
  description:
    "Compare new apartments, villas and plotted developments in Bengaluru by location, configuration, budget and expected possession. Request a shortlist.",
  path: "/new-projects/",
  image: "tower-balconies",
});

const FAQS: FaqItem[] = [
  {
    q: "What should I compare before shortlisting a new project?",
    a: "Compare the carpet area, floor plan, unit-specific cost, payment schedule, phase amenities and expected possession. Use the exact tower and phase when checking dates or what's included.",
  },
  {
    q: "How do I check a project's RERA registration?",
    a: "For a project that requires registration, ask for the phase-specific registration number and check the project record on the Karnataka RERA portal.",
  },
  {
    q: "What does “price onwards” mean?",
    a: "“Price onwards” is the starting quote for a specified configuration or unit. Ask which unit the quote applies to, when it was issued and what charges sit outside the quoted amount. Request an itemised cost sheet for the home you're considering.",
  },
  {
    q: "Can I start a shortlist from outside India?",
    a: "Yes. Share your preferred Bengaluru neighbourhoods, approximate budget, configuration and visit window. Ask for current plans, availability and viewing options before arranging appointments.",
  },
];

export default async function NewProjectsPage() {
  const items = (await getProjects()).map(projectCard);
  return (
    <>
      <PageHero
        bannerId="new-projects"
        eyebrow="New Projects"
        title="New residential projects in Bengaluru"
        caption="See what's taking shape across Bengaluru."
        description="Explore new residential projects in Bengaluru, including new launches and developments under construction. Start with where you'd like to live, then compare floor plans, quoted costs and expected possession. If you're buying for family or planning a return to Bengaluru, consider which layouts can adapt to your needs and which handover dates work with your plans."
        image={img("tower-balconies")}
      />
      <HubResults
        kind="project"
        items={items}
        suggestions={locationSuggestions()}
        title="Search and filters"
        caption="Select the filter."
        body="Choose your preferred neighbourhood, budget and property type. Where filters are available, narrow the results by configuration or possession stage. Open individual project pages to review the developer, phase details and floor plans."
        emptyMessage="No projects match these filters. Broaden your search or tell us what you are looking for."
        actions={
          <Link href="/contact-us/?topic=new-project#enquiry" className="btn-outline">
            Request a Shortlist
          </Link>
        }
      />
      <ContentBlock
        tone="sand"
        title="Compare the details that shape your decision"
        caption="Look beyond the brochure."
        cards={[
          {
            title: "Floor plan",
            text: "Evaluate the space, room layouts and functionality to ensure the home suits your lifestyle and everyday needs.",
          },
          {
            title: "Price",
            text: "Review the detailed cost breakdown, additional charges and payment schedules to understand the overall investment.",
          },
          {
            title: "Timeline",
            text: "Understand the expected possession date, construction progress and availability of amenities before making your decision.",
          },
        ]}
      />
      <ContentBlock
        tone="dark"
        title="Request a project brief"
        caption="Begin with the brief, down to the details."
        body="Share your preferred Bengaluru neighbourhoods, configuration, budget and timeline. Tell us which points are flexible so we can discuss a focused shortlist. If you live overseas, include your time zone and expected visit dates."
        actions={
          <>
            <Link href="/contact-us/?topic=new-project#enquiry" className="btn-gold">
              Request Project Details
            </Link>
            <Link href="/contact-us/?topic=new-project&about=Site%20visit#enquiry" className="btn-ghost-light">
              Arrange a Site Visit
            </Link>
          </>
        }
      />
      <Faq items={FAQS} />
    </>
  );
}
