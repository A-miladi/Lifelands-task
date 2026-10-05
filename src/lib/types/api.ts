import type { Game } from "./game";

export type ApiEnvelope<T> = {
  state: boolean;
  data: T;
};

export type Paginated<TItem> = {
  pageId: number;
  eachPerPage: number;
  searchValue: string;
  total: number;
  games: TItem[];
};

export type GamesPage = Paginated<Game>;

export type GamesPageResult = {
  page: number;
  payload: GamesPage;
};
