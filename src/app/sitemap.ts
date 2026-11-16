import type { MetadataRoute } from "next";
import { getBlogs, getProjects, getRentalList, getResaleList } from "@/lib/server-data";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** Real last-modified dates where we have them (admin save time, listing date, blog date); otherwise left out. */
const date = (...candidates: (string | undefined)[]) => {
  const d = candidates.map((c) => (c ? new Date(c) : null)).find((x) => x && !Number.isNaN(x.getTime()));
  return d ?? undefined;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, resale, rentals, blogs] = await Promise.all([getProjects(), getResaleList(), getRentalList(), getBlogs()]);
  const newest = (xs: (Date | undefined)[]) => xs.filter(Boolean).sort((a, b) => b!.getTime() - a!.getTime())[0];
  const projectDates = projects.map((p) => date(p.liveUpdatedAt, p.launchedOn));
  const resaleDates = resale.map((p) => date(p.liveUpdatedAt, p.postedOn));
  const rentalDates = rentals.filter((p) => !p.isSample).map((p) => date(p.liveUpdatedAt, p.postedOn));
  const blogDates = blogs.map((b) => date(b.publishedAt));

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: newest([...projectDates, ...resaleDates]), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/new-projects/"), lastModified: newest(projectDates), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/resale-properties/"), lastModified: newest(resaleDates), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/rental-properties/"), lastModified: newest(rentalDates), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/interiors/"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blogs/"), lastModified: newest(blogDates), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about-us/"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/contact-us/"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/careers/"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/nri-property-services/"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/property-management/"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/privacy-policy/"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms-and-conditions/"), changeFrequency: "yearly", priority: 0.3 },
  ];
  return [
    ...pages,
    ...projects.map((p, i) => ({ url: absoluteUrl(`/new-projects/${p.slug}/`), lastModified: projectDates[i], changeFrequency: "weekly" as const, priority: 0.8 })),
    ...resale.map((p, i) => ({ url: absoluteUrl(`/resale-properties/${p.slug}/`), lastModified: resaleDates[i], changeFrequency: "weekly" as const, priority: 0.7 })),
    ...rentals.filter((p) => !p.isSample).map((p) => ({ url: absoluteUrl(`/rental-properties/${p.slug}/`), lastModified: date(p.liveUpdatedAt, p.postedOn), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...blogs.map((b, i) => ({ url: absoluteUrl(`/blogs/${b.slug}/`), lastModified: blogDates[i], changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
