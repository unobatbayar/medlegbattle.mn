import type { Question, QuestionCategory } from "@/lib/types";

export const ALL_CATEGORIES: QuestionCategory[] = [
  "Ерөнхий",
  "Монгол",
  "Түүх",
  "Газарзүй",
  "Шинжлэх ухаан",
  "Соёл",
  "Спорт",
  "Технологи",
  "Байгаль"
];

export async function loadQuestionBank(): Promise<Question[]> {
  const res = await fetch("/questions.mn.js", { cache: "no-store" });
  if (!res.ok) throw new Error("Асуултуудыг татаж чадсангүй.");
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) throw new Error("Асуултын сан эвдэрсэн байна.");
  return data as Question[];
}

export function pickQuestions(
  bank: Question[],
  amount: number,
  categories: QuestionCategory[] | "ALL"
): Question[] {
  const pool =
    categories === "ALL" ? bank : bank.filter((q) => categories.includes(q.category as QuestionCategory));

  // Balanced sampling: avoid “one-category spam” (e.g., too many easy math/capitals in a row)
  const groups = new Map<string, Question[]>();
  for (const q of pool) {
    const key = q.category ?? "Ерөнхий";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(q);
  }
  const keys = shuffle(Array.from(groups.keys()));
  for (const k of keys) shuffle(groups.get(k)!);

  const picked: Question[] = [];
  let guard = 0;
  while (picked.length < amount && guard < amount * 50) {
    guard++;
    let progressed = false;
    for (const k of keys) {
      const bucket = groups.get(k)!;
      if (bucket.length === 0) continue;
      picked.push(bucket.pop()!);
      progressed = true;
      if (picked.length >= amount) break;
    }
    if (!progressed) break;
  }
  return picked;
}

export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shuffleChoices(q: Question): Question {
  const indexed = q.choices.map((text, idx) => ({ text, idx })) as Array<{ text: string; idx: number }>;
  shuffle(indexed);
  const newChoices = indexed.map((x) => x.text) as Question["choices"];
  const newAnswerIndex = indexed.findIndex((x) => x.idx === q.answerIndex) as 0 | 1 | 2 | 3;
  return { ...q, choices: newChoices, answerIndex: newAnswerIndex };
}


