import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from "./icons";
import { site } from "@/lib/data";
import { mailtoHref, telHref } from "@/lib/contact";

const socials = [
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: site.social.youtube, label: "YouTube", Icon: YouTubeIcon },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo className="rounded-2xl bg-white px-5 py-4" imgClassName="h-28" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{site.description}</p>
          <ul className="mt-6 flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-gold-400 hover:text-gold-300"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterCol title="Explore">
          <FooterLink href="/new-projects/">New Projects</FooterLink>
          <FooterLink href="/resale-properties/">Resale Properties</FooterLink>
          <FooterLink href="/rental-properties/">Rental Properties</FooterLink>
          <FooterLink href="/interiors/">Alven Homz Interiors</FooterLink>
          <FooterLink href="/blogs/">Blogs</FooterLink>
          <FooterLink href="/about-us/">About Us</FooterLink>
          <FooterLink href="/contact-us/">Contact Us</FooterLink>
        </FooterCol>

        <div className="lg:col-span-4">
          <h2 className="font-sans text-xs font-semibold tracking-[0.22em] text-gold-400 uppercase">Get in touch</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>{site.address}</span>
            </li>
            <li>
              <a href={telHref()} className="flex gap-3 hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> {site.phone}
              </a>
            </li>
            <li>
              <a href={mailtoHref("Enquiry from website")} className="flex gap-3 hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. All rights reserved.</p>
          {site.sampleContentNotice && (
            <p className="text-white/50">
              Resale and rental listings shown are sample content for demonstration and are not verified offers.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="lg:col-span-3">
      <h2 className="font-sans text-xs font-semibold tracking-[0.22em] text-gold-400 uppercase">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition hover:text-white">
        {children}
      </Link>
    </li>
  );
}
