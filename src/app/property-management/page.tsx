import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Faq, { type FaqItem } from "@/components/Faq";
import { ContentBlock } from "@/components/InfoCards";
import { PageHero } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Property Management in Bengaluru",
  description:
    "Explore owner services for renting, resale and preparing a Bengaluru home for its next occupant. Discuss the right scope for your property.",
  path: "/property-management/",
  image: "living-white",
});

const OWNER = "/contact-us/?topic=owner#enquiry";

const FAQS: FaqItem[] = [
  {
    q: "What does Alven Homz help property owners with?",
    a: "Alven Homz helps Bengaluru property owners plan renting, resale and interiors for a home's next occupant. The tasks and fees depend on the property and the scope agreed with the owner.",
  },
  {
    q: "Can I enquire about a vacant or under-construction home?",
    a: "Yes. Tell us whether the home is vacant, occupied or under construction, and which possession or move-in date you're working towards. We can discuss which preparation can begin now and which tasks depend on access or handover.",
  },
  {
    q: "Can I plan renting out my home while I live abroad?",
    a: "Yes. Share the home's location, furnishing, expected availability and your time zone. We can discuss what information tenants will need and what local viewing coordination can be included in the scope.",
  },
];

export default function PropertyManagementPage() {
  return (
    <>
      <PageHero
        eyebrow="Property Management"
        title="Property management for Bengaluru homeowners"
        caption="Make the next move for the home you own."
        description="Alven Homz helps Bengaluru homeowners prepare a property for renting, resale or its next occupant. Whether you've received the keys to a new apartment, are between tenants or are deciding what to do with a home from overseas, we start with the property's condition, availability and the outcome you want."
        image={img("living-white")}
        actions={
          <Link href={OWNER} className="btn-gold">
            Discuss Your Property <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <ContentBlock
        title="Prepare a home for renting"
        caption="Get the home ready to rent out."
        body="Start with the home's condition, furnishing and earliest move-in date. We can discuss how to present it to tenants, which charges and inclusions to state upfront, and how viewings could work while the home is occupied or being readied."
        actions={
          <Link href="/rental-properties/" className="btn-outline">
            Rental Properties
          </Link>
        }
      />
      <ContentBlock
        tone="sand"
        title="Prepare an owner-listed resale"
        caption="Show buyers what makes the home worth seeing."
        body="Share the community, configuration and whether the home is occupied, vacant or under construction. We can discuss the listing brief, which photos and plans buyers need, and the information to have ready about possession or transfer before arranging viewings."
        actions={
          <Link href="/resale-properties/" className="btn-outline bg-white">
            Resale Properties
          </Link>
        }
      />
      <ContentBlock
        title="Interiors before the next move"
        caption="Start with the details the next occupant will use every day."
        body="Start with the rooms and fittings that will matter most to the next occupant, such as practical kitchen storage, lighting or durable wardrobe finishes. We can discuss the improvements that fit your budget and timing, whether you plan to move in or offer the home for rent."
        actions={
          <Link href="/interiors/" className="btn-outline">
            Interiors
          </Link>
        }
      />
      <ContentBlock
        tone="dark"
        title="Agree the scope at the outset"
        caption="Agree on the details before the work begins."
        body="Tell us what you'd like help with, from preparing listing information to arranging viewings or scoping interior work. We can discuss which services are available for your home, who will handle each task and how fees will be agreed."
        actions={
          <>
            <Link href={OWNER} className="btn-gold">
              Share an Owner Brief <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/nri-property-services/" className="btn-ghost-light">
              Living overseas? NRI services
            </Link>
          </>
        }
      />
      <Faq items={FAQS} />
    </>
  );
}
