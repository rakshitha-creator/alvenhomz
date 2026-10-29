"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RentalProperty } from "@/lib/types";
import { deleteListingDoc, saveListingDoc } from "@/lib/firebase-data";
import { csvToList, listToCsv, slugify } from "@/lib/slug";
import { AdminPageHeader, Field, FormCard, FormInput, FormSelect, FormTextarea } from "./form";
import { ImageUploadField, VideoUploadField } from "./MediaFields";

const empty: RentalProperty = {
  slug: "",
  title: "",
  propertyType: "apartment",
  rent: 0,
  deposit: 0,
  maintenance: 0,
  bhk: 2,
  bathrooms: 2,
  carpetArea: 0,
  floor: "",
  totalFloors: 0,
  furnishing: "semi-furnished",
  furnishingDetails: [],
  parking: "1 Covered",
  availableFrom: new Date().toISOString().slice(0, 10),
  tenantPreference: ["family"],
  city: "Bengaluru",
  locality: "",
  address: "",
  lat: 12.97,
  lng: 77.59,
  images: [],
  amenities: [],
  description: "",
  postedOn: new Date().toISOString().slice(0, 10),
  published: true,
  featured: false,
};

export default function RentalForm({ initial }: { initial?: RentalProperty }) {
  const router = useRouter();
  const isEdit = !!initial?.slug;
  const [form, setForm] = useState<RentalProperty>(initial ?? empty);
  const [amenitiesText, setAmenitiesText] = useState(listToCsv(initial?.amenities));
  const [furnishText, setFurnishText] = useState(listToCsv(initial?.furnishingDetails));
  const [tenantText, setTenantText] = useState(listToCsv(initial?.tenantPreference ?? ["family"]));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const set = <K extends keyof RentalProperty>(key: K, value: RentalProperty[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const slug = isEdit ? form.slug : slugify(form.slug || form.title);
    if (!slug || slug === "_") {
      setError("Enter a valid slug.");
      return;
    }
    setSaving(true);
    try {
      await saveListingDoc("rentalProperties", slug, {
        ...form,
        slug,
        images: form.images ?? [],
        videoUrl: form.videoUrl || "",
        videoStoragePath: form.videoStoragePath || "",
        amenities: csvToList(amenitiesText),
        furnishingDetails: csvToList(furnishText),
        tenantPreference: csvToList(tenantText),
        published: form.published !== false,
      } as unknown as Record<string, unknown>);
      setMessage("Saved.");
      if (!isEdit) router.replace(`/admin/rentals/edit/?slug=${encodeURIComponent(slug)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!initial?.slug || !confirm("Delete this listing permanently?")) return;
    await deleteListingDoc("rentalProperties", initial.slug);
    router.replace("/admin/rentals/");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <AdminPageHeader
        title={isEdit ? `Edit: ${form.title || form.slug}` : "Add rental property"}
        action={
          <div className="flex gap-2">
            {isEdit && <button type="button" onClick={onDelete} className="btn-outline py-2 text-xs text-red-700">Delete</button>}
            <button type="submit" className="btn-primary py-2 text-xs" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
          </div>
        }
      />
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}

      <FormCard title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <FormInput required value={form.title} onChange={(e) => { set("title", e.target.value); if (!isEdit && !form.slug) set("slug", slugify(e.target.value)); }} />
          </Field>
          <Field label="Slug"><FormInput required value={form.slug} disabled={isEdit} onChange={(e) => set("slug", slugify(e.target.value))} /></Field>
          <Field label="Property type">
            <FormSelect value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="independent-house">Independent House</option>
              <option value="commercial-office">Office</option>
              <option value="commercial-shop">Shop</option>
            </FormSelect>
          </Field>
          <Field label="Monthly rent (INR)"><FormInput type="number" required value={form.rent || ""} onChange={(e) => set("rent", Number(e.target.value) || 0)} /></Field>
          <Field label="Deposit"><FormInput type="number" value={form.deposit || ""} onChange={(e) => set("deposit", Number(e.target.value) || 0)} /></Field>
          <Field label="Maintenance"><FormInput type="number" value={form.maintenance || ""} onChange={(e) => set("maintenance", Number(e.target.value) || 0)} /></Field>
          <Field label="BHK"><FormInput type="number" value={form.bhk || ""} onChange={(e) => set("bhk", Number(e.target.value) || 0)} /></Field>
          <Field label="Bathrooms"><FormInput type="number" value={form.bathrooms || ""} onChange={(e) => set("bathrooms", Number(e.target.value) || 0)} /></Field>
          <Field label="Carpet area"><FormInput type="number" value={form.carpetArea || ""} onChange={(e) => set("carpetArea", Number(e.target.value) || 0)} /></Field>
          <Field label="Furnishing">
            <FormSelect value={form.furnishing} onChange={(e) => set("furnishing", e.target.value as RentalProperty["furnishing"])}>
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </FormSelect>
          </Field>
          <Field label="Parking"><FormInput value={form.parking} onChange={(e) => set("parking", e.target.value)} /></Field>
          <Field label="Floor"><FormInput value={form.floor} onChange={(e) => set("floor", e.target.value)} /></Field>
          <Field label="Total floors"><FormInput type="number" value={form.totalFloors || ""} onChange={(e) => set("totalFloors", Number(e.target.value) || 0)} /></Field>
          <Field label="Available from"><FormInput type="date" value={form.availableFrom?.slice(0, 10) || ""} onChange={(e) => set("availableFrom", e.target.value)} /></Field>
          <Field label="Posted on"><FormInput type="date" value={form.postedOn?.slice(0, 10) || ""} onChange={(e) => set("postedOn", e.target.value)} /></Field>
          <Field label="Tenant preference" hint="family, bachelor, company" className="sm:col-span-2">
            <FormInput value={tenantText} onChange={(e) => setTenantText(e.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.published !== false} onChange={(e) => set("published", e.target.checked)} /> Published</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label>
        </div>
      </FormCard>

      <FormCard title="Location">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City"><FormInput value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
          <Field label="Locality"><FormInput value={form.locality} onChange={(e) => set("locality", e.target.value)} /></Field>
          <Field label="Address" className="sm:col-span-2"><FormInput value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
          <Field label="Latitude"><FormInput type="number" step="any" value={form.lat} onChange={(e) => set("lat", Number(e.target.value))} /></Field>
          <Field label="Longitude"><FormInput type="number" step="any" value={form.lng} onChange={(e) => set("lng", Number(e.target.value))} /></Field>
        </div>
      </FormCard>

      <FormCard title="Details & media">
        <Field label="Description"><FormTextarea required value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
        <Field label="Amenities (comma-separated)"><FormTextarea value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} /></Field>
        <Field label="Furnishing details (comma-separated)"><FormTextarea value={furnishText} onChange={(e) => setFurnishText(e.target.value)} /></Field>
        <ImageUploadField kind="rental" slug={form.slug || slugify(form.title)} images={form.images} onChange={(images) => set("images", images)} />
        <VideoUploadField kind="rental" slug={form.slug || slugify(form.title)} videoUrl={form.videoUrl} videoStoragePath={form.videoStoragePath} onChange={(v) => setForm((f) => ({ ...f, ...v }))} />
      </FormCard>
    </form>
  );
}
