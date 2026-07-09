import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Crown, Wallet } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { createClient } from "@/lib/supabase/server";
import { updateExpense } from "../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditExpensePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: expense } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!expense) redirect("/expenses");

  const { data: oshis } = await supabase
    .from("oshis")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/expenses"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-oshica-secondary" />
        </Link>

        <h1 className="text-lg font-black">支出を編集</h1>

        <div className="w-10" />
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

            <p className="mt-2 text-sm leading-7 text-oshica-muted">{error}</p>

            <Link
              href="/settings/billing"
              className="mt-5 inline-flex rounded-full bg-oshica-primary px-5 py-3 text-sm font-bold text-white"
            >
              プランを見る
            </Link>
          </div>
        </OshicaCard>
      ) : null}

      <OshicaCard className="py-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
          <Wallet className="h-7 w-7" />
        </div>

        <p className="mt-3 text-base font-black text-oshica-text">
          {expense.title}
        </p>

        <p className="mt-1 text-[11px] font-medium text-oshica-primary">
          登録内容を編集
        </p>
      </OshicaCard>

      <form action={updateExpense} className="mt-5 space-y-5">
        <input type="hidden" name="expenseId" value={expense.id} />

        <OshicaCard className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">推し</span>

            <select
              name="oshiId"
              defaultValue={expense.oshi_id ?? ""}
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
            <span className="text-sm font-bold text-oshica-text">
              タイトル
            </span>

            <input
              name="title"
              defaultValue={expense.title}
              required
              className="mt-2 block h-12 w-full min-w-0 rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">金額</span>

            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-oshica-primary">
                ¥
              </span>

              <input
                type="number"
                name="amount"
                defaultValue={expense.amount}
                required
                className="block h-12 w-full min-w-0 rounded-2xl border border-oshica-border bg-white pl-10 pr-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </div>
          </label>
        </OshicaCard>

        <OshicaCard>
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">日付</span>

            <input
  type="date"
  name="spentAt"
  defaultValue={expense.spent_at ?? ""}
  className="mt-2 flex h-12 w-full min-w-0 max-w-full appearance-none items-center rounded-2xl border border-oshica-border bg-white px-4 text-sm leading-none text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
/>
          </label>
        </OshicaCard>

        <OshicaCard>
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">メモ</span>

            <textarea
              name="memo"
              defaultValue={expense.notes ?? expense.memo ?? ""}
              rows={4}
              className="mt-2 block w-full min-w-0 resize-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>
        </OshicaCard>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            href="/expenses"
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
    </main>
  );
}