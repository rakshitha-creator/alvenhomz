import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building,
  Handshake,
  MapPin,
  Paintbrush,
  Phone,
  Quote,
  Scale,
  ShieldCheck,
} from "lucide-react";
import HeroSearch from "@/components/HeroSearch";
import ListingCard from "@/components/ListingCard";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import { SectionHeading, ViewAll } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import {
  interiorServices,
  locationSuggestions,
  popularLocations,
  projectCards,
  resaleCards,
  site,
  testimonials,
} from "@/lib/data";
import { telHref, whatsappHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { img, initials } from "@/lib/utils";

export const metadata = {
  ...pageMetadata({
    title: "Alven Homz – Find Your Perfect Space | New Projects, Resale, Rentals & Interiors",
    description:
      "Explore new launch projects, resale homes and rental properties across Bangalore — Sarjapur Road, Gunjur, Bommasandra and more — plus interior design, rental, resale and property management by Alven Homz.",
    path: "/",
  }),
  title: { absolute: "Alven Homz – Find Your Perfect Space | New Projects, Resale, Rentals & Interiors" },
};

const featured = <T extends { featured: boolean }>(list: T[], n = 3) => list.filter((x) => x.featured).slice(0, n);

const WHY = [
  { icon: BadgeCheck, title: "Diligence before display", text: "We review documents, approvals and pricing before a property is presented to you." },
  { icon: Scale, title: "Honest, data-led advice", text: "Clear comparisons on price, location and rental yield — never pressure selling." },
  { icon: Handshake, title: "End-to-end assistance", text: "Site visits, negotiation, home loans, documentation and registration support." },
  { icon: Paintbrush, title: "Interiors under one roof", text: "Move from keys to a finished home with Alven Homz." },
  { icon: ShieldCheck, title: "Transparent costs", text: "Rent, deposit, maintenance and charges spelled out upfront." },
  { icon: Building, title: "New, resale & rental", text: "One trusted advisor for every stage — buying, renting or investing." },
];

export default function HomePage() {
  const newProjectsList = featured(projectCards());
  const resaleList = featured(resaleCards());

  return (
    <>
      {/* Hero */}
      <section className="relative isolate z-10 flex h-[calc(100svh-88px-9rem)] min-h-[520px] md:h-[calc(100svh-88px-7.5rem)] flex-col justify-end bg-espresso-900">
        <div className="absolute inset-0 -z-10 isolate overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/brand/hero-1.webp"
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          >
            <source src="/videos/home-banner.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-espresso-900/30 to-transparent" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-espresso-900/30 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-gradient-to-t from-espresso-900/90 via-espresso-900/50 via-50% to-transparent md:h-[55%] md:from-espresso-900/80 md:via-espresso-900/35" />
        </div>
        <div className="container-x pb-8 sm:pb-10">
          <div className="grid items-end gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
            <h1 className="animate-fade-up text-4xl leading-[1.06] font-semibold text-white [text-shadow:0_2px_24px_rgb(42_28_19/0.6)] sm:text-5xl lg:text-6xl">
              Find Your Perfect Space with <span className="text-gold-400 italic">Alven Homz</span>
            </h1>
            <p className="animate-fade-up border-l-2 border-gold-500 pl-4 text-base leading-relaxed text-white/90 [text-shadow:0_1px_12px_rgb(42_28_19/0.7)] [animation-delay:120ms] sm:text-lg lg:mb-2">
              Explore New Projects, Resale Homes, Rentals &amp; Premium Interiors.
            </p>
          </div>
        </div>
        <div className="container-x relative -mb-24 animate-fade-up [animation-delay:220ms] md:-mb-20">
          <HeroSearch suggestions={locationSuggestions()} />
        </div>
      </section>

      {/* Featured New Projects */}
      <section className="container-x pt-40 pb-20 sm:pt-36 sm:pb-24">
        <SectionHeading
          eyebrow="New Launches"
          title="Featured New Projects"
          description="Handpicked new-launch and under-construction projects from reputed developers."
          action={<ViewAll href="/new-projects/" arrow>All new projects</ViewAll>}
        />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newProjectsList.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 80}>
              <ListingCard item={p} priority={i === 0} />
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Featured Resale */}
      <section className="bg-ivory py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Resale"
            title="Featured Resale Properties"
            description="Ready homes in established neighbourhoods — move in without the wait."
            action={<ViewAll href="/resale-properties/" arrow>All resale properties</ViewAll>}
          />
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resaleList.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 80}>
                <ListingCard item={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Interiors promo */}
      <section className="relative isolate overflow-hidden bg-sand py-20 sm:py-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand/interiors-watermark.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[85%] w-auto select-none"
        />
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Alven Homz</p>
            <h2 className="mt-4 text-4xl leading-tight font-semibold sm:text-5xl">
              Transform Your House into a <span className="text-gold-600 italic">Dream Home.</span>
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted">
              From modular kitchens to complete villa interiors, our designers create spaces that are elegant, functional and entirely yours.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {interiorServices.map((s) => (
                <li key={s.slug} className="flex items-center gap-2.5 text-sm text-navy-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> {s.title}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/interiors/" className="btn-gold">
                Explore Interiors <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappHref("Hi Alven Homz Interiors, I'd like a free interior consultation.")}
                target="_blank"
                rel="noopener"
                className="btn-outline"
              >
                <WhatsAppIcon className="h-4 w-4" /> Free consultation
              </a>
            </div>
          </Reveal>
          <Reveal delay={120} className="grid h-[440px] grid-cols-3 grid-rows-4 gap-3 sm:h-[560px] sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/interiors-4.webp"
              alt="Sage-green modular kitchen with island"
              loading="lazy"
              className="h-full w-full rounded-2xl object-cover col-start-1 row-span-3"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/interiors-1.webp"
              alt="Warm living room with ring chandelier"
              loading="lazy"
              className="h-full w-full rounded-2xl object-cover col-span-2 col-start-2 row-span-2 row-start-1"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/interiors-2.webp"
              alt="Dining room with glass pendant lights"
              loading="lazy"
              className="h-full w-full rounded-2xl object-cover col-start-1 row-start-4"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/interiors-3.webp"
              alt="Lounge with sculptural chandelier"
              loading="lazy"
              className="h-full w-full rounded-2xl object-cover col-start-2 row-span-2 row-start-3"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/interiors-5.webp"
              alt="Living room with TV wall and accent chairs"
              loading="lazy"
              className="h-full w-full rounded-2xl object-cover col-start-3 row-span-2 row-start-3"
            />
          </Reveal>
        </div>
      </section>

      {/* Popular locations */}
      <section className="bg-ivory py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Locations"
            title="Popular Locations"
            description="Interiors, rental, resale and property management across Bangalore's growing neighbourhoods."
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularLocations.map((l, i) => (
              <Reveal
                as="li"
                key={l.name}
                delay={i * 80}
                className="sm:last:col-span-2 sm:last:mx-auto sm:last:w-1/2 lg:last:col-span-1 lg:last:mx-0 lg:last:w-auto"
              >
                <a
                  href={whatsappHref(`Hi Alven Homz, I'd like to know about your services in ${l.name}.`)}
                  target="_blank"
                  rel="noopener"
                  className="group card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-sand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img(l.image)}
                      alt={`${l.name}, Bangalore`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-start gap-1.5 font-display text-xl leading-snug font-semibold text-navy-900">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-600" />
                      {l.name}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-gold-600">{l.blurb}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{l.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-navy-900">
                      Enquire <ArrowRight className="h-4 w-4 text-gold-600 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Why Choose Alven Homz */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading
          eyebrow="Why Alven Homz"
          title="Why Choose Alven Homz"
          description="A premium advisory experience built on transparency, local expertise and care."
          center
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 60}
              className="card p-7 text-center transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Testimonials */}
      <section className="bg-sand/60 py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Testimonials"
            title="What our homeowners say"
            action={<ViewAll href="/about-us/">More stories</ViewAll>}
          />
          <ul className="grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal
                as="li"
                key={t.name}
                delay={i * 60}
                className="card flex flex-col p-6"
              >
                <Quote className="h-8 w-8 text-gold-500" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-navy-800">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-gold-300">
                    {initials(t.name)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{t.name}</p>
                    <p className="text-xs text-muted">{t.context}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="container-x py-20 sm:py-24">
        <div className="grid overflow-hidden rounded-3xl bg-navy-900 lg:grid-cols-[1fr_1.15fr]">
          <div className="relative p-8 text-white sm:p-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/living-double-height-sm.webp"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="relative">
              <p className="eyebrow text-gold-300">Talk to an advisor</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Schedule a site visit or get expert advice
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/70">
                Tell us what you&apos;re looking for and we&apos;ll reply on WhatsApp or email with options that match your brief.
              </p>
              <div className="mt-8 grid gap-3 sm:max-w-xs">
                <a href={telHref()} className="btn-gold">
                  <Phone className="h-4 w-4" /> Call {site.phone}
                </a>
                <a
                  href={whatsappHref("Hi Alven Homz, I'd like to schedule a site visit.")}
                  target="_blank"
                  rel="noopener"
                  className="btn-whatsapp"
                >
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp us
                </a>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 sm:p-10">
            <LeadForm variant="contact" />
          </div>
        </div>
      </section>
    </>
  );
}
