import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({
  className,
  imgClassName,
  variant = "dark",
}: {
  className?: string;
  imgClassName?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Link href="/" aria-label="Alven Homz home" className={cn("inline-flex shrink-0 items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={variant === "light" ? "/images/brand/logo-light.webp" : "/images/brand/logo-dark.webp"}
        alt="Alven Homz – Care • Trust • Value"
        width={521}
        height={640}
        className={cn("h-[68px] w-auto", imgClassName)}
      />
    </Link>
  );
}
