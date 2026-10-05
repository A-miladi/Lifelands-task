import type { ComponentPropsWithoutRef } from "react";

export type SkeletonProps = ComponentPropsWithoutRef<"div">;

export function Skeleton({ className = "", ...rest }: SkeletonProps) {
  return (
    <div aria-hidden className={`shimmer rounded-lg ${className}`} {...rest} />
  );
}
