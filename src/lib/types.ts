export type ListingKind = "project" | "resale" | "rental";

export type ProjectStatus = "ready" | "under-construction" | "upcoming";

export interface NearbyPlace {
  name: string;
  distance: string;
  category: "transit" | "school" | "hospital" | "shopping" | "office" | "airport" | "leisure";
}

export interface Configuration {
  label: string; // e.g. "3 BHK" or "Plot"
  bhk?: number;
  area: string; // e.g. "1,450 – 1,620 sq.ft"
  price?: number; // starting price in INR, if published
}

export interface FloorPlan {
  label: string;
  bhk: number;
  area: string;
  /** Optional path to a real floor plan image in /public/images. Falls back to an indicative sketch. */
  image?: string;
}

interface ListingBase {
  slug: string;
  city: string;
  locality: string;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  /** Optional card/thumbnail image (path under /public); falls back to images[0]. */
  cover?: string;
  amenities: string[];
  description: string;
  featured?: boolean;
  /** Sample/demo content — shows a notice until replaced with verified data. */
  isSample?: boolean;
  /** Photos are stand-ins, not of this property — shows a "Representative images" note. */
  representativeImages?: boolean;
}

export interface Project extends ListingBase {
  name: string;
  developer: string;
  developerAbout: string;
  propertyType: "apartment" | "villa" | "plot";
  status: ProjectStatus;
  possession: string;
  reraNumber?: string;
  priceFrom: number;
  priceTo?: number;
  configurations: Configuration[];
  totalUnits: number;
  landArea: string;
  towers?: string;
  highlights: string[];
  floorPlans: FloorPlan[];
  nearby: NearbyPlace[];
  launchedOn: string;
}

export interface ResaleProperty extends ListingBase {
  title: string;
  propertyType: string;
  price: number;
  bhk: number;
  bathrooms: number;
  balconies: number;
  carpetArea: number;
  builtUpArea: number;
  floor: string;
  totalFloors: number;
  facing: string;
  furnishing: "furnished" | "semi-furnished" | "unfurnished";
  furnishingDetails: string[];
  parking: string;
  ageYears: number;
  readyToMove: boolean;
  ownership: string;
  postedOn: string;
}

export interface RentalProperty extends ListingBase {
  title: string;
  propertyType: string;
  rent: number;
  deposit: number;
  maintenance: number;
  bhk: number;
  bathrooms: number;
  carpetArea: number;
  floor: string;
  totalFloors: number;
  furnishing: "furnished" | "semi-furnished" | "unfurnished";
  furnishingDetails: string[];
  parking: string;
  availableFrom: string;
  tenantPreference: string[];
  postedOn: string;
}

export interface InteriorService {
  slug: string;
  title: string;
  summary: string;
  image: string;
  icon: string;
  points: string[];
}

export interface InteriorProject {
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  gallery: string[];
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  context: string;
  quote: string;
}
