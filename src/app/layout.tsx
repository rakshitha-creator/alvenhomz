import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PublicChrome from "@/components/PublicChrome";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import { img } from "@/lib/utils";

// Fonts are bundled in src/fonts (self-hosted), so builds never depend on Google's servers.
const manrope = localFont({
  src: [{ path: "../fonts/manrope-latin.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
});
const playfair = localFont({
  src: [
    { path: "../fonts/playfair-latin.woff2", weight: "500 700", style: "normal" },
    { path: "../fonts/playfair-italic-latin.woff2", weight: "500 700", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Flats for Sale & Rent in Bengaluru | Interiors – Alven Homz",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  icons: { icon: "/favicon.svg", apple: "/images/alvenhomz-logo.png" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: img("villa-night"), width: 1400, height: 900 }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.name,
  url: site.url,
  logo: absoluteUrl("/images/alvenhomz-logo.png"),
  slogan: "Care • Trust • Value",
  image: absoluteUrl(img("villa-night")),
  description: site.description,
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address,
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560102",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: Number(site.mapQuery.split(",")[0]), longitude: Number(site.mapQuery.split(",")[1]) },
  areaServed: { "@type": "City", name: "Bengaluru" },
  parentOrganization: { "@type": "Organization", name: "Abhee Ventures", url: "https://abheeventures.com/" },
  // Only real profile links (placeholder home pages like instagram.com/ are left out).
  sameAs: Object.values(site.social).filter((u) => /\.(com|in)\/[^/?#]+/.test(u)),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${manrope.variable} ${playfair.variable}`}>
      <body>
        <a href="#main" className="sr-only z-[100] rounded-md bg-espresso-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        <JsonLd data={organizationLd} />
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
