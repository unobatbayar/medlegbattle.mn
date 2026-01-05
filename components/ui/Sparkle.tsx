export function Sparkle() {
  return (
    <div className="relative h-11 w-11 shrink-0 animate-floaty rounded-2xl bg-gradient-to-br from-indigo-500/35 via-fuchsia-500/25 to-rose-500/25 p-[1px] shadow-glow">
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black/35">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l1.2 6.2L20 10l-6.8 1.8L12 18l-1.2-6.2L4 10l6.8-1.8L12 2z"
            stroke="url(#g)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="g" x1="4" y1="2" x2="20" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93c5fd" />
              <stop offset="0.5" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#fb7185" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}


