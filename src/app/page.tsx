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
    title: "A shortlist built around your brief",
    text: "Tell us which neighbourhoods, layouts and timelines work for you. We'll use those details to focus the search and help you compare the homes you're considering.",
  },
  {
    icon: Scale,
    title: "Clarity on costs",
    text: "Ask for an itemised quote for a purchase or a breakdown of rent, maintenance and deposit for a lease. You'll have a clearer basis for comparing two properties.",
  },
  {
    icon: Handshake,
    title: "Continuity after handover",
    text: "The same home may need different things over time. Speak with us about interiors before you move in, or about resale and leasing if your plans change.",
  },
];

const HOME_FAQS: FaqItem[] = [
  {
    q: "What does Alven Homz do in Bengaluru?",
    a: "Alven Homz helps clients buy new and resale homes, find rentals, sell or lease a residence and plan home interiors in Bengaluru. If you already own a property, you can enquire directly about the service you need.",
  },
  {
    q: "Can I enquire if I live overseas?",
    a: "Yes. You can start your Bengaluru property or interiors enquiry from overseas. Share your country, time zone and plans for the home, together with your travel dates if you expect to visit.",
  },
  {
    q: "Can Alven Homz help me shortlist a neighbourhood in Bengaluru?",
    a: "Yes. Share the places you need to reach regularly, your budget and the kind of home you want. We can discuss where to focus your search and which routes to try from each shortlisted property.",
  },
];

