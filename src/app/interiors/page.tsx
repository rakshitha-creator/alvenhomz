import { ArrowRight, BedDouble, Briefcase, ChefHat, Check, DoorClosed, Home, Phone, Sofa, type LucideIcon } from "lucide-react";
import InteriorPortfolio from "@/components/InteriorPortfolio";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import { interiorPortfolio, interiorProcess, interiorServices, site, testimonials } from "@/lib/data";
import { telHref, whatsappHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Alven Homz Interiors – Home, Kitchen, Bedroom & Office Interior Design",
  description:
    "Beautiful spaces, thoughtful designs, inspired living. Complete home interiors, modular kitchens, living rooms, bedrooms, wardrobes and office interiors by Alven Homz Interiors.",
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

const CONSULT_MSG = "Hi Alven Homz Interiors, I'd like to book a free interior consultation.";

export default function InteriorsPage() {
  const interiorTestimonial = testimonials.find((t) => /interior/i.test(t.context));

  return (
    <div className="bg-navy-950">
      {/* Hero */}
      <section className="relative isolate flex min-h-[600px] items-center overflow-hidden lg:min-h-[680px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img("living-double-height")} alt="Double-height luxury living room designed by Alven Homz Interiors" className="absolute inset-0 -z-10 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/75 to-navy-950/10" />
        <div className="container-x py-20">
          <p className="eyebrow animate-fade-up text-gold-300">Alven Homz Interiors</p>
          <h1 className="mt-5 max-w-3xl animate-fade-up text-4xl leading-[1.08] font-semibold text-white [animation-delay:80ms] sm:text-6xl">
            Beautiful Spaces. <span className="text-gold-400 italic">Thoughtful Designs.</span> Inspired Living.
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-white/75 [animation-delay:160ms]">
            Transform your home with elegant, functional and personalized interior design solutions.
          </p>
          <div className="mt-10 flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
            <a href="#consultation" className="btn-gold">
              Book a Free Interior Consultation <ArrowRight className="h-4 w-4" />
            </a>
            <a href={whatsappHref(CONSULT_MSG)} target="_blank" rel="noopener" className="btn-ghost-light">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp a designer
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-ivory py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="What we design" title="Interior Services" description="One studio for every room — designed, manufactured and installed by a single accountable team." align="center" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {interiorServices.map((s, i) => {
              const Icon = ICONS[s.icon] ?? Home;
              return (
                <Reveal as="li" key={s.slug} delay={i * 60} className="group overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(s.image, "sm")} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute bottom-0 left-6 flex h-12 w-12 translate-y-1/2 items-center justify-center rounded-xl bg-navy-900 text-gold-400 shadow-lift">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="p-6 pt-10">
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
                    <ul className="mt-4 space-y-2">
                      {s.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2 text-sm text-navy-800">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" /> {pt}
                        </li>
                      ))}
                    </ul>
                    <a href={whatsappHref(`Hi Alven Homz Interiors, I'm interested in ${s.title}. Please share details.`)} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600">
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
          <SectionHeading eyebrow="Portfolio" title="Our Interior Projects" description="A selection of homes and workplaces. Tap a project to see more photos." light />
          <InteriorPortfolio items={interiorPortfolio} />
          <p className="mt-6 text-xs text-white/40">Portfolio images are representative sample photography — replace with completed Alven Homz projects.</p>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="How we work" title="Our Design Process" description="A clear, six-step journey from first conversation to final handover." align="center" />
          <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interiorProcess.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 70} className="relative rounded-2xl border border-line bg-ivory p-7">
                <span className="font-display text-5xl font-semibold text-gold-500/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Quote */}
      {interiorTestimonial && (
        <section className="border-y border-white/10 py-16">
          <div className="container-x max-w-3xl text-center">
            <p className="font-display text-2xl leading-relaxed text-white italic sm:text-3xl">&ldquo;{interiorTestimonial.quote}&rdquo;</p>
            <p className="mt-6 text-sm text-gold-300">
              {interiorTestimonial.name} · {interiorTestimonial.context}
            </p>
          </div>
        </section>
      )}

      {/* Consultation */}
      <section id="consultation" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow text-gold-300">Free consultation</p>
            <h2 className="mt-4 text-4xl leading-tight font-semibold text-white">Book a Free Interior Consultation</h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/70">
              Share a few details about your space. A designer will reach out to understand your requirements and plan a site or studio visit.
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
          <div className="rounded-3xl border border-white/10 bg-navy-900 p-6 sm:p-10">
            <LeadForm variant="interiors" dark />
          </div>
        </div>
      </section>
    </div>
  );
}
