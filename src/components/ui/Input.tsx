"use client";

import { useId, type ComponentPropsWithoutRef } from "react";

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
  error?: string;
};

export function Input({
  label,
  error,
  id,
  className = "",
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-gray-600"
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={
          "h-10 rounded-xl border bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 " +
          "transition-[border-color,box-shadow] duration-200 " +
          "focus:outline-none focus:ring-4 " +
          (error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/15 "
            : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/15 ") +
          "disabled:bg-gray-50 disabled:text-gray-400 " +
          className
        }
        {...rest}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
