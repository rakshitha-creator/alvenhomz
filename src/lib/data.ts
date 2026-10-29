import projectsJson from "@/data/newProjects.json";
import resaleJson from "@/data/resaleProperties.json";
import rentalJson from "@/data/rentalProperties.json";
import interiorsJson from "@/data/interiors.json";
import testimonialsJson from "@/data/testimonials.json";
import locationsJson from "@/data/locations.json";
import siteJson from "@/data/site.json";
import type {
  InteriorProject,
  InteriorService,
  ListingKind,
  ProcessStep,
  Project,
  RentalProperty,
  ResaleProperty,
  Testimonial,
} from "./types";
import { FURNISHING, KIND_BASE, PROJECT_STATUS, PROPERTY_TYPES } from "./constants";
import { bhkLabel, formatArea, formatINR } from "./utils";

export const site = siteJson;
export const projects = projectsJson as Project[];
export const resaleProperties = resaleJson as ResaleProperty[];
export const rentalProperties = rentalJson as RentalProperty[];
export const interiorServices = interiorsJson.services as InteriorService[];
export const interiorPortfolio = interiorsJson.portfolio as InteriorProject[];
export const interiorProcess = interiorsJson.process as ProcessStep[];
export const testimonials = testimonialsJson as Testimonial[];
export const popularLocations = locationsJson;

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getResale = (slug: string) => resaleProperties.find((p) => p.slug === slug);
export const getRental = (slug: string) => rentalProperties.find((p) => p.slug === slug);

/** Flattened shape used by cards and the client-side search/filter engine. */
export interface ListingCardData {
  kind: ListingKind;
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  city: string;
  locality: string;
  image: string;
  price: number;
  priceLabel: string;
  priceNote: string;
  bhks: number[];
  propertyType: string;
  typeLabel: string;
  status?: string;
  statusLabel?: string;
  furnishing?: string;
  tenantPreference?: string[];
  specs: string[];
  date: string;
  featured: boolean;
  isSample: boolean;
}

export function projectCard(p: Project): ListingCardData {
  const bhks = p.configurations.map((c) => c.bhk).filter((b): b is number => !!b);
  // "2 BHK", "2.5 BHK" … → "2, 2.5 BHK"; keeps half-BHK variants that the numeric bhk can't express.
  const bhkLabels = [...new Set(p.configurations.map((c) => c.label.match(/^([\d.]+) BHK/)?.[1]).filter(Boolean))];
  const configText = p.propertyType === "plot" ? "Plots" : bhkLabels.length ? `${bhkLabels.join(", ")} BHK` : `${[...new Set(bhks)].join(", ")} BHK`;
  return {
    kind: "project",
    slug: p.slug,
    href: `${KIND_BASE.project}/${p.slug}/`,
    title: p.name,
    subtitle: `by ${p.developer}`,
    city: p.city,
    locality: p.locality,
    image: p.cover ?? p.images[0],
    price: p.priceFrom,
    priceLabel: formatINR(p.priceFrom),
    priceNote: "onwards",
    bhks,
    propertyType: p.propertyType,
    typeLabel: PROPERTY_TYPES[p.propertyType],
    status: p.status,
    statusLabel: PROJECT_STATUS[p.status],
    specs: [configText, p.landArea, p.possession === "To be confirmed" ? "" : `Possession ${p.possession}`],
    date: p.launchedOn,
    featured: !!p.featured,
    isSample: !!p.isSample,
  };
}

export function resaleCard(p: ResaleProperty): ListingCardData {
  return {
    kind: "resale",
    slug: p.slug,
    href: `${KIND_BASE.resale}/${p.slug}/`,
    title: p.title,
    subtitle: PROPERTY_TYPES[p.propertyType] ?? p.propertyType,
    city: p.city,
    locality: p.locality,
    image: p.cover ?? p.images[0],
    price: p.price,
    priceLabel: formatINR(p.price),
    priceNote: `₹${Math.round(p.price / p.builtUpArea).toLocaleString("en-IN")}/sq.ft`,
    bhks: p.bhk ? [p.bhk] : [],
    propertyType: p.propertyType,
    typeLabel: PROPERTY_TYPES[p.propertyType] ?? p.propertyType,
    furnishing: p.furnishing,
    specs: [p.bhk ? bhkLabel(p.bhk) : PROPERTY_TYPES[p.propertyType], formatArea(p.builtUpArea), FURNISHING[p.furnishing]],
    date: p.postedOn,
    featured: !!p.featured,
    isSample: !!p.isSample,
  };
}

export function rentalCard(p: RentalProperty): ListingCardData {
  return {
    kind: "rental",
    slug: p.slug,
    href: `${KIND_BASE.rental}/${p.slug}/`,
    title: p.title,
    subtitle: PROPERTY_TYPES[p.propertyType] ?? p.propertyType,
    city: p.city,
    locality: p.locality,
    image: p.cover ?? p.images[0],
    price: p.rent,
    priceLabel: formatINR(p.rent, { short: false }),
    priceNote: "/ month",
    bhks: p.bhk ? [p.bhk] : [],
    propertyType: p.propertyType,
    typeLabel: PROPERTY_TYPES[p.propertyType] ?? p.propertyType,
    furnishing: p.furnishing,
    tenantPreference: p.tenantPreference,
    specs: [p.bhk ? bhkLabel(p.bhk) : PROPERTY_TYPES[p.propertyType], formatArea(p.carpetArea), FURNISHING[p.furnishing]],
    date: p.postedOn,
    featured: !!p.featured,
    isSample: !!p.isSample,
  };
}

export const projectCards = () => projects.map(projectCard);
export const resaleCards = () => resaleProperties.map(resaleCard);
export const rentalCards = () => rentalProperties.map(rentalCard);

/** Same city first, then same type, then closest price. */
export function similar<T extends { slug: string; city: string; propertyType: string }>(
  items: T[],
  current: T,
  price: (x: T) => number,
  count = 3,
) {
  const base = price(current);
  return items
    .filter((x) => x.slug !== current.slug)
    .map((x) => ({
      x,
      score:
        (x.city === current.city ? 0 : 2) +
        (x.propertyType === current.propertyType ? 0 : 1) +
        Math.abs(price(x) - base) / Math.max(base, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map((s) => s.x);
}

export function allCities() {
  return [...new Set([...projects, ...resaleProperties, ...rentalProperties].map((p) => p.city))].sort();
}

/** Suggestions for the location search box: "Locality, City" plus bare city names. */
export function locationSuggestions() {
  const set = new Set<string>();
  for (const p of [...projects, ...resaleProperties, ...rentalProperties]) {
    set.add(p.city);
    set.add(`${p.locality}, ${p.city}`);
  }
  return [...set].sort();
}
