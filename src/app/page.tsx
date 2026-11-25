import Link from "next/link";
import {
  ArrowRight,
  Handshake,
  ListChecks,
  MapPin,
  Phone,
  Quote,
  Scale,
} from "lucide-react";
import Faq, { type FaqItem } from "@/components/Faq";
import { ContentBlock } from "@/components/InfoCards";
import HeroVideo from "@/components/HeroVideo";
import HeroSearch from "@/components/HeroSearch";
import ListingCard from "@/components/ListingCard";
import MobileSlider from "@/components/MobileSlider";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import { SectionHeading, ViewAll } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import {
  interiorServices,
  locationSuggestions,
  popularLocations,
  projectCard,
  resaleCard,
  site,
  testimonials,
} from "@/lib/data";
import { getProjects, getResaleList } from "@/lib/server-data";
import { telHref, whatsappHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { img, initials } from "@/lib/utils";

export const metadata = {
  ...pageMetadata({
    title: "Bengaluru Real Estate & Luxury Interiors | Alven Homz",
    description:
      "Explore new projects, resale homes, rentals and bespoke interiors in Bengaluru. Speak with Alven Homz about your next home or a property you already own.",
    path: "/",
  }),
  title: { absolute: "Bengaluru Real Estate & Luxury Interiors | Alven Homz" },
};

const featured = <T extends { featured: boolean }>(list: T[], n = 3) => list.filter((x) => x.featured).slice(0, n);

const WHY = [
  {
    icon: ListChecks,
    title: "Solutions tailored to your needs",
    text: "Every requirement is unique. Share your preferred location, budget, lifestyle and timelines, and our team will curate suitable options to help you make informed decisions with confidence.",
  },
  {
    icon: Scale,
    title: "Transparency at every step",
    text: "We believe in clear communication and complete transparency. From property pricing to rental agreements and other associated charges, we ensure you have a clear understanding before making a commitment.",
  },
  {
    icon: Handshake,
    title: "A trusted partner beyond the transaction",
    text: "Our relationship doesn't end with a property purchase or handover. From interiors and home improvement to renting, resale and ongoing property management, we stay connected to support your evolving needs.",
  },
];

const HOME_FAQS: FaqItem[] = [
  {
    q: "How do I choose the best real estate consultant in Bangalore?",
    a: "Look for an advisor who knows your preferred neighbourhoods and explains the full cost of each home. At Alven Homz, we help you compare new projects and resale homes by location, budget and possession date.",
  },
  {
    q: "How do I shortlist the best interior designers in Bangalore?",
    a: "Look for layouts that suit your routine and a quote that shows what each room will cost. At Alven Homz, we plan apartment and villa interiors around how you cook, work and host.",
  },
  {
    q: "What should I compare among the top property management companies in Bangalore?",
    a: "Compare who handles viewings, what support continues after handover and how fees are calculated. Alven Homz helps owners prepare homes for rent or resale and agrees the scope and fees upfront.",
  },
  {
    q: "How do I choose the best property consultant in Bangalore for NRI home buyers?",
    a: "Choose a consultant who helps you decide which homes are worth a trip. Alven Homz helps you compare floor plans, prices and possession dates from overseas, then plan viewings around your Bengaluru visit.",
  },
  {
    q: "How can Alven Homz help NRIs sell property in Bangalore from abroad?",
    a: "We help you set an asking price using comparable homes, prepare your property for sale and coordinate viewings with your local keyholder. You review offers from abroad and decide the price and handover terms.",
  },
];

const NEXT_STEPS = [
  { label: "Buy a Home", href: "/new-projects/" },
    { label: "Design Your Home", href: "/interiors/" },

  { label: "Find a Rental", href: "/rental-properties/" },
  { label: "Sell Your Home", href: "/contact-us/?topic=owner#enquiry" },
];

// Homeowner stories stay hidden until stories with permission to publish are available (copy deck instruction).
const SHOW_STORIES = false;

export default async function HomePage() {
  const newProjectsList = featured((await getProjects()).map(projectCard));
  const resaleList = featured((await getResaleList()).map(resaleCard));

  return (
    <>
      {/* Hero */}
      {/* Below lg the video is its own band and the copy sits beneath it; from lg up the copy overlays the video. */}
      <section className="relative isolate z-10 flex flex-col bg-espresso-900 lg:min-h-svh lg:justify-end lg:pt-[120px]">
        <div className="relative isolate h-[max(60svh,360px)] overflow-hidden lg:absolute lg:inset-0 lg:-z-10 lg:h-auto lg:min-h-0">
          <HeroVideo poster="/images/brand/hero-1.webp" mobilePoster="/images/brand/hero-mobile.webp" video="/videos/home-banner.mp4" mobileVideo="/videos/home-banner-mobile.mp4" />
          <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-espresso-900/60 to-transparent lg:hidden" />
          {/* Mobile/tablet: darkens the bottom of the video, where the heading overlaps it, and fades into the copy below. */}
          <div className="absolute inset-x-0 bottom-0 -z-10 h-[45%] bg-gradient-to-t from-espresso-900 via-espresso-900/60 to-transparent lg:hidden" />
          {/* Desktop: shade only along the bottom, where the heading and panel sit. */}
          <div className="absolute inset-x-0 bottom-0 -z-10 hidden h-[55%] bg-gradient-to-t from-espresso-950/85 via-espresso-950/40 to-transparent lg:block" />
        </div>
        <div className="container-x relative -mt-[max(15svh,90px)] pb-8 sm:pb-10 lg:mt-0 lg:pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <div>
              <h1 className="text-[1.75rem] leading-[1.15] font-semibold text-white [text-shadow:0_2px_24px_rgb(28_18_12/0.55)] sm:text-4xl lg:text-[2.4rem]">
                Bengaluru homes, thoughtfully <br className="hidden sm:block" /> chosen and <span className="text-gold-400 italic">designed</span>
              </h1>
              <div className="mt-5 flex items-center justify-center gap-4">
                <p className="font-display text-xl text-gold-300 italic sm:text-2xl">The right address is only the beginning.</p>
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a href="#property-search" className="btn-gold">
                  Search properties
                </a>
                <Link href="/contact-us/#enquiry" className="btn-ghost-light">
                  Speak with an Advisor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro — what Alven Homz does, between the hero and the search */}
      <section aria-labelledby="home-intro" className="container-x pt-14 sm:pt-20">
        <Reveal className="mx-auto max-w-4xl text-center">
          <h2 id="home-intro" className="text-2xl leading-snug font-semibold sm:text-4xl">
            Property Management <span aria-hidden className="mx-3 hidden text-gold-500 sm:inline">|</span>
            <span className="block text-gold-700 italic sm:inline">Interior Solutions</span>
          </h2>
          <span aria-hidden className="mx-auto mt-5 block h-px w-16 bg-gold-400" />
          <p className="mt-5 text-base leading-relaxed text-navy-800 hyphens-none">
            Alven Homz brings property management and interior design together in Bengaluru. We help you explore new residential projects, resale homes
            and premium rentals with your preferred neighbourhood and lifestyle in mind. If you own a home in the city, we can help you sell or rent it out,
            whether you live here or overseas. When you&apos;re ready to move in, we design interiors around the way you live.
          </p>
        </Reveal>
      </section>

      {/* Property search */}
      <section id="property-search" className="relative z-10 scroll-mt-28 pt-12 sm:pt-14">
        <div className="container-x">
          <p className="eyebrow mb-3">Start with the way you want to live</p>
          <HeroSearch suggestions={locationSuggestions()} />
        </div>
      </section>

      {/* Featured New Projects */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading
          eyebrow="New Launches"
          title="Featured New Projects"
          caption="A closer look at what's taking shape."
          description="Explore new residential projects in Bengaluru by neighbourhood, configuration and stage of construction. Compare the layout, cost and expected possession of each home, then look at the amenities planned for its phase and the journeys you'll make most often."
          action={<ViewAll href="/new-projects/" arrow>Explore New Projects</ViewAll>}
        />
        <MobileSlider label="Featured new projects">
          {newProjectsList.map((p, i) => (
            <li key={p.slug} className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-auto">
              <ListingCard item={p} priority={i === 0} />
            </li>
          ))}
        </MobileSlider>
      </section>

      {/* Featured Resale */}
      <section className="bg-ivory py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Resale"
            title="Featured Resale Properties"
            caption="See the home beyond the floor plan."
            description="Explore owner-listed resale homes in Bengaluru, from ready-to-move residences to units still under construction. For a completed home, look closely at the light, condition and furnishing. For a construction-stage resale, ask about the handover timeline, outstanding payments and transfer process."
            action={<ViewAll href="/resale-properties/" arrow>Explore Resale Homes</ViewAll>}
          />
          <MobileSlider label="Featured resale properties">
            {resaleList.map((p) => (
              <li key={p.slug} className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-auto">
                <ListingCard item={p} />
              </li>
            ))}
          </MobileSlider>
        </div>
      </section>

      {/* Interiors promo */}
      <section className="relative isolate overflow-hidden bg-sand py-20 sm:py-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand/interiors-watermark.webp"
          alt=""
          aria-hidden="true"
          width={540}
          height={900}
          loading="lazy"
          className="pointer-events-none absolute bottom-0 left-0 -z-10 aspect-[540/900] h-[85%] w-auto max-w-none object-contain select-none"
        />
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Interiors Solutions</p>
            <h2 className="mt-4 text-4xl leading-tight font-semibold sm:text-4xl">Interiors designed around your life</h2>
            <p className="mt-3 font-display text-xl text-gold-700 italic">Make the address unmistakably yours.</p>
            <p className="mt-5 max-w-lg leading-relaxed text-navy-800">
              Your home should reflect your personality and lifestyle. At Alven Homz, we blend design, functionality and comfort to create beautiful,
              thoughtfully designed spaces. From complete apartment and villa interiors to modular kitchens, bedrooms, wardrobes and living spaces, every detail
              is crafted around your needs with quality materials and timeless finishes.
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
              <Link href="/interiors/#interior-consultation" className="btn-outline">
                Book an Interior Consultation
              </Link>
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
          <SectionHeading eyebrow="Locations" title="Explore by neighbourhood" caption="The neighbourhood is part of the home." />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularLocations.map((l, i) => (
              <Reveal
                as="li"
                key={l.name}
                delay={i * 80}
                className="sm:last:col-span-2 sm:last:mx-auto sm:last:w-1/2 lg:last:col-span-1 lg:last:mx-0 lg:last:w-auto"
              >
                <div className="group card relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="aspect-[4/3] overflow-hidden bg-sand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img(l.image, "sm")}
                      alt={`${l.name}, Bengaluru`}
                      width={800}
                      height={600}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="flex items-start gap-1.5 font-display text-xl leading-snug font-semibold text-navy-900">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-600" />
                      {/* Stretched link: the whole card opens the homes in this area. */}
                      <Link href={`/new-projects/?q=${encodeURIComponent(l.name)}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                        {l.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-navy-800">{l.description}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                        See homes in {l.name} <ArrowRight className="h-4 w-4 text-gold-600 transition group-hover:translate-x-0.5" />
                      </span>
                      <a
                        href={whatsappHref(`Hi Alven Homz, I'd like to know about your services in ${l.name}.`)}
                        target="_blank"
                        rel="noopener"
                        aria-label={`Ask about ${l.name} on WhatsApp`}
                        className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-espresso-900 transition hover:border-espresso-900"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Why Choose Alven Homz */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading
          eyebrow="Why Alven Homz"
          title="One Team, From Search to Styling"
          caption="Making every property decision simpler, clearer and more rewarding."
          center
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {WHY.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 60}
              className="card p-7 text-center transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-espresso-900 text-gold-400">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold md:flex md:min-h-[3.5rem] md:items-center md:justify-center">{item.title}</h3>
              <p className="mt-3 text-justify text-base leading-relaxed text-muted hyphens-none [text-align-last:center]">{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Homeowner stories (hidden until approved stories exist) */}
      {SHOW_STORIES && (
      <section className="bg-sand/60 py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Homeowner stories"
            title="Homeowner stories"
            caption="Every home began with a different brief."
            description="Read how homeowners approached a purchase, prepared a residence for rent or developed an interior design brief. Each story starts with the decision the client needed to make and the details that helped them move forward."
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
                <p className="mt-4 flex-1 text-base leading-relaxed text-navy-800">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-espresso-900 text-sm font-semibold text-gold-300">
                    {initials(t.name)}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-navy-900">{t.name}</p>
                    <p className="text-xs text-muted">{t.context}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* Contact CTA */}
      <section id="contact" className="container-x py-20 sm:py-24">
        <div className="grid overflow-hidden rounded-3xl bg-espresso-900 lg:grid-cols-[1fr_1.15fr]">
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
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Let&apos;s find the right fit</h2>
              <p className="mt-3 font-display text-lg text-gold-300 italic">Tell us what you&apos;re looking for.</p>
              <p className="mt-4 max-w-md leading-relaxed text-white/75">
                A little insight into your preferences helps us find the right options for you. Share your preferred location in Bengaluru, budget, property
                configuration and expected timeline. Whether you&apos;re exploring a new home, considering a resale or rental property, or planning your interiors,
                our team is here to guide you every step of the way.
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

      {/* Find the right way forward */}
      <ContentBlock
        tone="sand"
        title="Find the right way forward"
        caption="Four ways to make your next move with confidence."
        body="Whether you're looking to buy, rent, sell or design your home, every journey begins with the right guidance. Tell us what you're looking for, and we'll help you explore the right solutions, understand what matters and take the next step with confidence."
        actions={NEXT_STEPS.map((n) => (
          <Link key={n.label} href={n.href} className="btn-outline bg-white">
            {n.label} <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      />

      <p className="container-x -mb-6 pt-10 text-center text-base text-navy-800">
        Living overseas? See <Link href="/nri-property-services/" className="font-semibold text-gold-700 underline">NRI Corner</Link>. Own a home
        you&apos;d like to rent out or sell? See <Link href="/property-management/" className="font-semibold text-gold-700 underline">property management</Link>.
      </p>
      <Faq items={HOME_FAQS} />
    </>
  );
}
