import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Building, CalendarDays, Car, Compass, Layers, Ruler, ShieldCheck, Sofa } from "lucide-react";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import JsonLd from "@/components/JsonLd";
import MapEmbed from "@/components/MapEmbed";
import { MobileEnquiryBar } from "@/components/ContactActions";
import { Badge, DetailHeader, DetailSection, EnquirySidebar, Facts, SectionNav, Similar } from "@/components/DetailParts";
import { getResale, resaleCard, resaleProperties, similar } from "@/lib/data";
import { FURNISHING, PROPERTY_TYPES } from "@/lib/constants";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { bhkLabel, formatArea, formatDate, formatINR, img, titleCase } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return resaleProperties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getResale((await params).slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title} – ${formatINR(p.price)} | ${p.locality}, ${p.city}`,
    description: `${p.bhk ? `${bhkLabel(p.bhk)} ` : ""}${PROPERTY_TYPES[p.propertyType]} for sale in ${p.locality}, ${p.city}. ${formatArea(p.builtUpArea)} built-up, ${FURNISHING[p.furnishing].toLowerCase()}, ${p.parking.toLowerCase()} parking. Price ${formatINR(p.price)}.`,
    path: `/resale-properties/${p.slug}/`,
    image: p.images[0],
  });
}

export default async function ResaleDetailPage({ params }: Props) {
  const p = getResale((await params).slug);
  if (!p) notFound();

  const path = `/resale-properties/${p.slug}/`;
  const location = `${p.locality}, ${p.city}`;
  const pricePerSqft = Math.round(p.price / p.builtUpArea);
  const listingRef = { title: p.title, location, price: formatINR(p.price), url: absoluteUrl(path) };
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Resale Properties", path: "/resale-properties/" },
    { name: p.title, path },
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
          offers: { "@type": "Offer", price: p.price, priceCurrency: "INR", businessFunction: "http://purl.org/goodrelations/v1#Sell" },
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
          title={p.title}
          location={p.address}
          price={formatINR(p.price)}
          priceNote={`₹${pricePerSqft.toLocaleString("en-IN")} per sq.ft (built-up)`}
          badges={
            <>
              <Badge>{PROPERTY_TYPES[p.propertyType]}</Badge>
              {p.readyToMove && <Badge tone="green">Ready to Move</Badge>}
              {p.featured && <Badge tone="gold">Featured</Badge>}
            </>
          }
        />
        <Gallery images={p.images} title={p.title} />

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <SectionNav
              items={[
                { id: "overview", label: "Overview" },
                { id: "furnishing", label: "Furnishing" },
                { id: "amenities", label: "Amenities" },
                { id: "location", label: "Location" },
              ]}
            />

            <DetailSection id="overview" title="Property Overview">
              <Facts
                items={[
                  { label: "Configuration", value: p.bhk ? bhkLabel(p.bhk) : PROPERTY_TYPES[p.propertyType], icon: <BedDouble className="h-3.5 w-3.5" /> },
                  { label: "Bathrooms", value: p.bathrooms, icon: <Bath className="h-3.5 w-3.5" /> },
                  { label: "Carpet area", value: formatArea(p.carpetArea), icon: <Ruler className="h-3.5 w-3.5" /> },
                  { label: "Built-up area", value: formatArea(p.builtUpArea), icon: <Ruler className="h-3.5 w-3.5" /> },
                  { label: "Floor", value: `${p.floor} of ${p.totalFloors}`, icon: <Layers className="h-3.5 w-3.5" /> },
                  { label: "Parking", value: p.parking, icon: <Car className="h-3.5 w-3.5" /> },
                  { label: "Furnishing", value: FURNISHING[p.furnishing], icon: <Sofa className="h-3.5 w-3.5" /> },
                  { label: "Facing", value: p.facing, icon: <Compass className="h-3.5 w-3.5" /> },
                  { label: "Property age", value: p.ageYears <= 1 ? "Less than 1 year" : `${p.ageYears} years`, icon: <CalendarDays className="h-3.5 w-3.5" /> },
                  { label: "Balconies", value: p.balconies || undefined, icon: <Building className="h-3.5 w-3.5" /> },
                  { label: "Ownership", value: titleCase(p.ownership), icon: <ShieldCheck className="h-3.5 w-3.5" /> },
                  { label: "Listed on", value: formatDate(p.postedOn), icon: <CalendarDays className="h-3.5 w-3.5" /> },
                ]}
              />
              <h3 className="mt-8 font-sans text-base font-bold">About this property</h3>
              <p className="mt-3 leading-relaxed text-navy-800">{p.description}</p>
              <p className="mt-4 text-xs text-muted">Ownership and title documents are shared for verification during the site visit and due-diligence stage.</p>
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
              <div>
                <p className="text-xs font-medium tracking-wide text-muted uppercase">Selling price</p>
                <p className="mt-1 font-display text-3xl font-semibold text-navy-900">{formatINR(p.price)}</p>
                <p className="mt-1 text-sm text-muted">
                  {p.bhk ? `${bhkLabel(p.bhk)} · ` : ""}
                  {formatArea(p.builtUpArea)} · {FURNISHING[p.furnishing]}
                </p>
              </div>
            }
          />
        </div>
      </div>

      <Similar title="Similar Resale Properties" items={similar(resaleProperties, p, (x) => x.price).map(resaleCard)} />
      <MobileEnquiryBar listing={listingRef} />
    </>
  );
}
