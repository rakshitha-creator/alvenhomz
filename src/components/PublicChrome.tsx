"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";

export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
