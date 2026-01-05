"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Confetti } from "@/components/ui/Confetti";
import { QuestionMedia } from "@/components/quiz/QuestionMedia";
import type { Question } from "@/lib/types";
import { loadQuestionBank, shuffleChoices } from "@/lib/questions-client";
import { buildDailyQuestions } from "@/lib/daily-questions";
import {
  getOrInitFirstSeenDay,
  getSeenQuestionIds,
  loadDailyState,
  loadStreak,
  markCompleted,
  markQuestionsSeen,
  playerPuzzleNumber,
  saveDailyState,
  type DailyRunState
} from "@/lib/daily-storage";
import { todayKey } from "@/lib/daily";

type Stage = "loading" | "playing" | "results";

type Picked = {
  questionId: string;
  pickedIndex: number;
};

function gridChar(status: "unknown" | "correct" | "wrong") {
  if (status === "correct") return "🟩";
  if (status === "wrong") return "🟥";
  return "⬛";
}

export default function DailyPlayPage() {
  const day = useMemo(() => todayKey(), []);
  const dayNo = useMemo(() => playerPuzzleNumber(day), [day]);
  const firstDay = useMemo(() => getOrInitFirstSeenDay(day), [day]);
  const [stage, setStage] = useState<Stage>("loading");
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Picked[]>([]);
  const [idx, setIdx] = useState(0);
  const startedAtRef = useRef<number>(Date.now());
  const [streak, setStreak] = useState(() => loadStreak());
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [shouldShowConfetti, setShouldShowConfetti] = useState(false);

  const current = questions[idx];
  const total = questions.length;

  const answerMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of answers) m.set(a.questionId, a.pickedIndex);
    return m;
  }, [answers]);

  const locked = current ? answerMap.has(current.id) : false;

  const score = useMemo(() => {
    let s = 0;
    for (const q of questions) {
      const p = answerMap.get(q.id);
      if (p === undefined) continue;
      if (p === q.answerIndex) s++;
    }
    return s;
  }, [questions, answerMap]);

  const finished = answers.length === total && total > 0;

  useEffect(() => {
    async function init() {
      setError(null);
      try {
        const saved = loadDailyState(day);
        const bank = await loadQuestionBank();
        const seenIds = getSeenQuestionIds();

        let dailyQs = buildDailyQuestions(bank, day, 10, {
          firstDay,
          dayIndex: dayNo,
          seenIds
        }).map(shuffleChoices);
        const questionIds = dailyQs.map((q) => q.id);

        // Mark all questions in today's set as seen immediately (never repeat them).
        markQuestionsSeen(questionIds);

        if (saved && saved.questionIds?.length) {
          // Rehydrate exact question set by ID so “daily” is stable and resumable.
          const byId = new Map(dailyQs.map((q) => [q.id, q]));
          const hydrated = saved.questionIds.map((id) => byId.get(id)).filter(Boolean) as Question[];
          if (hydrated.length === saved.questionIds.length) {
            dailyQs = hydrated;
          }
        }

        setQuestions(dailyQs);
        const restoredAnswers = saved?.answers?.map((a) => ({ questionId: a.questionId, pickedIndex: a.pickedIndex })) ?? [];
        setAnswers(restoredAnswers);
        startedAtRef.current = saved?.startedAt ?? Date.now();

        const nextIdx = Math.min(restoredAnswers.length, dailyQs.length - 1);
        setIdx(nextIdx < 0 ? 0 : nextIdx);
        
        // If already finished, go to results but don't show confetti (it was already shown)
        if (saved?.finishedAt) {
          setStage("results");
          setShouldShowConfetti(false); // Don't show confetti on refresh
        } else {
          setStage("playing");
        }

        if (!saved) {
          const state: DailyRunState = {
            v: 1,
            day,
            startedAt: Date.now(),
            questionIds,
            answers: []
          };
          saveDailyState(state);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Алдаа гарлаа.");
        setStage("loading");
      }
    }
    init();
  }, [day, dayNo, firstDay]);

  function persist(nextAnswers: Picked[], finishedAt?: number) {
    const state: DailyRunState = {
      v: 1,
      day,
      startedAt: startedAtRef.current,
      finishedAt,
      questionIds: questions.map((q) => q.id),
      answers: nextAnswers.map((a) => ({ questionId: a.questionId, pickedIndex: a.pickedIndex }))
    };
    saveDailyState(state);
  }

  function pick(choiceIndex: number) {
    if (!current) return;
    if (locked) return;
    const nextAnswers = [...answers, { questionId: current.id, pickedIndex: choiceIndex }];
    setAnswers(nextAnswers);
    persist(nextAnswers);

    // Auto-advance (instant play)
    if (idx < total - 1) {
      window.setTimeout(() => setIdx((v) => Math.min(v + 1, total - 1)), 250);
    }
  }

  function next() {
    if (!current) return;
    const nextIdx = Math.min(idx + 1, total - 1);
    setIdx(nextIdx);
  }

  function finishNow() {
    const finishedAt = Date.now();
    persist(answers, finishedAt);
    markCompleted(day);
    setStreak(loadStreak());
    setStage("results");
    // Show confetti and congrats for new completion
    setShouldShowConfetti(true);
  }

  useEffect(() => {
    if (finished && stage === "playing") {
      finishNow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, stage]);

  useEffect(() => {
    // Only show confetti and congrats if it's a NEW completion
    if (stage !== "results" || !shouldShowConfetti) return;
    
    setShowCongrats(true);
    const t = window.setTimeout(() => {
      setShowCongrats(false);
      setShouldShowConfetti(false); // Mark as shown
    }, 2200);
    return () => window.clearTimeout(t);
  }, [stage, shouldShowConfetti]);

  const gridStatuses = useMemo(() => {
    if (!questions.length) return [];
    return questions.map((q) => {
      const p = answerMap.get(q.id);
      if (p === undefined) return "unknown" as const;
      return p === q.answerIndex ? ("correct" as const) : ("wrong" as const);
    });
  }, [questions, answerMap]);

  const shareText = useMemo(() => {
    const header = `Мэдлэгийн Тулаан — Өдрийн сорил #${dayNo} (${day})\nОноо: ${score}/${total}`;
    const grid = gridStatuses.map((s) => gridChar(s)).join("");
    return `${header}\n${grid}\n#medlegbattle\n\nhttps://medlegbattle.vercel.app/`;
  }, [day, dayNo, score, total, gridStatuses]);

  async function share() {
    try {
      // Prefer native share sheet (mobile), fallback to clipboard (desktop)
      const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
      if (nav.share) {
        await nav.share({ text: shareText });
        setShareStatus("Хуваалцлаа");
        setTimeout(() => setShareStatus(null), 1600);
        return;
      }
      await navigator.clipboard.writeText(shareText);
      setShareStatus("Clipboard-д хууллаа");
      setTimeout(() => setShareStatus(null), 1600);
    } catch {
      // ignore
    }
  }

  return (
    <main className="flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="text-sm font-semibold text-white/80 hover:text-white">
          ← Нүүр
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="gold">Өдрийн сорил</Badge>
          <Badge>#{dayNo}</Badge>
        </div>
      </div>

      {error && (
        <Card className="border border-rose-400/30 bg-rose-500/10">
          <div className="text-sm font-semibold text-rose-100">Алдаа</div>
          <div className="mt-1 text-sm text-rose-100/80">{error}</div>
        </Card>
      )}

      {stage === "loading" && (
        <Card>
          <div className="text-sm text-white/70">Ачаалж байна…</div>
        </Card>
      )}

      {stage === "playing" && current && (
        <Card>
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-base font-semibold text-white/90">
                Асуулт <span className="text-white">{idx + 1}</span> / {total}
              </div>
              <Badge variant="pink">{current.category}</Badge>
            </div>

            <ProgressBar value={idx + 1} max={total} />

            {/* Mobile: keep media compact so answers fit without scroll */}
            <div className="sm:hidden">
              <QuestionMedia category={current.category} question={current.question} compact />
            </div>
            <div className="hidden sm:block">
              <QuestionMedia category={current.category} question={current.question} />
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 p-3 sm:p-5">
              <div className="text-pretty text-base font-extrabold leading-snug sm:text-xl">{current.question}</div>
            </div>

            {/* Mobile: single-column (clearer), Desktop: 2 columns */}
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {current.choices.map((ch, i) => {
                const picked = answerMap.get(current.id) === i;
                // Subtle color tints for each choice: A=blue, B=green, C=orange, D=pink
                const choiceColors = [
                  { border: "border-blue-400/20", bg: "bg-blue-500/8", hover: "hover:bg-blue-500/12", hoverBorder: "hover:border-blue-400/30", badge: "bg-blue-500/15 border-blue-400/25" },
                  { border: "border-emerald-400/20", bg: "bg-emerald-500/8", hover: "hover:bg-emerald-500/12", hoverBorder: "hover:border-emerald-400/30", badge: "bg-emerald-500/15 border-emerald-400/25" },
                  { border: "border-amber-400/20", bg: "bg-amber-500/8", hover: "hover:bg-amber-500/12", hoverBorder: "hover:border-amber-400/30", badge: "bg-amber-500/15 border-amber-400/25" },
                  { border: "border-rose-400/20", bg: "bg-rose-500/8", hover: "hover:bg-rose-500/12", hoverBorder: "hover:border-rose-400/30", badge: "bg-rose-500/15 border-rose-400/25" }
                ];
                const colors = choiceColors[i] || choiceColors[0];
                const base =
                  "w-full rounded-2xl border p-4 text-left font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed min-h-[64px] sm:p-5 sm:min-h-[72px]";
                const styles = picked
                  ? `${colors.border} ${colors.bg} border-opacity-40 bg-opacity-15 shadow-lg shadow-white/10`
                  : `${colors.border} ${colors.bg} ${colors.hover} ${colors.hoverBorder}`;
                return (
                  <button key={i} className={`${base} ${styles}`} onClick={() => pick(i)} disabled={locked}>
                    <div className="flex items-start gap-3">
                      <span className={`mt-[2px] inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${colors.badge} text-xs font-bold sm:h-9 sm:w-9 sm:text-sm`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 text-base leading-relaxed text-white/95 sm:text-lg sm:leading-relaxed">{ch}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {stage === "results" && (
        <>
          <Confetti show={shouldShowConfetti && showCongrats} />
          {showCongrats && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
              <div className="glass w-full max-w-md animate-pop rounded-3xl p-5 shadow-glow">
                <div className="text-xs font-semibold text-white/60">Өдрийн сорил</div>
                <div className="mt-1 text-2xl font-extrabold">Баяр хүргэе!</div>
                <div className="mt-2 text-sm text-white/75">
                  Та өнөөдрийн сорилоо дуусгалаа. Оноо:{" "}
                  <span className="font-semibold text-white">
                    {score}/{total}
                  </span>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setShowCongrats(false)}>OK</Button>
                </div>
              </div>
            </div>
          )}
          <Card>
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-white/70">Өдрийн сорил — үр дүн</div>
                  <div className="mt-1 text-3xl font-extrabold">
                    {score} / {total} <span className="text-base font-semibold text-white/60">({Math.round((score / total) * 100)}%)</span>
                  </div>
                </div>
                <div className="text-right text-xs text-white/60">
                  Цуврал: <span className="font-semibold text-white">{streak.current}</span> · Best:{" "}
                  <span className="font-semibold text-white">{streak.best}</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Хуваалцах grid</div>
                <div className="mt-2 text-2xl leading-none">{gridStatuses.map((s) => gridChar(s)).join("")}</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button onClick={share}>Хуваалцах</Button>
                  <span className="text-xs text-white/60">Маргааш дахин ирээрэй</span>
                </div>
                {shareStatus && <div className="mt-2 text-xs text-white/70">{shareStatus}</div>}
                <div className="mt-2 text-xs text-white/60">Маргааш шинэ сорил автоматаар гарна.</div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">Асуултуудаа харах уу?</div>
                <Button variant="ghost" onClick={() => setShowDetails((v) => !v)}>
                  {showDetails ? "Хаах" : "Дэлгэрэнгүй"}
                </Button>
              </div>

              {showDetails && <div className="space-y-3">
                {questions.map((q, i) => {
                  const p = answerMap.get(q.id);
                  const correct = p === q.answerIndex;
                  return (
                    <div
                      key={q.id}
                      className={`rounded-3xl border p-4 ${
                        correct ? "border-emerald-300/30 bg-emerald-500/10" : "border-rose-300/25 bg-rose-500/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="w-24 shrink-0">
                            <QuestionMedia category={q.category} question={q.question} compact />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white/90">
                              #{i + 1} · {q.category}
                            </div>
                            <div className="mt-1 text-sm font-semibold">{q.question}</div>
                          </div>
                        </div>
                        <div className={`text-xs font-semibold ${correct ? "text-emerald-200" : "text-rose-200"}`}>
                          {correct ? "Зөв" : "Буруу"}
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {q.choices.map((c, ci) => {
                          const isA = ci === q.answerIndex;
                          const isP = p === ci;
                          const style = isA
                            ? "border-emerald-200/35 bg-emerald-500/15"
                            : isP
                              ? "border-rose-200/35 bg-rose-500/15"
                              : "border-white/10 bg-white/5";
                          return (
                            <div key={ci} className={`rounded-2xl border px-3 py-2 text-xs text-white/85 ${style}`}>
                              <span className="font-semibold">{String.fromCharCode(65 + ci)}.</span> {c}
                            </div>
                          );
                        })}
                      </div>
                      {q.explanation && <div className="mt-3 text-xs text-white/70">{q.explanation}</div>}
                    </div>
                  );
                })}
              </div>}
            </div>
          </Card>
        </>
      )}
    </main>
  );
}


