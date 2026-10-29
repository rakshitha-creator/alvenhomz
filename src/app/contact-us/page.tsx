import { Mail, MapPin, Phone } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import MapEmbed from "@/components/MapEmbed";
import { PageHero } from "@/components/ui";
import { FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";
import { site } from "@/lib/data";
import { mailtoHref, telHref, whatsappHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Contact Alven Homz – Call, WhatsApp or Email Our Property Advisors",
  description: `Get in touch with Alven Homz for new projects, resale, rentals and interiors. Call ${site.phone}, WhatsApp us or email ${site.email}.`,
  path: "/contact-us/",
  image: "workspace-window",
});

export default function ContactPage() {
  const channels = [
    { icon: Phone, title: "Call us", value: site.phone, href: telHref(), cta: "Call now" },
    { icon: WhatsAppIcon, title: "WhatsApp", value: "Chat with an advisor", href: whatsappHref("Hi Alven Homz, I have an enquiry."), cta: "Open WhatsApp", external: true },
    { icon: Mail, title: "Email", value: site.email, href: mailtoHref("Enquiry from website"), cta: "Write to us" },
  ];
  const socials = [
    { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: site.social.youtube, label: "YouTube", Icon: YouTubeIcon },
  ];

  return (
    <>
      <PageHero
        bannerId="contact"
        eyebrow="Contact Us"
        title="We'd love to hear from you"
        description="Whether you're buying, renting, selling or designing — reach us on call, WhatsApp or email."
        image={img("workspace-window")}
      />

      <section className="container-x -mt-10 grid gap-4 sm:grid-cols-3">
        {channels.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            rel={c.external ? "noopener" : undefined}
            className="group card relative flex items-center gap-4 p-6 transition hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
              <c.icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs font-semibold tracking-wide text-muted uppercase">{c.title}</span>
              <span className="mt-0.5 block font-semibold text-navy-900">{c.value}</span>
              <span className="mt-1 block text-xs font-semibold text-gold-600 group-hover:text-navy-900">{c.cta} →</span>
            </span>
          </a>
        ))}
      </section>

      <section className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div className="card p-6 sm:p-10">
          <h2 className="text-3xl font-semibold">Send us a message</h2>
          <p className="mt-2 mb-8 text-sm text-muted">
            Fill in your details and choose WhatsApp or email — your message opens pre-filled, ready for you to send.
          </p>
          <LeadForm variant="contact" />
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-sans text-base font-bold">Office</h2>
            <p className="mt-3 flex gap-3 text-sm text-navy-800">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" /> {site.address}
            </p>
            <a href={telHref()} className="mt-3 flex gap-3 text-sm font-semibold text-navy-900 hover:text-gold-600">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" /> {site.phone}
            </a>
            <h2 className="mt-6 font-sans text-base font-bold">Follow us</h2>
            <ul className="mt-3 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy-900 transition hover:border-gold-500 hover:text-gold-600">
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <MapEmbed query={site.mapQuery} title="Alven Homz office" />
        </div>
      </section>
    </>
  );
}
