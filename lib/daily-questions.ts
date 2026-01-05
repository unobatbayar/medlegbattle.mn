import type { Question, QuestionCategory } from "@/lib/types";
import { hashStringToSeed, seededShuffle, todayKey } from "@/lib/daily";

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

function buildDailyQuestionsOnce(
  bank: Question[],
  seed: number,
  amount: number,
  dayIndex: number,
  seenIds?: Set<string>
): Question[] {
  // Filter out already-seen questions to ensure no repeats ever.
  const pool = bank.filter(
    (q) => DAILY_CATEGORIES.includes(q.category) && (!seenIds || !seenIds.has(q.id))
  );

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

  // Equal proportional daily plan: all categories appear roughly equally.
  // Default for 10 questions: 4 categories get 2 questions each, 2 categories get 1 question each
  // This ensures equal representation across all categories
  const basePlan: QuestionCategory[] = [
    "Газарзүй",
    "Ерөнхий",
    "Монгол",
    "Шинжлэх ухаан",
    "Соёл",
    "Түүх",
    "Газарзүй",
    "Ерөнхий",
    "Монгол",
    "Шинжлэх ухаан"
  ];
  const oneDayPlan = seededShuffle([...basePlan], seed ^ 0xA1B2C3D4).slice(0, amount);

  // Build a non-overlapping schedule by consuming from buckets up to dayIndex.
  // This guarantees no overlap between days as long as the bank has enough questions.
  const fallbackOrder: QuestionCategory[] = ["Газарзүй", "Ерөнхий", "Шинжлэх ухаан", "Соёл", "Түүх", "Байгаль", "Спорт", "Монгол"];
  const picked: Question[] = [];
  const targetDay = Math.max(1, Math.min(1000, dayIndex));
  for (let d = 1; d <= targetDay; d++) {
    for (const cat of oneDayPlan) {
      let q: Question | undefined;
      const bucket = groups.get(cat);
      if (bucket?.length) q = bucket.pop();
      if (!q) {
        for (const fcat of fallbackOrder) {
          const b = groups.get(fcat);
          if (b?.length) {
            q = b.pop();
            break;
          }
        }
      }
      if (!q) break;
      if (d === targetDay) picked.push(q);
    }
  }

  // Final deterministic shuffle so order isn’t always “one per category”.
  return seededShuffle(picked, seed ^ 0x55AA12FF);
}

export function buildDailyQuestions(
  bank: Question[],
  day = todayKey(),
  amount = 10,
  opts?: { firstDay: string; dayIndex: number; seenIds?: Set<string> }
): Question[] {
  const firstDay = opts?.firstDay ?? day;
  const dayIndex = opts?.dayIndex ?? 1;
  const seenIds = opts?.seenIds;
  const seed = hashStringToSeed(`medlegbattle|schedule|first:${firstDay}`);
  return buildDailyQuestionsOnce(bank, seed ^ hashStringToSeed(day), amount, dayIndex, seenIds);
}


