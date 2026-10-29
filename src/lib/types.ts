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
  amenities: string[];
  description: string;
  featured?: boolean;
  /** Sample/demo content — shows a notice until replaced with verified data. */
  isSample?: boolean;
  /** Photos are stand-ins, not of this property — shows a "Representative images" note. */
  representativeImages?: boolean;
  /** When false, listing is hidden from the public site. Defaults to true for seed/JSON data. */
  published?: boolean;
  /** Optional project/property walkthrough video (Firebase Storage download URL). */
  videoUrl?: string;
  /** Storage object path for deleting the video from admin. */
  videoStoragePath?: string;
}

export interface ProjectFaq {
  question: string;
  answer: string;
}

export interface ProjectContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  note?: string;
}

export interface ProjectTestimonial {
  name: string;
  context?: string;
  quote: string;
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
  /** Optional FAQs shown on the project detail page. */
  faqs?: ProjectFaq[];
  /** Optional project-specific contact overrides. */
  contact?: ProjectContact;
  /** Optional testimonials specific to this project. */
  testimonials?: ProjectTestimonial[];
}

export interface Lead {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  city?: string;
  message?: string;
  listingTitle?: string;
  listingUrl?: string;
  source: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "new" | "contacted" | "closed";
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

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: string;
  published: boolean;
  publishedAt: string;
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
