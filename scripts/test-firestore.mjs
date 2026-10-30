import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import * as fs from "fs";

// parse .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const parts = line.trim().split("=");
  if (parts.length >= 2 && !parts[0].startsWith("#")) {
    env[parts[0]] = parts.slice(1).join("=").trim();
  }
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  console.log("Checking Firestore collections...");
  for (const col of ["projects", "resaleProperties", "rentalProperties"]) {
    try {
      const snap = await getDocs(collection(db, col));
      console.log(`Collection ${col}: ${snap.size} documents`);
      snap.forEach(doc => {
        const d = doc.data();
        console.log(`  doc: ${doc.id}, images: ${d.images ? d.images[0] : 'no image'}`);
      });
    } catch (e) {
      console.log(`Error in ${col}:`, e.message);
    }
  }
}
test();

