"use client";

import { useId } from "react";
import { Input } from "./Input";

export type RangeInputProps = {
  label: string;
  min: number;
  max: number;
  valueMin: number | null;
  valueMax: number | null;
  onChangeMin: (v: number | null) => void;
  onChangeMax: (v: number | null) => void;
  unit?: string;
};

const DIGIT_MAP: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

function sanitizeNumberInput(raw: string): string {
  let out = "";
  let hasDot = false;
  for (const ch of raw) {
    const mapped = DIGIT_MAP[ch] ?? ch;
    if (mapped >= "0" && mapped <= "9") {
      out += mapped;
    } else if ((mapped === "." || mapped === "٫") && !hasDot) {
      out += ".";
      hasDot = true;
    }
  }
  return out;
}

export function RangeInput({
  label,
  min,
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  unit,
}: RangeInputProps) {
  const id = useId();
  const hasValue = valueMin !== null || valueMax !== null;
  const isInvalid =
    valueMin !== null && valueMax !== null && valueMin > valueMax;

  const range = max - min;
  const lo = valueMin ?? min;
  const hi = valueMax ?? max;
  const leftPct = range > 0 ? ((lo - min) / range) * 100 : 0;
  const rightPct = range > 0 ? ((hi - min) / range) * 100 : 100;

  const clear = () => {
    onChangeMin(null);
    onChangeMax(null);
  };

  const handleChange = (raw: string, setter: (v: number | null) => void) => {
    const cleaned = sanitizeNumberInput(raw);
    if (cleaned === "") {
      setter(null);
      return;
    }
    const num = Number(cleaned);
    if (!Number.isFinite(num)) {
      setter(null);
      return;
    }
    setter(num);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-gray-600">
          {label}
          {unit ? (
            <span className="mr-1 text-[10px] font-normal text-gray-400">
              ({unit})
            </span>
          ) : null}
        </label>
        {hasValue ? (
          <button
            type="button"
            onClick={clear}
            aria-label={`پاک کردن ${label}`}
            className="rounded text-[11px] font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            پاک کردن
          </button>
        ) : null}
      </div>

      <div className="flex items-center w-full gap-2">
        <Input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={`از ${min}`}
          value={valueMin === null ? "" : String(valueMin)}
          onChange={(e) => handleChange(e.target.value, onChangeMin)}
          onKeyDown={(e) => {
            const allowed = [
              "Backspace",
              "Tab",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Delete",
              "Home",
              "End",
              "Enter",
            ];
            if (allowed.includes(e.key)) return;
            if (e.key === "." || e.key === "٫") return;
            if (e.ctrlKey || e.metaKey) return;
            if (!/^[0-9۰-۹٠-٩]$/.test(e.key)) e.preventDefault();
          }}
          aria-label={`حداقل ${label}`}
          aria-invalid={isInvalid || undefined}
          className="text-center w-full tabular-nums"
        />
        <span
          aria-hidden
          className="shrink-0 select-none text-xs font-medium text-gray-300"
        >
          تا
        </span>
        <Input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={`تا ${max}`}
          value={valueMax === null ? "" : String(valueMax)}
          onChange={(e) => handleChange(e.target.value, onChangeMax)}
          onKeyDown={(e) => {
            const allowed = [
              "Backspace",
              "Tab",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Delete",
              "Home",
              "End",
              "Enter",
            ];
            if (allowed.includes(e.key)) return;
            if (e.key === "." || e.key === "٫") return;
            if (e.ctrlKey || e.metaKey) return;
            if (!/^[0-9۰-۹٠-٩]$/.test(e.key)) e.preventDefault();
          }}
          aria-label={`حداکثر ${label}`}
          aria-invalid={isInvalid || undefined}
          className="text-center w-full tabular-nums"
        />
      </div>

      <div
        aria-hidden
        className="relative h-0.5 w-full overflow-hidden rounded-full bg-gray-100"
      >
        <div
          className={
            "absolute inset-y-0 rounded-full transition-all duration-200 ease-[var(--ease-out-expo)] " +
            (isInvalid
              ? "bg-red-400"
              : "bg-gradient-to-l from-brand-400 to-brand-600")
          }
          style={{
            left: `${Math.max(0, Math.min(100, leftPct))}%`,
            right: `${Math.max(0, Math.min(100, 100 - rightPct))}%`,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px]">
        {isInvalid ? (
          <span role="alert" className="font-medium text-red-600">
            حداقل نباید بزرگ‌تر از حداکثر باشد
          </span>
        ) : hasValue ? (
          <span className="tabular-nums text-gray-500">
            {valueMin !== null ? valueMin : min}
            {" — "}
            {valueMax !== null ? valueMax : max}
          </span>
        ) : (
          <span className="text-gray-400">
            هر مقداری از {min} تا {max}
          </span>
        )}
      </div>
    </div>
  );
}
