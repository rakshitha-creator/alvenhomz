/**
 * One-time / idempotent seed: JSON listings → Firestore.
 *
 * Usage:
 *   set GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
 *   npm run seed:firestore
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadJson(rel) {
  return JSON.parse(readFileSync(join(root, rel), "utf8"));
}

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./alven-51419-firebase-adminsdk-fbsvc-f53e1ddc72.json";
if (!getApps().length) {
  initializeApp({ credential: cert(JSON.parse(readFileSync(credPath, "utf8"))) });
}

const db = getFirestore();

async function seedCollection(name, items) {
  let n = 0;
  for (const item of items) {
    if (!item.slug) throw new Error(`Missing slug in ${name}`);
    await db
      .collection(name)
      .doc(item.slug)
      .set(
        {
          ...item,
          published: item.published !== false,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    n += 1;
    console.log(`  ✓ ${name}/${item.slug}`);
  }
  return n;
}

const projects = loadJson("src/data/newProjects.json");
const resale = loadJson("src/data/resaleProperties.json");
const rentals = loadJson("src/data/rentalProperties.json");

console.log("Seeding Firestore…");
const a = await seedCollection("projects", projects);
const b = await seedCollection("resaleProperties", resale);
const c = await seedCollection("rentalProperties", rentals);
console.log(`Done. projects=${a} resale=${b} rentals=${c}`);
