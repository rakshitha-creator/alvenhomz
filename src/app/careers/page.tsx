import { ArrowRight, BriefcaseBusiness, HeartHandshake, Lightbulb, MapPin, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import JobApplicationForm, { ApplyForRoleButton } from "@/components/JobApplicationForm";
import { PageHero, SectionHeading } from "@/components/ui";
import { mailtoHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Careers at Alven Homz – Build Better Home Experiences",
  description: "Explore career opportunities at Alven Homz and help us deliver trusted real estate, interior design and home services across Bangalore.",
  path: "/careers/",
  image: "office-cowork",
});

const reasons = [
  {
    icon: Users,
    title: "Work as one team",
    text: "Collaborate with experienced people across real estate, interiors and home services.",
  },
  {
    icon: Lightbulb,
    title: "Turn ideas into impact",
    text: "Help create practical solutions that make owning and managing a home easier.",
  },
  {
    icon: HeartHandshake,
    title: "Build lasting trust",
    text: "Put homeowners first and deliver thoughtful service at every stage of their journey.",
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
  const applicationHref = mailtoHref(
    "Career application – Alven Homz",
    "Hello Alven Homz team,\n\nI would like to explore career opportunities with Alven Homz. Please find my resume attached.\n\nName:\nPhone:\nArea of interest:\n",
  );

  return (
    <>
      <PageHero
        bannerId="careers"
        eyebrow="Careers"
        title="Build the future of home living with us"
        description="Join a team committed to making real estate and home services simpler, more trusted and more rewarding for homeowners across Bangalore."
        image={img("office-cowork")}
      />

      <section className="container-x py-20 sm:py-24">
        <SectionHeading
          eyebrow="Why Alven Homz"
          title="Do meaningful work, together"
          description="Backed by Abhee Ventures’ 17-year track record, Alven Homz brings established expertise and fresh thinking together under one roof."
          align="center"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {reasons.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 80} className="card p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-espresso-900 text-gold-400">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-5 text-2xl font-semibold">{title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ivory py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Current openings"
            title="Find your place at Alven Homz"
            description="Explore our current opportunities across real estate, interior design, sales, project execution and finance."
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
                    <p className="mt-5 flex items-center gap-2 text-sm text-muted">
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

      <JobApplicationForm roles={jobs.map((job) => job.title)} />

      <section className="container-x py-20 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="eyebrow">Don&rsquo;t see your role?</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Your next opportunity could start here</h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-navy-800">
              We are always interested in meeting thoughtful, driven people who care about great customer experiences. If your strengths are in real estate,
              sales, interior design, project management, operations or customer service, we would love to hear from you.
            </p>
          </Reveal>
          <Reveal delay={100} className="rounded-3xl bg-espresso-900 p-8 text-white sm:p-10">
            <h2 className="text-3xl font-semibold text-white">Introduce yourself</h2>
            <p className="mt-3 leading-relaxed text-white/70">
              Email your resume and tell us which area you would like to work in. Our team will get in touch when a suitable opportunity is available.
            </p>
            <a href={applicationHref} className="btn-gold mt-7">
              Send your resume <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
