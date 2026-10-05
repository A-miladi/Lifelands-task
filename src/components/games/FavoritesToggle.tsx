"use client";

import { useFavorites } from "@/hooks/useFavorites";

type FavoritesToggleProps = {
  active: boolean;
  onChange: (next: boolean) => void;
};

export function FavoritesToggle({ active, onChange }: FavoritesToggleProps) {
  const { count } = useFavorites();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => onChange(!active)}
      className={
        "flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 " +
        (active
          ? "border-brand-500 bg-brand-50 text-brand-700"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50")
      }
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={`h-5 w-5 mb-1 ${active ? "fill-red-500 text-red-500" : "fill-none"}`}
        stroke="currentColor"
        strokeWidth={1}
      >
        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z" />
      </svg>
      <span> علاقه‌مندی ها</span>
      {count > 0 ? (
        <span className="rounded-full bg-brand-600 flex items-center justify-center pt-1 w-4 h-4 text-[10px] text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}
