import Link from "next/link";
import { ArrowRight, Building2, Eye, Gem, Home, KeyRound, Sofa, Target } from "lucide-react";
import Reveal from "@/components/Reveal";
import Faq, { type FaqItem } from "@/components/Faq";
import BannerMedia from "@/components/BannerMedia";
import { SectionHeading } from "@/components/ui";
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
  { word: "Clarity", text: "We provide transparent information and clear guidance to help clients make confident decisions." },
  { word: "Consideration", text: "We understand individual needs and lifestyles to deliver solutions that truly matter." },
  { word: "Accountability", text: "We take ownership of our commitments, ensuring clear responsibilities and dependable service throughout." },
];

const SERVICES = [
  { label: "Buy a new home", href: "/new-projects/", icon: Building2 },
  { label: "Buy a resale home", href: "/resale-properties/", icon: KeyRound },
  { label: "Rent a home", href: "/rental-properties/", icon: Home },
  { label: "Design your interiors", href: "/interiors/", icon: Sofa },
];

const JOURNEY = [
  { title: "Share your brief", text: "Tell us your property needs, preferred location, budget and timeline." },
  { title: "Explore the options", text: "Review suitable properties, plans, costs and timelines to make informed decisions." },
  { title: "Define the way forward", text: "Finalise the requirements, scope of work and responsibilities before proceeding." },
  { title: "Bring the plan to life", text: "From interior execution to preparing your property for sale or rent, we ensure a smooth and coordinated experience." },
];

const FAQS: FaqItem[] = [
  {
    q: "Where is Alven Homz based?",
    a: "Alven Homz is based in Sector 6, HSR Layout, Bengaluru. You can reach the team by phone, WhatsApp or email. Contact us in advance to arrange an office visit.",
  },
  {
    q: "Can I approach Alven Homz after buying a home elsewhere?",
    a: "Yes. You can enquire about interior design, renting out or resale for a Bengaluru home you purchased independently. Share its location, current status and the outcome you have in mind.",
  },
  {
    q: "Who does Alven Homz work with?",
    a: "We work with people buying, selling, renting or designing homes in Bengaluru, including homeowners and buyers living abroad. We start with the property and the decision you're working towards.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero — the photo on its own; the page heading sits in the intro section below. */}
      <section aria-label="About Alven Homz" className="relative isolate h-[58svh] min-h-[360px] overflow-hidden bg-espresso-950 sm:h-[68svh] lg:h-[78svh]">
        <BannerMedia pageId="about" fallback="living-penthouse" alt="A bright Bengaluru living room prepared by Alven Homz" priority />
        {/* Light shade at the top only, so the menu stays readable over the photo. */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-espresso-950/85 via-espresso-950/40 to-transparent" />
      </section>

      {/* Intro — photo on the left, the page heading and story on the right */}
      <section className="bg-ivory">
        <div className="container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-24">
          <Reveal className="relative">
            <span aria-hidden className="absolute -bottom-3 -left-3 hidden h-full w-full rounded-3xl border-2 border-gold-400/60 sm:block" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img("dining-living")}
              srcSet={`${img("dining-living", "sm")} 800w, ${img("dining-living")} 1600w`}
              sizes="(min-width: 1024px) 45vw, 100vw"
              alt="An open living and dining space in a Bengaluru home"
              loading="lazy"
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
            />
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow">About Alven Homz</p>
            <h1 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">A Bengaluru property partner beyond the purchase</h1>
            <p className="mt-3 font-display text-lg text-gold-700 italic">Your home journey deserves a partner for every step.</p>
            <p className="mt-5 text-base leading-relaxed text-navy-800 hyphens-none max-sm:text-left">
              Alven Homz brings residential property solutions and personalised interior services together under one roof in Bengaluru. Whether you are
              looking to buy a new or resale home, sell or rent out your property, or design a space that reflects your lifestyle, we make the journey simpler
              and more seamless.
            </p>
            <p className="mt-4 text-base leading-relaxed text-navy-800 hyphens-none max-sm:text-left">
              From finding the right property to transforming it into a home or maximising its value through sale or rental, we stay connected to your
              needs at every stage of homeownership.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact-us/#enquiry" className="btn-primary">
                Speak with an Advisor <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/new-projects/" className="btn-outline">
                Explore Properties
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who we are */}
      <section className="container-x grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">Care after the keys</h2>
          <div className="mt-5 flex items-center gap-4">
            <span aria-hidden className="hidden h-px w-10 shrink-0 bg-gold-500 sm:block" />
            <p className="font-display text-lg text-gold-700 italic">The keys mark the start of a new chapter.</p>
          </div>
          <p className="mt-5 text-base leading-relaxed text-navy-800 hyphens-none max-sm:text-left">
            Some approach us with a floor plan and a handover date, while others are planning a sale or preparing their property for tenants. We
            understand your objectives and guide you through every step, from finding the right home to making it ready for its next chapter.
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
                We simplify property and interior decisions through clear guidance, transparent information and well-defined solutions at every stage.
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
                To be a trusted property and interiors partner in Bengaluru, building lasting relationships as our clients&apos; needs and aspirations evolve.
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
                Share your requirements, preferred location or existing property details. Whether you&apos;re exploring a new home, planning a sale or
                considering interiors, we&apos;re here to help you take the next step with confidence.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <Link href="/contact-us/#enquiry" className="btn-gold">
                Meet Alven Homz <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-sm text-white/70 lg:text-right">
                Living overseas? <Link href="/nri-property-services/" className="font-semibold text-gold-300 underline">NRI Corner</Link>
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
