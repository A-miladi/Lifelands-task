"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Game } from "@/lib/types/game";
import type { GamesPage } from "@/lib/types/api";
import { filterGames, extractCategories, type FilterState } from "@/lib/filter";
import { sortGames, isSortKey, type SortKey } from "@/lib/sort";
import { isVendor } from "@/lib/config/vendors";
import { useUrlState } from "@/hooks/useUrlState";
import { useFavorites } from "@/hooks/useFavorites";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { SearchBar } from "./SearchBar";
import { SortSelect } from "./SortSelect";
import { FilterPanel, type FilterPatch } from "./FilterPanel";
import { FavoritesToggle } from "./FavoritesToggle";
import { GameList } from "./GameList";
import { LoadMoreButton } from "./LoadMoreButton";
import { EmptyState } from "./EmptyState";
import { ParticleBackground } from "../ui/ParticleBackground";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/Button";

type GameExplorerProps = {
  initialData: GamesPage;
};

export function GameExplorer({ initialData }: GameExplorerProps) {
  useEffect(() => {
    void useFavoritesStore.persist.rehydrate();
  }, []);

  const [search, setSearch] = useUrlState<string>("q", "");
  const [sortParam, setSortParam] = useUrlState<string>("sort", "score");
  const [vendorParams, setVendorParams] = useUrlState<string[]>("vendor", []);
  const [categoryParams, setCategoryParams] = useUrlState<string[]>("cat", []);
  const [minScoreParam, setMinScoreParam] = useUrlState<string>("min", "");
  const [maxScoreParam, setMaxScoreParam] = useUrlState<string>("max", "");
  const [favParam, setFavParam] = useUrlState<string>("fav", "");

  const { favorites } = useFavorites();

  const router = useRouter();
  const pathname = usePathname();

  const [games, setGames] = useState<Game[]>(initialData.games);
  const [currentPage, setCurrentPage] = useState(initialData.pageId);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reachedEnd, setReachedEnd] = useState(
    initialData.games.length < initialData.eachPerPage,
  );
  const abortRef = useRef<AbortController | null>(null);

  const filters: FilterState = useMemo(
    () => ({
      search,
      vendors: vendorParams.filter(isVendor),
      categories: categoryParams,
      minScore: minScoreParam === "" ? null : Number(minScoreParam),
      maxScore: maxScoreParam === "" ? null : Number(maxScoreParam),
      favoritesOnly: favParam === "1",
    }),
    [
      search,
      vendorParams,
      categoryParams,
      minScoreParam,
      maxScoreParam,
      favParam,
    ],
  );

  const sortKey: SortKey = isSortKey(sortParam) ? sortParam : "score";

  const availableCategories = useMemo(() => extractCategories(games), [games]);

  const filtered = useMemo(
    () => filterGames(games, filters, favorites),
    [games, filters, favorites],
  );

  const sorted = useMemo(
    () => sortGames(filtered, sortKey, "desc"),
    [filtered, sortKey],
  );

  const patchFilters = useCallback(
    (patch: FilterPatch) => {
      if (patch.search !== undefined) setSearch(patch.search);
      if (patch.vendors !== undefined) setVendorParams(patch.vendors);
      if (patch.categories !== undefined) setCategoryParams(patch.categories);
      if (patch.minScore !== undefined)
        setMinScoreParam(patch.minScore === null ? "" : String(patch.minScore));
      if (patch.maxScore !== undefined)
        setMaxScoreParam(patch.maxScore === null ? "" : String(patch.maxScore));
    },
    [
      setSearch,
      setVendorParams,
      setCategoryParams,
      setMinScoreParam,
      setMaxScoreParam,
    ],
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete("q");
    params.delete("sort");
    params.delete("vendor");
    params.delete("cat");
    params.delete("min");
    params.delete("max");
    params.delete("fav");
    const q = params.toString();
    router.replace(q.length > 0 ? `${pathname}?${q}` : pathname, {
      scroll: false,
    });
  }, [router, pathname]);

  const loadMore = useCallback(async () => {
    if (loadingMore || reachedEnd) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingMore(true);
    setLoadError(null);

    try {
      const nextPage = currentPage + 1;
      const res = await fetch(`/api/games?page=${nextPage}`, {
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`خطا در دریافت صفحه بعدی (HTTP ${res.status})`);
      }
      const payload = (await res.json()) as GamesPage;

      setGames((prev) => {
        const seen = new Set(prev.map((g) => g._id));
        const merged = [...prev];
        for (const g of payload.games) {
          if (!seen.has(g._id)) merged.push(g);
        }
        return merged;
      });
      setCurrentPage(nextPage);

      if (payload.games.length < payload.eachPerPage) setReachedEnd(true);
      if (payload.games.length === 0) setReachedEnd(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setLoadError(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      if (abortRef.current === controller) {
        setLoadingMore(false);
        abortRef.current = null;
      }
    }
  }, [currentPage, loadingMore, reachedEnd]);

  const hasMore = !reachedEnd && games.length < initialData.total;

  const isFiltering =
    filters.search.trim() !== "" ||
    filters.vendors.length > 0 ||
    filters.categories.length > 0 ||
    filters.minScore !== null ||
    filters.maxScore !== null ||
    filters.favoritesOnly;

  return (
    <section
      aria-label="کاوش بازیها"
      className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8"
    >
      <ParticleBackground count={20} cycleDurationSec={14} opacity={0.45} />
      <header className="mb-8 flex max-md:flex-col md:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/25">
            <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 text-white">
              <path fill="currentColor" d="M8 5v14l11-7L8 5Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              کاوش بازی ها
            </h1>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          بازی بعدی موردعلاقه خودت رو کشف کن
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:h-fit">
          <div className="relative z-30 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[var(--shadow-card)]">
            <SearchBar value={search} onChange={setSearch} delay={300} />
          </div>

          <div className="relative z-20 flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[var(--shadow-card)]">
            <SortSelect value={sortKey} onChange={(k) => setSortParam(k)} />
            <FavoritesToggle
              active={filters.favoritesOnly}
              onChange={(v) => setFavParam(v ? "1" : "")}
            />
          </div>

          <div className="relative z-10">
            <FilterPanel
              filters={filters}
              availableCategories={availableCategories}
              onChange={patchFilters}
              onClear={clearFilters}
            />
          </div>
          <Button onClick={() => router.push("/challenge")}>بازی همستر</Button>
        </aside>

        <div className="flex flex-col gap-5">
          {sorted.length === 0 ? (
            <EmptyState
              title={isFiltering ? "بازیای یافت نشد" : "هنوز بازیای نیست"}
              description={
                isFiltering
                  ? "فیلترها یا عبارت جستجو را تغییر دهید."
                  : "در حال حاضر هیچ بازیای در دسترس نیست."
              }
              actionLabel={isFiltering ? "حذف فیلترها" : undefined}
              onAction={isFiltering ? clearFilters : undefined}
            />
          ) : (
            <GameList games={sorted} />
          )}

          {loadError ? (
            <p role="alert" className="text-sm text-red-600">
              {loadError}
            </p>
          ) : null}

          {sorted.length > 0 ? (
            <LoadMoreButton
              hasMore={hasMore}
              loading={loadingMore}
              onClick={loadMore}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
