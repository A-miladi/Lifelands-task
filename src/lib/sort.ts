import type { Game } from "@/lib/types/game";
import { getQualityScore } from "./quality";

type NumericKeys = {
  [K in keyof Game]: Game[K] extends number ? K : never;
}[keyof Game];

const SORT_KEY_CANDIDATES = [
  "score",
  "runCount",
  "seenCount",
  "like",
] as const satisfies readonly NumericKeys[];

export const SORT_KEYS = [...SORT_KEY_CANDIDATES, "quality"] as const;

export type SortKey = (typeof SORT_KEYS)[number];

export const SORT_LABELS: Record<SortKey, string> = {
  score: "امتیاز",
  runCount: "تعداد اجرا",
  seenCount: "تعداد بازدید",
  like: "لایک",
  quality: "کیفیت کلی",
};

export function isSortKey(value: string): value is SortKey {
  return (SORT_KEYS as readonly string[]).includes(value);
}

function valueOf(game: Game, key: SortKey): number {
  if (key === "quality") return getQualityScore(game);
  const raw: number = game[key];
  return Number.isFinite(raw) ? raw : 0;
}

export function sortGames(
  games: readonly Game[],
  key: SortKey,
  direction: "asc" | "desc" = "desc",
): Game[] {
  const dir = direction === "desc" ? -1 : 1;

  return [...games].sort((a, b) => {
    const av = valueOf(a, key);
    const bv = valueOf(b, key);
    if (av === bv) return 0;
    return av < bv ? -dir : dir;
  });
}
