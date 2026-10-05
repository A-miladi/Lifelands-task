"use client";

import { useCallback, useMemo } from "react";
import { useFavoritesStore } from "@/stores/favoritesStore";

export function useFavorites(): {
  favorites: ReadonlySet<string>;
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
  count: number;
} {
  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleRaw = useFavoritesStore((s) => s.toggle);

  const toggle = useCallback((id: string) => toggleRaw(id), [toggleRaw]);
  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  return useMemo(
    () => ({ favorites, toggle, isFavorite, count: favorites.size }),
    [favorites, toggle, isFavorite],
  );
}
