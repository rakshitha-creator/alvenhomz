"use client";

import { useEffect, useState } from "react";
import { Building2, CalendarClock, FileText, Landmark, LayoutGrid, Ruler, ShieldCheck } from "lucide-react";
import Amenities from "@/components/Amenities";
import FloorPlans from "@/components/FloorPlans";
import Gallery from "@/components/Gallery";
import ListingVideo from "@/components/ListingVideo";
import MapEmbed from "@/components/MapEmbed";
import { MobileEnquiryBar } from "@/components/ContactActions";
import { WhatsAppIcon } from "@/components/icons";
import { Badge, DetailHeader, DetailSection, EnquirySidebar, Facts, SectionNav, Similar } from "@/components/DetailParts";
import { getProject, projectCard, projects, similar } from "@/lib/data";
import { getProjectBySlug, listPublishedProjects } from "@/lib/firebase-data";
import { isFirebaseConfigured } from "@/lib/firebase";
import { PROJECT_STATUS, PROPERTY_TYPES } from "@/lib/constants";
import { whatsappHref } from "@/lib/contact";
import { absoluteUrl } from "@/lib/seo";
import { formatINR, formatPriceRange } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { useResolvedSlug } from "@/hooks/useResolvedSlug";

const STATUS_TONE = { ready: "green", "under-construction": "amber", upcoming: "sky" } as const;

