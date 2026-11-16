"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { CalendarCheck, Mail, MessageSquareText, Phone } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { track } from "./Analytics";
import { formatFields, listingMessage, mailtoHref, telHref, whatsappHref, type ListingRef } from "@/lib/contact";
import { interiorServices, site } from "@/lib/data";
import { cn, formatDate } from "@/lib/utils";

type Variant = "listing" | "contact" | "interiors";

const INTERESTS = ["Buying a new project", "Buying a resale property", "Renting a property", "Selling or leasing my property", "Interior design", "Something else"];
const INTERIOR_PROPERTY_TYPES = ["Apartment", "Villa", "Independent House", "Office / Commercial"];
const INTERIOR_BUDGETS = ["Under ₹5 Lakh", "₹5 – 10 Lakh", "₹10 – 20 Lakh", "₹20 – 50 Lakh", "₹50 Lakh+"];
const TIME_SLOTS = ["Morning (9 AM – 12 PM)", "Afternoon (12 – 4 PM)", "Evening (4 – 7 PM)"];

type Values = Record<string, string>;
type Errors = Partial<Record<string, string>>;

// A 10-digit Indian mobile, or any international number written with its country code (+ and 8–15 digits).
const PHONE_RE = /^(?:(?:\+?91)?[6-9]\d{9}|\+[1-9]\d{7,14})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REQUIRED = "Please complete this field.";

