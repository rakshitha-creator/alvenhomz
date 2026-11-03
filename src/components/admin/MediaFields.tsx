"use client";

import { useState } from "react";
import { Field, FormInput } from "./form";
import { deleteStoragePath, uploadBlogImage, uploadListingImage, uploadListingVideo } from "@/lib/uploads";
import { confirmMediaChange } from "@/lib/media-confirm";
import { cn, img } from "@/lib/utils";

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

  // Reordering: the first image is the cover on cards and the main gallery photo.
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <Field label="Images" hint="Upload images or paste existing image keys / URLs (comma-separated). Stored in Firebase Storage. Remember to Save after changes.">
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
        <>
          <p className="text-xs text-muted">
            Drag photos to change their order, or use the arrows. The first photo is the cover. Remember to Save after changes.
          </p>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((src, i) => (
              <li
                key={src}
                draggable
                onDragStart={(e) => {
                  setDragFrom(i);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(i);
                }}
                onDragLeave={() => setDragOver((o) => (o === i ? null : o))}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragFrom !== null) move(dragFrom, i);
                  setDragFrom(null);
                  setDragOver(null);
                }}
                onDragEnd={() => {
                  setDragFrom(null);
                  setDragOver(null);
                }}
                className={cn(
                  "relative cursor-grab overflow-hidden rounded-lg border bg-white active:cursor-grabbing",
                  dragOver === i && dragFrom !== i ? "border-gold-500 ring-2 ring-gold-500" : "border-line",
                  dragFrom === i && "opacity-40",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(src, "sm")} alt="" draggable={false} className="aspect-square w-full object-cover" />
                <span className="absolute top-1 left-1 rounded bg-espresso-950/80 px-1.5 text-[10px] font-semibold text-white">
                  {i === 0 ? "Cover" : i + 1}
                </span>
                <button
                  type="button"
                  className="absolute top-1 right-1 rounded bg-espresso-950/80 px-1.5 text-[10px] text-white"
                  onClick={() => removeImage(src)}
                >
                  Remove
                </button>
                <div className="absolute inset-x-1 bottom-1 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    aria-label="Move earlier"
                    disabled={i === 0}
                    onClick={() => move(i, i - 1)}
                    className="rounded bg-white/90 px-2 text-xs font-bold text-espresso-900 shadow disabled:opacity-30"
                  >
                    ←
                  </button>
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => move(i, 0)}
                      className="rounded bg-white/90 px-1.5 text-[10px] font-semibold text-espresso-900 shadow"
                    >
                      Make cover
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label="Move later"
                    disabled={i === images.length - 1}
                    onClick={() => move(i, i + 1)}
                    className="rounded bg-white/90 px-2 text-xs font-bold text-espresso-900 shadow disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
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
    onChange({ videoUrl: "", videoStoragePath: "" });
  };

  return (
    <div className="space-y-3">
      <Field label="Video (optional)" hint="MP4 or WebM, max 100MB. Stored in Firebase Storage. Remember to Save after changes.">
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

  const remove = () => {
    if (!coverImage) return;
    if (!confirmMediaChange("remove", "image")) return;
    onChange("");
  };

  return (
    <div className="space-y-3">
      <Field label="Cover image" hint="Stored in Firebase Storage. Remember to Save after changes.">
        <FormInput type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0], e.target)} disabled={!slug} />
      </Field>
      {progress !== null && <p className="text-xs text-muted">Uploading… {progress}%</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <FormInput value={coverImage} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or key" />
      {coverImage && (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(coverImage, "sm")} alt="" className="h-40 w-full rounded-xl object-cover" />
          <button type="button" className="text-xs font-semibold text-red-600" onClick={remove}>
            Remove cover image
          </button>
        </div>
      )}
    </div>
  );
}
