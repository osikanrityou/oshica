import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";

import { SidebarMenuButton } from "@/components/layout/SidebarMenu";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaEmptyState } from "@/components/oshica/OshicaEmptyState";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { OshicaSectionHeader } from "@/components/oshica/OshicaSectionHeader";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { createClient } from "@/lib/supabase/server";
import { deleteGoods } from "./actions";

type Props = {
  searchParams?: Promise<{
    oshiId?: string;
  }>;
};

function getDaysLeft(dateText: string) {
  const today = new Date();
  const target = new Date(dateText);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function dateLabel(dateText: string) {
  const days = getDaysLeft(dateText);

  if (days === 0) return "今日";
  if (days > 0) return `あと${days}日`;

  return `${Math.abs(days)}日前`;
}

export default async function GoodsPage({ searchParams }: Props) {
  const params = await searchParams;
  const oshiId = params?.oshiId;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let goodsQuery = supabase
    .from("goods")
    .select(
      "id, name, price, deadline, release_date, status, memo, oshi_id",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (oshiId) {
    goodsQuery = goodsQuery.eq("oshi_id", oshiId);
  }

  const [selectedOshiResult, goodsResult] = await Promise.all([
    oshiId
      ? supabase
          .from("oshis")
          .select("id, name")
          .eq("id", oshiId)
          .eq("user_id", user.id)
          .single()
      : Promise.resolve({ data: null }),
    goodsQuery,
  ]);

  const selectedOshi = selectedOshiResult.data;
  const goods = goodsResult.data;

  const deadlineCount =
    goods?.filter((item: any) => Boolean(item.deadline)).length ?? 0;

  const pageTitle = selectedOshi
    ? `${selectedOshi.name}のグッズ`
    : "グッズ一覧";

  const pageDescription = selectedOshi
    ? "この推しに登録したグッズだけを表示しています"
    : "予約・発売日・締切をまとめて管理できます";

  return (
    <main className="mx-auto max-w-md bg-[#E9F0FF] px-5 pb-32 pt-8 text-[#001117]">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedOshi ? (
            <Link
              href={`/oshis/${selectedOshi.id}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
            <SidebarMenuButton />
          )}

          <p className="text-base font-black tracking-wide text-oshica-secondary">
            Oshica
          </p>
        </div>

        <div className="h-10 w-10" />
      </div>

      <OshicaPageHeader
        label="Goods"
        title={pageTitle}
        description={pageDescription}
        icon={<ShoppingBag className="h-5 w-5" />}
      />

      {selectedOshi ? (
        <Link
          href={`/oshis/${selectedOshi.id}`}
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-oshica-primary shadow-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          推し詳細へ戻る
        </Link>
      ) : null}

      <section className="mt-6 grid grid-cols-2 gap-3">
        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">登録グッズ</p>

          <p className="mt-2 text-2xl font-black text-oshica-text">
            {goods?.length ?? 0}件
          </p>
        </OshicaCard>

        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">締切あり</p>

          <p className="mt-2 text-2xl font-black text-oshica-text">
            {deadlineCount}件
          </p>
        </OshicaCard>
      </section>

      <section className="mt-6">
        <OshicaSectionHeader
          title={selectedOshi ? "この推しのグッズ" : "登録したグッズ"}
          href="/goods/new"
          actionLabel="追加する ›"
        />

        <div className="space-y-3">
          {goods && goods.length > 0 ? (
            goods.map((item: any) => (
              <OshicaCard key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/goods/${item.id}/edit`}
                    className="min-w-0 flex-1"
                  >
                    <p className="font-black text-[#001117]">{item.name}</p>

                    <p className="mt-1 text-sm font-black text-oshica-secondary">
                      {item.price
                        ? `¥${Number(item.price).toLocaleString("ja-JP")}`
                        : "金額未設定"}
                    </p>

                    {item.deadline && (
                      <p className="mt-2 text-xs text-[#60799E]">
                        締切：{item.deadline}
                      </p>
                    )}

                    {item.release_date && (
                      <p className="mt-1 text-xs text-[#60799E]">
                        発売日：{item.release_date}
                      </p>
                    )}

                    <span className="mt-2 inline-flex rounded-full bg-oshica-bg px-2 py-1 text-[10px] font-bold text-oshica-secondary">
                      {item.status ?? "未予約"}
                    </span>

                    {item.memo && (
                      <p className="mt-2 text-sm text-[#2C3855]">
                        {item.memo}
                      </p>
                    )}
                  </Link>

                  <div className="flex flex-col items-end gap-3">
                    {item.deadline && (
                      <span className="rounded-full bg-[#E9F0FF] px-3 py-1 text-xs font-black text-[#2C3855]">
                        {dateLabel(item.deadline)}
                      </span>
                    )}

                    <Link
                      href={`/goods/${item.id}/edit`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9F0FF] text-[#60799E]"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F0FF] px-3 py-1 text-xs font-bold text-[#60799E]">
                    <Package className="h-3.5 w-3.5" />
                    グッズ
                  </span>

                  <form action={deleteGoods}>
                    <input type="hidden" name="goodsId" value={item.id} />

                    <DeleteButton message={`${item.name}を削除しますか？`} />
                  </form>
                </div>
              </OshicaCard>
            ))
          ) : (
            <OshicaEmptyState
              icon={<Package className="h-6 w-6" />}
              title={
                selectedOshi
                  ? "この推しのグッズはまだありません"
                  : "まだグッズがありません"
              }
              description="予約したグッズを登録しましょう"
              href="/goods/new"
              actionLabel="グッズを登録"
            />
          )}
        </div>
      </section>
    </main>
  );
}