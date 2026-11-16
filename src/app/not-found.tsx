import Link from "next/link";
import { Home } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { whatsappHref } from "@/lib/contact";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">This space isn&apos;t available</h1>
      <p className="mt-4 max-w-md text-muted">The page you&apos;re looking for may have moved, or the listing is no longer on the market.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" /> Back to home
        </Link>
        <Link href="/new-projects/" className="btn-outline">Browse new projects</Link>
        <a href={whatsappHref("Hi Alven Homz, I couldn't find a page on your website. Can you help?")} target="_blank" rel="noopener" className="btn-whatsapp">
          <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
        </a>
      </div>
      <nav aria-label="Popular pages" className="mt-10 text-sm">
        <p className="text-muted">Popular pages</p>
        <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 font-semibold text-navy-900">
          <li><Link href="/resale-properties/" className="hover:text-gold-600">Resale homes</Link></li>
          <li><Link href="/rental-properties/" className="hover:text-gold-600">Rentals</Link></li>
          <li><Link href="/interiors/" className="hover:text-gold-600">Interiors</Link></li>
          <li><Link href="/blogs/" className="hover:text-gold-600">Blogs</Link></li>
          <li><Link href="/contact-us/" className="hover:text-gold-600">Contact us</Link></li>
        </ul>
      </nav>
    </section>
  );
}
