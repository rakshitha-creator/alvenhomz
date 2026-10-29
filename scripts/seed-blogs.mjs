/**
 * Seed 6 sample blogs for Alven Homz.
 *
 * Usage:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS=".\serviceAccount.json"
 *   node scripts/seed-blogs.mjs
 */
import { readFileSync } from "node:fs";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const sa = JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS || "./serviceAccount.json", "utf8"));
if (!getApps().length) initializeApp({ credential: cert(sa) });
const db = getFirestore();

const blogs = [
  {
    slug: "buying-new-launch-vs-resale-bangalore",
    title: "New Launch vs Resale in Bangalore: Which Should You Choose?",
    excerpt:
      "A clear comparison of new projects and ready resale homes — timelines, pricing, risks and who each option suits best.",
    author: "Alven Homz",
    publishedAt: "2026-03-01",
    coverImage: "tower-balconies",
    body: `## Why this decision matters

In Bangalore, buyers often choose between a **new launch / under-construction project** and a **ready resale home**. Both can work — the right pick depends on your timeline, budget and risk appetite.

## New launch advantages

- Newer amenities, layouts and building standards
- Often lower entry price than comparable ready stock
- Payment linked to construction milestones (in many projects)

## New launch trade-offs

- Waiting for possession
- Construction and delay risk — always verify RERA details
- Prices can change closer to handover

## Resale advantages

- See the exact flat, view and neighbourhood before you buy
- Faster move-in if the home is ready
- Negotiable pricing and clearer living costs

## How Alven Homz helps

We shortlist verified new projects and resale options across East and South Bangalore, walk you through documents, and help you compare true cost — not just the headline price.

**Talk to us** on WhatsApp if you want a side-by-side shortlist for your budget.`,
  },
  {
    slug: "how-to-read-rera-before-you-book",
    title: "How to Read RERA Details Before You Book a Project",
    excerpt:
      "RERA is more than a registration number. Learn what to check so you book with clearer expectations.",
    author: "Alven Homz",
    publishedAt: "2026-03-08",
    coverImage: "living-white",
    body: `## Start with the registration number

Every legitimate project should publish a **Karnataka RERA** number. Confirm it on the official portal before you pay a booking amount.

## What to verify

- Promoter / developer name
- Project name and location
- Proposed completion / possession timelines
- Approved carpet area and unit types where available

## Red flags

- No RERA number, or a number that does not match the project
- Vague possession language with no written timeline
- Pressure to pay large sums before paperwork is shared

## Our approach

On Alven Homz project pages we surface published RERA details where available. Our advisors still recommend verifying the latest status on the Karnataka RERA portal before you commit.`,
  },
  {
    slug: "renting-in-bangalore-deposit-and-move-in-costs",
    title: "Renting in Bangalore: Deposit, Maintenance and Move-in Costs",
    excerpt:
      "Understand monthly rent, security deposit and society maintenance so your move-in budget is realistic.",
    author: "Alven Homz",
    publishedAt: "2026-03-15",
    coverImage: "living-blue",
    body: `## The three numbers that matter

Most rental listings show:

1. **Monthly rent**
2. **Security deposit** (often several months of rent)
3. **Maintenance** (society charges, sometimes separate)

## Typical move-in outlay

Plan for **deposit + first month’s rent + maintenance** (if billed upfront). That is the figure we show clearly on Alven Homz rental detail pages.

## Questions to ask before you sign

- Who pays society maintenance?
- Is the deposit refundable and on what timeline?
- Are parking, clubhouse or visitor charges extra?
- Preferred tenant type (family / bachelor / company lease)

## Next step

Browse our [Rental Properties](/rental-properties/) page, filter by budget and furnishing, then WhatsApp us to schedule visits.`,
  },
  {
    slug: "sarjapur-gunjur-homes-guide",
    title: "Living Around Sarjapur Road & Gunjur: A Practical Buyer Guide",
    excerpt:
      "Connectivity, lifestyle and what to look for when buying near Sarjapur Road and Gunjur.",
    author: "Alven Homz",
    publishedAt: "2026-03-22",
    coverImage: "villa-night",
    body: `## Why buyers look here

East and South Bangalore corridors around **Sarjapur Road** and **Gunjur** attract end-users and investors for employment access, newer supply and improving social infrastructure.

## What to evaluate on a site visit

- Daily commute to your workplace
- Schools, hospitals and daily retail nearby
- Water, power backup and society maintenance culture
- Future road and metro plans (verify independently)

## New projects vs ready homes

New launches in this belt can offer modern amenities; resale stock can offer faster possession. Compare both with clear possession and price data.

Alven Homz lists curated projects and homes in these micro-markets — use filters on New Projects and Resale, then ask us for a shortlist matched to your commute.`,
  },
  {
    slug: "interior-design-after-you-get-the-keys",
    title: "Interior Design After You Get the Keys: Where to Start",
    excerpt:
      "A simple sequence for modular kitchens, living spaces and full-home interiors once possession is in hand.",
    author: "Alven Homz Interiors",
    publishedAt: "2026-03-29",
    coverImage: "kitchen-island",
    body: `## Don’t start with shopping

Begin with **how you live**: cooking style, work-from-home needs, storage and family routines. That brief drives layouts more than catalogue photos.

## A sensible order of work

1. Space planning and measurements
2. Civil / electrical readiness
3. Modular kitchen and wardrobes
4. Living / bedroom styling
5. Soft furnishings and lighting

## Budget clarity

Ask for itemised scopes — carpentry, appliances, false ceiling, painting — so there are fewer surprises mid-project.

## Alven Homz Interiors

If you bought or rented through us (or already have keys), our interiors team can take you from brief to finished home. Explore [Interiors](/interiors/) or request a free consultation on WhatsApp.`,
  },
  {
    slug: "documents-checklist-for-home-buyers",
    title: "Home Buyer Documents Checklist for Bangalore",
    excerpt:
      "A practical checklist of papers and checks before you book, pay or register a property.",
    author: "Alven Homz",
    publishedAt: "2026-04-05",
    coverImage: "living-gallery",
    body: `## Before booking

- Government ID and PAN for all applicants
- Proof of funds / loan pre-approval if financing
- Project brochure, price sheet and payment schedule (new projects)
- Title and society documents summary (resale)

## Before agreement

- Draft agreement for sale / sale deed review
- Encumbrance and title verification through your lawyer
- RERA / approvals confirmation for under-construction stock
- Parking, floor and inventory confirmation in writing

## Before registration

- Final sale deed
- Stamp duty and registration fee estimates
- NOC / society transfer requirements (resale)
- Loan sanction and disbursement timeline (if applicable)

## How we support you

Alven Homz advisors coordinate site visits, developer discussions and documentation hand-holding — while legal title checks should always involve a qualified professional.`,
  },
];

console.log("Seeding blogs…");
for (const post of blogs) {
  await db.collection("blogs").doc(post.slug).set(
    {
      ...post,
      published: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  console.log(`  ✓ blogs/${post.slug}`);
}
console.log(`Done. blogs=${blogs.length}`);
