import type { QuestionCategory } from "@/lib/types";
import Image from "next/image";

const categoryToSrc: Record<QuestionCategory, { src: string; alt: string }> = {
  "Ерөнхий": { src: "/visuals/general.svg", alt: "Ерөнхий мэдлэгийн дүрслэл" },
  "Монгол": { src: "/visuals/mongolia.svg", alt: "Монголын сэдвийн дүрслэл" },
  "Түүх": { src: "/visuals/history.svg", alt: "Түүхийн сэдвийн дүрслэл" },
  "Газарзүй": { src: "/visuals/geography.svg", alt: "Газарзүйн сэдвийн дүрслэл" },
  "Шинжлэх ухаан": { src: "/visuals/science.svg", alt: "Шинжлэх ухааны сэдвийн дүрслэл" },
  "Соёл": { src: "/visuals/culture.svg", alt: "Соёлын сэдвийн дүрслэл" },
  "Спорт": { src: "/visuals/sports.svg", alt: "Спортын сэдвийн дүрслэл" },
  "Технологи": { src: "/visuals/tech.svg", alt: "Технологийн сэдвийн дүрслэл" },
  "Математик": { src: "/visuals/general.svg", alt: "Ерөнхий дүрслэл" },
  "Байгаль": { src: "/visuals/nature.svg", alt: "Байгалийн сэдвийн дүрслэл" }
};

function pickByKeywords(category: QuestionCategory, question: string) {
  const q = question.toLowerCase();
  // small heuristics to feel “matched” to the subject
  if (q.includes("нийслэл") || q.includes("улс") || q.includes("тив")) return categoryToSrc["Газарзүй"];
  if (q.includes("хаан") || q.includes("он") || q.includes("зуу")) return categoryToSrc["Түүх"];
  if (q.includes("вирус") || q.includes("эс") || q.includes("ген") || q.includes("хүчилтөрөгч")) return categoryToSrc["Шинжлэх ухаан"];
  if (q.includes("код") || q.includes("интернэт") || q.includes("протокол") || q.includes("dns") || q.includes("api"))
    return categoryToSrc["Технологи"];
  if (q.includes("гол") || q.includes("уул") || q.includes("ой") || q.includes("амьтан") || q.includes("экосистем"))
    return categoryToSrc["Байгаль"];
  if (q.includes("наадам") || q.includes("соёмбо") || q.includes("аймаг") || q.includes("сум")) return categoryToSrc["Монгол"];
  return categoryToSrc[category] ?? categoryToSrc["Ерөнхий"];
}

export function QuestionMedia({
  category,
  question,
  compact = false
}: {
  category: QuestionCategory;
  question: string;
  compact?: boolean;
}) {
  const picked = pickByKeywords(category, question);
  const size = compact ? 40 : 112;
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent ${
        compact ? "h-12" : "h-36"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(167,139,250,0.22),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(251,113,133,0.18),transparent_55%),radial-gradient(circle_at_60%_90%,rgba(59,130,246,0.18),transparent_55%)]" />
      <div className="relative flex h-full items-center justify-between gap-3 px-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-white/60">{compact ? "" : "Сэдэв"}</div>
          <div className={`truncate font-extrabold ${compact ? "text-sm" : "text-lg"}`}>{category}</div>
          {!compact && <div className="mt-1 text-xs text-white/60">Өнөөдөр юу мэдэх вэ?</div>}
        </div>
        <Image
          src={picked.src}
          alt={picked.alt}
          width={size}
          height={size}
          priority
          className={`select-none opacity-95 ${compact ? "h-10 w-10" : "h-28 w-28"}`}
        />
      </div>
    </div>
  );
}


