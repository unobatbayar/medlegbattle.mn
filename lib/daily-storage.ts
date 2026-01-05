import { DAILY_VERSION, todayKey } from "@/lib/daily";

export type DailyAnswer = {
  questionId: string;
  pickedIndex: number;
};

export type DailyRunState = {
  v: number;
  day: string; // YYYY-MM-DD
  startedAt: number;
  finishedAt?: number;
  questionIds: string[];
  answers: DailyAnswer[];
};

const KEY_PREFIX = "medlegbattle.daily.v1.";
const STREAK_KEY = "medlegbattle.dailyStreak.v1";
const FIRST_DAY_KEY = "medlegbattle.firstSeenDay.v1";

export function dayStorageKey(day = todayKey()) {
  return `${KEY_PREFIX}${day}`;
}

export function loadDailyState(day = todayKey()): DailyRunState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(dayStorageKey(day));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyRunState;
    if (!parsed || parsed.v !== DAILY_VERSION) return null;
    if (parsed.day !== day) return null;
    if (!Array.isArray(parsed.questionIds) || !Array.isArray(parsed.answers)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDailyState(state: DailyRunState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(dayStorageKey(state.day), JSON.stringify(state));
}

export type DailyStreak = {
  lastCompletedDay?: string;
  current: number;
  best: number;
};

export function loadStreak(): DailyStreak {
  if (typeof window === "undefined") return { current: 0, best: 0 };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { current: 0, best: 0 };
    const parsed = JSON.parse(raw) as DailyStreak;
    if (!parsed) return { current: 0, best: 0 };
    return { current: parsed.current ?? 0, best: parsed.best ?? 0, lastCompletedDay: parsed.lastCompletedDay };
  } catch {
    return { current: 0, best: 0 };
  }
}

function dayToNumber(day: string) {
  // YYYY-MM-DD -> days since epoch (UTC) for consecutive compare
  const [y, m, d] = day.split("-").map(Number);
  const ms = Date.UTC(y, (m ?? 1) - 1, d ?? 1);
  return Math.floor(ms / 86400000);
}

export function getOrInitFirstSeenDay(today = todayKey()) {
  if (typeof window === "undefined") return today;
  const existing = localStorage.getItem(FIRST_DAY_KEY);
  if (existing && /^\d{4}-\d{2}-\d{2}$/.test(existing)) return existing;
  localStorage.setItem(FIRST_DAY_KEY, today);
  return today;
}

export function playerPuzzleNumber(day = todayKey()) {
  // Starts at #1 for each new player, based on the first day they ever opened the app.
  const first = getOrInitFirstSeenDay(day);
  return dayToNumber(day) - dayToNumber(first) + 1;
}

export function markCompleted(day: string) {
  if (typeof window === "undefined") return;
  const s = loadStreak();
  const last = s.lastCompletedDay;
  const dayN = dayToNumber(day);
  const lastN = last ? dayToNumber(last) : null;

  let current = s.current;
  if (lastN === null) current = 1;
  else if (dayN === lastN) current = s.current; // same day, no change
  else if (dayN === lastN + 1) current = s.current + 1; // streak continues
  else current = 1; // streak reset

  const best = Math.max(s.best, current);
  const next: DailyStreak = { lastCompletedDay: day, current, best };
  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
}


