export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="h-4 w-full overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
      <div
        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 transition-[width] duration-300 ease-out shadow-sm"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}


