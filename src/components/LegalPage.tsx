import Link from "next/link";
import { PageHero } from "@/components/ui";
import { img } from "@/lib/utils";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/** Shared layout for the Privacy Policy and Terms & Conditions pages: banner, sticky contents list and readable body copy. */
export default function LegalPage({
  eyebrow,
  title,
  description,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} image={img("workspace-window")} />

      <section className="container-x grid gap-12 py-16 sm:py-20 lg:grid-cols-[240px_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-[120px]">
            <p className="eyebrow">Contents</p>
            <ol className="mt-4 space-y-2.5 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-2 text-muted transition hover:text-espresso-900">
                    <span className="w-5 shrink-0 text-gold-600">{i + 1}.</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="max-w-3xl">
          <p className="text-sm text-muted">Last updated: {updated}</p>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-[120px] border-b border-line py-8 last:border-0">
              <h2 className="text-2xl font-semibold sm:text-[1.7rem]">
                <span className="mr-2 text-gold-600">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-navy-800 [&_a]:font-semibold [&_a]:text-gold-600 [&_a]:underline [&_li]:pl-1 [&_strong]:text-navy-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {s.body}
              </div>
            </section>
          ))}
          <p className="mt-8 text-sm text-muted">
            See also: <Link href="/privacy-policy/" className="font-semibold text-gold-600 underline">Privacy Policy</Link> ·{" "}
            <Link href="/terms-and-conditions/" className="font-semibold text-gold-600 underline">Terms &amp; Conditions</Link>
          </p>
        </article>
      </section>
    </>
  );
}
