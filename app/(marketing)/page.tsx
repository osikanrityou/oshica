import {
  CalendarDays,
  Check,
  Package,
  PawPrint,
  Trophy,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { ROUTES } from "@/lib/constants/routes";

const features = [
  {
    title: "イベント",
    description: "応募・開催日",
    icon: CalendarDays,
  },
  {
    title: "グッズ",
    description: "予約・発売日",
    icon: Package,
  },
  {
    title: "当落",
    description: "結果・発表日",
    icon: Trophy,
  },
  {
    title: "支出",
    description: "金額を記録",
    icon: Wallet,
  },
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-oshica-bg px-5 py-8 text-oshica-text">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-sm flex-col justify-center">
        <section className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-white shadow-sm">
            <PawPrint className="h-10 w-10 text-oshica-secondary" />
          </div>

          <p className="mt-5 text-sm font-black tracking-[0.24em] text-oshica-primary">
            OSHICA
          </p>

          <h1 className="mt-3 text-3xl font-black leading-tight text-oshica-secondary">
            推し活の締切、
            <br />
            もう忘れない。
          </h1>

          <p className="mt-4 text-sm font-bold leading-7 text-oshica-primary">
            予定も記録も、
            <br />
            推しごとにひとつへ。
          </p>
        </section>

        <OshicaCard className="mt-7 p-4">
          <div className="grid grid-cols-2 gap-2.5">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-oshica-bg px-3.5 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-oshica-primary" />

                    <p className="text-sm font-black text-oshica-text">
                      {feature.title}
                    </p>
                  </div>

                  <p className="mt-1.5 text-xs font-bold text-oshica-primary">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </OshicaCard>

        <div className="mt-6 space-y-3">
          <Link
            href={ROUTES.signup}
            className="flex w-full items-center justify-center rounded-full bg-oshica-primary px-6 py-4 text-sm font-black text-white shadow-sm transition active:scale-95"
          >
            無料ではじめる
          </Link>

          <Link
            href={ROUTES.login}
            className="flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-black text-oshica-primary shadow-sm transition active:scale-95"
          >
            ログイン
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 text-[11px] font-bold text-oshica-primary">
          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5" />
            無料
          </span>

          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5" />
            カード不要
          </span>

          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5" />
            すぐ使える
          </span>
        </div>

        <footer className="mt-7 text-center text-xs font-bold text-oshica-primary">
          <Link href={ROUTES.privacy}>プライバシー</Link>
          <span className="mx-2">・</span>
          <Link href={ROUTES.terms}>利用規約</Link>
        </footer>
      </div>
    </main>
  );
}