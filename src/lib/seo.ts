import type { Metadata } from "next";
import siteJson from "@/data/site.json";
import { img } from "./utils";

export const absoluteUrl = (path = "/") => `${siteJson.url.replace(/\/$/, "")}${path}`;

/** Build-time metadata with canonical URL and Open Graph / Twitter tags. Paths should end with "/". */
export function pageMetadata({
  title,
  description,
  path,
  image = "villa-night",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(img(image));
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteJson.name,
      locale: "en_IN",
      images: [{ url: ogImage, width: 1400, height: 900, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
