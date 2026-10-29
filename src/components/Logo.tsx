import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The official Alven Homz logo (521×640, transparent background).
 * "dark" has black lettering for light backgrounds; "light" has white lettering for dark backgrounds.
 */
export default function Logo({
  variant = "dark",
  className,
  imgClassName,
}: {
  variant?: "dark" | "light";
  className?: string;
  imgClassName?: string;
}) {
  return (
    <Link href="/" aria-label="Alven Homz home" className={cn("inline-flex shrink-0 items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/brand/logo-${variant}.webp`}
        alt="Alven Homz – Care • Trust • Value"
        width={521}
        height={640}
        className={cn("h-[68px] w-auto", imgClassName)}
      />
    </Link>
  );
}
