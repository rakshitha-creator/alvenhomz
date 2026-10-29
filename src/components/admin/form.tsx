import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="label mb-1.5 block">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function FormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("input", props.className)} />;
}

export function FormTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("input min-h-[100px]", props.className)} />;
}

export function FormSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("input", props.className)} />;
}

export function FormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card space-y-4 p-5">
      <h2 className="font-sans text-base font-bold text-navy-900">{title}</h2>
      {children}
    </section>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
