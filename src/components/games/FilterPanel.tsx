"use client";

import { MultiSelect } from "@/components/ui/MultiSelect";
import { FILTER_CONFIG } from "@/lib/config/filters";
import { isVendor, type Vendor } from "@/lib/config/vendors";
import type { FilterState } from "@/lib/filter";
import { RangeInput } from "../ui/RangeInput";

type FilterPanelProps = {
  filters: FilterState;
  availableCategories: string[];
  onChange: (patch: FilterPatch) => void;
  onClear: () => void;
};

export type FilterPatch = Partial<{
  search: string;
  vendors: Vendor[];
  categories: string[];
  minScore: number | null;
  maxScore: number | null;
}>;

export function FilterPanel({
  filters,
  availableCategories,
  onChange,
  onClear,
}: FilterPanelProps) {
  const activeCount =
    (filters.vendors.length > 0 ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.minScore !== null || filters.maxScore !== null ? 1 : 0);

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white/85 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">فیلترها</h2>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            حذف همه ({activeCount})
          </button>
        ) : null}
      </header>

      {FILTER_CONFIG.map((filter) => {
        if (filter.kind === "multi") {
          if (filter.id === "vendors") {
            return (
              <MultiSelect
                key={filter.id}
                label={filter.label}
                options={filter.options}
                value={filters.vendors}
                onChange={(next) =>
                  onChange({ vendors: next.filter(isVendor) })
                }
              />
            );
          }

          if (filter.id === "categories") {
            const options = availableCategories.map((c) => ({
              value: c,
              label: c,
            }));
            return (
              <MultiSelect
                key={filter.id}
                label={filter.label}
                options={options}
                value={filters.categories}
                onChange={(next) => onChange({ categories: next })}
                placeholder={
                  options.length === 0 ? "در حال بارگذاری..." : "انتخاب کنید"
                }
                disabled={options.length === 0}
              />
            );
          }

          return null;
        }

        if (filter.kind === "range") {
          return (
            <RangeInput
              key={filter.id}
              label={filter.label}
              min={filter.min}
              max={filter.max}
              unit="امتیاز"
              valueMin={filters.minScore}
              valueMax={filters.maxScore}
              onChangeMin={(v) => onChange({ minScore: v })}
              onChangeMax={(v) => onChange({ maxScore: v })}
            />
          );
        }

        return null;
      })}
    </section>
  );
}
