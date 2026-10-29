"use client";

import { useEffect, useState } from "react";
import { Bath, BedDouble, Building, CalendarDays, Car, Compass, Layers, Ruler, ShieldCheck, Sofa } from "lucide-react";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import ListingVideo from "@/components/ListingVideo";
import MapEmbed from "@/components/MapEmbed";
import { MobileEnquiryBar } from "@/components/ContactActions";
import { Badge, DetailHeader, DetailSection, EnquirySidebar, Facts, SectionNav, Similar } from "@/components/DetailParts";
import { getResale, resaleCard, resaleProperties, similar } from "@/lib/data";
import { getResaleBySlug, listPublishedResale } from "@/lib/firebase-data";
import { isFirebaseConfigured } from "@/lib/firebase";
import { FURNISHING, PROPERTY_TYPES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";
import { bhkLabel, formatArea, formatDate, formatINR, titleCase } from "@/lib/utils";
import type { ResaleProperty } from "@/lib/types";
import { useResolvedSlug } from "@/hooks/useResolvedSlug";

export default function ResaleDetailClient() {
  const slug = useResolvedSlug("resale-properties");
  const [p, setP] = useState<ResaleProperty | null | undefined>(undefined);
  const [similarItems, setSimilarItems] = useState(() =>
    similar(resaleProperties, resaleProperties[0] ?? ({} as ResaleProperty), (x) => x.price).map(resaleCard),
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!slug) {
        setP(null);
        return;
      }
      const seed = getResale(slug) ?? null;
      if (!isFirebaseConfigured()) {
        if (!cancelled) setP(seed);
        return;
      }
      try {
        const live = await getResaleBySlug(slug);
        const item = live ?? seed;
        if (!cancelled) setP(item);
        if (item) {
          const all = await listPublishedResale();
          const pool = all.length ? all : resaleProperties;
          if (!cancelled) setSimilarItems(similar(pool, item, (x) => x.price).map(resaleCard));
        }
      } catch {
        if (!cancelled) setP(seed);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (p?.title) document.title = `${p.title} | Alven Homz`;
  }, [p]);

  if (p === undefined) return <div className="container-x py-20 text-sm text-muted">Loading…</div>;
  if (!p) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-semibold">Property not found</h1>
      </div>
    );
  }

  const path = `/resale-properties/${p.slug}/`;
  const location = `${p.locality}, ${p.city}`;
  const pricePerSqft = p.builtUpArea ? Math.round(p.price / p.builtUpArea) : 0;
  const listingRef = { title: p.title, location, price: formatINR(p.price), url: absoluteUrl(path) };
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Resale Properties", path: "/resale-properties/" },
    { name: p.title, path },
  ];

  return (
    <>
      <div className="container-x">
        <DetailHeader
          crumbs={crumbs}
          title={p.title}
          location={p.address}
          price={formatINR(p.price)}
          priceNote={pricePerSqft ? `₹${pricePerSqft.toLocaleString("en-IN")} per sq.ft (built-up)` : undefined}
          badges={
            <>
              <Badge>{PROPERTY_TYPES[p.propertyType] ?? p.propertyType}</Badge>
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
                ...(p.videoUrl ? [{ id: "video", label: "Video" }] : []),
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
            </DetailSection>

            <DetailSection id="furnishing" title={`Furnishing – ${FURNISHING[p.furnishing]}`}>
              <ul className="flex flex-wrap gap-2">
                {(p.furnishingDetails ?? []).map((f) => (
                  <li key={f} className="rounded-full border border-line bg-white px-4 py-2 text-sm text-navy-800">{f}</li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection id="amenities" title="Amenities">
              <Amenities items={p.amenities} />
            </DetailSection>

            {p.videoUrl && (
              <DetailSection id="video" title="Property Video">
                <ListingVideo url={p.videoUrl} title={p.title} />
              </DetailSection>
            )}

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

      <Similar title="Similar Resale Properties" items={similarItems} />
      <MobileEnquiryBar listing={listingRef} />
    </>
  );
}
