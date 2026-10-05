"use client";

import { useState } from "react";
import { resolveImageUrl } from "@/lib/image";
import { getInitials } from "@/lib/format";

type AvatarProps = {
  src?: string;
  name: string;
  size?: number;
  className?: string;
};

export function Avatar({ src, name, size = 24, className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <span
      aria-hidden
      className={
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full " +
        "bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 " +
        "font-bold leading-none " +
        className
      }
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
    >
      {showImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={resolveImageUrl(src!)}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </span>
  );
}
