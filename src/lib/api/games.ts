import "server-only";
import { apiClient } from "./client";
import type { ApiEnvelope, GamesPage } from "@/lib/types/api";

export type GetGamesParams = {
  page?: number;
  search?: string;
  signal?: AbortSignal;
};

const EMPTY_PAGE: GamesPage = {
  pageId: 1,
  eachPerPage: 12,
  searchValue: "",
  total: 0,
  games: [],
};

export async function getGames({
  page = 1,
  search = "",
  signal,
}: GetGamesParams = {}): Promise<GamesPage> {
  try {
    const response = await apiClient.get<ApiEnvelope<GamesPage>>("/games", {
      params: { pageId: page, searchValue: search },
      signal,
    });

    if (!response.data.state) {
      return EMPTY_PAGE;
    }

    return response.data.data;
  } catch {
    return EMPTY_PAGE;
  }
}
