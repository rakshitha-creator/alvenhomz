"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, ProjectFaq, ProjectTestimonial } from "@/lib/types";
import { saveListingDoc, deleteListingDoc } from "@/lib/firebase-data";
import { csvToList, listToCsv, slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { AdminPageHeader, Field, FormCard, FormInput, FormSelect, FormTextarea } from "./form";
import { ImageUploadField, VideoUploadField } from "./MediaFields";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "plans", label: "Plans" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "gallery", label: "Gallery" },
  { id: "walkthrough", label: "Walkthrough" },
  { id: "faqs", label: "FAQs" },
  { id: "contact", label: "Contact" },
  { id: "testimonials", label: "Testimonials" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const empty: Project = {
  slug: "",
  name: "",
  developer: "",
  developerAbout: "",
  propertyType: "apartment",
  status: "upcoming",
  possession: "",
  city: "Bengaluru",
  locality: "",
  address: "",
  lat: 12.97,
  lng: 77.59,
  priceFrom: 0,
  configurations: [{ label: "2 BHK", bhk: 2, area: "" }],
  totalUnits: 0,
  landArea: "",
  highlights: [],
  floorPlans: [],
  nearby: [],
  amenities: [],
  images: [],
  description: "",
  launchedOn: new Date().toISOString().slice(0, 10),
  published: true,
  featured: false,
  faqs: [],
  contact: {},
  testimonials: [],
};

function faqsToText(faqs?: ProjectFaq[]) {
  return (faqs ?? []).map((f) => `${f.question}|${f.answer}`).join("\n");
}

function textToFaqs(text: string): ProjectFaq[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, ...rest] = line.split("|");
      return { question: question.trim(), answer: rest.join("|").trim() };
    })
    .filter((f) => f.question && f.answer);
}

function testimonialsToText(items?: ProjectTestimonial[]) {
  return (items ?? []).map((t) => `${t.name}|${t.context ?? ""}|${t.quote}`).join("\n");
}

function textToTestimonials(text: string): ProjectTestimonial[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, context, ...rest] = line.split("|");
      const item: ProjectTestimonial = {
        name: (name ?? "").trim(),
        quote: rest.join("|").trim(),
      };
      const ctx = (context ?? "").trim();
      if (ctx) item.context = ctx;
      return item;
    })
    .filter((t) => t.name && t.quote);
}

function nearbyToText(nearby?: Project["nearby"]) {
  return (nearby ?? []).map((n) => `${n.name}|${n.distance}|${n.category}`).join("\n");
}

function textToNearby(text: string): Project["nearby"] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, distance, category] = line.split("|").map((s) => s.trim());
      return {
        name: name || "",
        distance: distance || "",
        category: (category as Project["nearby"][number]["category"]) || "leisure",
      };
    })
    .filter((n) => n.name);
}

function plansToText(plans?: Project["floorPlans"]) {
  return (plans ?? []).map((p) => `${p.label}|${p.bhk}|${p.area}|${p.image ?? ""}`).join("\n");
}

function textToPlans(text: string): Project["floorPlans"] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, bhk, area, image] = line.split("|").map((s) => s.trim());
      const plan: Project["floorPlans"][number] = { label: label || "Plan", bhk: Number(bhk) || 0, area: area || "" };
      if (image) plan.image = image;
      return plan;
    });
}

