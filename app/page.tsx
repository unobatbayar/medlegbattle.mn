import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/ui/Sparkle";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-xl flex-col items-center justify-start gap-6 px-3 pt-10 text-center sm:min-h-[72vh] sm:justify-center sm:px-1 sm:pt-0">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="indigo">Өдрийн сорил</Badge>
        <Badge>Монгол хэл</Badge>
        <Badge variant="pink">1000+ асуулт</Badge>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Sparkle />
        <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
          <span className="text-gradient">Мэдлэгийн Тулаан</span>
        </h1>
      </div>

      <p className="text-pretty text-base text-white/75 sm:text-lg">
        10 асуулт. Үр дүн төгсгөлд нь. Нэг дарж тогло.
      </p>

      <Link href="/play" className="w-full">
        <Button size="lg" className="h-[72px] w-full text-xl sm:h-[72px] sm:text-xl">
          Тоглох
        </Button>
      </Link>

      <div className="max-w-md text-xs text-white/60 sm:text-sm">
        Хариултаа сонгоод автоматаар дараагийн асуулт руу шилжинэ. Дуусмагц оноогоо нэг дарж хуваалцана. Маргааш шинэ сорил автоматаар гарна.
      </div>
    </main>
  );
}

