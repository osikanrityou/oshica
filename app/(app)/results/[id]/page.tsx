import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, Crown, Trophy } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { createClient } from "@/lib/supabase/server";
import { deleteLotteryResult, updateLotteryResult } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditResultPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: item } = await supabase
    .from("lottery_results")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!item) redirect("/results");

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <header className="flex items-center justify-between">
        <Link
          href="/results"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        <p className="text-sm font-black text-oshica-secondary">当落編集</p>

        <div className="h-10 w-10" />
      </header>

      <section className="mt-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-oshica-primary shadow-sm">
            <Trophy className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-black text-oshica-primary">Result</p>
            <h1 className="text-2xl font-black text-oshica-text">当落編集</h1>
          </div>
        </div>

        {error ? (
          <OshicaCard className="mb-5 text-center">
            <div className="py-5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                <Crown className="h-6 w-6" />
              </div>

              <p className="mt-4 font-bold text-oshica-text">
                登録上限に達しました
              </p>

              <p className="mt-2 text-sm leading-7 text-oshica-muted">
                {error}
              </p>

              <Link
                href="/settings/billing"
                className="mt-5 inline-flex rounded-full bg-oshica-primary px-5 py-3 text-sm font-bold text-white"
              >
                プランを見る
              </Link>
            </div>
          </OshicaCard>
        ) : null}

        <form action={updateLotteryResult} className="space-y-5">
          <input type="hidden" name="resultId" value={item.id} />
          <input type="hidden" name="oshiId" value={item.source_id ?? ""} />

          <OshicaCard className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">結果</span>
              <select
                name="result"
                defaultValue={item.result ?? "pending"}
                className="mt-2 block w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
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
                defaultValue={item.announced_at ?? ""}
                className="mt-2 block w-full min-w-0 max-w-full appearance-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>
          </OshicaCard>

          <OshicaCard>
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">メモ</span>
              <textarea
                name="notes"
                rows={5}
                defaultValue={item.notes ?? ""}
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

            <button
              type="submit"
              className="rounded-full bg-oshica-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95"
            >
              保存する
            </button>
          </div>
        </form>

        <section className="mt-8">
          <form action={deleteLotteryResult} className="flex justify-center">
            <input type="hidden" name="resultId" value={item.id} />
            <DeleteButton message="この当落記録を削除しますか？" />
          </form>
        </section>
      </section>
    </main>
  );
}