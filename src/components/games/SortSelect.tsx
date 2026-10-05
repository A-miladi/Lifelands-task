"use client";

import { Select, type SelectOption } from "@/components/ui/Select";
import { SORT_CONFIG } from "@/lib/config/filters";
import { isSortKey, type SortKey } from "@/lib/sort";

type SortSelectProps = {
  value: SortKey;
  onChange: (next: SortKey) => void;
};

export function SortSelect({ value, onChange }: SortSelectProps) {
  const options: SelectOption[] = SORT_CONFIG.map((o) => ({
    value: o.value,
    label: o.label,
  }));

  return (
    <Select
      label="مرتب‌سازی"
      value={value}
      options={options}
      onChange={(v) => {
        if (isSortKey(v)) onChange(v);
      }}
    />
  );
}
