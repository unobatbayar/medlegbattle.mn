import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="mx-auto flex h-full w-full max-w-xl flex-col items-center justify-between gap-10 px-3 py-12 text-center sm:justify-center sm:gap-8 sm:px-1 sm:py-12">
      {/* Top */}
      <div className="flex w-full flex-col items-center gap-8 sm:gap-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="indigo">Өдрийн сорил</Badge>
          <Badge>Монгол хэл</Badge>
          <Badge variant="pink">10500+ асуулт</Badge>
        </div>

        <h1 className="text-balance text-6xl font-extrabold tracking-tight sm:text-7xl">
          <span className="text-gradient">Мэдлэгийн Тулаан</span>
        </h1>

        <p className="text-pretty text-lg text-white/90 sm:text-xl">
          Өдөр бүр 10 асуулт. Үр дүнгээ төгсгөлд нь үз...
        </p>
      </div>

      {/* Description section */}
      <div className="flex w-full max-w-lg flex-col gap-5 px-2 text-center sm:gap-4">
        <div className="flex flex-wrap justify-center gap-3 text-xs text-white/70 sm:text-sm">
          <span className="rounded-full bg-white/10 px-3 py-1">✓ 10,500+ асуулт</span>
          <span className="rounded-full bg-white/10 px-3 py-1">✓ Өдөр бүр шинэ</span>
          <span className="rounded-full bg-white/10 px-3 py-1">✓ Цуврал</span>
        </div>
      </div>

      {/* Bottom instructions */}
      <div className="max-w-md space-y-3 text-xs text-white/60 sm:space-y-2 sm:text-sm">
        <p>Хариултаа сонгоод автоматаар дараагийн асуулт руу шилжинэ.</p>
        <p>Дуусмагц оноогоо үзээд найзуудтайгаа хуваалцаарай.</p>
      </div>

      {/* Button at bottom */}
      <div className="w-full py-6 sm:py-8">
        <Link href="/play" className="w-full">
          <Button size="lg" className="h-[76px] w-full text-xl sm:h-[72px]">
            Тоглох
          </Button>
        </Link>
      </div>
    </main>
  );
}

