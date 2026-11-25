"use client";

import { Bath, BedDouble, Building, CalendarDays, Car, Compass, Layers, Ruler, ShieldCheck, Sofa } from "lucide-react";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import ListingVideo from "@/components/ListingVideo";
import Faq, { type FaqItem } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import MapEmbed from "@/components/MapEmbed";
import { MobileEnquiryBar } from "@/components/ContactActions";
import { Badge, DetailHeader, DetailSection, EnquirySidebar, Facts, SectionNav, Similar } from "@/components/DetailParts";
import { resaleCard, resaleProperties, similar } from "@/lib/data";
import { FURNISHING, PROPERTY_TYPES } from "@/lib/constants";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { bhkLabel, formatArea, formatDate, formatINR, img, titleCase } from "@/lib/utils";

import type { ResaleProperty } from "@/lib/types";

/** Detail page layout, shared by the static build (site data) and the live admin (Firebase) data. */
export default function ResaleDetailView({ p, all = resaleProperties }: { p: ResaleProperty; all?: ResaleProperty[] }) {

  const path = `/resale-properties/${p.slug}/`;
  const location = `${p.locality}, ${p.city}`;
  const pricePerSqft = p.price > 0 ? Math.round(p.price / p.builtUpArea) : 0;
  const priceDisplay = formatINR(p.price);
  const priceNote = p.price > 0 ? `₹${pricePerSqft.toLocaleString("en-IN")} per sq.ft (built-up)` : "Contact us for the latest price";
  const listingRef = { title: p.title, location, price: priceDisplay, url: absoluteUrl(path) };
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Resale Properties", path: "/resale-properties/" },
    { name: p.title, path },
  ];
  const community = p.title.split(/ in /)[1] ?? p.locality;
  const typeText = (PROPERTY_TYPES[p.propertyType] ?? p.propertyType).toLowerCase();
  const bhkText = p.bhk ? bhkLabel(p.bhk) : "";
  const possession = p.readyToMove ? "ready to move in" : "under construction";
  const area = p.builtUpArea ? `${formatArea(p.builtUpArea)} (built-up)` : p.carpetArea ? `${formatArea(p.carpetArea)} (carpet)` : "";
  const faqs: FaqItem[] = [
    {
      q: `Is this ${bhkText || "home"} at ${community} ready for possession?`,
      a: `The unit is listed as ${possession}${p.postedOn ? ` as of ${formatDate(p.postedOn)}` : ""}. Ask when handover is expected and which occupancy or transfer steps apply to this specific home.`,
    },
    {
      q: "Is the advertised area carpet area?",
      a: `The advertised area is quoted on a ${p.carpetArea ? "carpet" : "built-up"} basis. Request the supporting floor plan or source document, and use the same area basis when comparing this residence with others.`,
    },
    {
      q: "Can I view this residence before making a decision?",
      a: "Viewing depends on the unit's accessibility and construction stage. Ask what's available for this home. For a unit under construction, request the floor plan, representative imagery and any authorised site visit options.",
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          name: p.title,
          description: p.description,
          url: absoluteUrl(path),
          image: p.images.map((i) => absoluteUrl(img(i))),
          datePosted: p.postedOn,
          offers: {
            "@type": "Offer",
            ...(p.price > 0 ? { price: p.price } : {}),
            priceCurrency: "INR",
            businessFunction: "http://purl.org/goodrelations/v1#Sell",
          },
          about: {
            "@type": p.propertyType.startsWith("commercial") ? "Place" : "Accommodation",
            name: p.title,
            numberOfRooms: p.bhk || undefined,
            numberOfBathroomsTotal: p.bathrooms,
            floorSize: { "@type": "QuantitativeValue", value: p.builtUpArea, unitCode: "FTK" },
            address: { "@type": "PostalAddress", streetAddress: p.address, addressLocality: p.city, addressCountry: "IN" },
            geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
          },
        }}
      />

      <div className="container-x">
        <DetailHeader
          crumbs={crumbs}
          title={`${bhkText ? `${bhkText} ` : ""}resale ${typeText} at ${community}, ${p.locality}`}
          caption="See what makes this particular home worth a closer look."
          intro={`This owner-listed ${bhkText ? `${bhkText} ` : ""}${typeText} at ${community} in ${p.locality}, Bengaluru${area ? `, has a listed area of ${area}` : ""}. The current possession status is ${possession}. Review the home's furnishing, parking and handover details before enquiring.`}
          location={p.address}
          price={priceDisplay}
          priceNote={priceNote}
          badges={
            <>
              <Badge>{PROPERTY_TYPES[p.propertyType] ?? p.propertyType}</Badge>
              {p.readyToMove && <Badge tone="green">Ready to Move</Badge>}
              {p.featured && <Badge tone="gold">Featured</Badge>}
            </>
          }
        />
        <Gallery images={p.images} title={p.title} />
        {p.representativeImages && <p className="mt-3 text-xs text-muted">Photos show the furnished model unit of this series; the unit on sale may differ.</p>}

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <SectionNav
              items={[
                { id: "overview", label: "Overview" },
                ...(p.furnishingDetails.length ? [{ id: "furnishing", label: "Furnishing" }] : []),
                { id: "amenities", label: "Amenities" },
                ...(p.videoUrl ? [{ id: "video", label: "Video" }] : []),
                { id: "location", label: "Location" },
              ]}
            />

            <DetailSection id="overview" title="Property overview" caption="The facts to check before you visit.">
              <Facts
                items={[
                  { label: "Configuration", value: p.bhk ? bhkLabel(p.bhk) : PROPERTY_TYPES[p.propertyType] ?? p.propertyType, icon: <BedDouble className="h-3.5 w-3.5" /> },
                  { label: "Bathrooms", value: p.bathrooms, icon: <Bath className="h-3.5 w-3.5" /> },
                  { label: "Carpet area", value: formatArea(p.carpetArea), icon: <Ruler className="h-3.5 w-3.5" /> },
                  { label: "Built-up area", value: formatArea(p.builtUpArea), icon: <Ruler className="h-3.5 w-3.5" /> },
                  { label: "Floor", value: /\d/.test(p.floor) && p.totalFloors ? `${p.floor} of ${p.totalFloors}` : p.floor, icon: <Layers className="h-3.5 w-3.5" /> },
                  { label: "Parking", value: p.parking, icon: <Car className="h-3.5 w-3.5" /> },
                  { label: "Possession", value: p.readyToMove ? "Ready to move" : "Under construction", icon: <CalendarDays className="h-3.5 w-3.5" /> },
                  { label: "Furnishing", value: FURNISHING[p.furnishing] ?? p.furnishing, icon: <Sofa className="h-3.5 w-3.5" /> },
                  { label: "Facing", value: p.facing, icon: <Compass className="h-3.5 w-3.5" /> },
                  ...(p.readyToMove ? [{ label: "Property age", value: p.ageYears <= 1 ? "Less than 1 year" : `${p.ageYears} years`, icon: <CalendarDays className="h-3.5 w-3.5" /> }] : []),
                  { label: "Balconies", value: p.balconies || undefined, icon: <Building className="h-3.5 w-3.5" /> },
                  { label: "Ownership", value: titleCase(p.ownership), icon: <ShieldCheck className="h-3.5 w-3.5" /> },
                  { label: "Last updated", value: formatDate(p.liveUpdatedAt ?? p.postedOn), icon: <CalendarDays className="h-3.5 w-3.5" /> },
                ]}
              />
              <h3 className="mt-8 font-sans text-base font-bold">About the residence</h3>
              <p className="mt-1 font-display text-gold-700 italic">Picture the way you&apos;d use the space.</p>
              <p className="mt-3 leading-relaxed text-navy-800">{p.description}</p>
              <p className="mt-4 text-xs text-muted">Ownership and title documents are shared for verification during the site visit and due-diligence stage.</p>
            </DetailSection>

            {p.furnishingDetails.length > 0 && (
              <DetailSection id="furnishing" title={`Furnishing – ${FURNISHING[p.furnishing] ?? p.furnishing}`}>
                <ul className="flex flex-wrap gap-2">
                  {p.furnishingDetails.map((f) => (
                    <li key={f} className="rounded-full border border-line bg-white px-4 py-2 text-sm text-navy-800">{f}</li>
                  ))}
                </ul>
              </DetailSection>
            )}

            <DetailSection
              id="amenities"
              title="Amenities"
              intro={`Explore the facilities confirmed for residents of ${community}. If access to a particular amenity matters to you, check whether it is available now or planned for a later phase.`}
            >
              <Amenities items={p.amenities} />
            </DetailSection>

            {p.videoUrl && (
              <DetailSection id="video" title="Property Video">
                <ListingVideo url={p.videoUrl} title={p.title} />
              </DetailSection>
            )}

            <DetailSection
              id="location"
              title="Location"
              caption="A home is also the places you go every day."
              intro={`See how this address in ${p.locality} connects to the places you travel to most. When planning your viewing, try the route from the community entrance at the time you would normally travel.`}
            >
              <p className="mb-4 text-base text-navy-800">{p.address}</p>
              <MapEmbed lat={p.lat} lng={p.lng} title={p.title} />
            </DetailSection>
          </div>

          <EnquirySidebar
            listing={listingRef}
            isSample={p.isSample}
            heading="Enquire about this residence"
            caption="Take a closer look at this residence."
            intro="Ask about current availability and the viewing options for this home. Share your preferred dates and the details you would like to confirm, such as furnishing, handover or the proposed transfer process."
            summary={
              <div>
                <p className="text-xs font-medium tracking-wide text-muted uppercase">Selling price</p>
                <p className="mt-1 font-display text-3xl font-semibold text-navy-900">{priceDisplay}</p>
                <p className="mt-1 text-base text-muted">
                  {p.bhk ? `${bhkLabel(p.bhk)} · ` : ""}
                  {formatArea(p.builtUpArea)} · {FURNISHING[p.furnishing] ?? p.furnishing}
                </p>
              </div>
            }
          />
        </div>
      </div>

      <Faq items={faqs} className="pt-4" />
      <Similar title="Similar Resale Properties" items={similar(all, p, (x) => x.price).map(resaleCard)} />
      <MobileEnquiryBar listing={listingRef} />
    </>
  );
}
