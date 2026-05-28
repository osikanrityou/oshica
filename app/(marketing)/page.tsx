import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export default function MarketingPage() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-3 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
          Oshica
        </p>
        <h1 className="text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-50">
          推し活の予約・応募・当落・支出を、ひとつに。
        </h1>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          グッズ予約、イベント応募、カフェ予約、当落管理、支出管理をモバイルファーストで一元管理。
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Link href={ROUTES.signup}>
          <Button className="w-full" type="button">
            はじめる
          </Button>
        </Link>
        <Link href={ROUTES.login}>
          <Button className="w-full" variant="outline" type="button">
            ログイン
          </Button>
        </Link>
      </div>
      <p className="text-center text-xs text-zinc-500">
        <Link href={ROUTES.privacy} className="underline">
          プライバシー
        </Link>
        {" · "}
        <Link href={ROUTES.terms} className="underline">
          利用規約
        </Link>
      </p>
    </div>
  );
}