const NEXT_STEPS = [
  { label: "Buy a Home", href: "/new-projects/" },
  { label: "Find a Rental", href: "/rental-properties/" },
  { label: "Sell Your Home", href: "/contact-us/?topic=owner#enquiry" },
  { label: "Design Your Home", href: "/interiors/" },
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
        <div className="relative isolate h-[60svh] min-h-[360px] overflow-hidden lg:absolute lg:inset-0 lg:-z-10 lg:h-auto lg:min-h-0">
          <HeroVideo poster="/images/brand/hero-1.webp" video="/videos/home-banner.mp4" mobileVideo="/videos/home-banner-720.mp4" />
          <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-espresso-900/60 to-transparent lg:h-28 lg:from-espresso-900/30" />
          {/* Mobile/tablet: soft fade from the video into the copy below. */}
          <div className="absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t from-espresso-900 to-transparent lg:hidden" />
          {/* Darker on the left and bottom where the text sits, so it stays readable over bright window frames. */}
          <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-espresso-950/85 via-espresso-950/55 to-espresso-950/10 lg:block lg:via-espresso-950/40" />
          <div className="absolute inset-x-0 bottom-0 -z-10 hidden h-[75%] lg:block bg-gradient-to-t from-espresso-950/90 via-espresso-950/45 to-transparent" />
        </div>
        <div className="container-x pt-8 pb-8 sm:pb-10 lg:pt-0 lg:pb-16">
          <div className="grid max-w-3xl gap-8 lg:gap-10">
            <div>
              <h1 className="text-4xl leading-[1.05] font-semibold text-white [text-shadow:0_2px_24px_rgb(28_18_12/0.55)] sm:text-5xl lg:text-[3.4rem]">
                Bengaluru homes, thoughtfully chosen and <span className="text-gold-400 italic">designed</span>
              </h1>
              <div className="mt-5 flex items-center gap-4">
                <span aria-hidden className="hidden h-px w-12 shrink-0 bg-gold-400 sm:block" />
                <p className="font-display text-xl text-gold-300 italic sm:text-2xl">The right address is only the beginning.</p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#property-search" className="btn-gold">
                  Search properties
                </a>
                <Link href="/contact-us/#enquiry" className="btn-ghost-light">
                  Speak with an Advisor
                </Link>
              </div>
            </div>
            {/* Intro on a frosted panel so it reads over any video frame */}
            <div className="rounded-2xl border border-white/15 bg-espresso-950/55 p-6 shadow-lift backdrop-blur-md sm:p-7 lg:max-w-xl">
              <p className="text-xs font-semibold tracking-[0.2em] text-gold-300 uppercase">Buy · Sell · Lease · Design</p>
              <p className="mt-3 text-left text-[15px] leading-relaxed text-white/90">
                A home should fit the way you live, from the neighbourhood you return to each evening to the rooms you spend the most time in. Alven Homz helps
                you buy, sell and lease residential property in Bengaluru and design interiors for the home you choose. Explore new projects, owner-listed
                resale homes and premium rentals, or speak with us about preparing a property you already own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Property search — its own band directly after the hero */}
      <section id="property-search" className="relative z-10 scroll-mt-28 bg-espresso-900 pt-4 pb-12 sm:pb-16 lg:pt-12">
        <div className="container-x">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold-300 uppercase">Start with the way you want to live</p>
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
        <ul className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {newProjectsList.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 80} className="w-[85%] shrink-0 snap-start md:w-auto">
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
            caption="See the home beyond the floor plan."
            description="Explore owner-listed resale homes in Bengaluru, from ready-to-move residences to units still under construction. For a completed home, look closely at the light, condition and furnishing. For a construction-stage resale, ask about the handover timeline, outstanding payments and transfer process."
            action={<ViewAll href="/resale-properties/" arrow>Explore Resale Homes</ViewAll>}
          />
          <ul className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
            {resaleList.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 80} className="w-[85%] shrink-0 snap-start md:w-auto">
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
          width={540}
          height={900}
          loading="lazy"
          className="pointer-events-none absolute bottom-0 left-0 -z-10 aspect-[540/900] h-[85%] w-auto max-w-none object-contain select-none"
        />
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Alven Homz</p>
            <h2 className="mt-4 text-4xl leading-tight font-semibold sm:text-5xl">Interiors designed around your life</h2>
            <p className="mt-3 font-display text-xl text-gold-700 italic">Make the address unmistakably yours.</p>
            <p className="mt-5 max-w-lg leading-relaxed text-navy-800">
              From the proportions of a kitchen island to the light you come home to, the details shape how a house feels. Our Bengaluru interior design
              services cover complete apartment and villa interiors as well as modular kitchens, living rooms, bedrooms, wardrobes and home offices. We start
              with your routines, then shape the layout, materials and finishes around them.
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
                    <p className="mt-2 text-sm leading-relaxed text-navy-800">{l.description}</p>
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
          title="Why Alven Homz"
          caption="Know what matters before you decide."
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
              <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">{item.text}</p>
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
            description="Read how homeowners approached a purchase, prepared a residence for lease or developed an interior design brief. Each story starts with the decision the client needed to make and the details that helped them move forward."
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
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-espresso-900 text-sm font-semibold text-gold-300">
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
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Tell us what you have in mind</h2>
              <p className="mt-3 font-display text-lg text-gold-300 italic">A few details make for a better shortlist.</p>
              <p className="mt-4 max-w-md leading-relaxed text-white/75">
                Tell us which part of Bengaluru you have in mind, when you&apos;d like to move and which details matter most. Include a preferred configuration
                or budget range if you&apos;re comparing homes, or a floor plan if you&apos;re ready to talk interiors.
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

      {/* Find the right next step */}
      <ContentBlock
        tone="sand"
        title="Find the right next step"
        caption="Four ways to make your next move."
        body="Buying, renting, selling and designing a home each start with a different brief. Choose where you are in the process to see which details to have ready and where to begin."
        actions={NEXT_STEPS.map((n) => (
          <Link key={n.label} href={n.href} className="btn-outline bg-white">
            {n.label} <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      />

      <p className="container-x -mb-6 pt-10 text-center text-sm text-navy-800">
        Living overseas? See <Link href="/nri-property-services/" className="font-semibold text-gold-700 underline">NRI property services</Link>. Own a home
        you&apos;d like to lease or sell? See <Link href="/property-management/" className="font-semibold text-gold-700 underline">property management</Link>.
      </p>
      <Faq items={HOME_FAQS} />
    </>
  );
}
