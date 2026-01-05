export type LocalScore = {
  id: string;
  createdAt: number;
  name: string;
  score: number;
  total: number;
  accuracy: number; // 0..1
  durationMs?: number;
};

const KEY = "medlegbattle.localLeaderboard.v1";

export function loadLocalScores(): LocalScore[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalScore[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 50);
  } catch {
    return [];
  }
}

export function saveLocalScore(entry: LocalScore) {
  if (typeof window === "undefined") return;
  const prev = loadLocalScores();
  const next = [entry, ...prev]
    .sort((a, b) => b.score - a.score || b.accuracy - a.accuracy || a.createdAt - b.createdAt)
    .slice(0, 20);
  localStorage.setItem(KEY, JSON.stringify(next));
}


