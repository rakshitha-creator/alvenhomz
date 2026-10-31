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
    default: `${site.name} – ${site.tagline} | New Projects, Resale, Rentals & Interiors`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["real estate Bangalore", "Sarjapur Road apartments", "new projects", "resale flats", "rental apartments", "luxury villas", "interior design", "Alven Homz", "Alvenhomz"],
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
  address: { "@type": "PostalAddress", streetAddress: site.address, addressCountry: "IN" },
  sameAs: Object.values(site.social),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${manrope.variable} ${playfair.variable}`}>
      <body>
        <a href="#main" className="sr-only z-[100] rounded-md bg-navy-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        <JsonLd data={organizationLd} />
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
