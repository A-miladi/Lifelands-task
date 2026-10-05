"use client";

import { useEffect, useRef, useState } from "react";
import { resolveImageUrl } from "@/lib/image";

type GameCardImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

const FALLBACK_TIMEOUT_MS = 4000;

type Status = "loading" | "loaded" | "failed";

export function GameCardImage({
  src,
  alt,
  priority = false,
}: GameCardImageProps) {
  const resolved = src ? resolveImageUrl(src) : null;

  const [status, setStatus] = useState<Status>(resolved ? "loading" : "failed");
  const timeoutRef = useRef<number | null>(null);

  const [prevResolved, setPrevResolved] = useState(resolved);
  if (resolved !== prevResolved) {
    setPrevResolved(resolved);
    setStatus(resolved ? "loading" : "failed");
  }

  useEffect(() => {
    if (status !== "loading" || !resolved) return;

    timeoutRef.current = window.setTimeout(() => {
      setStatus("failed");
    }, FALLBACK_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [status, resolved]);

  const handleLoad = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStatus("loaded");
  };

  const handleError = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStatus("failed");
  };

  return (
    <div
      role="img"
      aria-label={alt}
      className="relative aspect-video w-full shrink-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
    >
      {status === "loading" ? <LoadingPlaceholder /> : null}
      {status === "failed" ? <FailedPlaceholder /> : null}

      {status !== "failed" && resolved ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={resolved}
          alt=""
          aria-hidden
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className={
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 " +
            (status === "loaded" ? "opacity-100" : "opacity-0")
          }
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : null}
    </div>
  );
}

function LoadingPlaceholder() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.15) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.6s linear infinite",
        }}
      />
      <svg
        viewBox="0 0 24 24"
        className="relative h-6 w-6 animate-spin text-slate-300"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" opacity="0.25" />
        <path d="M22 12a10 10 0 0 0-10-10" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function FailedPlaceholder() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex flex-col items-center justify-center gap-2.5"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-brand-100/60" />
        <div className="absolute inset-2 rounded-full bg-brand-200/40" />
        <svg
          viewBox="0 0 24 24"
          className="relative h-7 w-7 text-brand-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8h12a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4h-1.5l-1.2-2h-6.6l-1.2 2H6a4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4Z" />
          <line x1="8" y1="12" x2="8" y2="14" />
          <line x1="7" y1="13" x2="9" y2="13" />
          <circle cx="16" cy="13" r="0.8" fill="currentColor" />
          <circle cx="18" cy="11" r="0.8" fill="currentColor" />
        </svg>
      </div>

      <span className="relative text-[11px] font-medium text-slate-400">
        تصویری برای نمایش نیست
      </span>
    </div>
  );
}
