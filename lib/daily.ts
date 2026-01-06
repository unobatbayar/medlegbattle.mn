export const DAILY_VERSION = 1;

export function todayKey(d = new Date()) {
  // Mongolian timezone (UTC+8). Format: YYYY-MM-DD
  // Convert current time to Mongolia time (UTC+8)
  const mongoliaOffset = 8 * 60; // UTC+8 in minutes
  const utcTime = d.getTime() + (d.getTimezoneOffset() * 60000);
  const mongoliaTime = new Date(utcTime + (mongoliaOffset * 60000));
  
  const yyyy = mongoliaTime.getUTCFullYear();
  const mm = String(mongoliaTime.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(mongoliaTime.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function hashStringToSeed(input: string) {
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function dayToUtcNumber(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  const ms = Date.UTC(y, (m ?? 1) - 1, d ?? 1);
  return Math.floor(ms / 86400000);
}

export function addDays(day: string, deltaDays: number) {
  const n = dayToUtcNumber(day);
  const ms = (n + deltaDays) * 86400000;
  const d = new Date(ms);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}


