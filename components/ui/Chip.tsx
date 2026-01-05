import type { ComponentProps } from "react";

export function Chip({
  active,
  className = "",
  ...props
}: ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-[0.98] ${
        active
          ? "border-white/25 bg-white/15 text-white"
          : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
      } ${className}`}
    />
  );
}


