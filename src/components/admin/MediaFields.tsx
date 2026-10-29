"use client";

import { useState } from "react";
import { Field, FormInput } from "./form";
import { deleteStoragePath, uploadBlogImage, uploadListingImage, uploadListingVideo } from "@/lib/uploads";
import { confirmMediaChange } from "@/lib/media-confirm";
import { img } from "@/lib/utils";

type Kind = "projects" | "resale" | "rental";

export function ImageUploadField({
  kind,
  slug,
  images,
  onChange,
}: {
  kind: Kind;
  slug: string;
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  const onFiles = async (files: FileList | null, input: HTMLInputElement) => {
    if (!files?.length) return;
    if (!slug) {
      setError("Set a slug before uploading images.");
      input.value = "";
      return;
    }
    if (!confirmMediaChange("add", "images")) {
      input.value = "";
      return;
    }
    setError("");
    try {
      const next = [...images];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const { url } = await uploadListingImage(kind, slug, file, setProgress);
        next.push(url);
      }
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setProgress(null);
      input.value = "";
    }
  };

  const removeImage = (src: string) => {
    if (!confirmMediaChange("remove", "image")) return;
    onChange(images.filter((i) => i !== src));
  };

  return (
    <div className="space-y-3">
      <Field label="Images" hint="Upload images or paste existing image keys / URLs (comma-separated). Stored in Firebase Storage.">
        <FormInput
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onFiles(e.target.files, e.target)}
          disabled={!slug}
        />
      </Field>
      {progress !== null && <p className="text-xs text-muted">Uploading… {progress}%</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <FormInput
        value={images.join(", ")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        placeholder="image-key or https://…"
      />
      {images.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src) => (
            <li key={src} className="relative overflow-hidden rounded-lg border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(src, "sm")} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                className="absolute top-1 right-1 rounded bg-navy-950/80 px-1.5 text-[10px] text-white"
                onClick={() => removeImage(src)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function VideoUploadField({
  kind,
  slug,
  videoUrl,
  videoStoragePath,
  onChange,
}: {
  kind: Kind;
  slug: string;
  videoUrl?: string;
  videoStoragePath?: string;
  onChange: (next: { videoUrl?: string; videoStoragePath?: string }) => void;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  const onFile = async (file: File | undefined | null, input: HTMLInputElement) => {
    if (!file) return;
    if (!slug) {
      setError("Set a slug before uploading a video.");
      input.value = "";
      return;
    }
    if (!["video/mp4", "video/webm"].includes(file.type)) {
      setError("Only MP4 or WebM videos are allowed.");
      input.value = "";
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("Video must be under 100MB.");
      input.value = "";
      return;
    }
    const action = videoUrl ? "replace" : "add";
    if (!confirmMediaChange(action, "video")) {
      input.value = "";
      return;
    }
    setError("");
    try {
      if (videoStoragePath) await deleteStoragePath(videoStoragePath);
      const { url, path } = await uploadListingVideo(kind, slug, file, setProgress);
      onChange({ videoUrl: url, videoStoragePath: path });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setProgress(null);
      input.value = "";
    }
  };

  const remove = async () => {
    if (!confirmMediaChange("remove", "video")) return;
    await deleteStoragePath(videoStoragePath);
    onChange({ videoUrl: undefined, videoStoragePath: undefined });
  };

  return (
    <div className="space-y-3">
      <Field label="Video (optional)" hint="MP4 or WebM, max 100MB. Stored in Firebase Storage.">
        <FormInput
          type="file"
          accept="video/mp4,video/webm"
          onChange={(e) => onFile(e.target.files?.[0], e.target)}
          disabled={!slug}
        />
      </Field>
      {progress !== null && <p className="text-xs text-muted">Uploading… {progress}%</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {videoUrl && (
        <div className="space-y-2">
          <video src={videoUrl} controls className="max-h-56 w-full rounded-xl bg-navy-950" />
          <button type="button" className="text-xs font-semibold text-red-600" onClick={remove}>
            Remove video
          </button>
        </div>
      )}
    </div>
  );
}

export function BlogCoverField({
  slug,
  coverImage,
  onChange,
}: {
  slug: string;
  coverImage: string;
  onChange: (url: string) => void;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  const onFile = async (file: File | undefined | null, input: HTMLInputElement) => {
    if (!file) return;
    if (!slug) {
      setError("Set a slug before uploading.");
      input.value = "";
      return;
    }
    const action = coverImage ? "replace" : "add";
    if (!confirmMediaChange(action, "image")) {
      input.value = "";
      return;
    }
    setError("");
    try {
      const { url } = await uploadBlogImage(slug, file, setProgress);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setProgress(null);
      input.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Field label="Cover image">
        <FormInput type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0], e.target)} disabled={!slug} />
      </Field>
      {progress !== null && <p className="text-xs text-muted">Uploading… {progress}%</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <FormInput value={coverImage} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or key" />
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img(coverImage, "sm")} alt="" className="h-40 w-full rounded-xl object-cover" />
      )}
    </div>
  );
}
