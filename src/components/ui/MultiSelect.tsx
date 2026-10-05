"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { Badge } from "./Badge";

export type MultiSelectOption = {
  value: string;
  label: string;
};

export type MultiSelectProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "value" | "onChange"
> & {
  label?: string;
  options: readonly MultiSelectOption[];
  value: readonly string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید",
  className = "",
  ...rest
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const autoId = useId();
  const listboxId = `${autoId}-listbox`;
  const labelId = `${autoId}-label`;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const toggleOption = (v: string) => {
    const set = new Set(value);
    if (set.has(v)) set.delete(v);
    else set.add(v);
    onChange(Array.from(set));
  };

  const selectedOptions = options.filter((o) => value.includes(o.value));

  return (
    <div ref={rootRef} className="flex flex-col gap-1.5">
      {label ? (
        <span id={labelId} className="text-sm font-medium text-gray-700">
          {label}
        </span>
      ) : null}

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-labelledby={label ? labelId : undefined}
          onClick={() => setOpen((o) => !o)}
          className={
            "flex h-10 w-full items-center cursor-pointer justify-between gap-2 rounded-lg border bg-white px-3 " +
            "text-right text-base outline-none transition-colors " +
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 " +
            (open ? "border-brand-500 " : "border-gray-300 ") +
            className
          }
          {...rest}
        >
          <span
            className={value.length === 0 ? "text-gray-400" : "text-gray-900"}
          >
            {value.length === 0
              ? placeholder
              : `${value.length} مورد انتخاب شده`}
          </span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            <path
              fill="currentColor"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
            />
          </svg>
        </button>

        {open ? (
          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">موردی نیست</li>
            ) : (
              options.map((opt) => {
                const checked = value.includes(opt.value);
                return (
                  <li key={opt.value} role="option" aria-selected={checked}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOption(opt.value)}
                        className="h-4 w-4 accent-brand-600"
                      />
                      <span>{opt.label}</span>
                    </label>
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>

      {selectedOptions.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((o) => (
            <Badge
              key={o.value}
              onRemove={() => toggleOption(o.value)}
              removeLabel={`حذف ${o.label}`}
            >
              {o.label}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
