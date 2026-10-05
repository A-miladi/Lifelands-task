"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";

type SearchBarProps = {
  value: string;
  onChange: (next: string) => void;
  delay?: number;
};

export function SearchBar({ value, onChange, delay = 300 }: SearchBarProps) {
  const [local, setLocal] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const debounced = useDebounce(local, delay);

  if (value !== prevValue) {
    setPrevValue(value);
    setLocal(value);
  }

  const notifyChange = useEffectEvent((next: string) => {
    onChange(next);
  });

  useEffect(() => {
    if (debounced !== value) {
      notifyChange(debounced);
    }
  }, [debounced, value]);

  return (
    <Input
      type="search"
      inputMode="search"
      label="جستجو"
      placeholder="نام بازی یا سازنده..."
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      aria-label="جستجو در بازی‌ها"
    />
  );
}
