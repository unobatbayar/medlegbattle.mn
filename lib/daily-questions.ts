import type { Question, QuestionCategory } from "@/lib/types";
import { addDays, hashStringToSeed, seededShuffle, todayKey } from "@/lib/daily";

export const DAILY_CATEGORIES: QuestionCategory[] = [
  "Ерөнхий",
  "Монгол",
  "Түүх",
  "Газарзүй",
  "Шинжлэх ухаан",
  "Соёл",
  "Спорт",
  "Байгаль"
];

function idsKey(qs: Question[]) {
  return qs
    .map((q) => q.id)
    .slice()
    .sort()
    .join("|");
}

function buildDailyQuestionsOnce(bank: Question[], day: string, amount: number, salt: number): Question[] {
  const seed = hashStringToSeed(`medlegbattle|daily|${day}|salt:${salt}`);
  const pool = bank.filter((q) => DAILY_CATEGORIES.includes(q.category));

  // Group by category and do a deterministic, balanced draw.
  const groups = new Map<QuestionCategory, Question[]>();
  for (const cat of DAILY_CATEGORIES) groups.set(cat, []);
  for (const q of pool) groups.get(q.category)?.push(q);

  // Deterministically shuffle each category bucket.
  let s = seed;
  for (const cat of DAILY_CATEGORIES) {
    const bucket = groups.get(cat)!;
    seededShuffle(bucket, s ^ hashStringToSeed(cat));
    s = (s + 0x9e3779b9) >>> 0;
  }

  // Mongolia-first daily plan (more relevant for average Mongolian).
  // Counts for 10 questions: Монгол 3, Ерөнхий 3, Газарзүй 2, ШУ 1, Соёл 1
  const basePlan: QuestionCategory[] = [
    "Монгол",
    "Ерөнхий",
    "Монгол",
    "Газарзүй",
    "Ерөнхий",
    "Шинжлэх ухаан",
    "Монгол",
    "Газарзүй",
    "Ерөнхий",
    "Соёл"
  ];
  const plan = seededShuffle([...basePlan], seed ^ 0xA1B2C3D4).slice(0, amount);

  const picked: Question[] = [];
  for (const cat of plan) {
    const bucket = groups.get(cat);
    if (bucket && bucket.length) {
      picked.push(bucket.pop()!);
      continue;
    }
    // fallback: pull from Монгол/Ерөнхий first, then any.
    const fallbackOrder: QuestionCategory[] = ["Монгол", "Ерөнхий", "Газарзүй", "Шинжлэх ухаан", "Соёл", "Байгаль", "Спорт", "Түүх"];
    let got: Question | null = null;
    for (const fcat of fallbackOrder) {
      const b = groups.get(fcat);
      if (b && b.length) {
        got = b.pop()!;
        break;
      }
    }
    if (got) picked.push(got);
  }

  // Final deterministic shuffle so order isn’t always “one per category”.
  return seededShuffle(picked, seed ^ 0x55AA12FF);
}

export function buildDailyQuestions(bank: Question[], day = todayKey(), amount = 10): Question[] {
  // Ensure the next day's puzzle isn't identical to yesterday's.
  const prevDay = addDays(day, -1);
  const prev = buildDailyQuestionsOnce(bank, prevDay, amount, 0);
  const prevKey = idsKey(prev);

  for (let salt = 0; salt < 25; salt++) {
    const cur = buildDailyQuestionsOnce(bank, day, amount, salt);
    if (idsKey(cur) !== prevKey) return cur;
  }
  // Fallback (extremely unlikely): return first attempt.
  return buildDailyQuestionsOnce(bank, day, amount, 0);
}


