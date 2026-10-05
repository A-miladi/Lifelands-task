"use client";

import { Button } from "@/components/ui/Button";

type LoadMoreButtonProps = {
  hasMore: boolean;
  loading: boolean;
  onClick: () => void;
};

export function LoadMoreButton({
  hasMore,
  loading,
  onClick,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <span className="h-px w-16 bg-gray-200" aria-hidden />
        <p className="text-xs font-medium text-gray-400">
          به پایان لیست رسیدید
        </p>
        <span className="h-px w-16 bg-gray-200" aria-hidden />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <Button
        onClick={onClick}
        disabled={loading}
        size="md"
        className="min-w-40"
      >
        {loading ? (
          <>
            <svg
              aria-hidden
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="3"
              />
              <path
                d="M22 12a10 10 0 0 0-10-10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            در حال بارگذاری...
          </>
        ) : (
          "بازی‌های بیشتر"
        )}
      </Button>
    </div>
  );
}