function validate(v: Values, variant: Variant): Errors {
  const e: Errors = {};
  if (!v.name?.trim() || v.name.trim().length < 2) e.name = REQUIRED;
  const phone = (v.phone ?? "").replace(/[\s()-]/g, "");
  if (!phone) e.phone = REQUIRED;
  else if (!PHONE_RE.test(phone)) e.phone = "Enter a mobile number with its country code.";
  if (v.email && !EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (variant === "listing" && v.intent === "visit" && !v.date) e.date = REQUIRED;
  if (variant === "interiors" && !v.service) e.service = REQUIRED;
  if (variant === "contact" && !v.interest) e.interest = REQUIRED;
  return e;
}

/** Enquiry topics a page can preselect with /contact-us/?topic=…#enquiry (no personal data in the URL). */
export const TOPICS: Record<string, string> = {
  "new-project": "Buying a new project",
  resale: "Buying a resale property",
  rent: "Renting a property",
  owner: "Selling or leasing my property",
  interiors: "Interior design",
  other: "Something else",
};

function buildMessage(v: Values, variant: Variant, listing?: ListingRef) {
  const contactRows: Array<[string, string | undefined]> = [
    ["Name", v.name],
    ["Phone", v.phone],
    ["Email", v.email],
  ];
  if (variant === "listing" && listing) {
    const head = listingMessage(listing, v.intent === "visit" ? "visit" : "enquire").replace(/\n\nPlease share more details\.$/, "");
    return formatFields(head, [
      ...contactRows,
      ["Preferred date", v.intent === "visit" && v.date ? formatDate(v.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : undefined],
      ["Preferred time", v.intent === "visit" ? v.time : undefined],
      ["Message", v.message],
    ]);
  }
  if (variant === "interiors") {
    return formatFields("Hi Alven Homz, I'd like to discuss an interior design brief.", [
      ...contactRows,
      ["Property location", v.location],
      ["Property type", v.propertyType],
      ["Service required", v.service],
      ["Approximate budget", v.budget],
      ["About the home", v.message],
    ]);
  }
  return formatFields("Hi Alven Homz, I have an enquiry.", [
    ...contactRows,
    ["Looking for", v.interest],
    ["About", v.about],
    ["Preferred area", v.city],
    ["Brief", v.message],
  ]);
}

function subjectFor(v: Values, variant: Variant, listing?: ListingRef) {
  if (variant === "listing" && listing) return `${v.intent === "visit" ? "Site visit request" : "Enquiry"}: ${listing.title}`;
  if (variant === "interiors") return `Interior consultation request – ${v.service || "Alven Homz Interiors"}`;
  return `Website enquiry – ${v.interest || "General"}`;
}

export default function LeadForm({
  variant,
  listing,
  defaultIntent = "enquire",
  compact = false,
  dark = false,
}: {
  variant: Variant;
  listing?: ListingRef;
  defaultIntent?: "enquire" | "visit";
  compact?: boolean;
  dark?: boolean;
}) {
  const uid = useId();
  const [values, setValues] = useState<Values>({ intent: defaultIntent, time: TIME_SLOTS[0] });

  // Contact page: preselect the topic (and the listing a visitor came from) from ?topic=…&about=…
  useEffect(() => {
    if (variant !== "contact") return;
    const q = new URLSearchParams(window.location.search);
    const topic = TOPICS[q.get("topic") ?? ""];
    const about = q.get("about")?.slice(0, 120);
    if (topic || about) setValues((v) => ({ ...v, ...(topic ? { interest: topic } : {}), ...(about ? { about } : {}) }));
  }, [variant]);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<"callback" | "whatsapp" | "email" | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const send = async (channel: "callback" | "whatsapp" | "email") => {
    const errs = validate(values, variant);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const message = buildMessage(values, variant, listing);
    try {
      const { createLead } = await import("@/lib/firebase-data");
      const { isFirebaseConfigured } = await import("@/lib/firebase");
      if (isFirebaseConfigured()) {
        await createLead({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email?.trim() || undefined,
          interest: values.interest || values.service || values.intent || undefined,
          city: values.city || values.location || undefined,
          message:
            [values.intent === "visit" && values.date ? `Site visit: ${values.date}, ${values.time ?? ""}` : "", values.message ?? ""]
              .filter(Boolean)
              .join(" — ") || undefined,
          listingTitle: listing?.title ?? (values.about || undefined),
          listingUrl: listing?.url,
          source: channel === "callback" ? `${variant} · call back` : variant,
          createdAt: new Date().toISOString(),
          status: "new",
        });
      }
    } catch {
      // Lead storage is best-effort; WhatsApp/email still open.
    }
    track("generate_lead", { method: channel, form: variant, page_path: window.location.pathname });
    if (channel === "callback") {
      // Nothing to open: the lead is saved and the team calls back.
    } else if (channel === "whatsapp") {
      window.open(whatsappHref(message), "_blank", "noopener");
    } else {
      window.location.href = mailtoHref(subjectFor(values, variant, listing), message);
    }
    setSent(channel);
  };

  const today = new Date().toISOString().slice(0, 10);
  const fieldCls = cn("input", dark && "border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:bg-white/10 [&>option]:text-ink");
  const labelCls = cn("label", dark && "text-white/80");

  const field = (key: string, label: string, el: React.ReactNode, span2 = false) => (
    <div className={cn(span2 && !compact && "sm:col-span-2")}>
      <label htmlFor={`${uid}-${key}`} className={labelCls}>{label}</label>
      {el}
      {errors[key] && (
        <p id={`${uid}-${key}-err`} className="mt-1.5 text-xs font-medium text-red-600" role="alert">{errors[key]}</p>
      )}
    </div>
  );

  const aria = (key: string) => ({
    id: `${uid}-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-err` : undefined,
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        send("whatsapp");
      }}
      className="space-y-4"
    >
      {variant === "listing" && (
        <div role="radiogroup" aria-label="What would you like to do?" className={cn("grid grid-cols-2 gap-1 rounded-full p-1", dark ? "bg-white/10" : "bg-ivory")}>
          {(["enquire", "visit"] as const).map((intent) => (
            <button
              key={intent}
              type="button"
              role="radio"
              aria-checked={values.intent === intent}
              onClick={() => setValues((v) => ({ ...v, intent }))}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition",
                values.intent === intent ? "bg-espresso-900 text-white shadow" : "text-navy-800",
              )}
            >
              {intent === "visit" ? <CalendarCheck className="h-3.5 w-3.5" /> : <MessageSquareText className="h-3.5 w-3.5" />}
              {intent === "visit" ? "Schedule Visit" : "Enquire"}
            </button>
          ))}
        </div>
      )}

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        {field("name", "Full name *", <input {...aria("name")} className={fieldCls} autoComplete="name" value={values.name ?? ""} onChange={set("name")} placeholder="Your name" />)}
        {field("phone", "Mobile number with country code *", <input {...aria("phone")} className={fieldCls} type="tel" inputMode="tel" autoComplete="tel" value={values.phone ?? ""} onChange={set("phone")} placeholder="+91 98765 43210" />)}
        {field("email", "Email (optional)", <input {...aria("email")} className={fieldCls} type="email" autoComplete="email" value={values.email ?? ""} onChange={set("email")} placeholder="you@example.com" />, variant !== "interiors")}

        {variant === "listing" && values.intent === "visit" && (
          <>
            {field("date", "Preferred date *", <input {...aria("date")} className={fieldCls} type="date" min={today} value={values.date ?? ""} onChange={set("date")} />)}
            {field(
              "time",
              "Preferred time",
              <select {...aria("time")} className={fieldCls} value={values.time} onChange={set("time")}>
                {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
              </select>,
            )}
          </>
        )}

        {variant === "contact" && (
          <>
            {field(
              "interest",
              "What can we help with? *",
              <select {...aria("interest")} className={fieldCls} value={values.interest ?? ""} onChange={set("interest")}>
                <option value="">Select an option</option>
                {INTERESTS.map((i) => <option key={i}>{i}</option>)}
              </select>,
            )}
            {field("city", "Preferred area", <input {...aria("city")} className={fieldCls} value={values.city ?? ""} onChange={set("city")} placeholder="e.g. Sarjapur Road" />)}
            {values.about && (
              <p className={cn("text-sm sm:col-span-2", dark ? "text-white/70" : "text-muted")}>
                About: <span className="font-semibold">{values.about}</span>
              </p>
            )}
          </>
        )}

        {variant === "interiors" && (
          <>
            {field("location", "Property location", <input {...aria("location")} className={fieldCls} value={values.location ?? ""} onChange={set("location")} placeholder="Locality, city" />)}
            {field(
              "propertyType",
              "Property type",
              <select {...aria("propertyType")} className={fieldCls} value={values.propertyType ?? ""} onChange={set("propertyType")}>
                <option value="">Select</option>
                {INTERIOR_PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>,
            )}
            {field(
              "service",
              "Service required *",
              <select {...aria("service")} className={fieldCls} value={values.service ?? ""} onChange={set("service")}>
                <option value="">Select a service</option>
                {interiorServices.map((s) => <option key={s.slug}>{s.title}</option>)}
                <option>Renovation & Remodeling</option>
              </select>,
            )}
            {field(
              "budget",
              "Approximate budget",
              <select {...aria("budget")} className={fieldCls} value={values.budget ?? ""} onChange={set("budget")}>
                <option value="">Select</option>
                {INTERIOR_BUDGETS.map((b) => <option key={b}>{b}</option>)}
              </select>,
            )}
          </>
        )}

        {field(
          "message",
          variant === "interiors" ? "Tell us about your home" : variant === "contact" ? "Your brief" : "Message",
          <textarea
            {...aria("message")}
            className={cn(fieldCls, "min-h-24 resize-y")}
            rows={compact ? 3 : 4}
            value={values.message ?? ""}
            onChange={set("message")}
            placeholder="Based overseas? Share your country, time zone and a convenient time to speak. If you're travelling to Bengaluru, include your dates."
          />,
          true,
        )}
      </div>

      {sent === "callback" ? (
        <div role="status" className={cn("rounded-2xl px-5 py-4 text-sm leading-relaxed", dark ? "bg-white/10 text-white" : "bg-emerald-50 text-emerald-900")}>
          <p className="font-semibold">Thank you, {values.name.trim().split(" ")[0]}! We&apos;ve received your request.</p>
          <p className="mt-1">An Alven Homz advisor will call you on {values.phone} during working hours.</p>
          <p className="mt-2 text-xs opacity-80">
            Can&apos;t wait? <a href={telHref()} className="font-semibold underline">Call {site.phone}</a> or{" "}
            <button type="button" onClick={() => send("whatsapp")} className="font-semibold underline">chat on WhatsApp</button>.
          </p>
        </div>
      ) : (
        <>
          <div className={cn("grid gap-3", !compact && "sm:grid-cols-2")}>
            <button type="submit" className="btn-whatsapp w-full">
              <WhatsAppIcon className="h-5 w-5" /> Continue on WhatsApp
            </button>
            <button type="button" onClick={() => send("email")} className={cn("w-full", dark ? "btn-ghost-light" : "btn-outline")}>
              <Mail className="h-4 w-4" /> Open Email Draft
            </button>
          </div>
          <p className={cn("text-xs", dark ? "text-white/70" : "text-muted")}>
            Choose WhatsApp or email to open your draft. Review the details before sending. Prefer a call?{" "}
            <button type="button" onClick={() => send("callback")} className="inline-flex min-h-11 items-center font-semibold underline">
              <Phone className="mr-1 h-3.5 w-3.5" /> Request a call back
            </button>
          </p>
          {sent && (
            <p role="status" className={cn("rounded-xl px-4 py-3 text-xs leading-relaxed", dark ? "bg-white/10 text-white/80" : "bg-emerald-50 text-emerald-900")}>
              Thanks — we&apos;ve saved your enquiry.{" "}
              {sent === "whatsapp"
                ? "WhatsApp has opened with your details filled in; tap Send there to reach our team."
                : "Your email app has opened with a pre-filled draft; press Send to reach our team."}
            </p>
          )}
        </>
      )}
      <p className={cn("flex items-start gap-1.5 text-xs leading-relaxed", dark ? "text-white/60" : "text-muted")}>
        <span>
          We store your details to respond to your enquiry. See our{" "}
          <Link href="/privacy-policy/" className="underline">Privacy Policy</Link> and{" "}
          <Link href="/terms-and-conditions/" className="underline">Terms</Link>.
        </span>
      </p>
    </form>
  );
}
