import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getFirebaseStorage } from "./firebase";

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function uploadListingImage(
  kind: "projects" | "resale" | "rental",
  slug: string,
  file: File,
  onProgress?: (pct: number) => void,
) {
  const path = `listings/${kind}/${slug}/${crypto.randomUUID()}-${safeName(file.name)}`;
  return uploadFile(path, file, onProgress);
}

export async function uploadListingVideo(
  kind: "projects" | "resale" | "rental",
  slug: string,
  file: File,
  onProgress?: (pct: number) => void,
) {
  const path = `listings/${kind}/${slug}/video/${crypto.randomUUID()}-${safeName(file.name)}`;
  return uploadFile(path, file, onProgress);
}

export async function uploadBlogImage(slug: string, file: File, onProgress?: (pct: number) => void) {
  const path = `blogs/${slug}/${crypto.randomUUID()}-${safeName(file.name)}`;
  return uploadFile(path, file, onProgress);
}

export async function uploadBannerMedia(
  pageId: string,
  file: File,
  onProgress?: (pct: number) => void,
) {
  const kind = file.type.startsWith("video/") ? "video" : "image";
  const path = `banners/${pageId}/${kind}-${crypto.randomUUID()}-${safeName(file.name)}`;
  return uploadFile(path, file, onProgress);
}

async function uploadFile(path: string, file: File, onProgress?: (pct: number) => void) {
  const storageRef = ref(getFirebaseStorage(), path);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
  await new Promise<void>((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (onProgress && snap.totalBytes) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      },
      reject,
      () => resolve(),
    );
  });
  const url = await getDownloadURL(task.snapshot.ref);
  return { url, path };
}

export async function deleteStoragePath(path?: string | null) {
  if (!path) return;
  try {
    await deleteObject(ref(getFirebaseStorage(), path));
  } catch {
    // Object may already be gone
  }
}

/** True for photos already in Firebase Storage. */
export const isStorageUrl = (src: string) => /^https:\/\/firebasestorage\.googleapis\.com\//.test(src);

/**
 * Copies a photo the website serves itself (an /images/… path or a library key) into Firebase Storage under the
 * listing's folder and returns its download URL. Storage URLs and other external URLs are returned unchanged.
 */
export async function copyImageToStorage(kind: "projects" | "resale" | "rental", slug: string, src: string, resolve: (src: string) => string) {
  if (!src || isStorageUrl(src) || /^https?:\/\//.test(src)) return src;
  const res = await fetch(resolve(src));
  if (!res.ok) throw new Error(`Couldn't read ${src} (${res.status})`);
  const blob = await res.blob();
  const name = src.split("/").pop() || "photo.webp";
  const file = new File([blob], name.includes(".") ? name : `${name}.webp`, { type: blob.type || "image/webp" });
  const { url } = await uploadListingImage(kind, slug, file);
  return url;
}
