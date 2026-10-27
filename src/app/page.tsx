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
  rentalCards,
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
  { icon: Paintbrush, title: "Interiors under one roof", text: "Move from keys to a finished home with Alven Homz Interiors." },
  { icon: ShieldCheck, title: "Transparent costs", text: "Rent, deposit, maintenance and charges spelled out upfront." },
  { icon: Building, title: "New, resale & rental", text: "One trusted advisor for every stage — buying, renting or investing." },
];

export default function HomePage() {

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-navy-950 lg:min-h-[720px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/Luxury Blue Living Room Family Gathering.png" alt="Family gathered on a sofa in a luxury blue living room" className="absolute inset-0 -z-10 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-navy-950/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy-950/70 to-transparent" />
        <div className="container-x py-20">
          <h1 className="max-w-3xl animate-fade-up text-4xl leading-[1.08] font-semibold text-white [animation-delay:80ms] sm:text-6xl">
            Find Your Perfect Space with <span className="text-gold-400 italic">Alven Homz</span>
          </h1>
          <p className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-white/80 [animation-delay:160ms] sm:text-lg">
            Explore New Projects, Resale Homes, Rentals & Premium Interiors.
          </p>
          <div className="mt-10 animate-fade-up [animation-delay:240ms]">
            <HeroSearch suggestions={locationSuggestions()} />
          </div>
        </div>
      </section>

      {/* Featured New Projects */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading
          eyebrow="New Launches"
          title="Featured New Projects"
          description="Handpicked new-launch and under-construction projects from reputed developers."
          action={<ViewAll href="/new-projects/">All new projects</ViewAll>}
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured(projectCards()).map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 80}>
              <ListingCard item={p} />
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
          action={<ViewAll href="/resale-properties/">All resale properties</ViewAll>}
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured(resaleCards()).map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 80}>
              <ListingCard item={p} />
            </Reveal>
          ))}
        </ul>
        </div>
      </section>

      {/* Interiors promo */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-gold-300">Alven Homz Interiors</p>
            <h2 className="mt-4 text-4xl leading-tight font-semibold text-white sm:text-5xl">
              Transform Your House into a <span className="text-gold-400 italic">Dream Home.</span>
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-white/70">
              From modular kitchens to complete villa interiors, our designers create spaces that are elegant, functional and entirely yours.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {interiorServices.map((s) => (
                <li key={s.slug} className="flex items-center gap-2.5 text-sm text-white/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> {s.title}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/interiors/" className="btn-gold">
                Explore Interiors <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={whatsappHref("Hi Alven Homz Interiors, I'd like a free interior consultation.")} target="_blank" rel="noopener" className="btn-ghost-light">
                <WhatsAppIcon className="h-4 w-4" /> Free consultation
              </a>
            </div>
          </Reveal>
          <Reveal delay={120} className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img("living-gallery", "sm")} alt="Styled living room with gallery wall" loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover" />
            <div className="grid gap-4 pt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img("kitchen-island", "sm")} alt="White modular kitchen with island" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img("bedroom-luxe", "sm")} alt="Luxury bedroom interior" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Rentals */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading
          eyebrow="Rentals"
          title="Featured Rental Properties"
          description="Apartments, villas and commercial spaces with rent, deposit and maintenance shown clearly."
          action={<ViewAll href="/rental-properties/">All rentals</ViewAll>}
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured(rentalCards()).map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 80}>
              <ListingCard item={p} />
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Popular locations */}
      <section className="bg-ivory py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Locations" title="Popular Locations" description="Interiors, rental, resale and property management across Bangalore's growing neighbourhoods." />
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
                  className="group relative flex h-[24rem] items-end overflow-hidden rounded-2xl bg-navy-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 sm:h-[25rem] lg:h-[26rem]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(l.image, "sm")} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 z-10">
                    <div className="absolute inset-x-0 bottom-0 flex h-[9.6rem] flex-col rounded-t-xl border-x border-t border-white/20 bg-navy-950/55 p-2 backdrop-blur-sm sm:h-[10rem] sm:p-2.5 lg:h-[10.4rem] lg:p-2.5">
                      <div className="flex flex-col items-start">
                        <p className="flex h-5 min-w-0 items-start gap-1 font-display text-base leading-5 font-semibold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.9)] sm:h-6 sm:text-lg sm:leading-6">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                          <span className="line-clamp-1 min-w-0">{l.name}</span>
                        </p>
                        <p className="mt-0.5 h-4 line-clamp-1 text-[11px] leading-4 font-semibold text-gold-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)] sm:text-xs">{l.blurb}</p>
                      </div>
                      <p className="mt-0.5 min-h-0 line-clamp-3 text-[11px] leading-[1.2] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">{l.description}</p>
                      <span className="mt-1 inline-flex h-4 shrink-0 items-center gap-1 text-[11px] font-semibold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.9)] sm:h-5 sm:text-xs">
                        Enquire <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Why choose */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading eyebrow="Why Alven Homz" title="Why Choose Alven Homz" description="A premium advisory experience built on transparency, local expertise and care." align="center" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <Reveal as="li" key={w.title} delay={i * 60} className="card p-7 transition hover:-translate-y-1 hover:shadow-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <w.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.text}</p>
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
              <Reveal as="li" key={t.name} delay={i * 60} className="card flex flex-col p-6">
                <Quote className="h-8 w-8 text-gold-500" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-navy-800">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-gold-300">{initials(t.name)}</span>
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
            <img src={img("living-double-height", "sm")} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />
            <div className="relative">
              <p className="eyebrow text-gold-300">Talk to an advisor</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Schedule a site visit or get expert advice</h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/70">
                Tell us what you&apos;re looking for and we&apos;ll reply on WhatsApp or email with options that match your brief.
              </p>
              <div className="mt-8 grid gap-3 sm:max-w-xs">
                <a href={telHref()} className="btn-gold">
                  <Phone className="h-4 w-4" /> Call {site.phone}
                </a>
                <a href={whatsappHref("Hi Alven Homz, I'd like to schedule a site visit.")} target="_blank" rel="noopener" className="btn-whatsapp">
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
