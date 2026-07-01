import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { createClient } from "@/lib/supabase/server";
import { createGoods } from "../actions";

export default async function NewGoodsPage() {
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
        label="Goods"
        title="グッズ登録"
        description="Freeプランでは推し1人につき3件まで登録できます"
        icon={<Package className="h-5 w-5" />}
      />

      <form action={createGoods} className="mt-5 space-y-5">
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
            <span className="text-sm font-bold text-oshica-text">名前</span>
            <input
              name="name"
              type="text"
              required
              className="mt-2 block w-full min-w-0 rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">金額</span>
            <input
              name="price"
              type="number"
              inputMode="numeric"
              min="0"
              className="mt-2 block w-full min-w-0 rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>
        </OshicaCard>

        <OshicaCard className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">締切日</span>
            <input
              type="date"
              name="deadline"
              className="mt-2 block w-full min-w-0 max-w-full appearance-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">発売日</span>
            <input
              type="date"
              name="releaseDate"
              className="mt-2 block w-full min-w-0 max-w-full appearance-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">状態</span>
            <select
              name="status"
              defaultValue="未予約"
              className="mt-2 block w-full min-w-0 rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            >
              <option>未予約</option>
              <option>予約済み</option>
              <option>購入済み</option>
            </select>
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
            href="/goods"
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