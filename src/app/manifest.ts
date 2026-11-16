import type { MetadataRoute } from "next";
import { site } from "@/lib/data";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: "Buy, rent, design and manage your Bengaluru home with one trusted team.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#2a1c13",
    icons: [
      { src: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/images/brand/logo-dark.png", type: "image/png", sizes: "386x491" },
    ],
  };
}
