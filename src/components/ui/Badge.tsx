import type { ReactNode } from "react";

export type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "brand" | "success";
  onRemove?: () => void;
  removeLabel?: string;
};

export function Badge({
  children,
  variant = "default",
  onRemove,
  removeLabel = "حذف",
}: BadgeProps) {
  const cls =
    variant === "brand"
      ? "border-brand-200/70 bg-brand-50 text-brand-700"
      : variant === "success"
        ? "border-emerald-200/70 bg-emerald-50 text-emerald-700"
        : "border-gray-200 bg-gray-50 text-gray-700";

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-medium leading-5 ${cls}`}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="-mr-0.5 rounded p-0.5 transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <svg aria-hidden viewBox="0 0 20 20" className="h-3 w-3">
            <path
              fill="currentColor"
              d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
            />
          </svg>
        </button>
      ) : null}
    </span>
  );
}
