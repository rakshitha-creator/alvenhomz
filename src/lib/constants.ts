// Option lists shared by filters, cards and detail pages.

export const PROPERTY_TYPES: Record<string, string> = {
  apartment: "Apartment",
  villa: "Villa",
  "independent-house": "Independent House",
  plot: "Plot",
  penthouse: "Penthouse",
  "commercial-office": "Office Space",
  "commercial-shop": "Retail Shop",
};

export const PROJECT_STATUS: Record<string, string> = {
  ready: "Ready to Move",
  "under-construction": "Under Construction",
  upcoming: "Upcoming",
};

export const FURNISHING: Record<string, string> = {
  furnished: "Furnished",
  "semi-furnished": "Semi-Furnished",
  unfurnished: "Unfurnished",
  "not-confirmed": "Under construction",
};

export const TENANT_PREFERENCE: Record<string, string> = {
  family: "Family",
  bachelor: "Bachelors",
  company: "Company Lease",
};

export const BUY_BUDGETS = [
  { label: "Under ₹50 L", min: 0, max: 50_00_000 },
  { label: "₹50 L – ₹1 Cr", min: 50_00_000, max: 1_00_00_000 },
  { label: "₹1 Cr – ₹2 Cr", min: 1_00_00_000, max: 2_00_00_000 },
  { label: "₹2 Cr – ₹5 Cr", min: 2_00_00_000, max: 5_00_00_000 },
  { label: "Above ₹5 Cr", min: 5_00_00_000, max: 0 },
];

export const RENT_BUDGETS = [
  { label: "Under ₹25K", min: 0, max: 25_000 },
  { label: "₹25K – ₹50K", min: 25_000, max: 50_000 },
  { label: "₹50K – ₹1 L", min: 50_000, max: 1_00_000 },
  { label: "₹1 L – ₹2 L", min: 1_00_000, max: 2_00_000 },
  { label: "Above ₹2 L", min: 2_00_000, max: 0 },
];

export const KIND_BASE = {
  project: "/new-projects",
  resale: "/resale-properties",
  rental: "/rental-properties",
} as const;
