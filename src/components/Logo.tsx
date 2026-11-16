import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The Alven Homz logo. `tagline={false}` uses the lockup without "CARE • TRUST • VALUE", which is unreadable at
 * header size; the footer shows the full logo large enough to read it.
 */
export default function Logo({
  className,
  imgClassName,
  variant = "dark",
  tagline = true,
}: {
  className?: string;
  imgClassName?: string;
  variant?: "dark" | "light";
  tagline?: boolean;
}) {
  const file = `/images/brand/logo-${variant}${tagline ? "" : "-header"}.webp`;
  return (
    <Link href="/" aria-label="Alven Homz home" className={cn("inline-flex shrink-0 items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={file}
        alt="Alven Homz – Care • Trust • Value"
        width={386}
        height={tagline ? 491 : 430}
        className={imgClassName ?? (tagline ? "h-[76px] w-auto" : "h-[64px] w-auto")}
      />
    </Link>
  );
}
