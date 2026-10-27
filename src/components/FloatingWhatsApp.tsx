import { WhatsAppIcon } from "./icons";
import { whatsappHref } from "@/lib/contact";

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappHref("Hi Alven Homz, I'd like some help finding a property.")}
      target="_blank"
      rel="noopener"
      aria-label="Chat with Alven Homz on WhatsApp"
      className="group fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1faa53] text-white shadow-lift transition hover:scale-105 sm:right-6 sm:bottom-6 print:hidden"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#1faa53] opacity-25 [animation-duration:2.5s]" aria-hidden />
      <WhatsAppIcon className="relative h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold whitespace-nowrap opacity-0 transition group-hover:opacity-100 sm:block">
        Chat with us
      </span>
    </a>
  );
}
