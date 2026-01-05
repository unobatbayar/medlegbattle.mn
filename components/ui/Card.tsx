import type { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div {...props} className={`glass rounded-3xl p-5 shadow-glow ${className}`} />;
}


