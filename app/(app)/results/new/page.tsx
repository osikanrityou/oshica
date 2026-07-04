// app/(app)/results/new/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { createClient } from "@/lib/supabase/server";
import { createLotteryResult } from "../actions";

export default async function NewResultPage() {
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
      <OshicaPageHeader
        label="Result"
        title="当落登録"
        description="応募結果をシンプルに記録できます"
        icon={<Trophy className="h-5 w-5" />}
      />

      <form action={createLotteryResult} className="mt-5 space-y-5">
        <OshicaCard className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">推し</span>
            <select
              name="oshiId"
              className="mt-2 block w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
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

          <button
            type="submit"
            className="rounded-full bg-oshica-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95"
          >
            登録する
          </button>
        </div>
      </form>
    </main>
  );
}