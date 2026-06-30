import { CalendarDays, Package, PawPrint, Wallet } from "lucide-react";
import Link from "next/link";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { ROUTES } from "@/lib/constants/routes";

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-oshica-bg px-5 pb-12 pt-9 text-oshica-text">
      <div className="mx-auto w-full max-w-md">
        <section className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-white shadow-sm">
            <PawPrint className="h-10 w-10 text-oshica-secondary" />
          </div>

          <p className="mt-5 text-sm font-black tracking-[0.22em] text-oshica-primary">
            OSHICA
          </p>

          <h1 className="mt-3 text-3xl font-black leading-tight text-oshica-secondary">
            推し活の締切、
            <br />
            もう忘れない。
          </h1>

          <p className="mt-4 text-sm font-bold leading-7 text-oshica-primary">
            グッズ予約・イベント応募・当落・支出を
            <br />
            まとめて管理できます
          </p>
        </section>

        <OshicaCard className="mt-8 w-full">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-oshica-bg px-4 py-3">
              <Package className="h-5 w-5 text-oshica-primary" />
              <p className="mt-2 text-sm font-black text-oshica-text">
                グッズ
              </p>
              <p className="mt-1 text-xs font-bold text-oshica-primary">
                予約・発売日
              </p>
            </div>

            <div className="rounded-2xl bg-oshica-bg px-4 py-3">
              <CalendarDays className="h-5 w-5 text-oshica-primary" />
              <p className="mt-2 text-sm font-black text-oshica-text">
                イベント
              </p>
              <p className="mt-1 text-xs font-bold text-oshica-primary">
                応募・締切
              </p>
            </div>

            <div className="rounded-2xl bg-oshica-bg px-4 py-3">
              <PawPrint className="h-5 w-5 text-oshica-primary" />
              <p className="mt-2 text-sm font-black text-oshica-text">
                推し
              </p>
              <p className="mt-1 text-xs font-bold text-oshica-primary">
                推し別管理
              </p>
            </div>

            <div className="rounded-2xl bg-oshica-bg px-4 py-3">
              <Wallet className="h-5 w-5 text-oshica-primary" />
              <p className="mt-2 text-sm font-black text-oshica-text">
                支出
              </p>
              <p className="mt-1 text-xs font-bold text-oshica-primary">
                金額記録
              </p>
            </div>
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

        <p className="mt-8 text-center text-xs font-bold text-oshica-primary">
          推し活の予定管理を、もっとかんたんに。
        </p>

        <div className="mt-4 text-center text-xs font-bold text-oshica-primary">
          <Link href={ROUTES.privacy}>プライバシー</Link>
          <span className="mx-2">・</span>
          <Link href={ROUTES.terms}>利用規約</Link>
        </div>
      </div>
    </main>
  );
}