import Link from "next/link";
import type { ComponentProps, ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base"
  }[size];
  const styles =
    variant === "ghost"
      ? "border border-white/15 bg-white/5 text-white hover:bg-white/10"
      : "bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-glow hover:brightness-110";

  return (
    <button {...props} className={`${base} ${sizes} ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function ButtonLink({
  className = "",
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Link> & { className?: string }) {
  return (
    <Link
      {...props}
      className={`inline-flex h-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98] ${className}`}
    >
      {children}
    </Link>
  );
}


