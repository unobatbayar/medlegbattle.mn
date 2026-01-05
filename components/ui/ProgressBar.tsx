export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}


