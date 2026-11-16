import { cn } from "@/lib/utils";

/** A heading, caption and body above a row of titled cards (comparison, guidance and owner blocks from the copy deck). */
export function ContentBlock({
  id,
  title,
  caption,
  body,
  cards,
  actions,
  tone = "light",
  className,
}: {
  id?: string;
  title: string;
  caption?: string;
  body?: string;
  cards?: { title: string; text: string }[];
  actions?: React.ReactNode;
  tone?: "light" | "sand" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <section id={id} className={cn("scroll-mt-28 py-16 sm:py-20", tone === "sand" && "bg-sand", dark && "bg-espresso-950 text-white", className)}>
      <div className="container-x">
        <div className="max-w-3xl">
          <h2 className={cn("text-3xl font-semibold sm:text-4xl", dark && "text-white")}>{title}</h2>
          {caption && <p className={cn("mt-3 font-display text-lg italic", dark ? "text-gold-300" : "text-gold-700")}>{caption}</p>}
          {body && <p className={cn("mt-4 leading-relaxed", dark ? "text-white/75" : "text-navy-800")}>{body}</p>}
        </div>
        {cards && cards.length > 0 && (
          <ul className={cn("mt-8 grid gap-5", cards.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
            {cards.map((c) => (
              <li key={c.title} className={cn("rounded-2xl p-6", dark ? "border border-white/10 bg-white/5" : "card")}>
                <h3 className={cn("font-sans text-lg font-semibold", dark ? "text-white" : "text-navy-900")}>{c.title}</h3>
                <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-white/70" : "text-navy-800")}>{c.text}</p>
              </li>
            ))}
          </ul>
        )}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}
