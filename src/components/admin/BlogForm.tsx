"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/types";
import { deleteListingDoc, saveListingDoc } from "@/lib/firebase-data";
import { slugify } from "@/lib/slug";
import { AdminPageHeader, Field, FormCard, FormInput, FormTextarea } from "./form";
import { BlogCoverField } from "./MediaFields";

const empty: BlogPost = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  coverImage: "",
  author: "Alven Homz",
  published: true,
  publishedAt: new Date().toISOString().slice(0, 10),
};

export default function BlogForm({ initial }: { initial?: BlogPost }) {
  const router = useRouter();
  const isEdit = !!initial?.slug;
  const [form, setForm] = useState<BlogPost>(initial ?? empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const set = <K extends keyof BlogPost>(key: K, value: BlogPost[K]) => setForm((f) => ({ ...f, [key]: value }));

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
      await saveListingDoc("blogs", slug, {
        ...form,
        slug,
        coverImage: form.coverImage || "",
        published: form.published !== false,
      } as unknown as Record<string, unknown>);
      setMessage("Saved.");
      if (!isEdit) router.replace(`/admin/blogs/edit/?slug=${encodeURIComponent(slug)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!initial?.slug || !confirm("Delete this blog post permanently?")) return;
    await deleteListingDoc("blogs", initial.slug);
    router.replace("/admin/blogs/");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <AdminPageHeader
        title={isEdit ? `Edit: ${form.title || form.slug}` : "Add blog post"}
        action={
          <div className="flex gap-2">
            {isEdit && <button type="button" onClick={onDelete} className="btn-outline py-2 text-xs text-red-700">Delete</button>}
            <button type="submit" className="btn-primary py-2 text-xs" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
          </div>
        }
      />
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}

      <FormCard title="Post">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <FormInput required value={form.title} onChange={(e) => { set("title", e.target.value); if (!isEdit && !form.slug) set("slug", slugify(e.target.value)); }} />
          </Field>
          <Field label="Slug"><FormInput required value={form.slug} disabled={isEdit} onChange={(e) => set("slug", slugify(e.target.value))} /></Field>
          <Field label="Author"><FormInput value={form.author} onChange={(e) => set("author", e.target.value)} /></Field>
          <Field label="Published at"><FormInput type="date" value={form.publishedAt?.slice(0, 10) || ""} onChange={(e) => set("publishedAt", e.target.value)} /></Field>
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published !== false} onChange={(e) => set("published", e.target.checked)} /> Published
        </label>
        <Field label="Excerpt"><FormTextarea required value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></Field>
        <Field label="Body (Markdown)"><FormTextarea required value={form.body} onChange={(e) => set("body", e.target.value)} className="min-h-[240px] font-mono text-sm" /></Field>
        <BlogCoverField slug={form.slug || slugify(form.title)} coverImage={form.coverImage} onChange={(coverImage) => set("coverImage", coverImage)} />
      </FormCard>
    </form>
  );
}
