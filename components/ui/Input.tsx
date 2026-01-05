import type { ComponentProps } from "react";

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/25 focus:bg-white/10 ${className}`}
    />
  );
}


