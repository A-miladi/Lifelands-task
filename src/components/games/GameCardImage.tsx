"use client";

import Image from "next/image";
import { useState } from "react";
import { resolveImageUrl } from "@/lib/image";

type GameCardImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function GameCardImage({
  src,
  alt,
  priority = false,
}: GameCardImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const resolved = src ? resolveImageUrl(src) : null;

  return (
    <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {showImage && resolved ? (
        <Image
          src={resolved}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          priority={priority}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
          <span className="text-[11px] font-medium">تصویری برای نمایش نیست</span>
        </div>
      )}
    </div>
  );
}
