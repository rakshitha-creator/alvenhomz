/**
 * Enable Email/Password Auth (if needed) and create / reset the admin user.
 *
 * Usage:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS=".\alven-51419-firebase-adminsdk-fbsvc-f53e1ddc72.json"
 *   $env:ADMIN_EMAIL="admin@gmail.com"
 *   $env:ADMIN_PASSWORD="admin@123"
 *   npm run create:admin
 */
import { readFileSync } from "node:fs";
import { GoogleAuth } from "google-auth-library";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const email = process.env.ADMIN_EMAIL || "admin@gmail.com";
const password = process.env.ADMIN_PASSWORD;
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./alven-51419-firebase-adminsdk-fbsvc-f53e1ddc72.json";

if (!password || password.length < 6) {
  console.error("Set ADMIN_PASSWORD (min 6 chars). Optional: ADMIN_EMAIL");
  process.exit(1);
}

const sa = JSON.parse(readFileSync(credPath, "utf8"));
const projectId = sa.project_id;

async function enableEmailPasswordAuth() {
  const authClient = new GoogleAuth({
    credentials: sa,
    scopes: ["https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/identitytoolkit"],
  });
  const client = await authClient.getClient();
  const token = await client.getAccessToken();
  const headers = {
    Authorization: `Bearer ${token.token}`,
    "Content-Type": "application/json",
  };

  // First-time projects need Auth initialized before config can be patched
  await fetch(`https://identitytoolkit.googleapis.com/v2/projects/${projectId}/identityPlatform:initializeAuth`, {
    method: "POST",
    headers,
    body: "{}",
  });

  const configUrl = `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config?updateMask=signIn.email,authorizedDomains`;
  const patchRes = await fetch(configUrl, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      signIn: {
        email: { enabled: true, passwordRequired: true },
      },
      authorizedDomains: ["localhost", `${projectId}.firebaseapp.com`, `${projectId}.web.app`],
    }),
  });
  if (!patchRes.ok) {
    const body = await patchRes.text();
    throw new Error(`Could not enable Email/Password Auth (${patchRes.status}): ${body}`);
  }
  console.log("Email/Password sign-in is enabled.");
}

await enableEmailPasswordAuth();

if (!getApps().length) initializeApp({ credential: cert(sa), projectId });

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
        `Open https://console.firebase.google.com/project/${projectId}/authentication/providers\n` +
        "Click Get started → enable Email/Password → run this script again.",
    );
    process.exit(1);
  } else {
    throw e;
  }
}

console.log(`\nSign in at /admin/login/ with:\n  email: ${email}\n  password: (the one you set)`);
