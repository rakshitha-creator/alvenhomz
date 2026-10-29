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
