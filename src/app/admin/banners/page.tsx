"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, ImageIcon, Trash2, Video } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/form";
import { BANNER_SLOTS } from "@/lib/banners";
import { clearBanner, getBanner, saveBanner } from "@/lib/firebase-data";
import { confirmMediaChange } from "@/lib/media-confirm";
import type { BannerPageId, PageBanner } from "@/lib/types";
import { deleteStoragePath, uploadBannerMedia } from "@/lib/uploads";
import { img } from "@/lib/utils";

type BannerMap = Partial<Record<BannerPageId, PageBanner>>;

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<BannerPageId | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const load = async () => {
    setError("");
    try {
      const next: BannerMap = {};
      await Promise.all(
        BANNER_SLOTS.map(async (slot) => {
          const b = await getBanner(slot.id);
          if (b?.mediaUrl) next[slot.id] = b;
        }),
      );
      setBanners(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (pageId: BannerPageId, file: File | undefined | null, input: HTMLInputElement) => {
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isImage && !["video/mp4", "video/webm"].includes(file.type)) {
      setError("Only images or MP4/WebM videos are allowed.");
      input.value = "";
      return;
    }
    if (isVideo && file.size > 100 * 1024 * 1024) {
      setError("Video must be under 100MB.");
      input.value = "";
      return;
    }
    const existing = banners[pageId];
    const action = existing?.mediaUrl ? "replace" : "add";
    if (!confirmMediaChange(action, isVideo ? "video" : "image")) {
      input.value = "";
      return;
    }

    setBusyId(pageId);
    setError("");
    setProgress(0);
    try {
      if (existing?.mediaStoragePath) await deleteStoragePath(existing.mediaStoragePath);
      const { url, path } = await uploadBannerMedia(pageId, file, setProgress);
      const banner: PageBanner = {
        id: pageId,
        mediaType: isVideo ? "video" : "image",
        mediaUrl: url,
        mediaStoragePath: path,
      };
      await saveBanner(banner);
      setBanners((prev) => ({ ...prev, [pageId]: banner }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusyId(null);
      setProgress(null);
      input.value = "";
    }
  };

  const remove = async (pageId: BannerPageId) => {
    const existing = banners[pageId];
    if (!existing?.mediaUrl) return;
    if (!confirmMediaChange("remove", existing.mediaType === "video" ? "video" : "image")) return;

    setBusyId(pageId);
    setError("");
    try {
      await deleteStoragePath(existing.mediaStoragePath);
      await clearBanner(pageId);
      setBanners((prev) => {
        const next = { ...prev };
        delete next[pageId];
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove banner");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Banners"
        description="Change hero images or videos for Home, Projects, Resale, Rentals, and other pages. Media files go to Firebase Storage; banner records are stored in Firestore."
      />

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-sm text-muted">Loading…</p>}
      {progress !== null && busyId && (
        <p className="text-sm text-muted">
          Uploading {busyId}… {progress}%
        </p>
      )}

      <ul className="grid gap-4 lg:grid-cols-2">
        {BANNER_SLOTS.map((slot) => {
          const current = banners[slot.id];
          const preview = current?.mediaUrl || img(slot.fallbackImage);
          const isVideo = current?.mediaType === "video" && Boolean(current.mediaUrl);
          const busy = busyId === slot.id;

          return (
            <li key={slot.id} className="card overflow-hidden">
              <div className="relative aspect-[16/9] bg-navy-950">
                {isVideo ? (
                  <video src={preview} className="h-full w-full object-cover" muted controls playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                )}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-navy-950/80 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                  {isVideo ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                  {current ? (isVideo ? "CMS video" : "CMS image") : "Default"}
                </span>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-sans text-base font-bold text-navy-900">{slot.label}</h2>
                    <p className="text-xs text-muted">{slot.path}</p>
                  </div>
                  <Link
                    href={slot.path}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 hover:text-navy-900"
                  >
                    View <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <label className="block">
                  <span className="label mb-1.5 block">Upload image or video</span>
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm"
                    disabled={busy}
                    className="input py-2 text-sm"
                    onChange={(e) => upload(slot.id, e.target.files?.[0], e.target)}
                  />
                </label>

                {current?.mediaUrl && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => remove(slot.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove CMS media (use default)
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
