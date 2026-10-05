"use client";

import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-sm " +
    "hover:bg-brand-700 hover:shadow-md " +
    "active:bg-brand-800 active:shadow-sm " +
    "focus-visible:ring-brand-500/40 " +
    "disabled:bg-brand-500/50 disabled:shadow-none",
  secondary:
    "bg-white text-gray-800 border border-gray-200 shadow-sm " +
    "hover:bg-gray-50 hover:border-gray-300 hover:shadow " +
    "active:bg-gray-100 " +
    "focus-visible:ring-gray-400/40 " +
    "disabled:bg-gray-50 disabled:text-gray-400",
  ghost:
    "bg-transparent text-gray-700 " +
    "hover:bg-gray-100 " +
    "active:bg-gray-200 " +
    "focus-visible:ring-gray-400/40 " +
    "disabled:text-gray-400",
  danger:
    "bg-red-600 text-white shadow-sm " +
    "hover:bg-red-700 hover:shadow-md " +
    "active:bg-red-800 " +
    "focus-visible:ring-red-500/40",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex select-none items-center cursor-pointer justify-center rounded-xl font-medium " +
    "transition-[background-color,box-shadow,transform,color] duration-200 " +
    "ease-[var(--ease-out-expo)] " +
    "focus-visible:outline-none focus-visible:ring-4 " +
    "active:translate-y-px " +
    "disabled:cursor-not-allowed disabled:active:translate-y-0";

  return (
    <button
      type={type}
      className={`${base} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    />
  );
}
