import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from "./icons";
import { site } from "@/lib/data";
import { mailtoHref, telHref } from "@/lib/contact";

// Always shown in the footer. Put the Alven Homz profile URLs in src/data/site.json (social.*);
// until then each icon opens that network's home page.
const socials = [
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.social.youtube, label: "YouTube", Icon: YouTubeIcon },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-espresso-950 text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {/* Logo centred over the intro text below it */}
          <div className="flex max-w-sm justify-center">
            <Logo variant="light" imgClassName="h-32 w-auto" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed hyphens-none">
            Alven Homz brings residential property advisory and bespoke home interiors together in Bengaluru. Explore new developments, resale homes and
            rentals, or speak with us about selling, renting out or redesigning a residence you already own.
          </p>
          <ul aria-label="Alven Homz on social media" className="mt-6 flex max-w-sm justify-center gap-3">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-gold-400 hover:text-gold-300"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold tracking-[0.22em] text-gold-400 uppercase">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/new-projects/" className="transition hover:text-white">
                New Projects
              </Link>
            </li>
            <li>
              <Link href="/resale-properties/" className="transition hover:text-white">
                Resale Properties
              </Link>
            </li>
            <li>
              <Link href="/rental-properties/" className="transition hover:text-white">
                Rental Properties
              </Link>
            </li>
            <li>
              <Link href="/interiors/" className="transition hover:text-white">
                Interiors
              </Link>
            </li>
            <li>
              <Link href="/blogs/" className="transition hover:text-white">
                Blogs
              </Link>
            </li>
            <li>
              <Link href="/nri-property-services/" className="transition hover:text-white">
                NRI Corner
              </Link>
            </li>
            <li>
              <Link href="/property-management/" className="transition hover:text-white">
                Property Management
              </Link>
            </li>
            <li>
              <Link href="/about-us/" className="transition hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers/" className="transition hover:text-white">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact-us/" className="transition hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

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
        <div className="container-x flex flex-col gap-3 pt-6 pb-24 text-sm sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>© {year} {site.name}. All rights reserved.</p>
            <Link href="/privacy-policy/" className="inline-flex min-h-11 items-center transition hover:text-white">Privacy Policy</Link>
            <Link href="/terms-and-conditions/" className="inline-flex min-h-11 items-center transition hover:text-white">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
