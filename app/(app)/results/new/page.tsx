import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Crown, Trophy } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { createClient } from "@/lib/supabase/server";
import { createLotteryResult } from "../actions";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewResultPage({ searchParams }: Props) {
  const { error } = await searchParams;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: oshis } = await supabase
    .from("oshis")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <div className="mb-4">
        <Link
          href="/results"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-primary shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <OshicaPageHeader
        label="Result"
        title="当落登録"
        description="応募結果をシンプルに記録できます"
        icon={<Trophy className="h-5 w-5" />}
      />

      {error ? (
        <OshicaCard className="mt-5 text-center">
          <div className="py-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
              <Crown className="h-6 w-6" />
            </div>

            <p className="mt-4 font-bold text-oshica-text">
              登録上限に達しました
            </p>

            <p className="mt-2 text-sm leading-7 text-oshica-muted">
              {error}
            </p>

            <div className="mt-5 rounded-2xl bg-oshica-bg p-4 text-left text-sm">
              <p className="font-bold text-oshica-text">Plus（月500円）</p>
              <p className="mt-1 text-oshica-muted">推し5人・各5件まで</p>

              <p className="mt-4 font-bold text-oshica-text">
                Premium（月1000円）
              </p>
              <p className="mt-1 text-oshica-muted">すべて無制限</p>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/settings/billing"
                className="rounded-full bg-oshica-primary px-5 py-3 text-sm font-bold text-white"
              >
                プランを見る
              </Link>

              <Link
                href="/results"
                className="rounded-full px-5 py-3 text-sm font-bold text-oshica-primary"
              >
                当落一覧へ戻る
              </Link>
            </div>
          </div>
        </OshicaCard>
      ) : (
        <form action={createLotteryResult} className="mt-5 space-y-5">
          <OshicaCard className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">推し</span>
              <select
                name="oshiId"
                required
                className="mt-2 block h-12 w-full min-w-0 appearance-none rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              >
                <option value="">推しを選択</option>
                {oshis?.map((oshi: any) => (
                  <option key={oshi.id} value={oshi.id}>
                    {oshi.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-oshica-text">結果</span>
              <select
                name="result"
                defaultValue="pending"
                className="mt-2 block h-12 w-full min-w-0 appearance-none rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              >
                <option value="pending">未発表</option>
                <option value="won">当選</option>
                <option value="lost">落選</option>
                <option value="cancelled">キャンセル</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-oshica-text">発表日</span>
              <input
                type="date"
                name="announcedAt"
                className="mt-2 flex h-12 w-full min-w-0 max-w-full appearance-none items-center rounded-2xl border border-oshica-border bg-white px-4 text-sm leading-none text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>
          </OshicaCard>

          <OshicaCard>
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">メモ</span>
              <textarea
                name="notes"
                rows={4}
                placeholder="例：ライブ先行、イベント抽選など"
                className="mt-2 block w-full resize-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>
          </OshicaCard>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Link
              href="/results"
              className="rounded-full px-4 py-2 text-sm font-bold text-oshica-primary"
            >
              キャンセル
            </Link>

            <SubmitButton
              idleLabel="登録する"
              pendingLabel="登録中..."
            />
          </div>
        </form>
      )}
    </main>
  );
}