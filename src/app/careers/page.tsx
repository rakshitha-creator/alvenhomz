import { ArrowRight, BriefcaseBusiness, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import Faq, { type FaqItem } from "@/components/Faq";
import JobApplicationForm, { ApplyForRoleButton, GENERAL_APPLICATION } from "@/components/JobApplicationForm";
import { PageHero, SectionHeading } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Real Estate & Interior Design Careers",
  description: "Explore Bengaluru careers at Alven Homz across residential real estate, interior design, site execution and client advisory.",
  path: "/careers/",
  image: "office-cowork",
});

const FAQS: FaqItem[] = [
  {
    q: "Where are Alven Homz roles based?",
    a: "Alven Homz is based in Bengaluru. The individual role description specifies the office or project site and any travel associated with the work.",
  },
  {
    q: "Should I include a portfolio when applying for a design role?",
    a: "Yes. Include a portfolio link and describe your contribution to the work shown. Choose examples that reflect the skills listed for the role.",
  },
  {
    q: "How do I know whether a role is open?",
    a: "Check the current openings list, then open the relevant posting for its responsibilities and application instructions.",
  },
];


const jobs = [
  {
    title: "Accounts Executive – Interiors & Real Estate",
    department: "Accounts & Finance",
    experience: "3–6 Years",
    employmentType: "Full-Time",
    reportingTo: "General Manager / Business Head",
    location: "HSR Layout",
  },
  {
    title: "Interior Execution Supervisor",
    department: "Project Execution",
    industry: "Interior Design / Furniture / Turnkey Interiors",
    experience: "3–7 Years",
    employmentType: "Full-Time",
    reportingTo: "Sales Head",
  },
  {
    title: "Sales Executive – Interior Design",
    department: "Sales & Business Development",
    industry: "Interior Design / Furniture / Modular Kitchens / Turnkey Interiors",
    experience: "0–2 Years",
    employmentType: "Full-Time",
    reportingTo: "Sales Manager / Sales Head",
    location: "HSR Layout, Bengaluru",
  },
  {
    title: "Presales Executive – Real Estate",
    department: "Sales & Business Development",
    industry: "Residential Real Estate – Primary Sales",
    experience: "3–6 Years",
    employmentType: "Full-Time",
    reportingTo: "Sales Head / General Manager",
  },
  {
    title: "Presales Executive",
    department: "Sales & Business Development",
    industry: "Interior Design / Furniture / Turnkey Interiors",
    experience: "0–2 Years",
    employmentType: "Full-Time",
    reportingTo: "Sales Head",
  },
  {
    title: "Primary Sales – Real Estate",
    department: "Sales & Business Development",
    industry: "Residential Real Estate – Primary Sales",
    experience: "0–2 Years",
    reportingTo: "Sales Head / General Manager",
  },
  {
    title: "Senior Sales Manager – Real Estate",
    department: "Sales & Business Development",
    industry: "Residential Real Estate – Primary Sales",
    experience: "5–8 Years",
    employmentType: "Full-Time",
    reportingTo: "Sales Head / General Manager",
  },
  {
    title: "Sales Manager – Interior Design",
    department: "Sales & Business Development",
    industry: "Interior Design / Furniture / Modular Kitchens / Turnkey Interiors",
    experience: "5–6 Years",
    employmentType: "Full-Time",
    reportingTo: "Sales Head / General Manager",
    location: "HSR Layout, Bengaluru",
  },
  {
    title: "Senior Interior Designer",
    department: "Sales & Business Development",
    industry: "Interior Design / Furniture / Turnkey Interiors",
    experience: "2–6 Years",
    employmentType: "Full-Time",
    reportingTo: "Sales Head / General Manager",
    location: "HSR Layout",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        bannerId="careers"
        eyebrow="Careers"
        title="Careers at Alven Homz in Bengaluru"
        caption="Do work people come home to."
        description="Explore Bengaluru careers in residential property, interior design, client advisory and site execution. At Alven Homz, each role contributes to how a client chooses a home, prepares it for its next occupant or sees a design through from brief to handover."
        image={img("office-cowork")}
        actions={
          <a href="#open-roles" className="btn-gold">
            View Open Roles <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />

      <section className="container-x py-20 sm:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Culture</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">How we work</h2>
          <p className="mt-3 font-display text-lg text-gold-700 italic">Good work starts with ownership.</p>
          <p className="mt-5 leading-relaxed text-navy-800">
            Property, design and site teams work from the same client brief. We value colleagues who explain decisions clearly, follow through on commitments
            and pay attention to details, from the accuracy of a listing to the finish of a piece of joinery.
          </p>
        </Reveal>
      </section>

      <section id="open-roles" className="scroll-mt-28 bg-ivory py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Current openings"
            title="Open roles"
            caption="Find the role that fits your craft."
            description="Browse current openings in Bengaluru. Read the role description for its day-to-day responsibilities, experience requirements and any site or travel commitments."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {jobs.map((job, index) => {
              const fields = [
                ["Department", job.department],
                ["Industry", job.industry],
                ["Experience", job.experience],
                ["Employment Type", job.employmentType],
                ["Reporting To", job.reportingTo],
              ].filter((field): field is [string, string] => Boolean(field[1]));
              return (
                <Reveal key={job.title} delay={(index % 2) * 80} className="card flex h-full flex-col p-7 sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-espresso-900 text-gold-400">
                      <BriefcaseBusiness className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] text-gold-700 uppercase">{job.department}</p>
                      <h3 className="mt-1 text-2xl font-semibold">{job.title}</h3>
                    </div>
                  </div>
                  {job.location ? (
                    <p className="mt-5 flex items-center gap-2 text-base text-muted">
                      <MapPin className="h-4 w-4 shrink-0 text-gold-600" aria-hidden /> {job.location}
                    </p>
                  ) : null}
                  <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-sm">
                    {fields.map(([label, value]) => (
                      <div key={label} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
                        <dt className="font-semibold text-navy-900">{label}</dt>
                        <dd className="leading-relaxed text-muted">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <ApplyForRoleButton role={job.title} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <JobApplicationForm roles={[...jobs.map((job) => job.title), GENERAL_APPLICATION]} />

      <section className="container-x py-20 sm:py-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-espresso-900 p-8 text-white sm:p-12 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-white">General applications</h2>
            <p className="mt-2 font-display text-lg text-gold-300 italic">Tell us what you&apos;d like to build here.</p>
            <p className="mt-3 leading-relaxed text-white/75">
              If your experience spans residential real estate or interiors, tell us which work you&apos;d like to take on and share a brief example of a
              project you helped deliver.
            </p>
          </div>
          <ApplyForRoleButton role={GENERAL_APPLICATION} label="Introduce Yourself" className="btn-gold shrink-0" />
        </div>
      </section>

      <Faq items={FAQS} className="pt-0" />
    </>
  );
}
