import {
  ArrowRight,
  BedDouble,
  Briefcase,
  ChefHat,
  DoorClosed,
  Home,
  Phone,
  Sofa,
  type LucideIcon,
} from "lucide-react";
import BannerMedia from "@/components/BannerMedia";
import Faq, { type FaqItem } from "@/components/Faq";
import ProcessSteps from "@/components/ProcessSteps";
import InteriorPortfolio from "@/components/InteriorPortfolio";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import { interiorPortfolio, interiorProcess, interiorServices, site } from "@/lib/data";
import { telHref, whatsappHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Luxury Home Interior Designers in Bengaluru",
  description:
    "Commission interiors for your Bengaluru apartment or villa, from modular kitchens and bespoke wardrobes to coordinated full-home design.",
  path: "/interiors/",
  image: "living-double-height",
});

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  "chef-hat": ChefHat,
  sofa: Sofa,
  "bed-double": BedDouble,
  "door-closed": DoorClosed,
  briefcase: Briefcase,
};

const CONSULT_MSG = "Hi Alven Homz, I'd like to speak with a designer about my home's interiors.";

const FAQS: FaqItem[] = [
  {
    q: "How much should I budget for 3 BHK interiors in Bengaluru?",
    a: "For planning, allow approximately ₹10–16 lakh before GST for a mid-range 3 BHK interior and ₹17–28 lakh or more for a premium specification. The number of wardrobes, kitchen layout, custom joinery and finishes shape the estimate. Share your floor plan with Alven Homz for a room-wise quotation.",
  },
  {
    q: "What does a modular kitchen cost in Bengaluru?",
    a: "Around ₹2.5–4 lakh is a useful initial allowance for a moderately sized modular kitchen. Tall pantry units, premium hardware, countertops and appliances can increase the total. When requesting your quote, specify which appliances you already own and whether countertop supply and installation should be included.",
  },
  {
    q: "How are interiors calculated for a 1,500 sq. ft. apartment?",
    a: "The apartment’s advertised area is only a starting point. A wardrobe quote may use the width and height of its shutters, while flooring uses the area being laid. For a meaningful estimate, share the floor plan and list the rooms, cabinetry and finishes you want included.",
  },
  {
    q: "What should a full-home interior quotation include?",
    a: "Look for a room-wise breakdown of dimensions, materials, hardware, finishes and installation. Check design fees, taxes and exclusions separately. A kitchen quote is easier to compare when you can see whether it includes the countertop, sink, fittings, appliances and electrical work.",
  },
  {
    q: "How much should I budget for villa interiors in Bengaluru?",
    a: "For an initial estimate, ₹15–22 lakh is an indicative starting band for a four-bedroom home or villa, with more extensive specifications reaching ₹22–40 lakh or above. Define the scope floor by floor, especially for staircase finishes, double-height rooms, additional kitchens and outdoor areas.",
  },
];

export default function InteriorsPage() {
  return (
    <div className="bg-espresso-950">
      {/* Hero */}
      <section className="relative isolate flex min-h-[600px] items-center overflow-hidden lg:min-h-[680px]">
        <BannerMedia
          pageId="interiors"
          fallback="living-double-height"
          alt="Double-height luxury living room designed by Alven Homz Interiors"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-espresso-950 via-espresso-950/75 to-espresso-950/10" />
        <div className="container-x pt-32 pb-20">
          <h1 className="max-w-3xl text-4xl leading-[1.08] font-semibold text-white sm:text-6xl">Luxury home interiors in Bengaluru</h1>
          <p className="mt-4 font-display text-xl text-gold-300 italic sm:text-2xl">Thoughtfully designed around your lifestyle.</p>
          <p className="mt-5 max-w-2xl leading-relaxed text-white/80">
            Alven Homz creates bespoke interiors for apartments and villas in Bengaluru, thoughtfully tailored to your lifestyle and everyday needs. From space
            planning and lighting to materials and finishes, every detail is designed to bring together comfort, functionality and timeless elegance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#interior-consultation" className="btn-gold">
              Book an Interior Consultation <ArrowRight className="h-4 w-4" />
            </a>
            <a href={whatsappHref(CONSULT_MSG)} target="_blank" rel="noopener" className="btn-ghost-light">
              <WhatsAppIcon className="h-4 w-4" /> Speak with a Designer
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-2 text-sm text-white/85">
            {["Apartments and villas", "One room or the whole home", "Plan before possession", "Planning from overseas"].map((t) => (
              <li key={t} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="bg-ivory py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="What we design" title="Interior services" caption="One point of view, carried through every room." align="center" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {interiorServices.map((s, i) => {
              const Icon = ICONS[s.icon] ?? Home;
              return (
                <Reveal as="li" key={s.slug} delay={i * 60} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(s.image, "sm")} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  {/* The icon sits half over the photo; it lives outside the photo box so the photo's clipping can't cut it off. */}
                  <div className="relative px-6 pb-6">
                    <span className="relative z-10 -mt-6 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-espresso-900 text-gold-400 shadow-lift ring-4 ring-white">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-navy-800">{s.summary}</p>
                    <a href={whatsappHref(`Hi Alven Homz, I'm interested in ${s.title.toLowerCase()}. Please share details.`)} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600">
                      Enquire on WhatsApp <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected interiors"
            caption="See what a floor plan can become."
            description="Look closely at how the layout, lighting and joinery respond to each home. Explore the materials up close and see how they sit alongside the larger decisions about circulation and storage."
            light
          />
          <InteriorPortfolio items={interiorPortfolio} />
          <p className="mt-6 text-xs text-white/60">Cards marked &ldquo;Design concept&rdquo; are concept visuals. Other images are representative photography, not completed Alven Homz projects.</p>
        </div>
      </section>

      {/* Process — scroll story, one step at a time */}
      <section className="bg-sand py-20 sm:py-28">
        <div className="container-x">
          <ProcessSteps steps={interiorProcess} />
        </div>
      </section>

      {/* Consultation */}
      <section id="interior-consultation" className="scroll-mt-28 py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow text-gold-300">Interior consultation</p>
            <h2 className="mt-4 text-4xl leading-tight font-semibold text-white">Start your interior brief</h2>
            <p className="mt-3 font-display text-lg text-gold-300 italic">Start with a plan. Make it yours.</p>
            <p className="mt-5 max-w-md leading-relaxed text-white/75">
              Share your floor plan, Bengaluru locality, property type, handover date and approximate budget. Tell us whether you&apos;re planning a complete
              home, a kitchen or a few rooms, and mention any furniture or finishes you want to keep.
            </p>
            <div className="mt-8 grid gap-3 sm:max-w-xs">
              <a href={whatsappHref(CONSULT_MSG)} target="_blank" rel="noopener" className="btn-whatsapp">
                <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
              </a>
              <a href={telHref()} className="btn-ghost-light">
                <Phone className="h-4 w-4" /> Call {site.phone}
              </a>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img("kitchen-marble", "sm")} alt="Marble modular kitchen" loading="lazy" className="mt-10 hidden aspect-[16/10] w-full max-w-md rounded-2xl object-cover lg:block" />
          </div>
          <div className="rounded-3xl border border-white/10 bg-espresso-900 p-6 sm:p-10">
            <LeadForm variant="interiors" dark />
          </div>
        </div>
      </section>
      <div className="bg-ivory">
        <Faq items={FAQS} />
      </div>
    </div>
  );
}
