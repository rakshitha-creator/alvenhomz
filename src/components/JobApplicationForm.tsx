"use client";

import { useEffect, useId, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { mailtoHref } from "@/lib/contact";

const APPLY_EVENT = "alvenhomz:apply-for-job";

export const GENERAL_APPLICATION = "General Application";

export function ApplyForRoleButton({ role, label = "Apply for this role", className = "btn-outline mt-7 self-start" }: { role: string; label?: string; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      aria-label={role === GENERAL_APPLICATION ? label : `${label}: ${role}`}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(APPLY_EVENT, { detail: role }));
        document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {label} <ArrowRight className="h-4 w-4" aria-hidden />
    </button>
  );
}

type FormValues = {
  role: string;
  name: string;
  phone: string;
  email: string;
  experience: string;
  profileUrl: string;
  message: string;
};

const EMPTY_VALUES: FormValues = { role: "", name: "", phone: "", email: "", experience: "", profileUrl: "", message: "" };
const PHONE_RE = /^(\+?91)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function JobApplicationForm({ roles }: { roles: string[] }) {
  const uid = useId();
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const selectRole = (event: Event) => {
      const role = (event as CustomEvent<string>).detail;
      setValues((current) => ({ ...current, role }));
      setErrors((current) => ({ ...current, role: undefined }));
      setSent(false);
    };
    window.addEventListener(APPLY_EVENT, selectRole);
    return () => window.removeEventListener(APPLY_EVENT, selectRole);
  }, []);

  const set = (key: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    setSent(false);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (!values.role) nextErrors.role = "Select the role you are applying for.";
    if (values.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, ""))) nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!EMAIL_RE.test(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!values.experience) nextErrors.experience = "Select your total experience.";
    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0] as keyof FormValues | undefined;
    if (firstError) {
      document.getElementById(`${uid}-${firstError}`)?.focus();
      return;
    }

    const message = [
      `Job application: ${values.role}`,
      "",
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `Email: ${values.email.trim()}`,
      `Total experience: ${values.experience}`,
      values.profileUrl.trim() ? `Resume / LinkedIn: ${values.profileUrl.trim()}` : "",
      values.message.trim() ? `Message: ${values.message.trim()}` : "",
    ].filter(Boolean).join("\n");

    try {
      const [{ createLead }, { isFirebaseConfigured }] = await Promise.all([
        import("@/lib/firebase-data"),
        import("@/lib/firebase"),
      ]);
      if (isFirebaseConfigured()) {
        await createLead({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          interest: values.role,
          message,
          source: "careers",
          createdAt: new Date().toISOString(),
          status: "new",
        });
      }
    } catch {
      // Storage is best-effort; the completed email application still opens.
    }

    setSent(true);
    window.location.href = mailtoHref(`Application: ${values.role}`, message);
  };

  const fieldError = (key: keyof FormValues) => errors[key] ? `${uid}-${key}-error` : undefined;

  return (
    <section id="apply" className="scroll-mt-28 bg-espresso-950 py-20 text-white sm:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="eyebrow text-gold-300">Apply now</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Apply to Alven Homz</h2>
          <p className="mt-3 font-display text-lg text-gold-300 italic">Show us the work you&apos;re proud of.</p>
          <p className="mt-5 leading-relaxed text-white/75">
            Share your résumé and the role you&apos;re applying for. For a design role, include a portfolio link and explain your contribution to each featured
            project, such as concept development, drawings, materials or site coordination.
          </p>
          <p className="mt-4 text-sm text-white/60">Your email app opens with the application ready to send. Attach your résumé if you haven&apos;t included a link.</p>
        </div>
        <form onSubmit={submit} noValidate className="grid gap-4 rounded-3xl bg-white p-6 text-navy-900 sm:grid-cols-2 sm:p-8">
          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-role`} className="label">Position *</label>
            <select id={`${uid}-role`} className="input" value={values.role} onChange={set("role")} aria-invalid={Boolean(errors.role)} aria-describedby={fieldError("role")}>
              <option value="">Select a position</option>
              {roles.map((role) => <option key={role}>{role}</option>)}
            </select>
            {errors.role ? <p id={`${uid}-role-error`} className="mt-1.5 text-xs font-medium text-red-600" role="alert">{errors.role}</p> : null}
          </div>
          {([
            ["name", "Full name *", "text", "Your name"],
            ["phone", "Mobile number *", "tel", "98765 43210"],
            ["email", "Email address *", "email", "you@example.com"],
          ] as const).map(([key, label, type, placeholder]) => (
            <div key={key} className={key === "email" ? "sm:col-span-2" : undefined}>
              <label htmlFor={`${uid}-${key}`} className="label">{label}</label>
              <input id={`${uid}-${key}`} className="input" type={type} value={values[key]} onChange={set(key)} placeholder={placeholder} autoComplete={key === "phone" ? "tel" : key} aria-invalid={Boolean(errors[key])} aria-describedby={fieldError(key)} />
              {errors[key] ? <p id={`${uid}-${key}-error`} className="mt-1.5 text-xs font-medium text-red-600" role="alert">{errors[key]}</p> : null}
            </div>
          ))}
          <div>
            <label htmlFor={`${uid}-experience`} className="label">Total experience *</label>
            <select id={`${uid}-experience`} className="input" value={values.experience} onChange={set("experience")} aria-invalid={Boolean(errors.experience)} aria-describedby={fieldError("experience")}>
              <option value="">Select experience</option>
              {["Fresher", "Under 1 year", "1–2 Years", "3–4 Years", "5–6 Years", "7–8 Years", "9+ Years"].map((item) => <option key={item}>{item}</option>)}
            </select>
            {errors.experience ? <p id={`${uid}-experience-error`} className="mt-1.5 text-xs font-medium text-red-600" role="alert">{errors.experience}</p> : null}
          </div>
          <div>
            <label htmlFor={`${uid}-profileUrl`} className="label">Resume or LinkedIn link</label>
            <input id={`${uid}-profileUrl`} className="input" type="url" value={values.profileUrl} onChange={set("profileUrl")} placeholder="https://" inputMode="url" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-message`} className="label">Message</label>
            <textarea id={`${uid}-message`} className="input min-h-28 resize-y" value={values.message} onChange={set("message")} placeholder="Tell us briefly about your experience." />
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <button type="submit" className="btn-gold">Send Application <ArrowRight className="h-4 w-4" aria-hidden /></button>
            {sent ? <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" aria-hidden /> Application prepared. Please send it from your email app.</p> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
