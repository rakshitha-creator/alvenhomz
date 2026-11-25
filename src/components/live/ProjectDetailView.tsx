"use client";

import Link from "next/link";
import { Building2, CalendarClock, Download, FileText, Landmark, LayoutGrid, Ruler, ShieldCheck } from "lucide-react";
import { track } from "@/components/Analytics";
import Amenities from "@/components/Amenities";
import FloorPlans from "@/components/FloorPlans";
import Gallery from "@/components/Gallery";
import Faq, { type FaqItem } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import MapEmbed from "@/components/MapEmbed";
import { MobileEnquiryBar } from "@/components/ContactActions";
import { WhatsAppIcon } from "@/components/icons";
import { Badge, DetailHeader, DetailSection, EnquirySidebar, Facts, SectionNav, Similar } from "@/components/DetailParts";
import { projectCard, projects, similar } from "@/lib/data";
import { PROJECT_STATUS, PROPERTY_TYPES } from "@/lib/constants";
import { whatsappHref } from "@/lib/contact";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { formatINR, formatPriceRange, img } from "@/lib/utils";

import type { Project } from "@/lib/types";
import { repairSplitList } from "@/lib/live-merge";

const STATUS_TONE = { ready: "green", "under-construction": "amber", upcoming: "sky" } as const;

