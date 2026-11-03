import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { site } from "@/lib/data";
import { mailtoHref, telHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "The terms that apply when you use the Alven Homz website and our property, rental, resale and interior services.",
  path: "/terms-and-conditions/",
  image: "workspace-window",
});

const UPDATED = "3 November 2026";

export default function TermsPage() {
  const sections: LegalSection[] = [
    {
      id: "acceptance",
      title: "Acceptance of these terms",
      body: (
        <>
          <p>
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of <a href={site.url}>{site.url.replace(/^https?:\/\//, "")}</a> (the
            &ldquo;Website&rdquo;), operated by <strong>{site.name}</strong>, the home services vertical of Abhee Ventures (&ldquo;Alven Homz&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;).
          </p>
          <p>By using the Website or contacting us through it, you agree to these Terms. If you do not agree, please do not use the Website.</p>
        </>
      ),
    },
    {
      id: "services",
      title: "Our services",
      body: (
        <>
          <p>Through the Website, Alven Homz provides information and assistance for:</p>
          <ul>
            <li>new launch and under-construction projects, including projects developed by Abhee Ventures;</li>
            <li>resale and rental of residential and commercial properties;</li>
            <li>interior design and home improvement services.</li>
          </ul>
          <p>
            The Website is an information and enquiry platform. Submitting an enquiry does not create a booking, agreement to sell, lease or any other
            binding contract. Any transaction is governed only by the separate written agreements you sign with the developer, owner, buyer, tenant or
            service provider.
          </p>
        </>
      ),
    },
    {
      id: "listings",
      title: "Property listings and information",
      body: (
        <>
          <p>We try to keep all listings accurate and up to date. However:</p>
          <ul>
            <li>
              prices, availability, areas, floor plans, specifications, amenities, possession dates and offers are indicative and may change without
              notice;
            </li>
            <li>details marked as tentative, &ldquo;to be confirmed&rdquo; or &ldquo;price on request&rdquo; must be confirmed with our team;</li>
            <li>
              images, renders, model-unit photos, walkthroughs and plans may be artistic impressions or representative, and the actual property may differ;
            </li>
            <li>distances and travel times to nearby places are approximate.</li>
          </ul>
          <p>
            Website content is not a legal offer or warranty. Please verify all details, approvals and documents yourself, and rely only on the final
            agreement and the information registered with RERA.
          </p>
        </>
      ),
    },
    {
      id: "rera",
      title: "RERA and approvals",
      body: (
        <p>
          Where a project&apos;s RERA registration number is shown, you can verify it on the Karnataka RERA website (rera.karnataka.gov.in). Approval and
          registration details are provided as received from the developer. Buyers should independently check approvals, title and encumbrances before
          making any payment.
        </p>
      ),
    },
    {
      id: "your-responsibilities",
      title: "Your responsibilities",
      body: (
        <>
          <p>When using the Website, you agree to:</p>
          <ul>
            <li>provide true, accurate and current information in enquiries;</li>
            <li>use the Website only for lawful, personal purposes connected with finding or improving a home;</li>
            <li>not copy, scrape, resell or misuse listings or other content;</li>
            <li>not attempt to disrupt, hack or gain unauthorised access to the Website or its systems.</li>
          </ul>
        </>
      ),
    },
    {
      id: "communication",
      title: "Communication consent",
      body: (
        <p>
          By sharing your phone number or email with us, you agree that Alven Homz and its partners may contact you by call, SMS, WhatsApp or email about
          your enquiry and related properties or services, even if your number is registered on the National Do Not Call (DND) registry. You can ask us to
          stop marketing messages at any time.
        </p>
      ),
    },
    {
      id: "payments",
      title: "Payments, fees and transactions",
      body: (
        <>
          <p>
            We do not accept payments through the Website. Never make a payment based only on a message, call or listing without verifying it with our
            official team at <a href={telHref()}>{site.phone}</a>.
          </p>
          <p>
            Brokerage, service charges and interior project fees, where applicable, are agreed in writing before any work begins. Bookings, token amounts,
            refunds and cancellations follow the terms of the relevant developer, owner or service agreement.
          </p>
        </>
      ),
    },
    {
      id: "interiors",
      title: "Interior services",
      body: (
        <p>
          Interior designs, 3D views, quotations and timelines are shared for discussion and become binding only once confirmed in a signed proposal or
          work order. Final finishes, colours and materials may vary slightly from samples and images due to natural variation, lighting and site
          conditions.
        </p>
      ),
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      body: (
        <p>
          The Alven Homz name, logo, website design, text, photographs and other content are owned by or licensed to Alven Homz and Abhee Ventures. You may
          not reproduce, distribute or use them commercially without our written permission. Developer names, logos and project materials belong to their
          respective owners.
        </p>
      ),
    },
    {
      id: "third-party",
      title: "Third-party links and services",
      body: (
        <p>
          The Website may link to or embed third-party services such as Google Maps, WhatsApp, social media and developer websites. We are not responsible
          for their content, availability or practices, and your use of them is governed by their own terms.
        </p>
      ),
    },
    {
      id: "liability",
      title: "Limitation of liability",
      body: (
        <>
          <p>
            The Website is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To the fullest extent allowed by law, Alven Homz is
            not liable for any indirect, incidental or consequential loss arising from your use of the Website or reliance on its content, including any
            errors in listings, interruptions or loss of data.
          </p>
          <p>
            Alven Homz acts as a facilitator between buyers, sellers, owners, tenants and developers, and is not responsible for the acts or omissions of
            those third parties, except as expressly agreed in writing.
          </p>
        </>
      ),
    },
    {
      id: "privacy",
      title: "Privacy",
      body: (
        <p>
          Our use of your personal information is described in our <Link href="/privacy-policy/">Privacy Policy</Link>, which forms part of these Terms.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to these terms",
      body: (
        <p>
          We may update these Terms at any time by posting the revised version on this page with a new &ldquo;Last updated&rdquo; date. Continuing to use
          the Website after changes means you accept the updated Terms.
        </p>
      ),
    },
    {
      id: "law",
      title: "Governing law and jurisdiction",
      body: (
        <p>
          These Terms are governed by the laws of India. Any dispute arising from them or from your use of the Website will be subject to the exclusive
          jurisdiction of the courts in Bengaluru, Karnataka.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact us",
      body: (
        <ul>
          <li>
            <strong>Email:</strong> <a href={mailtoHref("Question about Terms & Conditions")}>{site.email}</a>
          </li>
          <li>
            <strong>Phone:</strong> <a href={telHref()}>{site.phone}</a>
          </li>
          <li>
            <strong>Address:</strong> {site.address}
          </li>
        </ul>
      ),
    },
  ];

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      description="Please read these terms carefully before using our website and services."
      updated={UPDATED}
      sections={sections}
    />
  );
}
