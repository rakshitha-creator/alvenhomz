import type { PageBanner } from "./types";

/** Pages with a CMS-managed hero / banner media slot. */
export const BANNER_SLOTS: Array<{
  id: PageBanner["id"];
  label: string;
  path: string;
  /** Local fallback image (key or absolute path) used until CMS media is set. */
  fallbackImage: string;
}> = [
  { id: "home", label: "Home", path: "/", fallbackImage: "/images/Luxury Blue Living Room Family Gathering.png" },
  { id: "new-projects", label: "New Projects", path: "/new-projects/", fallbackImage: "tower-balconies" },
  { id: "resale", label: "Resale Properties", path: "/resale-properties/", fallbackImage: "living-white" },
  { id: "rentals", label: "Rental Properties", path: "/rental-properties/", fallbackImage: "living-blue" },
  { id: "blogs", label: "Blogs", path: "/blogs/", fallbackImage: "living-white" },
  { id: "about", label: "About Us", path: "/about-us/", fallbackImage: "living-penthouse" },
  { id: "contact", label: "Contact Us", path: "/contact-us/", fallbackImage: "workspace-window" },
  { id: "interiors", label: "Interiors", path: "/interiors/", fallbackImage: "living-double-height" },
];

export function getBannerSlot(id: PageBanner["id"]) {
  return BANNER_SLOTS.find((s) => s.id === id);
}
