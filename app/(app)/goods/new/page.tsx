import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { createClient } from "@/lib/supabase/server";
import { createGoods } from "../actions";

const FREE_GOODS_LIMIT = 3;

export default async function NewGoodsPage() {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count, error } = await supabase
    .from("goods")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  const isLimitReached = (count ?? 0) >= FREE_GOODS_LIMIT;

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
        description="予約・発売日・締切をまとめて記録できます"
        icon={<Package className="h-5 w-5" />}
      />

      {isLimitReached ? (
        <OshicaCard className="mt-6 text-center">
          <div className="py-6">
           <p className="font-bold text-oshica-text">
  無料プランの登録上限に達しました
</p>

<p className="mt-2 text-sm text-oshica-primary">
  グッズは無料プランで3件まで登録できます
</p>

<Link
  href="/goods"
  className="mt-5 inline-flex rounded-full bg-oshica-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95"
>
  グッズ一覧へ戻る
</Link>
          </div>
        </OshicaCard>
      ) : (
        <form action={createGoods} className="mt-5 space-y-5">
          <OshicaCard className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">推し</span>
              <select
                name="oshiId"
                className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              >
                <option value="">選択なし</option>
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
                className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-oshica-text">金額</span>
              <input
                name="price"
                type="number"
                inputMode="numeric"
                min="0"
                className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>
          </OshicaCard>

          <OshicaCard className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">締切日</span>
              <input
                type="date"
                name="deadline"
                className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-oshica-text">発売日</span>
              <input
                type="date"
                name="releaseDate"
                className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-oshica-text">状態</span>
              <select
                name="status"
                defaultValue="未予約"
                className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
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
                className="mt-2 w-full resize-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
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
      )}
    </main>
  );
}