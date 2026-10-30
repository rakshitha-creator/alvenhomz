import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, CalendarClock, FileText, Landmark, LayoutGrid, Ruler, ShieldCheck } from "lucide-react";
import Amenities from "@/components/Amenities";
import FloorPlans from "@/components/FloorPlans";
import Gallery from "@/components/Gallery";
import JsonLd from "@/components/JsonLd";
import MapEmbed from "@/components/MapEmbed";
import { MobileEnquiryBar } from "@/components/ContactActions";
import { WhatsAppIcon } from "@/components/icons";
import { Badge, DetailHeader, DetailSection, EnquirySidebar, Facts, SectionNav, Similar } from "@/components/DetailParts";
import { getProject, projectCard, projects, similar } from "@/lib/data";
import { PROJECT_STATUS, PROPERTY_TYPES } from "@/lib/constants";
import { whatsappHref } from "@/lib/contact";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { formatINR, formatPriceRange, img } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const configs = p.propertyType === "plot" ? "Plots" : p.configurations.map((c) => c.label).join(", ");
  return pageMetadata({
    title: `${p.name} by ${p.developer} – ${configs} in ${p.locality}, ${p.city}`,
    description: `${p.name} in ${p.locality}, ${p.city}: ${configs} from ${formatINR(p.priceFrom)}. ${PROJECT_STATUS[p.status]}, possession ${p.possession}. View photos, amenities, floor plans and location.`,
    path: `/new-projects/${p.slug}/`,
    image: p.images[0],
  });
}

const STATUS_TONE = { ready: "green", "under-construction": "amber", upcoming: "sky" } as const;

export default async function ProjectPage({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();

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
          title={p.name}
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

            <DetailSection id="overview" title="Project Overview">
              <p className="leading-relaxed text-navy-800">{p.description}</p>
              <div className="mt-6">
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
              <h3 className="mt-8 font-sans text-base font-bold">Project highlights</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3 rounded-xl bg-ivory px-4 py-3 text-sm text-navy-800">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" /> {h}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection id="pricing" title="Price & Configurations">
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
                    {p.configurations.map((c) => (
                      <tr key={c.label}>
                        <th scope="row" className="px-5 py-4 font-semibold text-navy-900">{c.label}</th>
                        <td className="px-5 py-4 text-navy-800">{c.area}</td>
                        <td className="px-5 py-4 font-semibold text-navy-900">{c.price ? `${formatINR(c.price)}*` : "On request"}</td>
                        <td className="px-5 py-4 text-right">
                          <a
                            href={whatsappHref(`Hi Alven Homz, please share the latest price for ${c.label} at ${p.name}, ${location}.`)}
                            target="_blank"
                            rel="noopener"
                            className="text-xs font-semibold text-gold-600 hover:text-navy-900"
                          >
                            Get price sheet
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted">*Indicative starting prices. Taxes, registration and other charges extra. Confirm current pricing with our team.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={whatsappHref(brochureMsg)} target="_blank" rel="noopener" className="btn-whatsapp">
                  <WhatsAppIcon className="h-4 w-4" /> Get brochure on WhatsApp
                </a>
                <a href="#enquire" className="btn-outline">
                  <FileText className="h-4 w-4" /> Enquire Now
                </a>
              </div>
            </DetailSection>

            <DetailSection id="amenities" title="Amenities">
              <Amenities items={p.amenities} />
            </DetailSection>

            {p.floorPlans.length > 0 && (
              <DetailSection id="floor-plans" title="Floor Plans">
                <FloorPlans
                  plans={p.floorPlans}
                  onRequest={
                    <a href={whatsappHref(brochureMsg)} target="_blank" rel="noopener" className="btn-primary">
                      Request official floor plans
                    </a>
                  }
                />
              </DetailSection>
            )}

            <DetailSection id="location" title="Location & Nearby">
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
            </DetailSection>

            <DetailSection id="developer" title={`About ${p.developer}`}>
              <div className="flex gap-5 rounded-2xl bg-ivory p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy-900 font-display text-2xl text-gold-300">{p.developer[0]}</span>
                <p className="text-sm leading-relaxed text-navy-800">{p.developerAbout}</p>
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
                <p className="mt-1 text-sm text-muted">{p.configurations.map((c) => c.label).join(" · ")}</p>
              </div>
            }
          />
        </div>
      </div>

      <Similar title="Similar Projects" items={similar(projects, p, (x) => x.priceFrom).map(projectCard)} />
      <MobileEnquiryBar listing={listingRef} />
    </>
  );
}
