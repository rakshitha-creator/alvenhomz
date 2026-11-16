import Link from "next/link";
import { ArrowRight, Building2, Eye, Gem, Home, KeyRound, Sofa, Target } from "lucide-react";
import Reveal from "@/components/Reveal";
import Faq, { type FaqItem } from "@/components/Faq";
import { PageHero, SectionHeading } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = {
  ...pageMetadata({
  title: "About Alven Homz | Bengaluru Property Advisory",
  description:
    "Get to know Alven Homz, a Bengaluru residential property and interiors partner for homebuyers, owners, tenants and clients based overseas.",
  path: "/about-us/",
  image: "living-penthouse",
}),
  title: { absolute: "About Alven Homz | Bengaluru Property Advisory" },
};

const VALUES = [
  { word: "Clarity", text: "We set out the facts that shape a decision, including what's included, what needs confirming and who can provide the latest information." },
  { word: "Consideration", text: "We make room for the way each client lives and works, including the routines, travel plans and family needs that shape a property or design brief." },
  { word: "Accountability", text: "We agree the scope and who handles each part of the work, so clients know what to expect as the plan progresses." },
];

const SERVICES = [
  { label: "Buy a new home", href: "/new-projects/", icon: Building2 },
  { label: "Buy a resale home", href: "/resale-properties/", icon: KeyRound },
  { label: "Rent a home", href: "/rental-properties/", icon: Home },
  { label: "Design your interiors", href: "/interiors/", icon: Sofa },
];

const JOURNEY = [
  { title: "Share your brief", text: "Tell us what you want the property to do: the neighbourhood, the people who'll live there and your timeline." },
  { title: "Compare the details", text: "Work through floor plans, costs and possession or move-in dates side by side, with what still needs confirming set out." },
  { title: "Agree the next step", text: "Agree the scope and who handles each part of the work before anything moves forward." },
  { title: "Prepare the home", text: "From interiors before you move in to readying the home for sale or lease, the same team stays with the plan." },
];

