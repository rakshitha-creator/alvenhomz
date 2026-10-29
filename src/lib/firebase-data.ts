import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  deleteDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import type { BlogPost, Lead, PageBanner, Project, RentalProperty, ResaleProperty } from "./types";
import { getFirebaseDb, isFirebaseConfigured } from "./firebase";

export type ListingCollection = "projects" | "resaleProperties" | "rentalProperties";

const COLLECTIONS = {
  projects: "projects",
  resaleProperties: "resaleProperties",
  rentalProperties: "rentalProperties",
  blogs: "blogs",
  leads: "leads",
  banners: "banners",
} as const;

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj };
  for (const key of Object.keys(out)) {
    if (out[key] === undefined) delete out[key];
  }
  return out;
}

function fromDoc<T>(id: string, data: Record<string, unknown> | undefined): T | null {
  if (!data) return null;
  const { createdAt: _c, updatedAt: _u, ...rest } = data;
  return { slug: id, ...rest } as T;
}

export async function listPublishedProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(getFirebaseDb(), COLLECTIONS.projects), where("published", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<Project>(d.id, d.data())).filter(Boolean) as Project[];
}

export async function listPublishedResale(): Promise<ResaleProperty[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(getFirebaseDb(), COLLECTIONS.resaleProperties), where("published", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<ResaleProperty>(d.id, d.data())).filter(Boolean) as ResaleProperty[];
}

export async function listPublishedRentals(): Promise<RentalProperty[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(getFirebaseDb(), COLLECTIONS.rentalProperties), where("published", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<RentalProperty>(d.id, d.data())).filter(Boolean) as RentalProperty[];
}

export async function listPublishedBlogs(): Promise<BlogPost[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(
    collection(getFirebaseDb(), COLLECTIONS.blogs),
    where("published", "==", true),
    orderBy("publishedAt", "desc"),
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map((d) => fromDoc<BlogPost>(d.id, d.data())).filter(Boolean) as BlogPost[];
  } catch {
    // Fallback if composite index is missing
    const snap = await getDocs(query(collection(getFirebaseDb(), COLLECTIONS.blogs), where("published", "==", true)));
    return (snap.docs.map((d) => fromDoc<BlogPost>(d.id, d.data())).filter(Boolean) as BlogPost[]).sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt),
    );
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(getFirebaseDb(), COLLECTIONS.projects, slug));
  if (!snap.exists()) return null;
  const item = fromDoc<Project>(snap.id, snap.data());
  if (!item || item.published === false) return null;
  return item;
}

export async function getResaleBySlug(slug: string): Promise<ResaleProperty | null> {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(getFirebaseDb(), COLLECTIONS.resaleProperties, slug));
  if (!snap.exists()) return null;
  const item = fromDoc<ResaleProperty>(snap.id, snap.data());
  if (!item || item.published === false) return null;
  return item;
}

export async function getRentalBySlug(slug: string): Promise<RentalProperty | null> {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(getFirebaseDb(), COLLECTIONS.rentalProperties, slug));
  if (!snap.exists()) return null;
  const item = fromDoc<RentalProperty>(snap.id, snap.data());
  if (!item || item.published === false) return null;
  return item;
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(getFirebaseDb(), COLLECTIONS.blogs, slug));
  if (!snap.exists()) return null;
  const item = fromDoc<BlogPost>(snap.id, snap.data());
  if (!item || item.published === false) return null;
  return item;
}

/** Admin: all docs including unpublished. */
export async function listAllAdmin<T>(col: ListingCollection | "blogs"): Promise<T[]> {
  if (!isFirebaseConfigured()) return [];
  const snap = await getDocs(collection(getFirebaseDb(), col));
  return snap.docs.map((d) => fromDoc<T>(d.id, d.data())).filter(Boolean) as T[];
}

