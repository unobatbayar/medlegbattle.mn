import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/ui/Sparkle";

export default function HomePage() {
  return (
    <main className="mx-auto flex h-full w-full max-w-xl flex-col items-center justify-between px-3 py-8 text-center sm:justify-center sm:gap-6 sm:px-1">
      {/* Top */}
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="indigo">Өдрийн сорил</Badge>
          <Badge>Монгол хэл</Badge>
          <Badge variant="pink">1000+ асуулт</Badge>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Sparkle />
          <h1 className="text-balance text-6xl font-extrabold tracking-tight sm:text-7xl">
            <span className="text-gradient">Мэдлэгийн Тулаан</span>
          </h1>
        </div>

        <p className="text-pretty text-lg text-white/90 sm:text-xl">
          Өдөр бүр 10 асуулт. Үр дүнгээ төгсгөлд нь үзнэ.
        </p>
      </div>

      {/* Description section */}
      <div className="flex w-full max-w-lg flex-col gap-4 px-2 text-left sm:gap-5">
        <div className="space-y-2 text-sm text-white/80 sm:text-base">
          <p>
            <strong className="text-white">Мэдлэгийн Тулаан</strong> бол Монгол хэл дээрх өдрийн мэдлэгийн сорил юм.
            Өдөр бүр танд 10 шинэ асуулт санал болгоно.
          </p>
          <p>
            Асуултууд нь <strong className="text-white">Монгол түүх, соёл, газарзүй, шинжлэх ухаан</strong> болон
            бусад ерөнхий мэдлэгээс сонгогдоно. Хариултаа сонгоод автоматаар дараагийн асуулт руу шилжинэ.
          </p>
          <p>
            Тест дууссаны дараа оноогоо үзээд найзуудтайгаа хуваалцаарай. Маргааш шинэ сорил автоматаар гарна.
          </p>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/70 sm:text-sm">
          <span className="rounded-full bg-white/10 px-3 py-1">✓ 5200+ асуулт</span>
          <span className="rounded-full bg-white/10 px-3 py-1">✓ Өдөр бүр шинэ</span>
          <span className="rounded-full bg-white/10 px-3 py-1">✓ Цуврал (streak)</span>
          <span className="rounded-full bg-white/10 px-3 py-1">✓ Үнэгүй</span>
        </div>
      </div>

      {/* Middle: big CTA */}
      <div className="w-full py-4 sm:py-6">
        <Link href="/play" className="w-full">
          <Button size="lg" className="h-[76px] w-full text-xl sm:h-[72px]">
            Тоглох
          </Button>
        </Link>
      </div>

      {/* Bottom */}
      <div className="max-w-md text-xs text-white/60 sm:text-sm">
        <p>Хариултаа сонгоод автоматаар дараагийн асуулт руу шилжинэ.</p>
        <p className="mt-1">Дуусмагц оноогоо үзээд найзуудтайгаа хуваалцаарай.</p>
      </div>
    </main>
  );
}

