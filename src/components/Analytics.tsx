"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Google Analytics 4 (and optionally Google Tag Manager) behind a cookie-consent banner, using Consent Mode v2:
 * nothing is stored until the visitor accepts. Lead actions are sent as events:
 *   whatsapp_click, call_click, email_click (any wa.me / tel: / mailto: link) and generate_lead (enquiry form).
 * IDs come from NEXT_PUBLIC_GA_ID (falls back to the Firebase measurement ID) and NEXT_PUBLIC_GTM_ID.
 * WhatsApp messages get a "Source: /page/" line so the sales team knows where the enquiry came from.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";
const KEY = "alvenhomz-consent";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: Gtag;
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // gtag.js expects the arguments object itself.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
  void args;
}

/** Send an analytics event (no-op until analytics has loaded and consent is given). */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}

function loadScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function start(granted: boolean) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag as Gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: granted ? "granted" : "denied",
  });
  if (!granted) return;
  if (GA_ID) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }
  if (GTM_ID) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
  }
}

function readConsent(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export default function Analytics() {
  const pathname = usePathname() || "/";
  const [choice, setChoice] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const saved = readConsent();
    setChoice(saved);
    if (saved === "granted") start(true);
  }, []);

  // Page views on client-side navigation (the first one is sent by config).
  useEffect(() => {
    if (choice === "granted" && GA_ID) track("page_view", { page_path: pathname });
  }, [pathname, choice]);

  // Lead actions: WhatsApp, call and email links anywhere on the site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const from = window.location.pathname;
      if (href.startsWith("https://wa.me/")) {
        try {
          const url = new URL(href);
          const text = url.searchParams.get("text") ?? "";
          if (!text.includes("Source:")) {
            url.searchParams.set("text", `${text}${text ? "\n\n" : ""}Source: ${from}`);
            a.setAttribute("href", url.toString());
          }
        } catch {
          // leave the link as it is
        }
        track("whatsapp_click", { page_path: from });
      } else if (href.startsWith("tel:")) track("call_click", { page_path: from });
      else if (href.startsWith("mailto:")) track("email_click", { page_path: from });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const decide = (granted: boolean) => {
    try {
      localStorage.setItem(KEY, granted ? "granted" : "denied");
    } catch {
      // private mode: just don't remember
    }
    setChoice(granted ? "granted" : "denied");
    if (granted) start(true);
  };

  if (!(GA_ID || GTM_ID) || choice !== null) return null;
  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-xl rounded-2xl border border-line bg-white p-4 text-sm text-navy-800 shadow-lift sm:p-5">
      <p>
        We use analytics cookies to understand how visitors use our site and improve it. See our{" "}
        <Link href="/privacy-policy/" className="font-semibold underline">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => decide(true)} className="btn-primary min-h-11 py-2 text-sm">
          Accept
        </button>
        <button type="button" onClick={() => decide(false)} className="btn-outline min-h-11 py-2 text-sm">
          Decline
        </button>
      </div>
    </div>
  );
}
