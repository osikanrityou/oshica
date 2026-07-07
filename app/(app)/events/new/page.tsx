import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Crown } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { createClient } from "@/lib/supabase/server";
import { createEvent } from "../actions";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewEventPage({ searchParams }: Props) {
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
      <OshicaPageHeader
        label="Event"
        title="イベント登録"
        description="Freeプランでは推し1人につき3件まで登録できます"
        icon={<CalendarDays className="h-5 w-5" />}
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
                href="/events"
                className="rounded-full px-5 py-3 text-sm font-bold text-oshica-primary"
              >
                イベント一覧へ戻る
              </Link>
            </div>
          </div>
        </OshicaCard>
      ) : (
        <form action={createEvent} className="mt-5 space-y-5">
          <OshicaCard className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">推し</span>
              <select
                name="oshiId"
                required
                className="mt-2 block w-full min-w-0 rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
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
              <span className="text-sm font-bold text-oshica-text">
                タイトル
              </span>
              <input
                name="title"
                required
                className="mt-2 block w-full min-w-0 rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>
          </OshicaCard>

          <OshicaCard className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">
                イベント日
              </span>
              <input
                type="date"
                name="eventDate"
                className="mt-2 block w-full min-w-0 max-w-full appearance-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-oshica-text">締切日</span>
              <input
                type="date"
                name="deadline"
                className="mt-2 block w-full min-w-0 max-w-full appearance-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>
          </OshicaCard>

          <OshicaCard>
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">メモ</span>
              <textarea
                name="memo"
                rows={5}
                className="mt-2 block w-full min-w-0 resize-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>
          </OshicaCard>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Link
              href="/events"
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
      )}
    </main>
  );
}