export default function ProjectDetailClient() {
  const slug = useResolvedSlug("new-projects");
  const [p, setP] = useState<Project | null | undefined>(undefined);
  const [similarItems, setSimilarItems] = useState(() =>
    similar(projects, projects[0] ?? ({} as Project), (x) => x.priceFrom).map(projectCard),
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!slug) {
        setP(null);
        return;
      }
      const seed = getProject(slug) ?? null;
      if (!isFirebaseConfigured()) {
        if (!cancelled) setP(seed);
        return;
      }
      try {
        const live = await getProjectBySlug(slug);
        const item = live ?? seed;
        if (!cancelled) setP(item);
        if (item) {
          const all = await listPublishedProjects();
          const pool = all.length ? all : projects;
          if (!cancelled) setSimilarItems(similar(pool, item, (x) => x.priceFrom).map(projectCard));
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
    if (p?.name) document.title = `${p.name} | Alven Homz`;
  }, [p]);

  if (p === undefined) {
    return <div className="container-x py-20 text-sm text-muted" aria-busy="true">Loading project…</div>;
  }
  if (!p) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <p className="mt-2 text-sm text-muted">This listing may be unpublished or the link is incorrect.</p>
      </div>
    );
  }

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
    { id: "overview", label: "About" },
    { id: "pricing", label: "Plans" },
    { id: "amenities", label: "Amenities" },
    ...(p.floorPlans?.length ? [{ id: "floor-plans", label: "Floor Plans" }] : []),
    { id: "gallery", label: "Gallery" },
    ...(p.videoUrl ? [{ id: "walkthrough", label: "Walkthrough" }] : []),
    { id: "location", label: "Location" },
    { id: "developer", label: "Developer" },
    ...((p.faqs?.length ?? 0) > 0 ? [{ id: "faqs", label: "FAQs" }] : []),
    { id: "contact", label: "Contact" },
    ...((p.testimonials?.length ?? 0) > 0 ? [{ id: "testimonials", label: "Testimonials" }] : []),
  ];

  return (
    <>
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
        <div id="gallery">
          <Gallery images={p.images} title={p.name} />
          {p.representativeImages && <p className="mt-2 text-xs text-muted">Representative images — not actual photographs of this project.</p>}
        </div>

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
              <h3 className="mt-8 font-sans text-base font-bold">Project highlights</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {(p.highlights ?? []).map((h) => (
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
                          <a href={whatsappHref(`Hi Alven Homz, please share the latest price for ${c.label} at ${p.name}, ${location}.`)} target="_blank" rel="noopener" className="text-xs font-semibold text-gold-600 hover:text-navy-900">
                            Get price sheet
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={whatsappHref(brochureMsg)} target="_blank" rel="noopener" className="btn-whatsapp">
                  <WhatsAppIcon className="h-4 w-4" /> Get brochure on WhatsApp
                </a>
                <a href="#enquire" className="btn-outline"><FileText className="h-4 w-4" /> Enquire Now</a>
              </div>
            </DetailSection>

            <DetailSection id="amenities" title="Amenities">
              <Amenities items={p.amenities} />
            </DetailSection>

            {(p.floorPlans?.length ?? 0) > 0 && (
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

            {p.videoUrl && (
              <DetailSection id="walkthrough" title="Walkthrough">
                <ListingVideo url={p.videoUrl} title={p.name} />
              </DetailSection>
            )}

            <DetailSection id="location" title="Location & Nearby">
              <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
                <MapEmbed lat={p.lat} lng={p.lng} title={p.name} />
                <ul className="divide-y divide-line rounded-2xl border border-line">
                  {(p.nearby ?? []).map((n) => (
                    <li key={n.name} className="flex items-center justify-between gap-3 px-4 py-3.5 text-sm">
                      <span className="text-navy-800">{n.name}</span>
                      <span className="shrink-0 rounded-full bg-ivory px-2.5 py-1 text-xs font-semibold text-navy-900">{n.distance}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </DetailSection>

            <DetailSection id="developer" title={`About ${p.developer}`}>
              <div className="flex gap-5 rounded-2xl bg-ivory p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy-900 font-display text-2xl text-gold-300">{p.developer[0]}</span>
                <p className="text-sm leading-relaxed text-navy-800">{p.developerAbout}</p>
              </div>
            </DetailSection>

            {(p.faqs?.length ?? 0) > 0 && (
              <DetailSection id="faqs" title="FAQs">
                <ul className="space-y-3">
                  {p.faqs!.map((f) => (
                    <li key={f.question} className="rounded-2xl border border-line bg-white px-5 py-4">
                      <p className="font-semibold text-navy-900">{f.question}</p>
                      <p className="mt-2 text-sm leading-relaxed text-navy-800">{f.answer}</p>
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}

            <DetailSection id="contact" title="Contact">
              <div className="rounded-2xl bg-ivory p-5 text-sm text-navy-800">
                {p.contact?.note && <p className="mb-3">{p.contact.note}</p>}
                <ul className="space-y-2">
                  {p.contact?.phone && (
                    <li>
                      Phone:{" "}
                      <a href={`tel:${p.contact.phone}`} className="font-semibold text-navy-900">
                        {p.contact.phone}
                      </a>
                    </li>
                  )}
                  {p.contact?.whatsapp && (
                    <li>
                      WhatsApp:{" "}
                      <a href={whatsappHref(`Hi, I'm interested in ${p.name}.`, p.contact.whatsapp)} target="_blank" rel="noopener" className="font-semibold text-navy-900">
                        Chat now
                      </a>
                    </li>
                  )}
                  {p.contact?.email && (
                    <li>
                      Email:{" "}
                      <a href={`mailto:${p.contact.email}`} className="font-semibold text-navy-900">
                        {p.contact.email}
                      </a>
                    </li>
                  )}
                  {!p.contact?.phone && !p.contact?.whatsapp && !p.contact?.email && (
                    <li>Use the enquiry form to reach Alven Homz about this project.</li>
                  )}
                </ul>
              </div>
            </DetailSection>

            {(p.testimonials?.length ?? 0) > 0 && (
              <DetailSection id="testimonials" title="Testimonials">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {p.testimonials!.map((t) => (
                    <li key={`${t.name}-${t.quote.slice(0, 24)}`} className="rounded-2xl border border-line bg-white p-5">
                      <p className="text-sm leading-relaxed text-navy-800">&ldquo;{t.quote}&rdquo;</p>
                      <p className="mt-4 text-sm font-semibold text-navy-900">{t.name}</p>
                      {t.context && <p className="text-xs text-muted">{t.context}</p>}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}
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

      <Similar title="Similar Projects" items={similarItems} />
      <MobileEnquiryBar listing={listingRef} />
    </>
  );
}
