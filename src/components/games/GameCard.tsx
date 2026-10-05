"use client";

import { memo } from "react";
import type { Game } from "@/lib/types/game";
import { formatFaNumber, formatScore, isRecentlyCreated } from "@/lib/format";
import { getQualityScore } from "@/lib/quality";
import { VENDOR_LABELS, isVendor } from "@/lib/config/vendors";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { GameCardImage } from "./GameCardImage";
import { FavoriteButton } from "./FavoriteButton";

type GameCardProps = {
  game: Game;
  priority?: boolean;
};

const MAX_TAGS = 2;

export const GameCard = memo(function GameCard({
  game,
  priority = false,
}: GameCardProps) {
  const vendors = game.vitrinThirdPartyVendors.filter(isVendor);
  const quality = getQualityScore(game);
  const isNew = isRecentlyCreated(game);
  const visibleTags = game.tags.slice(0, MAX_TAGS);

  return (
    <article
      title={game.description?.trim() || game.title}
      className={
        "group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white " +
        "shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease-out-expo)] " +
        "hover:-translate-y-1 hover:border-gray-300 hover:shadow-[var(--shadow-card-hover)]"
      }
    >
      <div className="relative">
        <GameCardImage src={game.image} alt={game.title} priority={priority} />
        <div className="absolute right-2.5 top-2.5 z-10">
          <FavoriteButton gameId={game._id} />
        </div>
        {isNew ? (
          <div className="absolute left-2.5 top-2.5 z-10">
            <span className="rounded-lg bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              جدید
            </span>
          </div>
        ) : null}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            سطح {formatFaNumber(game.level)}
          </span>
        </div>
        <div className="absolute left-2.5 bottom-2.5">
          <Badge variant="brand">{game.category.title.trim()}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <header className="flex flex-col gap-1.5">
          <h3 className="line-clamp-1 text-[15px] font-bold text-gray-900">
            {game.title}
          </h3>

          <div className="flex items-center gap-2">
            <Avatar
              src={game.creator.userId.profileImage}
              name={game.creator.fullName}
              size={22}
            />
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-[11px] font-medium text-gray-700">
                {game.creator.fullName}
              </span>
              <span className="truncate text-[10px] text-gray-400">
                {game.createdAt}
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-1">
          {vendors.map((v) => (
            <Badge key={v}>{VENDOR_LABELS[v]}</Badge>
          ))}
          {visibleTags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <dl className="mt-auto grid grid-cols-3 gap-1 border-t border-gray-100 pt-3 text-[11px]">
          <Stat label="امتیاز" value={formatScore(game.score)} tone="brand" />
          <Stat label="اجرا" value={formatFaNumber(game.runCount)} />
          <Stat label="کیفیت" value={formatScore(quality)} tone="quality" />

          <Stat label="نظر" value={formatFaNumber(game.commentCount)} />
          <Stat label="دانلود" value={formatFaNumber(game.downloadCount)} />
          <Stat label="لایک" value={formatFaNumber(game.like)} />
        </dl>
      </div>
    </article>
  );
});

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "brand" | "quality";
}) {
  const valueCls =
    tone === "brand"
      ? "text-brand-700"
      : tone === "quality"
        ? "text-amber-600"
        : "text-gray-800";
  return (
    <div className="flex bg-brand-50/30 rounded-lg border border-brand-50 flex-col items-center gap-0.5 py-1">
      <dt className="text-gray-400">{label}</dt>
      <dd className={`font-bold tabular-nums ${valueCls}`}>{value}</dd>
    </div>
  );
}
