import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", align === "center" && "items-center text-center sm:flex-col sm:items-center")}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow", light && "text-gold-300")}>{eyebrow}</p>}
        <h2 className={cn("mt-3 text-3xl font-semibold sm:text-4xl", light && "text-white")}>{title}</h2>
        {description && <p className={cn("mt-4 text-base leading-relaxed", light ? "text-white/70" : "text-muted")}>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ViewAll({ href, children = "View all" }: { href: string; children?: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-navy-900">
      {children}
      <ChevronRight className="h-4 w-4 text-gold-600 transition group-hover:translate-x-0.5" />
    </Link>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-navy-800">{it.name}</span>
            ) : (
              <Link href={it.path} className="hover:text-navy-900">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SampleNotice({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 rounded-xl border border-gold-300/60 bg-gold-300/15 px-4 py-3 text-xs leading-relaxed text-navy-800", className)}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
      Sample listing for demonstration. Prices, availability and approvals shown here are illustrative — confirm all details with our team before making decisions.
    </p>
  );
}

export function PageHero({ eyebrow, title, description, image }: { eyebrow: string; title: string; description: string; image: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" fetchPriority="high" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" />
      <div className="container-x py-16 sm:py-20">
        <p className="eyebrow text-gold-300 animate-fade-up">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white animate-fade-up [animation-delay:80ms] sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 animate-fade-up [animation-delay:160ms] sm:text-lg">{description}</p>
      </div>
    </section>
  );
}
