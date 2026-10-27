import Link from "next/link";
import { cn } from "@/lib/utils";

/** The official Alven Homz logo (public/images/alvenhomz-logo.png, 505×600). */
export default function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  return (
    <Link href="/" aria-label="Alven Homz home" className={cn("inline-flex shrink-0 items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/alvenhomz-logo.png"
        alt="Alven Homz – Care • Trust • Value"
        width={505}
        height={600}
        className={cn("h-[68px] w-auto", imgClassName)}
      />
    </Link>
  );
}
