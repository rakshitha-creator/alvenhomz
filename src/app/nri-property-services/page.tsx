import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Faq, { type FaqItem } from "@/components/Faq";
import { ContentBlock } from "@/components/InfoCards";
import { PageHero } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "NRI Property Services in Bengaluru",
  description:
    "Buying, selling, leasing or designing a Bengaluru home from overseas? Discuss your property brief, visit window and service needs with Alven Homz.",
  path: "/nri-property-services/",
  image: "living-penthouse",
});

const CONSULT = "/contact-us/?topic=other&about=NRI%20%2F%20overseas%20enquiry#enquiry";

const FAQS: FaqItem[] = [
  {
    q: "Can I start buying a Bengaluru home before travelling to India?",
    a: "Yes. Start by sharing your preferred localities, budget and timeline. Ask for current floor plans, unit availability and viewing options, then discuss transaction requirements specific to your circumstances with your advisers.",
  },
  {
    q: "Can I enquire about renting or selling a Bengaluru home while abroad?",
    a: "Yes. Share the property's Bengaluru locality, ownership and occupancy status, and the support you need. We can discuss listing preparation and viewing coordination and agree what's included before work starts.",
  },
  {
    q: "What should I share for the first call?",
    a: "Share your country, time zone, preferred locality or property details, and your approximate budget or asking-price expectation. Mention your next visit and the decision you want to make before it.",
  },
  {
    q: "What can I organise before my next Bengaluru visit?",
    a: "You can shortlist properties, request current plans and quotes, and discuss available viewing times. If your visit includes interiors, share the floor plan and check when the property can be accessed for a site meeting.",
  },
];

export default function NriPropertyServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="NRI Property Services"
        title="Bengaluru property services for NRI clients"
        caption="A Bengaluru address, even when life takes you elsewhere."
        description="Buying or managing a Bengaluru home while living overseas starts with deciding what you need from the property. It might be a family residence, a place to return to or a home you plan to lease. Alven Homz helps NRI clients explore new and resale homes, discuss leasing or selling an existing property, and plan interiors around handover dates and visits to the city."
        image={img("living-penthouse")}
        actions={
          <Link href={CONSULT} className="btn-gold">
            Request an NRI Property Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <ContentBlock
        title="Buying a home from overseas"
        caption="Shortlist from abroad. Make the visit count."
        body="Tell us which Bengaluru neighbourhoods you're considering and who will use the home. Compare floor plans, possession windows and itemised quotes while you're abroad, then decide which residences to view during your visit. Ask which property information and viewing options are available before booking appointments."
        actions={
          <>
            <Link href="/new-projects/" className="btn-outline">
              New Projects
            </Link>
            <Link href="/resale-properties/" className="btn-outline">
              Resale Properties
            </Link>
          </>
        }
      />
      <ContentBlock
        tone="sand"
        title="Selling or leasing a Bengaluru home"
        caption="Set the plan before arranging the viewings."
        body="Tell us whether the home is occupied, vacant or awaiting handover. We can discuss how to present it for sale or lease, what prospective buyers or tenants will ask, and which viewing arrangements are practical while you're overseas. We agree responsibilities and fees before work starts."
        actions={
          <>
            <Link href="/resale-properties/" className="btn-outline bg-white">
              Resale
            </Link>
            <Link href="/rental-properties/" className="btn-outline bg-white">
              Rentals
            </Link>
            <Link href="/property-management/" className="btn-outline bg-white">
              Property Management
            </Link>
          </>
        }
      />
      <ContentBlock
        title="Planning interiors from overseas"
        caption="Make design decisions before you land."
        body="Send an available floor plan, the handover window and an idea of which rooms you want to design. We can discuss how to review layouts and finishes from abroad, and which approvals depend on samples or final site measurements."
        actions={
          <>
            <Link href="/interiors/" className="btn-outline">
              Interiors
            </Link>
            <Link href="/interiors/#interior-consultation" className="btn-outline">
              Interior consultation form
            </Link>
          </>
        }
      />
      <ContentBlock
        tone="dark"
        title="A first conversation that fits your time zone"
        caption="A conversation on your time."
        body="Share your country, time zone, Bengaluru locality, property status and expected travel dates. Tell us which decision you want to make before your next visit. For transaction-specific legal, banking or tax questions, bring in your independent advisers."
        actions={
          <Link href={CONSULT} className="btn-gold">
            Request an NRI Property Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <Faq items={FAQS} />
    </>
  );
}
