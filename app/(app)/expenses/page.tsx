import Link from "next/link";
import { ChevronLeft, Wallet } from "lucide-react";

import { SidebarMenuButton } from "@/components/layout/SidebarMenu";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { ExpenseList } from "@/features/expense/components/ExpenseList";
import { createClient } from "@/lib/supabase/server";
import {
  ExpenseRepository,
  type ExpenseWithOshi,
} from "@/server/repositories/expense-repository";

export const metadata = { title: "支出" };

type Props = {
  searchParams?: Promise<{
    oshiId?: string;
  }>;
};

export default async function ExpensesPage({ searchParams }: Props) {
  const params = await searchParams;
  const oshiId = params?.oshiId;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let items: ExpenseWithOshi[] = [];
  let selectedOshi: { id: string; name: string } | null = null;

  if (user) {
    if (oshiId) {
      const { data } = await supabase
        .from("oshis")
        .select("id, name")
        .eq("id", oshiId)
        .eq("user_id", user.id)
        .single();

      selectedOshi = data;
    }

    try {
      const repo = new ExpenseRepository(supabase);
      const allItems = await repo.listByUser(user.id);

      items = oshiId
        ? allItems.filter((item) => item.oshi_id === oshiId)
        : allItems;
    } catch {
      items = [];
    }
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;

  const monthTotal = items
    .filter((item) => item.spent_at?.startsWith(thisMonth))
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
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
        label="Expenses"
        title={selectedOshi ? `${selectedOshi.name}の支出` : "支出"}
        description={
          selectedOshi
            ? "この推しに登録した支出だけを表示しています"
            : "どの推しに使った金額か、まとめて確認できます"
        }
        icon={<Wallet className="h-5 w-5" />}
        actionHref="/expenses/new"
        actionLabel="追加する ›"
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
          <p className="text-xs font-bold text-oshica-primary">合計支出</p>

          <p className="mt-2 text-xl font-black text-oshica-text">
            ¥{total.toLocaleString("ja-JP")}
          </p>
        </OshicaCard>

        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">今月</p>

          <p className="mt-2 text-xl font-black text-oshica-text">
            ¥{monthTotal.toLocaleString("ja-JP")}
          </p>
        </OshicaCard>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-oshica-text">
            {selectedOshi ? "この推しの支出" : "支出履歴"}
          </h2>

          <p className="text-xs font-bold text-oshica-primary">
            {items.length}件
          </p>
        </div>

        <ExpenseList items={items} />
      </section>
    </main>
  );
}