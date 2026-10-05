import { KNOWN_VENDORS, VENDOR_LABELS, type Vendor } from "./vendors";
import { SORT_KEYS, SORT_LABELS, type SortKey } from "@/lib/sort";

export type FilterKind = "multi" | "range";

export type FilterOption = {
  value: string;
  label: string;
};

export type BaseFilter = {
  id: string;
  label: string;
  kind: FilterKind;
};

export type MultiFilter = BaseFilter & {
  kind: "multi";
  options: readonly FilterOption[];
};

export type RangeFilter = BaseFilter & {
  kind: "range";
  min: number;
  max: number;
  step: number;
};

export type FilterConfig = MultiFilter | RangeFilter;

const VENDOR_FILTER: MultiFilter = {
  id: "vendors",
  label: "پلتفرم",
  kind: "multi",
  options: KNOWN_VENDORS.map((v: Vendor) => ({
    value: v,
    label: VENDOR_LABELS[v],
  })),
};

const SCORE_FILTER: RangeFilter = {
  id: "score",
  label: "بازه امتیاز",
  kind: "range",
  min: 0,
  max: 5,
  step: 0.5,
};

const CATEGORY_FILTER: MultiFilter = {
  id: "categories",
  label: "دسته‌بندی",
  kind: "multi",
  options: [],
};

export const FILTER_CONFIG: readonly FilterConfig[] = [
  VENDOR_FILTER,
  CATEGORY_FILTER,
  SCORE_FILTER,
];

export const SORT_CONFIG = SORT_KEYS.map((key: SortKey) => ({
  value: key,
  label: SORT_LABELS[key],
}));
