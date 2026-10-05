import type { Game } from "@/lib/types/game";
import { normalizeForSearch } from "./normalize";
import { isVendor, type Vendor } from "./config/vendors";

export type FilterState = {
  search: string;
  vendors: Vendor[];
  categories: string[];
  minScore: number | null;
  maxScore: number | null;
  favoritesOnly: boolean;
};

export const EMPTY_FILTERS: FilterState = {
  search: "",
  vendors: [],
  categories: [],
  minScore: null,
  maxScore: null,
  favoritesOnly: false,
};

export function filterGames(
  games: readonly Game[],
  filters: FilterState,
  favorites: ReadonlySet<string> = new Set(),
): Game[] {
  const needle = normalizeForSearch(filters.search);
  const vendorSet =
    filters.vendors.length > 0 ? new Set(filters.vendors) : null;
  const categorySet =
    filters.categories.length > 0 ? new Set(filters.categories) : null;
  const { minScore, maxScore, favoritesOnly } = filters;

  return games.filter((game) => {
    if (favoritesOnly && !favorites.has(game._id)) return false;

    if (needle.length > 0) {
      const inTitle = normalizeForSearch(game.title).includes(needle);
      const inCompany = normalizeForSearch(game.companyName).includes(needle);
      if (!inTitle && !inCompany) return false;
    }

    if (vendorSet) {
      const has = game.vitrinThirdPartyVendors.some(
        (v) => isVendor(v) && vendorSet.has(v),
      );
      if (!has) return false;
    }

    if (categorySet) {
      const cat = game.category?.title?.trim();
      if (!cat || !categorySet.has(cat)) return false;
    }

    if (minScore !== null && game.score < minScore) return false;
    if (maxScore !== null && game.score > maxScore) return false;

    return true;
  });
}

export function extractCategories(games: readonly Game[]): string[] {
  const set = new Set<string>();
  for (const g of games) {
    const t = g.category?.title?.trim();
    if (t) set.add(t);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "fa"));
}
