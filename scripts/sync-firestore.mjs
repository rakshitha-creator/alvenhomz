/**
 * Safe sync: site JSON listings → Firestore, without touching anything edited in the admin.
 *
 *  - Listing missing in Firestore            → created from JSON (so it can be edited in the admin).
 *  - Listing only ever seeded (never saved   → refreshed from JSON (the seed copy is older than the site data).
 *    in the admin; updatedAt is a Timestamp)
 *  - Listing saved in the admin               → left alone (admin saves write updatedAt as an ISO string).
 *  - Seed-only listing no longer in JSON      → unpublished (old sample data), not deleted.
 *
 * Usage (dry run first, then apply):
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json node scripts/sync-firestore.mjs
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json node scripts/sync-firestore.mjs --apply
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const apply = process.argv.includes("--apply");
const loadJson = (rel) => JSON.parse(readFileSync(join(root, rel), "utf8"));

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credPath) throw new Error("Set GOOGLE_APPLICATION_CREDENTIALS to the Firebase service account JSON for alven-51419.");
if (!getApps().length) initializeApp({ credential: cert(JSON.parse(readFileSync(credPath, "utf8"))) });
const db = getFirestore();

const strip = (v) => JSON.parse(JSON.stringify(v)); // drops undefined; Firestore rejects it

async function sync(name, items) {
  const snap = await db.collection(name).get();
  const existing = new Map(snap.docs.map((d) => [d.id, d.data()]));
  const slugs = new Set(items.map((i) => i.slug));

  for (const item of items) {
    const cur = existing.get(item.slug);
    const editedInAdmin = cur && typeof cur.updatedAt === "string";
    if (editedInAdmin && item.contentUpdatedAt && item.contentUpdatedAt > cur.updatedAt) {
      // Site data updated after the admin save: merge it in, keep admin-only fields (FAQs, testimonials…).
      console.log(`  ↻ merge ${name}/${item.slug} (site data newer than admin save)`);
      if (apply) await db.collection(name).doc(item.slug).set({ ...strip(item), updatedAt: new Date().toISOString() }, { merge: true });
      continue;
    }
    if (editedInAdmin) {
      console.log(`  = ${name}/${item.slug} (edited in admin — kept)`);
      continue;
    }
    console.log(`  ${cur ? "↻ refresh" : "+ create"} ${name}/${item.slug}`);
    if (apply) {
      await db
        .collection(name)
        .doc(item.slug)
        .set({
          ...strip(item),
          published: item.published !== false,
          createdAt: cur?.createdAt ?? FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
    }
  }

  for (const [id, data] of existing) {
    if (slugs.has(id) || typeof data.updatedAt === "string" || data.published === false) continue;
    console.log(`  − unpublish ${name}/${id} (old sample, not on the site)`);
    if (apply) await db.collection(name).doc(id).update({ published: false, updatedAt: Timestamp.now() });
  }
}

console.log(apply ? "Syncing Firestore…" : "Dry run (add --apply to write):");
await sync("projects", loadJson("src/data/newProjects.json"));
await sync("resaleProperties", loadJson("src/data/resaleProperties.json"));
await sync("rentalProperties", loadJson("src/data/rentalProperties.json"));
console.log("Done.");
