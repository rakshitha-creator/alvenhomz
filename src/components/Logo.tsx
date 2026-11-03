import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The Alven Homz logo as a horizontal lockup: the gold "A" mark (cropped from the official 521×640 artwork)
 * beside the wordmark set in live text, so "HOMZ" and the tagline stay readable at header and footer sizes.
 * "dark" is for light backgrounds; "light" is for dark backgrounds.
 */
export default function Logo({
  variant = "dark",
  size = "md",
  className,
}: {
  variant?: "dark" | "light";
  size?: "md" | "lg";
  className?: string;
}) {
  const lg = size === "lg";
  return (
    <Link href="/" aria-label="Alven Homz home" className={cn("inline-flex shrink-0 items-center", lg ? "gap-4" : "gap-3", className)}>
      {/* The mark spans x 160–375, y 0–345 of the artwork; show only that box. */}
      <span aria-hidden className={cn("relative block aspect-[215/345] overflow-hidden", lg ? "h-20" : "h-14")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/brand/logo-${variant}.webp`}
          alt=""
          width={521}
          height={640}
          className="absolute top-0 left-[-74.4%] h-[185.5%] w-auto max-w-none"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-sans font-bold tracking-[0.06em]",
            lg ? "text-[34px]" : "text-[25px]",
            variant === "dark" ? "text-[#111]" : "text-white",
          )}
        >
          ALVEN
        </span>
        <span
          className={cn(
            "font-sans font-semibold tracking-[0.62em]",
            lg ? "mt-1.5 text-[15px]" : "mt-1 text-[12px]",
            variant === "dark" ? "text-gold-600" : "text-gold-400",
          )}
        >
          HOMZ
        </span>
        <span
          className={cn(
            "font-sans font-medium tracking-[0.08em] whitespace-nowrap",
            lg ? "mt-2 text-[11px]" : "mt-1.5 text-[9px]",
            variant === "dark" ? "text-navy-800" : "text-white/80",
          )}
        >
          CARE • TRUST • VALUE
        </span>
      </span>
    </Link>
  );
}
