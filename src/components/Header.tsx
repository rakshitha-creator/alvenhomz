"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import Logo from "./Logo";
import { WhatsAppIcon } from "./icons";
import { site } from "@/lib/data";
import { telHref, whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/new-projects/", label: "New Projects" },
  { href: "/resale-properties/", label: "Resale" },
  { href: "/rental-properties/", label: "Rentals" },
  { href: "/interiors/", label: "Interiors" },
  { href: "/about-us/", label: "About Us" },
  { href: "/contact-us/", label: "Contact Us" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, "")));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow",
          scrolled ? "border-line shadow-[0_6px_24px_-16px_rgb(13_31_58/0.35)]" : "border-transparent",
        )}
      >
        <div className="container-x flex h-[88px] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-medium transition",
                      isActive(item.href) ? "text-navy-900" : "text-muted hover:text-navy-900",
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-gold-500" />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href={telHref()} className="hidden items-center gap-2 text-sm font-semibold text-navy-900 xl:flex">
              <Phone className="h-4 w-4 text-gold-600" /> {site.phone}
            </a>
            <a
              href={whatsappHref("Hi Alven Homz, I'd like to know more about your properties.")}
              target="_blank"
              rel="noopener"
              aria-label="Chat on WhatsApp"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-line text-[#1faa53] transition hover:border-[#1faa53] sm:flex"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <Link href="/contact-us/" className="btn-gold hidden py-2.5 sm:inline-flex">
              Enquire Now
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy-900 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {open && (
        <div id="mobile-nav" className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute top-[88px] right-0 bottom-0 w-full max-w-sm border-l border-line bg-white p-6 shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-base font-medium transition",
                        isActive(item.href) ? "bg-ivory text-navy-900 font-semibold" : "text-muted hover:bg-ivory/60 hover:text-navy-900",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 space-y-3 border-t border-line pt-6">
              <a href={telHref()} className="btn-outline flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold">
                <Phone className="h-4 w-4 text-gold-600" /> {site.phone}
              </a>
              <a
                href={whatsappHref("Hi Alven Homz, I'd like to know more about your properties.")}
                target="_blank"
                rel="noopener"
                className="btn-whatsapp flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold"
              >
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp Us
              </a>
              <Link href="/contact-us/" className="btn-gold flex w-full items-center justify-center py-3 text-sm font-semibold">
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
