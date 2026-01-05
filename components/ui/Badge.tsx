import type { ComponentProps } from "react";

type Variant = "default" | "pink" | "gold" | "indigo";

export function Badge({ className = "", variant = "default", ...props }: ComponentProps<"span"> & { variant?: Variant }) {
  const variants: Record<Variant, string> = {
    default: "border-white/15 bg-white/5 text-white/80",
    pink: "border-fuchsia-400/30 bg-fuchsia-500/15 text-fuchsia-100",
    gold: "border-amber-300/30 bg-amber-400/15 text-amber-50",
    indigo: "border-indigo-400/30 bg-indigo-500/15 text-indigo-50"
  };
  return (
    <span
      {...props}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    />
  );
}


