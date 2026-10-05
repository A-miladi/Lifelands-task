import type { Game } from "@/lib/types/game";

export function getQualityScore(game: Game): number {
  const safeScore = Number.isFinite(game.score) ? Math.max(0, game.score) : 0;
  const safeRating = Number.isFinite(game.rating)
    ? Math.max(0, game.rating)
    : 0;
  const safeLike = Number.isFinite(game.like) ? Math.max(0, game.like) : 0;

  return safeScore * 2 + safeRating * 1.5 + Math.log10(1 + safeLike) * 1.2;
}
