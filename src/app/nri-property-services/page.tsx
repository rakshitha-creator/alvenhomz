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
    "Buying, selling, renting out or designing a Bengaluru home from overseas? Discuss your property brief, visit window and service needs with Alven Homz.",
  path: "/nri-property-services/",
  image: "living-penthouse",
});

const CONSULT = "/contact-us/?topic=other&about=NRI%20%2F%20overseas%20enquiry#enquiry";

const FAQS: FaqItem[] = [
  {
    q: "Can I buy a new apartment in Bengaluru while living abroad?",
    a: "Yes. As an NRI, you can purchase a residential apartment in Bengaluru and pay through an inward bank remittance or an eligible NRE, NRO or FCNR(B) account. To start your search with Alven Homz, share your budget, preferred neighbourhoods and when you want possession. We can help you compare projects before you plan a trip.",
  },
  {
    q: "How can I verify a Bengaluru project before paying a booking amount from overseas?",
    a: "Start with the Karnataka RERA registration number for the project phase you’re considering. Match the developer, phase and stated completion date to the booking documents. Then request the exact unit plan, carpet area, itemised cost sheet, payment milestones and cancellation terms. If you arrange a video walkthrough, confirm whether it shows your unit, a model apartment or the construction site.",
  },
  {
    q: "Can I sell my Bengaluru apartment without travelling to India?",
    a: "It may be possible to complete the sale through a trusted representative under a properly executed and authenticated Power of Attorney (PoA). Before signing it abroad, have an Indian property lawyer confirm which sale and registration steps it must cover and how it should be authenticated for use in Karnataka. This lets you settle the paperwork before committing to a buyer’s timeline.",
  },
  {
    q: "How can Alven Homz help me price and sell my Bengaluru home from overseas?",
    a: "Start by sharing the community name, floor plan, parking details, occupancy status and preferred sale date. We can help you compare similar homes in the same community, discuss an asking price and plan viewings with your local keyholder. If the home is tenanted, tell us when it can be shown and whether you intend to sell it with the tenant in place.",
  },
  {
    q: "How much will I receive after selling my Bengaluru property, and can I transfer the proceeds abroad?",
    a: "Your sale price and the amount available to remit can differ. Before accepting an offer, ask your chartered accountant to estimate buyer withholding (TDS), your final tax liability and net proceeds after any outstanding loan and sale expenses. Ask your authorised dealer bank to confirm how much you can remit and which records it needs, particularly if you inherited the home or originally paid for it from overseas.",
  },
];

export default function NriPropertyServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="NRI Property Services"
        title={
          <>
            Bengaluru property services
            <br />
            for NRI clients
          </>
        }
        caption="A Bengaluru address, even when life takes you elsewhere."
        description="Buying or managing a Bengaluru home while living overseas starts with deciding what you need from the property. It might be a family residence, a place to return to or a home you plan to rent out. Alven Homz helps NRI clients explore new and resale homes, discuss renting out or selling an existing property, and plan interiors around handover dates and visits to the city."
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
        title="Selling or renting out a Bengaluru home"
        caption="Set the plan before arranging the viewings."
        body="Tell us whether the home is occupied, vacant or awaiting handover. We can discuss how to present it for sale or rent, what prospective buyers or tenants will ask, and which viewing arrangements are practical while you're overseas. We agree responsibilities and fees before work starts."
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
