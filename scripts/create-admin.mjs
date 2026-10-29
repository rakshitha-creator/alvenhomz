/**
 * Create / reset the admin Auth user (run after Email/Password Auth is enabled).
 *
 * Usage:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS=".\serviceAccount.json"
 *   $env:ADMIN_EMAIL="you@example.com"
 *   $env:ADMIN_PASSWORD="ChooseAStrongPassword1"
 *   npm run create:admin
 */
import { readFileSync } from "node:fs";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const email = process.env.ADMIN_EMAIL || "admin@alvenhomz.com";
const password = process.env.ADMIN_PASSWORD;

if (!password || password.length < 8) {
  console.error("Set ADMIN_PASSWORD (min 8 chars). Optional: ADMIN_EMAIL");
  process.exit(1);
}

const sa = JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS || "./serviceAccount.json", "utf8"));
if (!getApps().length) initializeApp({ credential: cert(sa) });

const auth = getAuth();
try {
  const existing = await auth.getUserByEmail(email);
  await auth.updateUser(existing.uid, { password, emailVerified: true });
  console.log(`Updated password for ${email} (${existing.uid})`);
} catch (e) {
  if (e.code === "auth/user-not-found") {
    const user = await auth.createUser({ email, password, emailVerified: true, displayName: "Alven Admin" });
    console.log(`Created admin ${email} (${user.uid})`);
  } else if (e.code === "auth/configuration-not-found") {
    console.error(
      "Firebase Authentication is not enabled yet.\n" +
        "Open https://console.firebase.google.com/project/alvenhomz/authentication/providers\n" +
        "Click Get started → enable Email/Password → run this script again.",
    );
    process.exit(1);
  } else {
    throw e;
  }
}
