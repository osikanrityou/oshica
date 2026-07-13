import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Crown, Package } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { createClient } from "@/lib/supabase/server";
import { updateGoods } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditGoodsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: goods } = await supabase
    .from("goods")
    .select("id, name, price, deadline, release_date, status, memo, oshi_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!goods) {
    redirect("/goods");
  }

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/goods"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-oshica-secondary" />
        </Link>

        <h1 className="text-lg font-black">グッズを編集</h1>

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
          <Package className="h-7 w-7" />
        </div>

        <p className="mt-3 text-base font-black text-oshica-text">
          {goods.name}
        </p>

        <p className="mt-1 text-[11px] font-medium text-oshica-primary">
          登録内容を編集
        </p>
      </OshicaCard>

      <form action={updateGoods} className="mt-5 space-y-5">
        <input type="hidden" name="goodsId" value={goods.id} />
        <input type="hidden" name="oshiId" value={goods.oshi_id ?? ""} />

        <OshicaCard className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">グッズ名</span>

            <input
              name="name"
              defaultValue={goods.name}
              required
              className="mt-2 block h-12 w-full min-w-0 rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">値段</span>

            <input
              name="price"
              type="number"
              defaultValue={goods.price ?? ""}
              className="mt-2 block h-12 w-full min-w-0 rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>
        </OshicaCard>

        <OshicaCard className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">締切日</span>

            <input
              type="date"
              name="deadline"
              defaultValue={goods.deadline ?? ""}
              className="mt-2 flex h-12 w-full min-w-0 max-w-full appearance-none items-center rounded-2xl border border-oshica-border bg-white px-4 text-sm leading-none text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">発売日</span>

            <input
              type="date"
              name="releaseDate"
              defaultValue={goods.release_date ?? ""}
              className="mt-2 flex h-12 w-full min-w-0 max-w-full appearance-none items-center rounded-2xl border border-oshica-border bg-white px-4 text-sm leading-none text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">状態</span>

            <select
              name="status"
              defaultValue={goods.status ?? "未予約"}
              className="mt-2 block h-12 w-full min-w-0 appearance-none rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
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
              defaultValue={goods.memo ?? ""}
              rows={4}
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

          <SubmitButton
            idleLabel="保存する"
            pendingLabel="保存中..."
          />
        </div>
      </form>
    </main>
  );
}