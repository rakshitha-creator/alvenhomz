import { Mail, MessageSquareText, Phone } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { listingMessage, mailtoHref, telHref, whatsappHref, type ListingRef } from "@/lib/contact";

/** Call / WhatsApp / Email quick actions for a listing. */
export function ContactActions({ listing }: { listing: ListingRef }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <a href={telHref()} className="flex flex-col items-center gap-1 rounded-xl border border-line py-3 text-xs font-semibold text-navy-900 transition hover:bg-ivory">
        <Phone className="h-4 w-4 text-gold-600" /> Call
      </a>
      <a href={whatsappHref(listingMessage(listing))} target="_blank" rel="noopener" className="flex flex-col items-center gap-1 rounded-xl border border-line py-3 text-xs font-semibold text-navy-900 transition hover:bg-ivory">
        <WhatsAppIcon className="h-4 w-4 text-[#1faa53]" /> WhatsApp
      </a>
      <a href={mailtoHref(`Enquiry: ${listing.title}`, listingMessage(listing))} className="flex flex-col items-center gap-1 rounded-xl border border-line py-3 text-xs font-semibold text-navy-900 transition hover:bg-ivory">
        <Mail className="h-4 w-4 text-gold-600" /> Email
      </a>
    </div>
  );
}

/** Sticky bottom bar on mobile detail pages. */
export function MobileEnquiryBar({ listing }: { listing: ListingRef }) {
  return (
    <>
    {/* Spacer so the fixed bar never covers the footer */}
    <div className="h-[68px] lg:hidden" aria-hidden />
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden print:hidden">
      <a href={telHref()} className="btn-outline px-2 py-2.5 text-xs">
        <Phone className="h-4 w-4" /> Call
      </a>
      <a href={whatsappHref(listingMessage(listing))} target="_blank" rel="noopener" className="btn-whatsapp px-2 py-2.5 text-xs">
        <WhatsAppIcon className="h-4 w-4" /> WhatsApp
      </a>
      <a href="#enquire" className="btn-primary px-2 py-2.5 text-xs">
        <MessageSquareText className="h-4 w-4" /> Enquire
      </a>
    </div>
    </>
  );
}
