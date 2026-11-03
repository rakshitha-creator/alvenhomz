import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { site } from "@/lib/data";
import { mailtoHref, telHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Alven Homz collects, uses, stores and protects the personal information you share through our website, WhatsApp, phone and email.",
  path: "/privacy-policy/",
  image: "workspace-window",
});

const UPDATED = "3 November 2026";

export default function PrivacyPolicyPage() {
  const sections: LegalSection[] = [
    {
      id: "about",
      title: "About this policy",
      body: (
        <>
          <p>
            This Privacy Policy explains how <strong>{site.name}</strong> (&ldquo;Alven Homz&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;), the home
            services vertical of Abhee Ventures, collects, uses, shares and protects your personal information when you visit{" "}
            <a href={site.url}>{site.url.replace(/^https?:\/\//, "")}</a> (the &ldquo;Website&rdquo;) or contact us by phone, WhatsApp or email.
          </p>
          <p>
            We handle personal data in line with applicable Indian law, including the Information Technology Act, 2000 and its rules, and the Digital
            Personal Data Protection Act, 2023. By using the Website or sharing your details with us, you agree to the practices described here.
          </p>
        </>
      ),
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      body: (
        <>
          <p>
            <strong>Information you give us.</strong> When you fill in an enquiry, site-visit or interior-consultation form, or contact us directly, we may
            collect:
          </p>
          <ul>
            <li>your name, mobile number and email address;</li>
            <li>your city or preferred location, the property or service you are interested in, your budget and timeline;</li>
            <li>any message, documents or details you choose to share with us.</li>
          </ul>
          <p>
            <strong>Information collected automatically.</strong> Like most websites, our hosting provider records basic technical data such as your IP
            address, browser type, device, pages visited and the date and time of your visit. This is used for security and to keep the Website working
            properly.
          </p>
          <p>
            We do not knowingly collect sensitive personal data such as passwords, bank or card details, or government ID numbers through the Website.
            Please do not send these to us through the enquiry forms.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "How we use your information",
      body: (
        <>
          <p>We use your information only for purposes connected with your enquiry and our services, including to:</p>
          <ul>
            <li>respond to your enquiry and share details of properties, projects or interior services you asked about;</li>
            <li>arrange site visits, consultations and follow-up calls;</li>
            <li>help you buy, sell, rent or furnish a property, and coordinate with the developer, owner or tenant involved;</li>
            <li>send you relevant updates about new projects and offers, where you have agreed to receive them;</li>
            <li>keep records of our communication, improve our Website and services, and prevent fraud or misuse;</li>
            <li>comply with legal, regulatory and RERA requirements.</li>
          </ul>
        </>
      ),
    },
    {
      id: "forms-and-storage",
      title: "Enquiry forms, WhatsApp and email",
      body: (
        <>
          <p>
            When you submit a form on the Website, your details are saved securely in our enquiry database (hosted on Google Firebase) so that our team
            can respond to you. The form then opens WhatsApp or your email app with a pre-filled message, which you can review before sending.
          </p>
          <p>
            Messages you send us on WhatsApp are also subject to WhatsApp&apos;s own privacy policy, and emails to your email provider&apos;s policy.
          </p>
        </>
      ),
    },
    {
      id: "sharing",
      title: "Who we share it with",
      body: (
        <>
          <p>We do not sell or rent your personal information. We share it only where needed to serve you:</p>
          <ul>
            <li>with Abhee Ventures and the developers, property owners, buyers or tenants involved in your enquiry;</li>
            <li>with our interior design and execution partners, when you ask for interior services;</li>
            <li>with service providers who help us run the Website and our business (such as hosting, database and communication tools), under obligations to keep it confidential;</li>
            <li>with banks or home-loan partners, only if you ask us to connect you with them;</li>
            <li>with authorities where required by law, court order or to protect our rights and the safety of others.</li>
          </ul>
        </>
      ),
    },
    {
      id: "third-party",
      title: "Third-party services and links",
      body: (
        <p>
          The Website uses embedded Google Maps on property pages and may link to WhatsApp, social media and developer websites. These services may
          collect information according to their own privacy policies, which we do not control. We encourage you to read them before sharing information.
        </p>
      ),
    },
    {
      id: "cookies",
      title: "Cookies",
      body: (
        <p>
          The Website does not use advertising or tracking cookies of its own. Embedded Google Maps, WhatsApp and other third-party services may set
          their own cookies when you use them. You can block or delete cookies in your browser settings; some features may then not work as
          intended.
        </p>
      ),
    },
    {
      id: "retention-security",
      title: "Data retention and security",
      body: (
        <>
          <p>
            We keep your information only as long as needed to handle your enquiry, provide our services, and meet legal and accounting requirements.
            After that, we delete or anonymise it.
          </p>
          <p>
            We use reasonable technical and organisational safeguards — such as access controls and encrypted connections (HTTPS) — to protect your
            data. However, no method of transmission or storage over the internet is completely secure, and we cannot guarantee absolute security.
          </p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "Your rights and choices",
      body: (
        <>
          <p>Subject to applicable law, you can:</p>
          <ul>
            <li>ask for a summary of the personal data we hold about you;</li>
            <li>ask us to correct, update or complete your information;</li>
            <li>withdraw your consent and ask us to delete your information, unless we must keep it by law;</li>
            <li>opt out of marketing messages at any time by replying &ldquo;STOP&rdquo; or telling our team;</li>
            <li>raise a grievance about how we handle your data.</li>
          </ul>
          <p>
            To use any of these rights, contact us using the details below. We will respond within a reasonable time and in any case within the period
            required by law.
          </p>
        </>
      ),
    },
    {
      id: "children",
      title: "Children's privacy",
      body: (
        <p>
          Our services are meant for adults. We do not knowingly collect personal data from anyone under 18. If you believe a child has shared their
          details with us, please contact us and we will delete them.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: (
        <p>
          We may update this Privacy Policy from time to time. The latest version will always be on this page with its &ldquo;Last updated&rdquo; date.
          Please check it periodically. Continuing to use the Website after changes means you accept the updated policy.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact and grievances",
      body: (
        <>
          <p>For questions, requests or complaints about your personal data, please contact us:</p>
          <ul>
            <li>
              <strong>Email:</strong> <a href={mailtoHref("Privacy request")}>{site.email}</a>
            </li>
            <li>
              <strong>Phone:</strong> <a href={telHref()}>{site.phone}</a>
            </li>
            <li>
              <strong>Address:</strong> {site.address}
            </li>
          </ul>
          <p>
            Please also read our <Link href="/terms-and-conditions/">Terms &amp; Conditions</Link>.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How we collect, use and protect the information you share with Alven Homz."
      updated={UPDATED}
      sections={sections}
    />
  );
}
