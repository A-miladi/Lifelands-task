"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "value" | "onChange" | "children" | "type"
> & {
  label?: string;
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید",
  className = "",
  id,
  disabled,
  ...rest
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const autoId = useId();
  const baseId = id ?? autoId;
  const listboxId = `${baseId}-listbox`;
  const labelId = `${baseId}-label`;

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value],
  );
  const selectedOption =
    selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const openDropdown = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const closeDropdown = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeDropdown();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLLIElement>(
      `[data-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const commit = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    closeDropdown();
    triggerRef.current?.focus();
  };

  const moveActive = (delta: 1 | -1) => {
    setActiveIndex((prev) => {
      if (options.length === 0) return -1;
      let next = prev;
      for (let i = 0; i < options.length; i++) {
        next = (next + delta + options.length) % options.length;
        const opt = options[next];
        if (opt && !opt.disabled) return next;
      }
      return prev;
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "Enter" ||
        e.key === " "
      ) {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        closeDropdown();
        break;
      case "ArrowDown":
        e.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        const opt = options[activeIndex];
        if (opt) commit(opt);
        break;
      }
      case "Tab":
        closeDropdown();
        break;
      default:
        break;
    }
  };

  const activeOptionId =
    open && activeIndex >= 0 ? `${baseId}-option-${activeIndex}` : undefined;

  return (
    <div ref={rootRef} className="flex flex-col gap-1.5">
      {label ? (
        <span id={labelId} className="text-sm font-medium text-gray-700">
          {label}
        </span>
      ) : null}

      <div className="relative">
        <button
          {...rest}
          ref={triggerRef}
          id={baseId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-activedescendant={activeOptionId}
          disabled={disabled}
          onClick={() => (open ? closeDropdown() : openDropdown())}
          onKeyDown={handleKeyDown}
          className={
            "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white px-3 " +
            "text-right text-base outline-none transition-colors " +
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 " +
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 " +
            (open ? "border-brand-500 " : "border-gray-300 ") +
            className
          }
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
            {selectedOption?.label ?? placeholder}
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
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">موردی نیست</li>
            ) : (
              options.map((opt, i) => {
                const isSelected = opt.value === value;
                const isActive = i === activeIndex;
                return (
                  <li
                    key={opt.value}
                    id={`${baseId}-option-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled || undefined}
                    onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(opt)}
                    className={
                      "flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm " +
                      (opt.disabled
                        ? "cursor-not-allowed text-gray-400 "
                        : isActive
                          ? "bg-brand-50 text-brand-700 "
                          : "text-gray-800 hover:bg-gray-50 ") +
                      (isSelected ? " font-semibold" : "")
                    }
                  >
                    <span>{opt.label}</span>
                    {isSelected ? (
                      <svg
                        aria-hidden
                        viewBox="0 0 20 20"
                        className="h-4 w-4 text-brand-600"
                      >
                        <path
                          fill="currentColor"
                          d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
                        />
                      </svg>
                    ) : null}
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
