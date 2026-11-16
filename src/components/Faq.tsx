import { ChevronDown } from "lucide-react";
import JsonLd from "./JsonLd";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: string };

/**
 * "Frequently asked questions" block: H2 heading, each question an H3 inside a keyboard-operable disclosure.
 * Answers are in the page HTML (closed <details> content is still crawlable), with FAQPage structured data.
 */
export default function Faq({ items, title = "Frequently asked questions", className }: { items: FaqItem[]; title?: string; className?: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq-heading" className={cn("container-x py-16 sm:py-20", className)}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-heading" className="text-3xl font-semibold sm:text-4xl">
          {title}
        </h2>
        <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
          {items.map((f) => (
            <details key={f.q} className="group px-5 py-1 sm:px-6">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
                <h3 className="font-sans text-base font-semibold text-navy-900">{f.q}</h3>
                <ChevronDown className="h-5 w-5 shrink-0 text-gold-600 transition group-open:rotate-180" aria-hidden />
              </summary>
              <p className="pb-5 leading-relaxed text-navy-800">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
