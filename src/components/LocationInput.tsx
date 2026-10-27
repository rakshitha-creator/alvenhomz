"use client";

import { useId, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/** Text input with keyboard-accessible location suggestions (combobox pattern). */
export default function LocationInput({
  value,
  onChange,
  suggestions,
  placeholder = "City or locality",
  className,
  inputClassName,
  label = "Location",
}: {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  label?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    const list = q ? suggestions.filter((s) => s.toLowerCase().includes(q)) : suggestions.filter((s) => !s.includes(","));
    return list.slice(0, 8);
  }, [value, suggestions]);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
    setActive(-1);
  };

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gold-600" aria-hidden />
      <input
        id={id}
        role="combobox"
        aria-expanded={open && matches.length > 0}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => (blurTimer.current = setTimeout(() => setOpen(false), 120))}
        onKeyDown={(e) => {
          if (!open || !matches.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => (a + 1) % matches.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => (a - 1 + matches.length) % matches.length);
          } else if (e.key === "Enter" && active >= 0) {
            e.preventDefault();
            pick(matches[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className={cn("input pl-10", inputClassName)}
      />
      {open && matches.length > 0 && (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-auto rounded-xl border border-line bg-white py-1.5 text-left shadow-lift"
        >
          {matches.map((m, i) => (
            <li
              key={m}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                clearTimeout(blurTimer.current);
                pick(m);
              }}
              className={cn("flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-navy-900", i === active ? "bg-ivory" : "hover:bg-ivory")}
            >
              <MapPin className="h-3.5 w-3.5 text-muted" />
              {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
