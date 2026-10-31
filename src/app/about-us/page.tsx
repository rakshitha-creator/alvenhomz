import Link from "next/link";
import { ArrowRight, Check, Eye, Gem, Target } from "lucide-react";
import Reveal from "@/components/Reveal";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import { PageHero, SectionHeading } from "@/components/ui";
import { testimonials } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "About Alven Homz – Dedicated Home Services",
  description:
    "Alven Homz is your trusted home services partner, built on 17 years of legacy — interior design, rental, resale and property management under one roof.",
  path: "/about-us/",
  image: "living-penthouse",
});

const VALUES = [
  { word: "Care", text: "in how we look after your home and your needs." },
  { word: "Trust", text: "in every commitment we make and keep." },
  { word: "Value", text: "in every solution we deliver." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        bannerId="about"
        eyebrow="About Alven Homz"
        title="Your home, our continued commitment"
        description="Your trusted home services partner, built on 17 years of legacy."
        image={img("living-penthouse")}
      />

      <section className="container-x grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Beyond the keys to your home</h2>
          <div className="mt-6 space-y-4 leading-relaxed text-navy-800">
            <p>
              At Alven Homz, our relationship with homeowners has always gone beyond handing over the keys. Over 17 years of building quality homes, we
              have earned the trust of our homeowners, and Alven Homz is our next step in strengthening that bond.
            </p>
            <p>
              Alven Homz is your dedicated home services partner. We were created to support you long after you take possession of your
              home. Built on Alven Homz&apos;s values of trust, care and quality, we offer reliable and cost-effective solutions that make homeownership easier and
              more convenient.
            </p>
            <p>
              From interior design and home transformations to rental, resale and property management, we bring essential home services together under one
              roof, with one team you can rely on.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120} className="grid grid-cols-2 gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("tower-balconies", "sm")} alt="Residential apartment towers" loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("living-wood", "sm")} alt="Warm contemporary living room interior" loading="lazy" className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover" />
        </Reveal>
      </section>

      <section className="bg-navy-950 py-20 text-white sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="What drives us" title="Mission, vision and values" align="center" light />
          <div className="grid gap-6 md:grid-cols-3">
            <Reveal className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <Target className="h-8 w-8 text-gold-400" />
              <h3 className="mt-5 text-2xl font-semibold text-white">Our Mission</h3>
              <ul className="mt-3 list-disc pl-5 leading-relaxed text-white/70 marker:text-gold-400">
                <li>To make homeownership simple, convenient and worry-free through reliable, transparent and cost-effective home services.</li>
              </ul>
            </Reveal>
            <Reveal delay={80} className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <Eye className="h-8 w-8 text-gold-400" />
              <h3 className="mt-5 text-2xl font-semibold text-white">Our Vision</h3>
              <ul className="mt-3 list-disc pl-5 leading-relaxed text-white/70 marker:text-gold-400">
                <li>To be the most trusted home services partner for homeowners, carrying forward the legacy of quality and trust that defines Alven Homz.</li>
              </ul>
            </Reveal>
            <Reveal delay={160} className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <Gem className="h-8 w-8 text-gold-400" />
              <h3 className="mt-5 text-2xl font-semibold text-white">Our Values</h3>
              <p className="mt-1 text-sm font-semibold tracking-[0.18em] text-gold-300 uppercase">Care · Trust · Value</p>
              <ul className="mt-4 space-y-3">
                {VALUES.map((v) => (
                  <li key={v.word} className="flex gap-2.5 leading-relaxed text-white/70">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-gold-400" />
                    <span>
                      <span className="font-semibold text-white">{v.word}</span> {v.text}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-x py-20 sm:py-24">
        <SectionHeading eyebrow="Testimonials" title="What our homeowners say" align="center" />
        <TestimonialsSlider testimonials={testimonials} />
      </section>

      <section className="container-x pb-20 sm:pb-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-navy-900 p-8 sm:p-12 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-white">Let&apos;s take care of your home</h2>
            <p className="mt-2 text-white/70">Interiors, rental, resale or property management — talk to the Alven Homz team today.</p>
          </div>
          <Link href="/contact-us/" className="btn-gold">
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
