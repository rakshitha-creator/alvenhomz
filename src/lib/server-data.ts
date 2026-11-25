/**
 * Build-time data: reads the admin's published listings and blog posts from Firestore (public REST API) while the
 * static site is generated, so every page ships its real content in the HTML instead of "Loading…".
 * Admin-saved listings replace the built-in JSON version of the same slug; listings that exist only in the JSON stay.
 * If Firestore can't be reached at build time, the built-in JSON is used, so a build never fails because of it.
 * Only import this from server components, generateStaticParams/generateMetadata and sitemap.
 */
import { projects, rentalProperties, resaleProperties } from "./data";
import { repairSplitList } from "./live-merge";
import type { BlogPost, Project, RentalProperty, ResaleProperty } from "./types";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

type FsValue = Record<string, unknown>;

function decode(v: FsValue): unknown {
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("timestampValue" in v) return { __timestamp: v.timestampValue };
  if ("arrayValue" in v) return ((v.arrayValue as { values?: FsValue[] }).values ?? []).map(decode);
  if ("mapValue" in v) return decodeFields((v.mapValue as { fields?: Record<string, FsValue> }).fields ?? {});
  return undefined;
}

function decodeFields(fields: Record<string, FsValue>) {
  return Object.fromEntries(Object.entries(fields).map(([k, val]) => [k, decode(val)]));
}

const cache = new Map<string, Promise<Record<string, unknown>[]>>();

/** Published documents of a collection, with `editedInAdmin`/`liveUpdatedAt` derived like the client does. */
function publishedDocs(collection: string) {
  if (!cache.has(collection)) {
    cache.set(
      collection,
      (async () => {
        if (!PROJECT_ID || !API_KEY) return [];
        try {
          const res = await fetch(
            `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                structuredQuery: {
                  from: [{ collectionId: collection }],
                  where: { fieldFilter: { field: { fieldPath: "published" }, op: "EQUAL", value: { booleanValue: true } } },
                },
              }),
            },
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const rows = (await res.json()) as { document?: { name: string; fields?: Record<string, FsValue> } }[];
          return rows
            .filter((r) => r.document)
            .map((r) => {
              const { createdAt: _c, updatedAt, ...rest } = decodeFields(r.document!.fields ?? {});
              const edited = typeof updatedAt === "string";
              return { slug: r.document!.name.split("/").pop(), ...rest, editedInAdmin: edited, ...(edited ? { liveUpdatedAt: updatedAt } : {}) };
            });
        } catch (e) {
          console.warn(`[build] Firestore ${collection} unavailable, using built-in data:`, e instanceof Error ? e.message : e);
          return [];
        }
      })(),
    );
  }
  return cache.get(collection)!;
}

/** Admin-saved listings (over their built-in version) + built-in listings the admin doesn't have. Old seed-only docs are ignored. */
async function merged<T extends { slug: string; highlights?: string[] }>(collection: string, builtIn: T[]): Promise<T[]> {
  const live = (await publishedDocs(collection)).filter((d) => d.editedInAdmin) as unknown as T[];
  const bySlug = new Map(live.map((l) => [l.slug, l]));
  const out = builtIn.map((b) => {
    const l = bySlug.get(b.slug);
    if (!l) return b;
    // Like the browser-side merge: empty admin fields (e.g. faqs: []) don't wipe out the website's data.
    const filled = Object.fromEntries(Object.entries(l).filter(([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)));
    const item = { ...b, ...filled } as T;
    if (item.highlights) item.highlights = repairSplitList(item.highlights, b.highlights);
    return item;
  });
  const extra = live.filter((l) => !builtIn.some((b) => b.slug === l.slug));
  return [...extra, ...out];
}

export const getProjects = () => merged<Project>("projects", projects);
export const getResaleList = () => merged<ResaleProperty>("resaleProperties", resaleProperties);
/** Sample/demo rentals are kept out of the public site until real, verified listings replace them. */
export const getRentalList = async () => (await merged<RentalProperty>("rentalProperties", rentalProperties)).filter((r) => !r.isSample);

export async function getBlogs(): Promise<BlogPost[]> {
  const docs = (await publishedDocs("blogs")) as unknown as BlogPost[];
  return [...docs].sort((a, b) => String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")));
}