/** Detail page layout, shared by the static build (site data) and the live admin (Firebase) data. */
export default function ProjectDetailView({ p, all = projects }: { p: Project; all?: Project[] }) {

  const path = `/new-projects/${p.slug}/`;
  const location = `${p.locality}, ${p.city}`;
  const priceRange = p.priceTo && p.priceTo > p.priceFrom ? formatPriceRange(p.priceFrom, p.priceTo) : `${formatINR(p.priceFrom)} onwards`;
  const listingRef = { title: `${p.name} by ${p.developer}`, location, price: `${priceRange}`, url: absoluteUrl(path) };
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "New Projects", path: "/new-projects/" },
    { name: p.name, path },
  ];
  const brochureMsg = `Hi Alven Homz, please share the brochure, price sheet and floor plans for ${p.name} (${location}).`;
  // "Download Brochure": the uploaded PDF when there is one; otherwise it asks for the brochure on WhatsApp.
  const brochureButton = (className = "btn-gold") =>
    p.brochureUrl ? (
      <a
        href={p.brochureUrl}
        target="_blank"
        rel="noopener"
        download
        className={className}
        onClick={() => track("brochure_download", { project: p.slug, page_path: window.location.pathname })}
      >
        <Download className="h-4 w-4" /> Download Brochure
      </a>
    ) : (
      // No PDF uploaded yet: same button, sends the brochure request on WhatsApp.
      <a
        href={whatsappHref(brochureMsg)}
        target="_blank"
        rel="noopener"
        className={className}
        onClick={() => track("brochure_request", { project: p.slug, page_path: window.location.pathname })}
      >
        <Download className="h-4 w-4" /> Download Brochure
      </a>
    );
  const kindText = p.propertyType === "plot" ? "plotted development" : p.propertyType === "villa" ? "villa community" : "residential apartment development";
  const configs = p.configurations.map((c) => c.label);
  const configText = configs.length > 1 ? `${configs.slice(0, -1).join(", ")} and ${configs.at(-1)}` : (configs[0] ?? "");
  const enquiryHref = `/contact-us/?topic=new-project&about=${encodeURIComponent(p.name)}#enquiry`;
  const visitHref = `/contact-us/?topic=new-project&about=${encodeURIComponent(`Site visit – ${p.name}`)}#enquiry`;
  const firstPlace = p.nearby[0]?.name;
  // Project-specific FAQs (website data or admin) replace the general questions when present.
  const ownFaqs: FaqItem[] = (p.faqs ?? []).filter((f) => f.question && f.answer).map((f) => ({ q: f.question, a: f.answer }));
  const generalFaqs: FaqItem[] = [
    {
      q: `Which floor plans are available at ${p.name}?`,
      a: `${p.name} lists ${configText || "several configurations"}. Availability can vary by tower and phase. Ask for the current unit list and the floor plan for the specific residence you want to compare.`,
    },
    {
      q: `When is possession expected at ${p.name}?`,
      a: `The stated possession for ${p.name} is ${p.possession}. Confirm the schedule for the tower and unit you are considering.`,
    },
    {
      q: `How much does a home at ${p.name} cost?`,
      a: `${p.priceFrom > 0 ? `Quotes start from ${formatINR(p.priceFrom)} for the entry configuration.` : "Pricing is available on request."} Ask for a current unit-specific cost sheet to see the quoted price, applicable charges and payment milestones.`,
    },
  ];
  const faqs = ownFaqs.length ? ownFaqs : generalFaqs;

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "pricing", label: "Price & Configurations" },
    { id: "amenities", label: "Amenities" },
    ...(p.floorPlans.length ? [{ id: "floor-plans", label: "Floor Plans" }] : []),
    { id: "location", label: "Location" },
    { id: "developer", label: "Developer" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          name: p.name,
          description: p.description,
          url: absoluteUrl(path),
          image: p.images.map((i) => absoluteUrl(img(i))),
          datePosted: p.launchedOn,
          offers: { "@type": "AggregateOffer", priceCurrency: "INR", lowPrice: p.priceFrom, ...(p.priceTo ? { highPrice: p.priceTo } : {}) },
          about: {
            "@type": p.propertyType === "plot" ? "Place" : "ApartmentComplex",
            name: p.name,
            address: { "@type": "PostalAddress", streetAddress: p.address, addressLocality: p.city, addressCountry: "IN" },
            geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
          },
        }}
      />

      <div className="container-x">
        <DetailHeader
          crumbs={crumbs}
          title={`${p.name} in ${p.locality}, Bengaluru`}
          caption="Get to know the address before you visit."
          intro={`${p.name} is a ${kindText} by ${p.developer} in ${p.locality}, Bengaluru${configText ? `, with ${configText} homes` : ""}. Review the layouts, the amenities for your phase and expected possession before requesting a quote for a specific unit.`}
          location={`${p.address}`}
          price={priceRange}
          priceNote={`by ${p.developer}`}
          badges={
            <>
              <Badge tone={STATUS_TONE[p.status]}>{PROJECT_STATUS[p.status]}</Badge>
              <Badge>{PROPERTY_TYPES[p.propertyType]}</Badge>
              {p.featured && <Badge tone="gold">Featured</Badge>}
            </>
          }
        />
        <Gallery images={p.images} title={p.name} />
        {p.representativeImages && <p className="mt-2 text-xs text-muted">Representative images — not actual photographs of this project.</p>}

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <SectionNav items={sections} />

            <DetailSection
              id="overview"
              title="Project Overview"
              caption="The details that shape the address."
              intro={`${p.name} in ${p.locality} is ${PROJECT_STATUS[p.status].toLowerCase()}, with expected possession ${/^\d|^[A-Z][a-z]{2,8} \d{4}/.test(p.possession) ? "in " : ""}${p.possession}. Check the overview for the configuration options and the basis on which areas are quoted.`}
            >
              <p className="leading-relaxed text-navy-800 hyphens-none">{p.description}</p>
              <div className="mt-10">
                <Facts
                  items={[
                    { label: "Status", value: PROJECT_STATUS[p.status], icon: <Building2 className="h-3.5 w-3.5" /> },
                    { label: "Possession", value: p.possession, icon: <CalendarClock className="h-3.5 w-3.5" /> },
                    { label: "Configurations", value: p.configurations.map((c) => c.label).join(", "), icon: <LayoutGrid className="h-3.5 w-3.5" /> },
                    { label: p.propertyType === "plot" ? "Total plots" : "Total units", value: p.totalUnits.toLocaleString("en-IN"), icon: <Landmark className="h-3.5 w-3.5" /> },
                    { label: "Land area", value: p.landArea, icon: <Ruler className="h-3.5 w-3.5" /> },
                    { label: "Towers", value: p.towers, icon: <Building2 className="h-3.5 w-3.5" /> },
                    { label: "RERA no.", value: p.reraNumber ?? "Not applicable / awaited", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
                  ]}
                />
              </div>
              {p.reraNumber && !p.isSample && (
                <p className="mt-3 text-xs text-muted">
                  Details as published by the developer. Verify the RERA registration on the{" "}
                  <a href="https://rera.karnataka.gov.in/" target="_blank" rel="noopener" className="font-semibold text-navy-800 underline">
                    Karnataka RERA portal
                  </a>
                  .
                </p>
              )}
              <h3 className="mt-10 font-sans text-base font-bold">Project Highlights</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {repairSplitList(p.highlights ?? []).map((h) => (
                  <li key={h} className="flex gap-3 rounded-xl bg-ivory px-4 py-3 text-sm text-navy-800">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" /> {h}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection
              id="pricing"
              title={`${p.name}: Price and configurations`}
              caption="Understand the cost of the home you choose."
              intro="Compare the available configurations by layout, quoted area and price basis. Request an itemised cost sheet for your preferred unit so you can review the quoted price, applicable charges and payment milestones together."
            >
              <div className="overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-ivory text-xs tracking-wide text-muted uppercase">
                    <tr>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Configuration</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Area</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Starting price</th>
                      <th scope="col" className="px-5 py-3.5"><span className="sr-only">Action</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {p.configurations.map((c, ci) => (
                      <tr key={c.label}>
                        <th scope="row" className="px-5 py-4 font-semibold text-navy-900">{c.label}</th>
                        <td className="px-5 py-4 text-navy-800">{c.area}</td>
                        <td className="px-5 py-4 font-semibold text-navy-900">{c.price
                          ? `${formatINR(c.price)}*`
                          : ci === 0 && p.priceFrom && !p.configurations.some((x) => x.price)
                            ? `From ${formatINR(p.priceFrom)}*` /* matches the "onwards" price in the header */
                            : "Price on request"}</td>
                        <td className="px-5 py-4 text-right">
                          <a
                            href={whatsappHref(`Hi Alven Homz, please share the latest price for ${c.label} at ${p.name}, ${location}.`)}
                            target="_blank"
                            rel="noopener"
                            className="text-xs font-semibold text-gold-600 hover:text-navy-900"
                          >
                            Get Today's Price on WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted">*Indicative starting prices. Taxes, registration and other charges extra. Confirm current pricing with our team.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {brochureButton()}
                <a href="#enquire" className="btn-outline">
                  <FileText className="h-4 w-4" /> Enquire Now
                </a>
              </div>
            </DetailSection>

            <DetailSection
              id="amenities"
              title="Amenities"
              intro={`Explore the facilities listed at ${p.name}. Check which are available and which are planned, especially if you're choosing this phase for a particular amenity.`}
            >
              <Amenities items={p.amenities} />
            </DetailSection>

            {p.floorPlans.length > 0 && (
              <DetailSection
                id="floor-plans"
                title="Floor Plans"
                caption="See how the space will work for you."
                intro="Select a configuration to see how the rooms connect, where the utility and storage sit and how much usable space is available. Ask for the floor plan and area basis for the unit you're considering."
              >
                <FloorPlans
                  plans={p.floorPlans}
                  onRequest={
                    <a href={whatsappHref(brochureMsg)} target="_blank" rel="noopener" className="btn-primary">
                      Send Me All Floor Plans
                    </a>
                  }
                />
              </DetailSection>
            )}

            <DetailSection
              id="location"
              title="Location and Nearby"
              caption="Place the project in context."
              intro={`${p.name} is in ${p.locality}, Bengaluru.${firstPlace ? ` If you regularly travel to ${firstPlace} or the places below, review the route from the project entrance and allow for the time of day you normally make the trip.` : ""}`}
            >
              <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
                <MapEmbed lat={p.lat} lng={p.lng} title={p.name} />
                <ul className="divide-y divide-line rounded-2xl border border-line">
                  {p.nearby.map((n) => (
                    <li key={n.name} className="flex items-center justify-between gap-3 px-4 py-3.5 text-sm">
                      <span className="text-navy-800">{n.name}</span>
                      <span className="shrink-0 rounded-full bg-ivory px-2.5 py-1 text-xs font-semibold text-navy-900">{n.distance}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 text-xs text-muted">Distances are approximate.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={enquiryHref} className="btn-primary">
                  Request Current Availability
                </Link>
                <Link href={visitHref} className="btn-outline">
                  Arrange a Site Visit
                </Link>
              </div>
            </DetailSection>

            <DetailSection id="developer" title={`About ${p.developer}`}>
              <div className="flex items-center gap-5 rounded-2xl bg-ivory p-6">
                {/abhee/i.test(p.developer) ? (
                  <span className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-card sm:h-28 sm:w-24">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/brand/abhee-ventures-logo.webp" alt="Abhee Ventures logo" width={365} height={529} loading="lazy" className="h-full w-auto object-contain" />
                  </span>
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-espresso-900 font-display text-2xl text-gold-300">{p.developer[0]}</span>
                )}
                <p className="text-base leading-relaxed text-navy-800">{p.developerAbout}</p>
              </div>
            </DetailSection>
          </div>

          <EnquirySidebar
            listing={listingRef}
            isSample={p.isSample}
            summary={
              <div>
                <p className="text-xs font-medium tracking-wide text-muted uppercase">Starting from</p>
                <p className="mt-1 font-display text-3xl font-semibold text-navy-900">{formatINR(p.priceFrom)}</p>
                <p className="mt-1 text-base text-muted">{p.configurations.map((c) => c.label).join(" · ")}</p>
                <div className="mt-4 grid">{brochureButton("btn-gold w-full")}</div>
              </div>
            }
          />
        </div>
      </div>

      <Faq items={faqs} className="pt-4" />
      <Similar title="Similar Projects" items={similar(all, p, (x) => x.priceFrom).map(projectCard)} />
      <MobileEnquiryBar listing={listingRef} />
    </>
  );
}
