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
  { href: "/about-us/", label: "About Us" },
  { href: "/new-projects/", label: "New Projects" },
  { href: "/resale-properties/", label: "Resale" },
  { href: "/rental-properties/", label: "Rentals" },
  { href: "/blogs/", label: "Blogs" },
  { href: "/contact-us/", label: "Contact" },
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

      {/* Kept outside <header>: its backdrop-blur would make this fixed panel position relative to the header. */}
      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-0 top-[88px] bottom-0 z-[45] overflow-y-auto bg-white transition duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="container-x py-6">
          <ul className="divide-y divide-line">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between py-4 font-display text-xl",
                    isActive(item.href) ? "text-gold-600" : "text-navy-900",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <a href={telHref()} className="btn-outline">
              <Phone className="h-4 w-4" /> Call {site.phone}
            </a>
            <a href={whatsappHref("Hi Alven Homz, I'd like to know more about your properties.")} target="_blank" rel="noopener" className="btn-whatsapp">
              <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
