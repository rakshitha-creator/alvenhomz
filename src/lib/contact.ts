import siteJson from "@/data/site.json";

// Every enquiry on this site goes out through WhatsApp, a phone call or an email draft.
// Nothing is submitted to or stored by the website itself.

export const telHref = (phone = siteJson.phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export function whatsappHref(text?: string, number = siteJson.whatsapp) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function mailtoHref(subject: string, body?: string, to = siteJson.email) {
  const params = new URLSearchParams();
  params.set("subject", subject);
  if (body) params.set("body", body);
  // URLSearchParams encodes spaces as "+", which some mail apps show literally.
  return `mailto:${to}?${params.toString().replace(/\+/g, "%20")}`;
}

export interface ListingRef {
  title: string;
  location: string;
  price?: string;
  url?: string;
}

export function listingMessage(listing: ListingRef, intent: "enquire" | "visit" = "enquire") {
  const lines = [
    intent === "visit" ? `Hi Alven Homz, I'd like to schedule a visit to:` : `Hi Alven Homz, I'm interested in:`,
    `• ${listing.title}`,
    `• ${listing.location}`,
  ];
  if (listing.price) lines.push(`• ${listing.price}`);
  if (listing.url) lines.push(listing.url);
  lines.push("", "Please share more details.");
  return lines.join("\n");
}

/** Turns a set of labelled form fields into a readable message body. */
export function formatFields(heading: string, fields: Array<[string, string | undefined]>) {
  const rows = fields.filter(([, v]) => v && v.trim()).map(([k, v]) => `${k}: ${v!.trim()}`);
  return [heading, "", ...rows].join("\n");
}
