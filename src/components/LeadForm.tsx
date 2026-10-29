"use client";

import { useId, useState } from "react";
import { CalendarCheck, Mail, MessageSquareText, Phone } from "lucide-react";
import { WhatsAppIcon } from "./icons";
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

const PHONE_RE = /^(\+?91)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values, variant: Variant): Errors {
  const e: Errors = {};
  if (!v.name?.trim() || v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!PHONE_RE.test((v.phone ?? "").replace(/[\s-]/g, ""))) e.phone = "Enter a valid 10-digit Indian mobile number.";
  if (v.email && !EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (variant === "listing" && v.intent === "visit" && !v.date) e.date = "Choose a preferred visit date.";
  if (variant === "interiors" && !v.service) e.service = "Select the service you need.";
  if (variant === "contact" && !v.interest) e.interest = "Tell us what you're looking for.";
  return e;
}

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
    return formatFields("Hi Alven Homz Interiors, I'd like to book a free consultation.", [
      ...contactRows,
      ["Property location", v.location],
      ["Property type", v.propertyType],
      ["Service required", v.service],
      ["Approximate budget", v.budget],
      ["Message", v.message],
    ]);
  }
  return formatFields("Hi Alven Homz, I have an enquiry.", [...contactRows, ["Looking for", v.interest], ["Preferred area", v.city], ["Message", v.message]]);
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
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<"whatsapp" | "email" | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const send = async (channel: "whatsapp" | "email") => {
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
          message: values.message || undefined,
          listingTitle: listing?.title,
          listingUrl: listing?.url,
          source: variant,
          createdAt: new Date().toISOString(),
          status: "new",
        });
      }
    } catch {
      // Lead storage is best-effort; WhatsApp/email still open.
    }
    if (channel === "whatsapp") {
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
                values.intent === intent ? "bg-navy-900 text-white shadow" : "text-navy-800",
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
        {field("phone", "Mobile number *", <input {...aria("phone")} className={fieldCls} type="tel" inputMode="tel" autoComplete="tel" value={values.phone ?? ""} onChange={set("phone")} placeholder="98765 43210" />)}
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
              "I'm looking for *",
              <select {...aria("interest")} className={fieldCls} value={values.interest ?? ""} onChange={set("interest")}>
                <option value="">Select an option</option>
                {INTERESTS.map((i) => <option key={i}>{i}</option>)}
              </select>,
            )}
            {field("city", "Preferred area", <input {...aria("city")} className={fieldCls} value={values.city ?? ""} onChange={set("city")} placeholder="e.g. Sarjapur Road" />)}
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
          "Message",
          <textarea {...aria("message")} className={cn(fieldCls, "min-h-24 resize-y")} rows={compact ? 3 : 4} value={values.message ?? ""} onChange={set("message")} placeholder="Anything we should know?" />,
          true,
        )}
      </div>

      <div className={cn("grid gap-3", !compact && "sm:grid-cols-2")}>
        <button type="submit" className="btn-whatsapp w-full">
          <WhatsAppIcon className="h-5 w-5" /> Send on WhatsApp
        </button>
        <button type="button" onClick={() => send("email")} className={cn("w-full", dark ? "btn-ghost-light" : "btn-outline")}>
          <Mail className="h-4 w-4" /> Send via Email
        </button>
      </div>

      {sent ? (
        <p role="status" className={cn("rounded-xl px-4 py-3 text-xs leading-relaxed", dark ? "bg-white/10 text-white/80" : "bg-emerald-50 text-emerald-900")}>
          {sent === "whatsapp"
            ? "WhatsApp has opened with your details filled in — tap Send there to reach our team."
            : "Your email app has opened with a pre-filled draft — press Send to reach our team."}{" "}
          Prefer to talk? <a href={telHref()} className="font-semibold underline">Call {site.phone}</a>.
        </p>
      ) : (
        <p className={cn("flex items-start gap-1.5 text-[11px] leading-relaxed", dark ? "text-white/50" : "text-muted")}>
          <Phone className="mt-0.5 h-3 w-3 shrink-0" />
          Your details open in WhatsApp or your email app for you to send — this website doesn&apos;t store them.
        </p>
      )}
    </form>
  );
}