const FAQS: FaqItem[] = [
  {
    q: "Where is Alven Homz based?",
    a: "Alven Homz is based in Sector 6, HSR Layout, Bengaluru. You can reach the team by phone, WhatsApp or email. Contact us in advance to arrange an office visit.",
  },
  {
    q: "Can I approach Alven Homz after buying a home elsewhere?",
    a: "Yes. You can enquire about interior design, leasing or resale for a Bengaluru home you purchased independently. Share its location, current status and the outcome you have in mind.",
  },
  {
    q: "Who does Alven Homz work with?",
    a: "We work with people buying, selling, renting or designing homes in Bengaluru, including homeowners and buyers living abroad. We start with the property and the decision you're working towards.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        bannerId="about"
        eyebrow="About Alven Homz"
        title="A Bengaluru property partner beyond the purchase"
        caption="A relationship that lasts beyond handover."
        description="Alven Homz is a Bengaluru residential property and interior design company. We work with buyers comparing new or resale residences, owners preparing a home for sale or lease, and clients designing apartments and villas. Many of those decisions are connected. A floor plan can shape an interiors brief, and a possession date can determine when you're ready to move in or put a home on the rental market."
        image={img("living-penthouse")}
      />

      {/* Who we are */}
      <section className="container-x grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">Care after the keys</h2>
          <div className="mt-5 flex items-center gap-4">
            <span aria-hidden className="hidden h-px w-10 shrink-0 bg-gold-500 sm:block" />
            <p className="font-display text-lg text-gold-700 italic sm:text-xl">The keys mark the start of a new chapter.</p>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-navy-800">
            Some clients come to us with a floor plan and a handover date. Others are weighing up a sale or preparing an apartment for its first tenant. We
            begin with what you want the property to do and use that brief to work through the decisions in order, from choosing a residence to preparing it
            for the people who&apos;ll live there.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3">
            {SERVICES.map((sv) => (
              <li key={sv.label}>
                <Link
                  href={sv.href}
                  className="group flex h-full items-center gap-3 rounded-xl border border-line bg-white p-3.5 transition hover:border-gold-400 hover:shadow-card"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ivory text-gold-700">
                    <sv.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-sm leading-snug font-semibold text-navy-900">{sv.label}</span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gold-600 opacity-0 transition group-hover:opacity-100" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120} className="relative">
          <span aria-hidden className="absolute -right-3 -bottom-3 hidden h-full w-full rounded-3xl border-2 border-gold-400/60 sm:block" />
          {/* One 4:3 photo (no crop): living room on the left, doorway and keys on the right. Stacks under the copy on mobile. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img("interiors/about-us")}
            srcSet={`${img("interiors/about-us", "sm")} 720w, ${img("interiors/about-us")} 1448w`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            width={1448}
            height={1086}
            alt="A furnished apartment with oak cabinetry and keys on the entry console."
            loading="lazy"
            className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
          />
        </Reveal>
      </section>

      {/* How a brief moves forward */}
      <section className="bg-sand py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="How we work" title="One brief, worked through in order" align="center" />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 70} className="relative rounded-2xl bg-white p-6 shadow-card">
                <span className="font-display text-4xl font-semibold text-gold-500/50">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-sans text-lg font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-800">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Mission, vision, values */}
      <section className="bg-espresso-950 py-20 text-white sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="What drives us" title="Mission, vision and values" align="center" light />
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
              <Target aria-hidden className="absolute -top-4 -right-4 h-32 w-32 text-white/[0.04]" />
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300">
                <Target className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-3xl font-semibold text-white">Our mission</h3>
              <p className="mt-2 font-display text-lg text-gold-300 italic">Clarity at every decision.</p>
              <p className="mt-4 leading-relaxed text-white/75">
                We make residential property and interiors decisions easier to evaluate by starting with a clear brief and explaining the details that affect
                each option. We agree the work involved before the next step.
              </p>
            </Reveal>
            <Reveal delay={80} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
              <Eye aria-hidden className="absolute -top-4 -right-4 h-32 w-32 text-white/[0.04]" />
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300">
                <Eye className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-3xl font-semibold text-white">Our vision</h3>
              <p className="mt-2 font-display text-lg text-gold-300 italic">A partner for the life of your home.</p>
              <p className="mt-4 leading-relaxed text-white/75">
                We aim to be the Bengaluru property and interiors team clients return to as their circumstances change, from choosing their first residence to
                redesigning or leasing a home they already own.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300">
              <Gem className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-4 text-3xl font-semibold text-white">Our values</h3>
            <p className="mt-2 font-display text-lg text-gold-300 italic">Care you can see in the details.</p>
          </div>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal as="li" key={v.word} delay={i * 70} className="rounded-2xl border-t-2 border-gold-400 bg-white/[0.06] p-7">
                <p className="text-xs font-semibold tracking-[0.2em] text-gold-300 uppercase">0{i + 1}</p>
                <h4 className="mt-2 font-display text-2xl font-semibold text-white">{v.word}</h4>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Homeowner stories are hidden until stories with permission to publish are available (copy deck instruction). */}

      {/* Closing enquiry */}
      <section className="container-x py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-espresso-900 p-8 sm:p-12 lg:p-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("living-double-height", "sm")} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Talk to us about your home</h2>
              <p className="mt-2 font-display text-lg text-gold-300 italic">Begin with the home you have in mind.</p>
              <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
                Tell us where you are in the process, whether you have a Bengaluru neighbourhood in mind, an existing property to discuss or a floor plan ready
                for review. We&apos;ll use that as the starting point for the conversation.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <Link href="/contact-us/#enquiry" className="btn-gold">
                Meet Alven Homz <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-sm text-white/70 lg:text-right">
                Living overseas? <Link href="/nri-property-services/" className="font-semibold text-gold-300 underline">NRI property services</Link>
                <br />
                Own a home? <Link href="/property-management/" className="font-semibold text-gold-300 underline">Property management</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-ivory">
        <Faq items={FAQS} />
      </div>
    </>
  );
}
