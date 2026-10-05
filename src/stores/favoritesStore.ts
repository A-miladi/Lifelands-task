"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  favorites: Set<string>;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: new Set<string>(),
      toggle: (id) => {
        const next = new Set(get().favorites);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        set({ favorites: next });
      },
      has: (id) => get().favorites.has(id),
      clear: () => set({ favorites: new Set<string>() }),
    }),
    {
      name: "lifelands:favorites",
      skipHydration: true,
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          try {
            const parsed = JSON.parse(raw) as {
              state: { favorites: string[] };
            };
            return { state: { favorites: new Set(parsed.state.favorites) } };
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          const serialized = JSON.stringify({
            state: { favorites: Array.from(value.state.favorites) },
          });
          localStorage.setItem(name, serialized);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
