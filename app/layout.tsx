import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мэдлэгийн Тулаан — Quiz",
  description: "Монгол хэл дээрх сонирхолтой, өнгөлөг, хурдан тест — үр дүнгээ үзээд өөрийгөө сорь!"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Use static year to prevent hydration mismatch
  const year = 2026;
  return (
    <html lang="mn">
      <body>
        <div className="min-h-screen bg-grid">
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/40 blur-3xl" />
            <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-fuchsia-500/35 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-rose-500/30 blur-3xl" />
          </div>
          <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10">
            <div className="flex-1">{children}</div>
            <footer className="mt-8 text-center text-xs text-white/60">
              © {year} · Narantsetseg P.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}


