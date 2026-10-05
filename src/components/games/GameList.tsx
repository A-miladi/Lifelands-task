"use client";

import { memo } from "react";
import type { Game } from "@/lib/types/game";
import { GameCard } from "./GameCard";

type GameListProps = {
  games: readonly Game[];
};

export const GameList = memo(function GameList({ games }: GameListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 ">
      {games.map((game, index) => (
        <GameCard key={game._id} game={game} priority={index < 4} />
      ))}
    </div>
  );
});
