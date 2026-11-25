import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Faq from "@/components/Faq";
import LeadForm from "@/components/LeadForm";
import MapEmbed from "@/components/MapEmbed";
import { PageHero } from "@/components/ui";
import { FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";
import { site } from "@/lib/data";
import { mailtoHref, telHref, whatsappHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = {
  ...pageMetadata({
  title: "Contact Alven Homz | HSR Layout Bengaluru",
  description: "Reach Alven Homz in HSR Layout for Bengaluru property enquiries, new projects, resale, rentals or a home interior design consultation.",
  path: "/contact-us/",
  image: "workspace-window",
}),
  title: { absolute: "Contact Alven Homz | HSR Layout Bengaluru" },
};

export default function ContactPage() {
  const channels = [
    { icon: Phone, title: "Call", value: site.phone, text: "", href: telHref(), cta: "Call now" },
    {
      icon: WhatsAppIcon,
      title: "WhatsApp",
      value: "Message us on WhatsApp",
      text: "Share your preferred neighbourhood, property link or a short description of your interiors brief.",
      href: whatsappHref("Hi Alven Homz, I have an enquiry."),
      cta: "Open WhatsApp",
      external: true,
    },
    {
      icon: Mail,
      title: "Email",
      value: site.email,
      text: "Include the property location or listing link and let us know the best way to reach you.",
      href: mailtoHref("Enquiry from website"),
      cta: "Send your brief",
    },
  ];
  // Only real profile links (a bare home page such as instagram.com/ is a placeholder).
  const isProfile = (url: string) => /^https?:\/\/[^/]+\/[^/?#]+/.test(url);
  const allSocials = [
    { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: site.social.youtube, label: "YouTube", Icon: YouTubeIcon },
  ];
  const socials = allSocials.filter((x) => isProfile(x.href));
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`;

  return (
    <>
      <PageHero
        bannerId="contact"
        eyebrow="Contact Us"
        title="Let's make your next move easier"
        caption="Your property journey begins with a conversation."
        description="Whether you're looking to buy, rent, sell, lease or transform your home, share your requirements with us. Our team will connect with you to understand your needs and guide you towards the right solutions."
        image={img("workspace-window")}
      />

      <section aria-labelledby="channels-heading" className="container-x pt-14">
        <h2 id="channels-heading" className="text-3xl font-semibold">Choose how to reach us</h2>
        <p className="mt-2 font-display text-lg text-gold-700 italic">Choose the way you prefer to reach us.</p>
        <p className="mt-2 text-sm text-navy-800">
          Contacting us from overseas? See <Link href="/nri-property-services/" className="font-semibold text-gold-700 underline">NRI property services</Link>.
          Own a home in Bengaluru? See <Link href="/property-management/" className="font-semibold text-gold-700 underline">property management</Link>.
        </p>
      </section>
      <section className="container-x mt-6 grid gap-4 sm:grid-cols-3">
        {channels.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            rel={c.external ? "noopener" : undefined}
            className="group card relative flex items-center gap-4 p-6 transition hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-espresso-900 text-gold-400">
              <c.icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs font-semibold tracking-wide text-muted uppercase">{c.title}</span>
              <span className="mt-0.5 block font-semibold break-words text-navy-900">{c.value}</span>
              {c.text && <span className="mt-1 block text-sm leading-relaxed text-navy-800">{c.text}</span>}
              <span className="mt-1 block text-xs font-semibold text-gold-600 group-hover:text-navy-900">{c.cta} →</span>
            </span>
          </a>
        ))}
      </section>

      <section className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div id="enquiry" className="card scroll-mt-28 p-6 sm:p-10">
          <h2 className="text-3xl font-semibold">Send your brief</h2>
          <p className="mt-2 font-display text-lg text-gold-700 italic">Tell us what matters most to you.</p>
          <p className="mt-3 mb-8 text-sm leading-relaxed text-navy-800">
            Select the service you need and share a few details. A neighbourhood or listing link helps with a property enquiry. For interiors, add the
            property type and when you expect to receive the keys.
          </p>
          <LeadForm variant="contact" />
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold">Visit our Bengaluru office</h2>
            <p className="mt-1 font-display text-gold-700 italic">Meet us in HSR Layout.</p>
            <p className="mt-3 flex gap-3 text-sm text-navy-800 select-text">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" /> <span>Alven Homz, {site.address}</span>
            </p>
            <p className="mt-2 text-sm text-muted">Contact us before visiting to confirm a suitable time.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={directions} target="_blank" rel="noopener" className="btn-outline py-2 text-sm">
                Get Directions
              </a>
              <a href={telHref()} className="flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-900 hover:text-gold-600">
                <Phone className="h-4 w-4 shrink-0 text-gold-600" /> {site.phone}
              </a>
            </div>
            {socials.length > 0 && (
              <>
            <h2 className="mt-6 text-xl font-semibold">Follow Alven Homz</h2>
            <p className="mt-1 font-display text-gold-700 italic">A closer look at our work in Bengaluru.</p>
            <p className="mt-2 text-sm text-navy-800">Follow Alven Homz for Bengaluru property features, interior design details and updates from the team.</p>
            <ul className="mt-3 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener" aria-label={`Alven Homz on ${label}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-navy-900 transition hover:border-gold-500 hover:text-gold-600">
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
              </>
            )}
          </div>
          <MapEmbed query={site.mapQuery} title="Alven Homz office" />
        </div>
      </section>
      <Faq
        className="pt-0"
        items={[
          {
            q: "How do I arrange a property viewing?",
            a: "Share the property name or listing link and a few times that work for you. We can discuss current availability and whether an in-person visit, a site visit or another viewing format is available for that property.",
          },
          {
            q: "What should I share for an interior consultation?",
            a: "Share the floor plan, Bengaluru locality, property type, expected handover date and the rooms you want to design. An approximate budget and details about furniture you wish to retain help shape the first conversation.",
          },
          {
            q: "How should I contact Alven Homz from overseas?",
            a: "Use WhatsApp or email for an enquiry from overseas. Include your international dialling code, time zone and a convenient time to speak. Add your Bengaluru visit dates if you're arranging viewings or a design meeting.",
          },
        ]}
      />
    </>
  );
}
