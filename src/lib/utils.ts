export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Formats INR amounts the Indian way: ₹1.25 Cr, ₹85 L, ₹45,000 */
export function formatINR(value?: number | null, opts: { short?: boolean } = {}) {
  if (value === undefined || value === null || Number.isNaN(value)) return "Price on request";
  const short = opts.short ?? true;
  if (short && value >= 1_00_00_000) return `₹${trim(value / 1_00_00_000)} Cr`;
  if (short && value >= 1_00_000) return `₹${trim(value / 1_00_000)} L`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function trim(n: number) {
  return n.toFixed(2).replace(/\.?0+$/, "");
}

export function formatPriceRange(min?: number, max?: number) {
  if (!min && !max) return "Price on request";
  if (min && max && max > min) return `${formatINR(min)} – ${formatINR(max)}`;
  return formatINR(min || max);
}

export function formatArea(value?: number | null, unit = "sq.ft") {
  if (!value) return "—";
  return `${Math.round(value).toLocaleString("en-IN")} ${unit}`;
}

export function formatDate(value?: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", opts);
}

export function titleCase(input?: string) {
  if (!input) return "";
  return input.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function bhkLabel(bhk?: number) {
  if (!bhk) return "";
  return `${bhk} BHK`;
}

/** Path to a photo in /public/images. "sm" is the 720px card/thumbnail variant. */
export function img(name: string, size: "lg" | "sm" = "lg") {
  if (name.startsWith("/") || name.startsWith("http")) return name;
  return `/images/${name}${size === "sm" ? "-sm" : ""}.webp`;
}

/** "Anitha & Ramesh Gowda" → "AR" */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
