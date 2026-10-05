"use client";

import { useFavoritesStore } from "@/stores/favoritesStore";

type FavoriteButtonProps = {
  gameId: string;
};

export function FavoriteButton({ gameId }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((s) => s.favorites.has(gameId));
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <button
      type="button"
      aria-label={
        isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
      }
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(gameId);
      }}
      className={
        "flex h-9 w-9 items-center justify-center rounded-full " +
        "bg-white/95 shadow-[0_1px_2px_rgba(15,23,42,0.15)] backdrop-blur-sm " +
        "transition-all duration-200 ease-[var(--ease-spring)] " +
        "hover:scale-110 active:scale-95 " +
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
      }
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={`h-4 w-4 transition-colors ${
          isFavorite ? "fill-red-500 text-red-500" : "fill-none text-gray-600"
        }`}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z" />
      </svg>
    </button>
  );
}