export async function getAdminDoc<T>(col: ListingCollection | "blogs", slug: string): Promise<T | null> {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(getFirebaseDb(), col, slug));
  if (!snap.exists()) return null;
  return fromDoc<T>(snap.id, snap.data());
}

export async function saveListingDoc(col: ListingCollection | "blogs", slug: string, data: Record<string, unknown>) {
  const now = new Date().toISOString();
  const existing = await getDoc(doc(getFirebaseDb(), col, slug));
  const payload = stripUndefined({
    ...data,
    slug,
    updatedAt: now,
    createdAt: existing.exists() ? (existing.data()?.createdAt ?? now) : now,
  });
  await setDoc(doc(getFirebaseDb(), col, slug), payload, { merge: true });
}

export async function deleteListingDoc(col: ListingCollection | "blogs", slug: string) {
  await deleteDoc(doc(getFirebaseDb(), col, slug));
}

export function listenPublishedProjects(cb: (items: Project[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured()) {
    cb([]);
    return null;
  }
  const q = query(collection(getFirebaseDb(), COLLECTIONS.projects), where("published", "==", true));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => fromDoc<Project>(d.id, d.data())).filter(Boolean) as Project[]);
  });
}

export function listenPublishedResale(cb: (items: ResaleProperty[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured()) {
    cb([]);
    return null;
  }
  const q = query(collection(getFirebaseDb(), COLLECTIONS.resaleProperties), where("published", "==", true));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => fromDoc<ResaleProperty>(d.id, d.data())).filter(Boolean) as ResaleProperty[]);
  });
}

export function listenPublishedRentals(cb: (items: RentalProperty[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured()) {
    cb([]);
    return null;
  }
  const q = query(collection(getFirebaseDb(), COLLECTIONS.rentalProperties), where("published", "==", true));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => fromDoc<RentalProperty>(d.id, d.data())).filter(Boolean) as RentalProperty[]);
  });
}

export async function createLead(lead: Omit<Lead, "id">) {
  if (!isFirebaseConfigured()) return null;
  const payload = stripUndefined({
    ...lead,
    status: lead.status ?? "new",
    createdAt: lead.createdAt ?? new Date().toISOString(),
  } as Record<string, unknown>);
  const ref = await addDoc(collection(getFirebaseDb(), COLLECTIONS.leads), payload);
  return ref.id;
}

export async function listLeadsAdmin(): Promise<Lead[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    const q = query(collection(getFirebaseDb(), COLLECTIONS.leads), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) }));
  } catch {
    const snap = await getDocs(collection(getFirebaseDb(), COLLECTIONS.leads));
    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) }))
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  }
}

export async function updateLeadStatus(id: string, status: Lead["status"]) {
  await setDoc(doc(getFirebaseDb(), COLLECTIONS.leads, id), { status, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function getBanner(id: PageBanner["id"]): Promise<PageBanner | null> {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(getFirebaseDb(), COLLECTIONS.banners, id));
  if (!snap.exists()) return null;
  return { id, ...(snap.data() as Omit<PageBanner, "id">) };
}

export async function listBannersAdmin(): Promise<PageBanner[]> {
  if (!isFirebaseConfigured()) return [];
  const snap = await getDocs(collection(getFirebaseDb(), COLLECTIONS.banners));
  return snap.docs.map((d) => ({ id: d.id as PageBanner["id"], ...(d.data() as Omit<PageBanner, "id">) }));
}

export async function saveBanner(banner: PageBanner) {
  const now = new Date().toISOString();
  await setDoc(
    doc(getFirebaseDb(), COLLECTIONS.banners, banner.id),
    stripUndefined({
      mediaType: banner.mediaType,
      mediaUrl: banner.mediaUrl,
      mediaStoragePath: banner.mediaStoragePath,
      updatedAt: now,
    } as Record<string, unknown>),
    { merge: true },
  );
}

export async function clearBanner(id: PageBanner["id"]) {
  await deleteDoc(doc(getFirebaseDb(), COLLECTIONS.banners, id));
}