export default function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const isEdit = !!initial?.slug;
  const [section, setSection] = useState<SectionId>("about");
  const [form, setForm] = useState<Project>({ ...empty, ...initial, contact: initial?.contact ?? {}, faqs: initial?.faqs ?? [], testimonials: initial?.testimonials ?? [] });
  const [configText, setConfigText] = useState(
    (initial?.configurations ?? empty.configurations)
      .map((c) => `${c.label}|${c.bhk ?? ""}|${c.area}|${c.price ?? ""}`)
      .join("\n"),
  );
  const [amenitiesText, setAmenitiesText] = useState(listToCsv(initial?.amenities));
  const [highlightsText, setHighlightsText] = useState(listToCsv(initial?.highlights));
  const [plansText, setPlansText] = useState(plansToText(initial?.floorPlans));
  const [nearbyText, setNearbyText] = useState(nearbyToText(initial?.nearby));
  const [faqsText, setFaqsText] = useState(faqsToText(initial?.faqs));
  const [testimonialsText, setTestimonialsText] = useState(testimonialsToText(initial?.testimonials));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const set = <K extends keyof Project>(key: K, value: Project[K]) => setForm((f) => ({ ...f, [key]: value }));

  const parseConfigs = () =>
    configText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, bhk, area, price] = line.split("|").map((s) => s.trim());
        const config: Project["configurations"][number] = {
          label: label || "Config",
          area: area || "",
        };
        if (bhk) config.bhk = Number(bhk);
        if (price) config.price = Number(price);
        return config;
      });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const slug = isEdit ? form.slug : slugify(form.slug || form.name);
    if (!slug || slug === "_") {
      setError("Enter a valid slug (not “_”).");
      return;
    }
    setSaving(true);
    try {
      const contact: NonNullable<Project["contact"]> = {};
      if (form.contact?.phone) contact.phone = form.contact.phone;
      if (form.contact?.whatsapp) contact.whatsapp = form.contact.whatsapp;
      if (form.contact?.email) contact.email = form.contact.email;
      if (form.contact?.note) contact.note = form.contact.note;

      await saveListingDoc("projects", slug, {
        ...form,
        slug,
        images: form.images ?? [],
        videoUrl: form.videoUrl || "",
        videoStoragePath: form.videoStoragePath || "",
        configurations: parseConfigs(),
        amenities: csvToList(amenitiesText),
        highlights: csvToList(highlightsText),
        floorPlans: textToPlans(plansText),
        nearby: textToNearby(nearbyText),
        faqs: textToFaqs(faqsText),
        testimonials: textToTestimonials(testimonialsText),
        contact,
        published: form.published !== false,
      } as unknown as Record<string, unknown>);
      setMessage("Saved successfully.");
      if (!isEdit) router.replace(`/admin/projects/edit/?slug=${encodeURIComponent(slug)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!initial?.slug || !confirm("Delete this project permanently?")) return;
    await deleteListingDoc("projects", initial.slug);
    router.replace("/admin/projects/");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <AdminPageHeader
        title={isEdit ? `Edit project` : "Add new project"}
        description={isEdit ? form.name || form.slug : "Fill each section below, then save."}
        action={
          <div className="flex flex-wrap gap-2">
            {isEdit && (
              <button type="button" onClick={onDelete} className="btn-outline py-2 text-xs text-red-700">
                Delete
              </button>
            )}
            <button type="submit" className="btn-primary py-2 text-xs" disabled={saving}>
              {saving ? "Saving…" : "Save project"}
            </button>
          </div>
        }
      />

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={form.published !== false} onChange={(e) => set("published", e.target.checked)} />
          Published
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured on home
        </label>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-line">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold transition",
                section === s.id ? "bg-navy-900 text-white" : "text-navy-800 hover:bg-ivory",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {section === "about" && (
        <FormCard title="About">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project name">
              <FormInput
                required
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!isEdit && !form.slug) set("slug", slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Slug" hint="URL segment. Locked after create.">
              <FormInput required value={form.slug} disabled={isEdit} onChange={(e) => set("slug", slugify(e.target.value))} />
            </Field>
            <Field label="Developer">
              <FormInput required value={form.developer} onChange={(e) => set("developer", e.target.value)} />
            </Field>
            <Field label="Property type">
              <FormSelect value={form.propertyType} onChange={(e) => set("propertyType", e.target.value as Project["propertyType"])}>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
              </FormSelect>
            </Field>
            <Field label="Status">
              <FormSelect value={form.status} onChange={(e) => set("status", e.target.value as Project["status"])}>
                <option value="ready">Ready to Move</option>
                <option value="under-construction">Under Construction</option>
                <option value="upcoming">Upcoming</option>
              </FormSelect>
            </Field>
            <Field label="Possession">
              <FormInput value={form.possession} onChange={(e) => set("possession", e.target.value)} />
            </Field>
            <Field label="Price from (INR)">
              <FormInput type="number" required value={form.priceFrom || ""} onChange={(e) => set("priceFrom", Number(e.target.value) || 0)} />
            </Field>
            <Field label="Price to (optional)">
              <FormInput type="number" value={form.priceTo || ""} onChange={(e) => set("priceTo", e.target.value ? Number(e.target.value) : undefined)} />
            </Field>
            <Field label="RERA number">
              <FormInput value={form.reraNumber || ""} onChange={(e) => set("reraNumber", e.target.value || undefined)} />
            </Field>
            <Field label="Launched on">
              <FormInput type="date" value={form.launchedOn?.slice(0, 10) || ""} onChange={(e) => set("launchedOn", e.target.value)} />
            </Field>
            <Field label="Total units">
              <FormInput type="number" value={form.totalUnits || ""} onChange={(e) => set("totalUnits", Number(e.target.value) || 0)} />
            </Field>
            <Field label="Land area">
              <FormInput value={form.landArea} onChange={(e) => set("landArea", e.target.value)} />
            </Field>
            <Field label="Towers">
              <FormInput value={form.towers || ""} onChange={(e) => set("towers", e.target.value || undefined)} />
            </Field>
          </div>
          <Field label="Project description">
            <FormTextarea required value={form.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <Field label="About developer">
            <FormTextarea value={form.developerAbout} onChange={(e) => set("developerAbout", e.target.value)} />
          </Field>
          <Field label="Highlights (comma-separated)">
            <FormTextarea value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} />
          </Field>
        </FormCard>
      )}

      {section === "plans" && (
        <FormCard title="Plans & configurations">
          <Field label="Configurations" hint="One per line: Label|BHK|Area|Price — e.g. 3 BHK|3|1,450 sq.ft|15000000">
            <FormTextarea value={configText} onChange={(e) => setConfigText(e.target.value)} className="min-h-[120px] font-mono text-xs" />
          </Field>
          <Field label="Floor plans" hint="One per line: Label|BHK|Area|image-key">
            <FormTextarea value={plansText} onChange={(e) => setPlansText(e.target.value)} className="min-h-[120px] font-mono text-xs" />
          </Field>
        </FormCard>
      )}

      {section === "amenities" && (
        <FormCard title="Amenities">
          <Field label="Amenities (comma-separated)">
            <FormTextarea value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} className="min-h-[160px]" />
          </Field>
        </FormCard>
      )}

      {section === "location" && (
        <FormCard title="Location">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City">
              <FormInput value={form.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="Locality">
              <FormInput value={form.locality} onChange={(e) => set("locality", e.target.value)} />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <FormInput value={form.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field label="Latitude">
              <FormInput type="number" step="any" value={form.lat} onChange={(e) => set("lat", Number(e.target.value))} />
            </Field>
            <Field label="Longitude">
              <FormInput type="number" step="any" value={form.lng} onChange={(e) => set("lng", Number(e.target.value))} />
            </Field>
          </div>
          <Field label="Nearby places" hint="One per line: Name|Distance|category (transit/school/hospital/shopping/office/airport/leisure)">
            <FormTextarea value={nearbyText} onChange={(e) => setNearbyText(e.target.value)} className="min-h-[120px] font-mono text-xs" />
          </Field>
        </FormCard>
      )}

      {section === "gallery" && (
        <FormCard title="Gallery">
          <ImageUploadField kind="projects" slug={form.slug || slugify(form.name)} images={form.images} onChange={(images) => set("images", images)} />
        </FormCard>
      )}

      {section === "walkthrough" && (
        <FormCard title="Walkthrough video">
          <VideoUploadField
            kind="projects"
            slug={form.slug || slugify(form.name)}
            videoUrl={form.videoUrl}
            videoStoragePath={form.videoStoragePath}
            onChange={(v) => setForm((f) => ({ ...f, ...v }))}
          />
        </FormCard>
      )}

      {section === "faqs" && (
        <FormCard title="FAQs">
          <Field label="FAQs" hint="One per line: Question|Answer">
            <FormTextarea value={faqsText} onChange={(e) => setFaqsText(e.target.value)} className="min-h-[200px] font-mono text-xs" />
          </Field>
        </FormCard>
      )}

      {section === "contact" && (
        <FormCard title="Project contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone">
              <FormInput
                value={form.contact?.phone || ""}
                onChange={(e) => setForm((f) => ({ ...f, contact: { ...f.contact, phone: e.target.value } }))}
              />
            </Field>
            <Field label="WhatsApp">
              <FormInput
                value={form.contact?.whatsapp || ""}
                onChange={(e) => setForm((f) => ({ ...f, contact: { ...f.contact, whatsapp: e.target.value } }))}
                placeholder="9198XXXXXXXX"
              />
            </Field>
            <Field label="Email" className="sm:col-span-2">
              <FormInput
                type="email"
                value={form.contact?.email || ""}
                onChange={(e) => setForm((f) => ({ ...f, contact: { ...f.contact, email: e.target.value } }))}
              />
            </Field>
            <Field label="Contact note" className="sm:col-span-2">
              <FormTextarea
                value={form.contact?.note || ""}
                onChange={(e) => setForm((f) => ({ ...f, contact: { ...f.contact, note: e.target.value } }))}
              />
            </Field>
          </div>
        </FormCard>
      )}

      {section === "testimonials" && (
        <FormCard title="Testimonials">
          <Field label="Testimonials" hint="One per line: Name|Context|Quote">
            <FormTextarea value={testimonialsText} onChange={(e) => setTestimonialsText(e.target.value)} className="min-h-[200px] font-mono text-xs" />
          </Field>
        </FormCard>
      )}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save project"}
        </button>
      </div>
    </form>
  );
}
