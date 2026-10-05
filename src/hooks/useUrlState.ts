"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useUrlState<T extends string | string[]>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = useMemo<T>(() => {
    if (Array.isArray(defaultValue)) {
      const all = searchParams.getAll(key);
      return (all.length > 0 ? all : defaultValue) as T;
    }
    const raw = searchParams.get(key);
    return (raw !== null ? raw : defaultValue) as T;
  }, [searchParams, key, defaultValue]);

  const setValue = useCallback(
    (next: T) => {
      const base =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : new URLSearchParams(searchParams.toString());

      if (Array.isArray(next)) {
        base.delete(key);
        if (next.length > 0) {
          for (const item of next) base.append(key, item);
        }
      } else {
        if (next === "" || next === defaultValue) {
          base.delete(key);
        } else {
          base.set(key, next);
        }
      }

      const query = base.toString();
      const url = query.length > 0 ? `${pathname}?${query}` : pathname;
      router.replace(url, { scroll: false });
    },
    [router, pathname, searchParams, key, defaultValue],
  );

  return [value, setValue];
}
