import "server-only";
import { apiClient } from "./client";
import type { ApiEnvelope, GamesPage } from "@/lib/types/api";

export type GetGamesParams = {
  page?: number;
  search?: string;
  signal?: AbortSignal;
};

/**
 * fetch یک صفحه از بازی‌ها.
 * فقط server-side صدا زده می‌شود (client.ts با server-only محافظت شده).
 */
export async function getGames({
  page = 1,
  search = "",
  signal,
}: GetGamesParams = {}): Promise<GamesPage> {
  const response = await apiClient.get<ApiEnvelope<GamesPage>>("/games", {
    params: { pageId: page, searchValue: search },
    signal,
  });

  if (!response.data.state) {
    throw new Error("Lifelands API returned state:false");
  }

  return response.data.data;
}
