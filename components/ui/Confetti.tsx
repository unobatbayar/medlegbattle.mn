"use client";

import { useEffect, useMemo, useState } from "react";

type Piece = { id: number; left: number; delay: number; size: number; hue: number; rot: number };

export function Confetti({ show }: { show: boolean }) {
  const pieces = useMemo<Piece[]>(() => {
    const out: Piece[] = [];
    for (let i = 0; i < 42; i++) {
      out.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        size: 6 + Math.random() * 8,
        hue: Math.floor(200 + Math.random() * 140),
        rot: Math.floor(Math.random() * 180)
      });
    }
    return out;
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-20px] animate-[confettiFall_1.4s_ease-in_forwards]"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            background: `hsl(${p.hue} 95% 65%)`,
            transform: `rotate(${p.rot}deg)`,
            animationDelay: `${p.delay}s`,
            opacity: 1,
            zIndex: 50
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(420deg);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}


