import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bath, BedDouble, CalendarCheck, Car, Layers, Ruler, Sofa, Users } from "lucide-react";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import JsonLd from "@/components/JsonLd";
import MapEmbed from "@/components/MapEmbed";
import { MobileEnquiryBar } from "@/components/ContactActions";
import { Badge, DetailHeader, DetailSection, EnquirySidebar, Facts, SectionNav, Similar } from "@/components/DetailParts";
import { getRental, rentalCard, rentalProperties, similar } from "@/lib/data";
import { FURNISHING, PROPERTY_TYPES, TENANT_PREFERENCE } from "@/lib/constants";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { bhkLabel, formatArea, formatDate, formatINR, img } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return rentalProperties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getRental((await params).slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title} for Rent – ${formatINR(p.rent, { short: false })}/month | ${p.locality}, ${p.city}`,
    description: `${p.bhk ? `${bhkLabel(p.bhk)} ` : ""}${PROPERTY_TYPES[p.propertyType]} for rent in ${p.locality}, ${p.city}. Rent ${formatINR(p.rent, { short: false })}/month, deposit ${formatINR(p.deposit)}, ${FURNISHING[p.furnishing].toLowerCase()}, available from ${formatDate(p.availableFrom)}.`,
    path: `/rental-properties/${p.slug}/`,
    image: p.images[0],
  });
}

export default async function RentalDetailPage({ params }: Props) {
  const p = getRental((await params).slug);
  if (!p) notFound();

  const path = `/rental-properties/${p.slug}/`;
  const location = `${p.locality}, ${p.city}`;
  const rent = formatINR(p.rent, { short: false });
  const listingRef = { title: p.title, location, price: `${rent}/month`, url: absoluteUrl(path) };
  const tenants = p.tenantPreference.map((t) => TENANT_PREFERENCE[t] ?? t).join(", ");
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Rental Properties", path: "/rental-properties/" },
    { name: p.title, path },
  ];

  const costs = [
    { label: "Monthly rent", value: rent, note: "Payable every month", highlight: true },
    { label: "Security deposit", value: formatINR(p.deposit, { short: false }), note: `One-time, refundable · ${Math.round(p.deposit / p.rent)}× rent` },
    { label: "Maintenance", value: p.maintenance ? `${formatINR(p.maintenance, { short: false })}/mo` : "Not applicable", note: p.maintenance ? "Paid separately to the society" : "No society maintenance charges" },
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
            businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
            priceSpecification: { "@type": "UnitPriceSpecification", price: p.rent, priceCurrency: "INR", unitText: "MONTH" },
            availabilityStarts: p.availableFrom,
          },
          about: {
            "@type": p.propertyType.startsWith("commercial") ? "Place" : "Accommodation",
            name: p.title,
            numberOfRooms: p.bhk || undefined,
            floorSize: { "@type": "QuantitativeValue", value: p.carpetArea, unitCode: "FTK" },
            address: { "@type": "PostalAddress", streetAddress: p.address, addressLocality: p.city, addressCountry: "IN" },
            geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
          },
        }}
      />

      <div className="container-x">
        <DetailHeader
          crumbs={crumbs}
          title={p.title}
          location={p.address}
          price={rent}
          priceNote="per month"
          badges={
            <>
              <Badge>{PROPERTY_TYPES[p.propertyType]}</Badge>
              <Badge tone="sky">{FURNISHING[p.furnishing]}</Badge>
              <Badge tone="green">Available from {formatDate(p.availableFrom, { day: "numeric", month: "short" })}</Badge>
              {p.featured && <Badge tone="gold">Featured</Badge>}
            </>
          }
        />
        <Gallery images={p.images} title={p.title} />

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <SectionNav
              items={[
                { id: "costs", label: "Rent & Charges" },
                { id: "overview", label: "Overview" },
                { id: "furnishing", label: "Furnishing" },
                { id: "amenities", label: "Amenities" },
                { id: "location", label: "Location" },
              ]}
            />

            <DetailSection id="costs" title="Rent & Charges">
              <ul className="grid gap-4 sm:grid-cols-3">
                {costs.map((c) => (
                  <li key={c.label} className={c.highlight ? "rounded-2xl bg-navy-900 p-5 text-white" : "rounded-2xl border border-line bg-white p-5"}>
                    <p className={c.highlight ? "text-xs font-semibold tracking-wide text-gold-300 uppercase" : "text-xs font-semibold tracking-wide text-muted uppercase"}>{c.label}</p>
                    <p className={c.highlight ? "mt-2 font-display text-2xl font-semibold text-white" : "mt-2 font-display text-2xl font-semibold text-navy-900"}>{c.value}</p>
                    <p className={c.highlight ? "mt-1 text-xs text-white/70" : "mt-1 text-xs text-muted"}>{c.note}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">
                Move-in cost (deposit + first month{p.maintenance ? " + maintenance" : ""}):{" "}
                <span className="font-semibold text-navy-900">{formatINR(p.deposit + p.rent + p.maintenance, { short: false })}</span>
              </p>
            </DetailSection>

            <DetailSection id="overview" title="Property Overview">
              <Facts
                items={[
                  { label: "Configuration", value: p.bhk ? bhkLabel(p.bhk) : PROPERTY_TYPES[p.propertyType], icon: <BedDouble className="h-3.5 w-3.5" /> },
                  { label: "Bathrooms", value: p.bathrooms, icon: <Bath className="h-3.5 w-3.5" /> },
                  { label: "Carpet area", value: formatArea(p.carpetArea), icon: <Ruler className="h-3.5 w-3.5" /> },
                  { label: "Floor", value: `${p.floor} of ${p.totalFloors}`, icon: <Layers className="h-3.5 w-3.5" /> },
                  { label: "Parking", value: p.parking, icon: <Car className="h-3.5 w-3.5" /> },
                  { label: "Furnishing", value: FURNISHING[p.furnishing], icon: <Sofa className="h-3.5 w-3.5" /> },
                  { label: "Available from", value: formatDate(p.availableFrom), icon: <CalendarCheck className="h-3.5 w-3.5" /> },
                  { label: "Preferred tenants", value: tenants, icon: <Users className="h-3.5 w-3.5" /> },
                ]}
              />
              <h3 className="mt-8 font-sans text-base font-bold">About this property</h3>
              <p className="mt-3 leading-relaxed text-navy-800">{p.description}</p>
            </DetailSection>

            <DetailSection id="furnishing" title={`Furnishing – ${FURNISHING[p.furnishing]}`}>
              <ul className="flex flex-wrap gap-2">
                {p.furnishingDetails.map((f) => (
                  <li key={f} className="rounded-full border border-line bg-white px-4 py-2 text-sm text-navy-800">{f}</li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection id="amenities" title="Amenities">
              <Amenities items={p.amenities} />
            </DetailSection>

            <DetailSection id="location" title="Location">
              <p className="mb-4 text-sm text-navy-800">{p.address}</p>
              <MapEmbed lat={p.lat} lng={p.lng} title={p.title} />
            </DetailSection>
          </div>

          <EnquirySidebar
            listing={listingRef}
            isSample={p.isSample}
            summary={
              <dl className="space-y-2.5 text-sm">
                <div className="flex items-baseline justify-between">
                  <dt className="text-muted">Monthly rent</dt>
                  <dd className="font-display text-2xl font-semibold text-navy-900">{rent}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2.5">
                  <dt className="text-muted">Security deposit</dt>
                  <dd className="font-semibold text-navy-900">{formatINR(p.deposit, { short: false })}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2.5">
                  <dt className="text-muted">Maintenance</dt>
                  <dd className="font-semibold text-navy-900">{p.maintenance ? `${formatINR(p.maintenance, { short: false })}/mo` : "N/A"}</dd>
                </div>
              </dl>
            }
          />
        </div>
      </div>

      <Similar title="Similar Rentals" items={similar(rentalProperties, p, (x) => x.rent).map(rentalCard)} />
      <MobileEnquiryBar listing={listingRef} />
    </>
  );
}
