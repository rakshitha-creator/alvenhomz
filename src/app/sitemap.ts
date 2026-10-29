import type { MetadataRoute } from "next";
import { projects, rentalProperties, resaleProperties } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/new-projects/"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/resale-properties/"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/rental-properties/"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/interiors/"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blogs/"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about-us/"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/contact-us/"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];
  return [
    ...pages,
    ...projects.map((p) => ({ url: absoluteUrl(`/new-projects/${p.slug}/`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...resaleProperties.map((p) => ({ url: absoluteUrl(`/resale-properties/${p.slug}/`), lastModified: new Date(p.postedOn), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...rentalProperties.map((p) => ({ url: absoluteUrl(`/rental-properties/${p.slug}/`), lastModified: new Date(p.postedOn), changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
