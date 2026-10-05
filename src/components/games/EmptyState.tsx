"use client";

import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white/60 py-16 text-center backdrop-blur-sm"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50 shadow-inner">
        <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 text-gray-400">
          <path
            fill="currentColor"
            d="M10 2a8 8 0 1 0 4.9 14.3l4.4 4.4a1 1 0 0 0 1.4-1.4l-4.4-4.4A8 8 0 0 0 10 2Zm-6 8a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        {description ? (
          <p className="max-w-md text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
      {actionLabel && onAction ? (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
